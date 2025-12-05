<?php
use App\Http\Controllers\LeaveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/leaves', [LeaveController::class, 'index']);        // list leaves
    Route::post('/leaves', [LeaveController::class, 'store']);       // create leave request
    Route::get('/leaves/{id}', [LeaveController::class, 'show']);    // view leave
    Route::put('/leaves/{id}', [LeaveController::class, 'update']);  // approve/reject
    Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']); // cancel
});
