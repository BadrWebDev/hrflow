<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\LeaveType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Services\NotificationService;

class LeaveController extends Controller
{
    /**
     * List all leaves for the logged-in user (admin can see all)
     */
    public function index()
    {
        $user = Auth::user();

        // Check permission
        if (!$user->hasPermissionTo('view leaves')) {
            return response()->json(['error' => 'You do not have permission to view leaves'], 403);
        }

        if ($user->hasRole('admin')) {
            // Admin sees all leaves
            $leaves = Leave::with(['user', 'leaveType', 'approver'])->get();
        } elseif ($user->hasRole('department_manager') && $user->department_id) {
            // Department manager sees their department's leaves
            $leaves = Leave::with(['user', 'leaveType', 'approver'])
                ->whereHas('user', function($query) use ($user) {
                    $query->where('department_id', $user->department_id);
                })
                ->get();
        } else {
            // Employee sees only their own leaves
            $leaves = Leave::with('leaveType')->where('user_id', $user->id)->get();
        }

        return response()->json($leaves);
    }

    /**
     * Create a new leave request
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check permission
        if (!$user->hasPermissionTo('create leave')) {
            return response()->json(['error' => 'You do not have permission to create leave requests'], 403);
        }

        $validator = Validator::make($request->all(), [
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        $days = (strtotime($request->end_date) - strtotime($request->start_date)) / 86400 + 1;

        $leave = Leave::create([
            'user_id' => Auth::id(),
            'leave_type_id' => $request->leave_type_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'days' => $days,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        // Load relationships for notification
        $leave->load(['user', 'leaveType']);

        // Send notification to admins
        $notificationService = new NotificationService();
        $notificationService->notifyLeaveSubmitted($leave);

        return response()->json($leave, 201);
    }

    /**
     * View a specific leave
     */
    public function show($id)
    {
        $leave = Leave::with(['user', 'leaveType', 'approver'])->findOrFail($id);
        return response()->json($leave);
    }

    /**
     * Update leave (approve/reject) — admin only
     */
    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);
        $user = Auth::user();

        // Check permission based on action
        if ($request->status === 'approved' && !$user->hasPermissionTo('approve leave')) {
            return response()->json(['error' => 'You do not have permission to approve leaves'], 403);
        }
        if ($request->status === 'rejected' && !$user->hasPermissionTo('reject leave')) {
            return response()->json(['error' => 'You do not have permission to reject leaves'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,pending',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors'=>$validator->errors()], 422);
        }

        $leave->status = $request->status;
        $leave->approver_id = $user->id;
        $leave->approved_at = now();
        $leave->save();

        // Load relationships for notification
        $leave->load(['user', 'leaveType', 'approver']);

        // Send notification based on status
        $notificationService = new NotificationService();
        if ($request->status === 'approved') {
            $notificationService->notifyLeaveApproved($leave);
        } elseif ($request->status === 'rejected') {
            $notificationService->notifyLeaveRejected($leave);
        }

        return response()->json($leave);
    }

    /**
     * Cancel leave (employee)
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $leave = Leave::findOrFail($id);

        // Check permission
        if (!$user->hasPermissionTo('delete leave')) {
            return response()->json(['error' => 'You do not have permission to delete leaves'], 403);
        }

        // Employees can only delete their own leaves
        if (!$user->hasRole('admin') && $leave->user_id !== $user->id) {
            return response()->json(['error'=>'You can only delete your own leave requests'], 403);
        }

        // Load relationships before deleting
        $leave->load(['user', 'leaveType']);

        // Send notification if employee cancels
        if ($user->id === $leave->user_id) {
            $notificationService = new NotificationService();
            $notificationService->notifyLeaveCancelled($leave);
        }

        $leave->delete();

        return response()->json(['message'=>'Leave deleted successfully']);
    }
}
