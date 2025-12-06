<?php
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LeaveTypeController;

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

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Leave management
        Route::put('/leaves/{id}', [LeaveController::class, 'update']); // approve/reject
        
        // Department management
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // Leave Type management
        Route::post('/leave-types', [LeaveTypeController::class, 'store']);
        Route::put('/leave-types/{id}', [LeaveTypeController::class, 'update']);
        Route::delete('/leave-types/{id}', [LeaveTypeController::class, 'destroy']);
    });
});
