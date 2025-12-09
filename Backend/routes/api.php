<?php
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BulkOperationController;
use App\Http\Controllers\ExportController;

// Public authentication routes
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    Route::get('/me', [ApiAuthController::class, 'me']);
    
    // Leave routes (all authenticated users)
    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::post('/leaves', [LeaveController::class, 'store']);
    Route::get('/leaves/{id}', [LeaveController::class, 'show']);
    Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']); // cancel own leave
    
    // Department routes (read for all, write for admin)
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    
    // User routes (read own profile for all, list/create/update/delete for admin)
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']); // employees can update themselves
    
    // Leave Type routes (read for all)
    Route::get('/leave-types', [LeaveTypeController::class, 'index']);
    Route::get('/leave-types/{id}', [LeaveTypeController::class, 'show']);

    // User management (permission-based)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Role & Permission management (permission-based, not admin-only)
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/permissions', [RoleController::class, 'permissions']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
    Route::post('/users/{userId}/assign-role', [RoleController::class, 'assignRole']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Leave management
        Route::put('/leaves/{id}', [LeaveController::class, 'update']); // approve/reject
        
        // Department management
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
        
        // Leave Type management
        Route::post('/leave-types', [LeaveTypeController::class, 'store']);
        Route::put('/leave-types/{id}', [LeaveTypeController::class, 'update']);
        Route::delete('/leave-types/{id}', [LeaveTypeController::class, 'destroy']);

        // Bulk operations
        Route::post('/bulk/approve-leaves', [BulkOperationController::class, 'bulkApproveLeaves']);
        Route::post('/bulk/reject-leaves', [BulkOperationController::class, 'bulkRejectLeaves']);
        Route::post('/bulk/delete-users', [BulkOperationController::class, 'bulkDeleteUsers']);

        // Export & Reporting
        Route::get('/export/users/excel', [ExportController::class, 'exportUsersExcel']);
        Route::get('/export/users/csv', [ExportController::class, 'exportUsersCSV']);
        Route::get('/export/leaves/excel', [ExportController::class, 'exportLeavesExcel']);
        Route::get('/export/leaves/csv', [ExportController::class, 'exportLeavesCSV']);
        Route::get('/export/leave-report/pdf', [ExportController::class, 'exportLeaveReportPDF']);
        Route::get('/export/monthly-summary/pdf', [ExportController::class, 'exportMonthlySummaryPDF']);
    });
});
