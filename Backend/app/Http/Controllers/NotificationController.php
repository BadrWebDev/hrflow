<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications for current user
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = $this->notificationService->getAll($user);
        
        return response()->json($notifications);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $unread = $this->notificationService->getUnread($user);
        
        return response()->json(['count' => $unread->count()]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $success = $this->notificationService->markAsRead($id, $user);
        
        if ($success) {
            return response()->json(['message' => 'Notification marked as read']);
        }
        
        return response()->json(['error' => 'Notification not found'], 404);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $this->notificationService->markAllAsRead($user);
        
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
