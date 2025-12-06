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

        if ($user->role === 'admin') {
            $leaves = Leave::with(['user', 'leaveType', 'approver'])->get();
        } else {
            $leaves = Leave::with('leaveType')->where('user_id', $user->id)->get();
        }

        return response()->json($leaves);
    }

    /**
     * Create a new leave request
     */
    public function store(Request $request)
    {
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

        if ($user->role !== 'admin' && $leave->user_id !== $user->id) {
            return response()->json(['error'=>'Unauthorized'], 403);
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
