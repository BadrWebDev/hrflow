<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Leave permissions
            'view leaves',
            'create leave',
            'edit leave',
            'delete leave',
            'approve leave',
            'reject leave',
            
            // User permissions
            'view users',
            'create user',
            'edit user',
            'delete user',
            
            // Department permissions
            'view departments',
            'create department',
            'edit department',
            'delete department',
            
            // Leave type permissions
            'view leave types',
            'create leave type',
            'edit leave type',
            'delete leave type',
            
            // Role permissions
            'view roles',
            'create role',
            'edit role',
            'delete role',
            'assign roles',
            
            // Report permissions
            'export reports',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Admin role - all permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Department Manager role - limited permissions
        $manager = Role::create(['name' => 'department_manager']);
        $manager->givePermissionTo([
            'view leaves',
            'approve leave',
            'reject leave',
            'view users',
            'view departments',
            'view leave types',
            'view reports',
        ]);

        // Employee role - basic permissions
        $employee = Role::create(['name' => 'employee']);
        $employee->givePermissionTo([
            'view leaves',
            'create leave',
            'delete leave', // own leaves only
        ]);

        // Assign roles to existing users
        $adminUser = User::where('email', 'admin@hrflow.test')->first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
        }

        $employees = User::where('role', 'employee')->get();
        foreach ($employees as $emp) {
            $emp->assignRole('employee');
        }
    }
}
