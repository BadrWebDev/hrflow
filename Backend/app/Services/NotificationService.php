<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\LeaveNotificationMail;

class NotificationService
{
    /**
     * Create a notification for a user
     */
    public function create(User $user, string $title, string $message, string $type, array $data = [])
    {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'data' => $data,
        ]);
    }

    /**
     * Send notification when leave is submitted
     */
    public function notifyLeaveSubmitted($leave)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            $notification = $this->create(
                $admin,
                'New Leave Request',
                "{$leave->user->name} has submitted a leave request from {$leave->start_date} to {$leave->end_date}",
                'leave_submitted',
                [
                    'leave_id' => $leave->id,
                    'user_name' => $leave->user->name,
                    'leave_type' => $leave->leaveType->name,
                    'start_date' => $leave->start_date,
                    'end_date' => $leave->end_date,
                ]
            );

            // Send email
            $this->sendEmail($admin, $notification);
        }
    }

    /**
     * Send notification when leave is approved
     */
    public function notifyLeaveApproved($leave)
    {
        $notification = $this->create(
            $leave->user,
            'Leave Request Approved',
            "Your leave request from {$leave->start_date} to {$leave->end_date} has been approved by {$leave->approver->name}",
            'leave_approved',
            [
                'leave_id' => $leave->id,
                'leave_type' => $leave->leaveType->name,
                'start_date' => $leave->start_date,
                'end_date' => $leave->end_date,
                'approved_by' => $leave->approver->name,
            ]
        );

        // Send email
        $this->sendEmail($leave->user, $notification);
    }

    /**
     * Send notification when leave is rejected
     */
    public function notifyLeaveRejected($leave)
    {
        $notification = $this->create(
            $leave->user,
            'Leave Request Rejected',
            "Your leave request from {$leave->start_date} to {$leave->end_date} has been rejected by {$leave->approver->name}",
            'leave_rejected',
            [
                'leave_id' => $leave->id,
                'leave_type' => $leave->leaveType->name,
                'start_date' => $leave->start_date,
                'end_date' => $leave->end_date,
                'rejected_by' => $leave->approver->name,
            ]
        );

        // Send email
        $this->sendEmail($leave->user, $notification);
    }

    /**
     * Send notification when leave is cancelled
     */
    public function notifyLeaveCancelled($leave)
    {
        // Notify admins
        $admins = User::where('role', 'admin')->get();
        
        foreach ($admins as $admin) {
            $notification = $this->create(
                $admin,
                'Leave Request Cancelled',
                "{$leave->user->name} has cancelled their leave request from {$leave->start_date} to {$leave->end_date}",
                'leave_cancelled',
                [
                    'leave_id' => $leave->id,
                    'user_name' => $leave->user->name,
                    'leave_type' => $leave->leaveType->name,
                    'start_date' => $leave->start_date,
                    'end_date' => $leave->end_date,
                ]
            );

            // Send email
            $this->sendEmail($admin, $notification);
        }
    }

    /**
     * Send email notification
     */
    private function sendEmail(User $user, Notification $notification)
    {
        try {
            Mail::to($user->email)->send(new LeaveNotificationMail($notification));
            
            // Mark email as sent
            $notification->email_sent = true;
            $notification->save();
        } catch (\Exception $e) {
            // Log error but don't fail the notification creation
            \Log::error('Failed to send notification email: ' . $e->getMessage());
        }
    }

    /**
     * Get unread notifications for a user
     */
    public function getUnread(User $user)
    {
        return Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get all notifications for a user
     */
    public function getAll(User $user, $limit = 50)
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($notificationId, User $user)
    {
        $notification = Notification::where('id', $notificationId)
            ->where('user_id', $user->id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
            return true;
        }

        return false;
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(User $user)
    {
        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
