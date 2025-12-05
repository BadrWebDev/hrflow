<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\LeaveType;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Departments
        Department::create(['name'=>'HR']);
        Department::create(['name'=>'IT']);
        Department::create(['name'=>'Finance']);

        // Leave Types
        LeaveType::create(['name'=>'Annual', 'default_quota'=>20, 'max_consecutive_days'=>10]);
        LeaveType::create(['name'=>'Sick', 'default_quota'=>10, 'max_consecutive_days'=>5]);
        LeaveType::create(['name'=>'Unpaid', 'default_quota'=>0, 'max_consecutive_days'=>30]);

        // Admin user
        User::create([
            'name'=>'Admin',
            'email'=>'admin@hrflow.test',
            'password'=>Hash::make('Admin1234'),
            'role'=>'admin',
        ]);
    }
}
