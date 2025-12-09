<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * List all users (admin only)
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user->hasPermissionTo('view users')) {
            return response()->json(['error' => 'You do not have permission to view users'], 403);
        }

        $users = User::with(['department', 'leaves', 'roles'])->get();
        return response()->json($users);
    }

    /**
     * Create a new user/employee
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->hasPermissionTo('create user')) {
            return response()->json(['error' => 'You do not have permission to create users'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:employee,admin',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'department_id' => $request->department_id,
        ]);

        // Assign Spatie role for permissions
        $newUser->assignRole($request->role);

        return response()->json($newUser->load(['department', 'roles']), 201);
    }

    /**
     * View a specific user
     */
    public function show($id)
    {
        $user = Auth::user();
        
        // Employees can only view their own profile, admins can view anyone
        if ($user->role !== 'admin' && $user->id != $id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $targetUser = User::with(['department', 'leaves.leaveType'])->findOrFail($id);
        return response()->json($targetUser);
    }

    /**
     * Update user (admin or self for limited fields)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($id);

        // Check permission for editing other users
        if ($user->id != $id && !$user->hasPermissionTo('edit user')) {
            return response()->json(['error' => 'You do not have permission to edit users'], 403);
        }

        $rules = [];
        
        if ($user->hasPermissionTo('edit user') || $user->role === 'admin') {
            // Admin/permission holders can update everything
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|nullable|string|min:8',
                'role' => 'sometimes|required|in:employee,admin',
                'department_id' => 'nullable|exists:departments,id',
            ];
        } else {
            // Employee can only update name and password
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'password' => 'sometimes|nullable|string|min:8',
            ];
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = [];
        
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        if ($user->hasPermissionTo('edit user') || $user->role === 'admin') {
            if ($request->has('email')) {
                $updateData['email'] = $request->email;
            }
            if ($request->has('role')) {
                $updateData['role'] = $request->role;
            }
            if ($request->has('department_id')) {
                $updateData['department_id'] = $request->department_id;
            }
        }

        $targetUser->update($updateData);

        // Sync Spatie role if role was updated
        if (isset($updateData['role'])) {
            $targetUser->syncRoles([$updateData['role']]);
        }

        return response()->json($targetUser->load(['department', 'roles']));
    }

    /**
     * Delete user (admin only)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        if (!$user->hasPermissionTo('delete user')) {
            return response()->json(['error' => 'You do not have permission to delete users'], 403);
        }
        
        // Prevent admin from deleting themselves
        if ($user->id == $id) {
            return response()->json(['error' => 'Cannot delete your own account'], 422);
        }

        $targetUser = User::findOrFail($id);
        $targetUser->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
