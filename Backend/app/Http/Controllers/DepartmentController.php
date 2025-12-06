<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * List all departments
     */
    public function index()
    {
        $departments = Department::with(['manager', 'users'])->get();
        return response()->json($departments);
    }

    /**
     * Create a new department (admin only)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:departments,name',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department = Department::create([
            'name' => $request->name,
            'manager_id' => $request->manager_id,
        ]);

        return response()->json($department->load(['manager', 'users']), 201);
    }

    /**
     * View a specific department
     */
    public function show($id)
    {
        $department = Department::with(['manager', 'users'])->findOrFail($id);
        return response()->json($department);
    }

    /**
     * Update a department (admin only)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $department = Department::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:departments,name,' . $id,
            'manager_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department->update($request->only(['name', 'manager_id']));

        return response()->json($department->load(['manager', 'users']));
    }

    /**
     * Delete a department (admin only)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $department = Department::findOrFail($id);
        
        // Check if department has employees
        if ($department->users()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete department with assigned employees'
            ], 422);
        }

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }
}
