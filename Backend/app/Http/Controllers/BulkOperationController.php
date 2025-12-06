<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class BulkOperationController extends Controller
{
    /**
     * Bulk approve leaves
     */
    public function bulkApproveLeaves(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'leave_ids' => 'required|array',
            'leave_ids.*' => 'exists:leaves,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaves = Leave::whereIn('id', $request->leave_ids)
            ->where('status', 'pending')
            ->get();

        $notificationService = new NotificationService();
        $successCount = 0;

        foreach ($leaves as $leave) {
            $leave->update([
                'status' => 'approved',
                'approver_id' => Auth::id(),
            ]);

            // Load relationships and send notification
            $leave->load(['user', 'leaveType']);
            $notificationService->notifyLeaveApproved($leave);
            
            $successCount++;
        }

        return response()->json([
            'message' => "$successCount leave(s) approved successfully",
            'approved_count' => $successCount
        ]);
    }

    /**
     * Bulk reject leaves
     */
    public function bulkRejectLeaves(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'leave_ids' => 'required|array',
            'leave_ids.*' => 'exists:leaves,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaves = Leave::whereIn('id', $request->leave_ids)
            ->where('status', 'pending')
            ->get();

        $notificationService = new NotificationService();
        $successCount = 0;

        foreach ($leaves as $leave) {
            $leave->update([
                'status' => 'rejected',
                'approver_id' => Auth::id(),
            ]);

            // Load relationships and send notification
            $leave->load(['user', 'leaveType']);
            $notificationService->notifyLeaveRejected($leave);
            
            $successCount++;
        }

        return response()->json([
            'message' => "$successCount leave(s) rejected successfully",
            'rejected_count' => $successCount
        ]);
    }

    /**
     * Bulk delete users
     */
    public function bulkDeleteUsers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Prevent deleting current user and admin users
        $currentUserId = Auth::id();
        $users = User::whereIn('id', $request->user_ids)
            ->where('id', '!=', $currentUserId)
            ->where('role', '!=', 'admin')
            ->get();

        $deletedCount = $users->count();
        User::whereIn('id', $users->pluck('id'))->delete();

        return response()->json([
            'message' => "$deletedCount user(s) deleted successfully",
            'deleted_count' => $deletedCount
        ]);
    }
}
