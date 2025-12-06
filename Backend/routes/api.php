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
    
    // Leave routes
    Route::get('/leaves', [LeaveController::class, 'index']);        // list leaves
    Route::post('/leaves', [LeaveController::class, 'store']);       // create leave request
    Route::get('/leaves/{id}', [LeaveController::class, 'show']);    // view leave
    Route::put('/leaves/{id}', [LeaveController::class, 'update']);  // approve/reject
    Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']); // cancel

    // Department routes
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Leave Type routes
    Route::get('/leave-types', [LeaveTypeController::class, 'index']);
    Route::post('/leave-types', [LeaveTypeController::class, 'store']);
    Route::get('/leave-types/{id}', [LeaveTypeController::class, 'show']);
    Route::put('/leave-types/{id}', [LeaveTypeController::class, 'update']);
    Route::delete('/leave-types/{id}', [LeaveTypeController::class, 'destroy']);
});
