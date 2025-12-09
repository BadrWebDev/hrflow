<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Get all roles with their permissions
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    /**
     * Get all available permissions
     */
    public function permissions()
    {
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });
        
        return response()->json($permissions);
    }

    /**
     * Create a new role
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web'
        ]);
        
        if ($request->has('permissions')) {
            $permissions = $this->addDependentPermissions($request->permissions);
            $role->givePermissionTo($permissions);
        }

        return response()->json($role->load('permissions'), 201);
    }

    /**
     * Add dependent permissions automatically
     */
    private function addDependentPermissions($permissions)
    {
        $dependencyMap = [
            'create user' => ['view users', 'view departments', 'view roles'],
            'edit user' => ['view users', 'view departments', 'view roles'],
            'create department' => ['view departments'],
            'edit department' => ['view departments'],
            'create leave type' => ['view leave types'],
            'edit leave type' => ['view leave types'],
            'create role' => ['view roles'],
            'edit role' => ['view roles'],
            'assign roles' => ['view roles', 'view users'],
        ];

        $allPermissions = collect($permissions);
        
        foreach ($permissions as $permission) {
            if (isset($dependencyMap[$permission])) {
                foreach ($dependencyMap[$permission] as $dependent) {
                    if (!$allPermissions->contains($dependent)) {
                        $allPermissions->push($dependent);
                    }
                }
            }
        }

        return $allPermissions->toArray();
    }

    /**
     * Update a role
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // Prevent editing system roles
        if (in_array($role->name, ['admin', 'employee', 'department_manager'])) {
            return response()->json(['error' => 'Cannot edit system roles'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->update(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $permissions = $this->addDependentPermissions($request->permissions);
            $role->syncPermissions($permissions);
        }

        return response()->json($role->load('permissions'));
    }

    /**
     * Delete a role
     */
    public function destroy($id)
    {
        try {
            $role = Role::findOrFail($id);

            // Prevent deleting system roles
            if (in_array($role->name, ['admin', 'employee', 'department_manager'])) {
                return response()->json(['error' => 'Cannot delete system roles'], 403);
            }

            // Remove all users from this role before deleting
            \DB::table('model_has_roles')->where('role_id', $role->id)->delete();
            
            // Remove all permissions from this role
            \DB::table('role_has_permissions')->where('role_id', $role->id)->delete();

            // Delete the role directly from database to avoid Spatie events
            \DB::table('roles')->where('id', $role->id)->delete();
            
            return response()->json(['message' => 'Role deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Role deletion error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete role: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request, $userId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role' => 'required|exists:roles,name',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = \App\Models\User::findOrFail($userId);
            $role = Role::where('name', $request->role)->firstOrFail();

            // Remove all existing roles for this user
            \DB::table('model_has_roles')
                ->where('model_type', 'App\\Models\\User')
                ->where('model_id', $user->id)
                ->delete();

            // Assign the new role
            \DB::table('model_has_roles')->insert([
                'role_id' => $role->id,
                'model_type' => 'App\\Models\\User',
                'model_id' => $user->id,
            ]);

            // Clear permission cache for this user
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return response()->json([
                'message' => 'Role assigned successfully',
                'user' => $user->fresh(['roles'])
            ]);
        } catch (\Exception $e) {
            \Log::error('Role assignment error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to assign role: ' . $e->getMessage()], 500);
        }
    }
}
