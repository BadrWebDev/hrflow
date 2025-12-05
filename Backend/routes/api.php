<?php
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\Auth\ApiAuthController;

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
});
