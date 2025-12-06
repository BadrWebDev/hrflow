<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LeaveTypeController extends Controller
{
    /**
     * List all leave types
     */
    public function index()
    {
        $leaveTypes = LeaveType::withCount('leaves')->get();
        return response()->json($leaveTypes);
    }

    /**
     * Create a new leave type (admin only)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:leave_types,name',
            'default_quota' => 'required|integer|min:0',
            'max_consecutive_days' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveType = LeaveType::create([
            'name' => $request->name,
            'default_quota' => $request->default_quota,
            'max_consecutive_days' => $request->max_consecutive_days,
        ]);

        return response()->json($leaveType, 201);
    }

    /**
     * View a specific leave type
     */
    public function show($id)
    {
        $leaveType = LeaveType::withCount('leaves')->findOrFail($id);
        return response()->json($leaveType);
    }

    /**
     * Update a leave type (admin only)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $leaveType = LeaveType::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:leave_types,name,' . $id,
            'default_quota' => 'sometimes|required|integer|min:0',
            'max_consecutive_days' => 'sometimes|required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveType->update($request->only(['name', 'default_quota', 'max_consecutive_days']));

        return response()->json($leaveType);
    }

    /**
     * Delete a leave type (admin only)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $leaveType = LeaveType::findOrFail($id);
        
        // Check if leave type is being used
        if ($leaveType->leaves()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete leave type with existing leave requests'
            ], 422);
        }

        $leaveType->delete();

        return response()->json(['message' => 'Leave type deleted successfully']);
    }
}
