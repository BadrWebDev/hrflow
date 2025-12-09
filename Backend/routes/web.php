<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Health check for Railway
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'HRFlow API',
        'timestamp' => now()->toIso8601String()
    ]);
});

Route::get('/', function () {
    return response()->json([
        'message' => 'HRFlow API',
        'version' => '1.0.0',
        'endpoints' => [
            'health' => '/health',
            'api' => '/api/*'
        ]
    ]);
});

Route::get('/dashboard', function () {
    return response()->json(['message' => 'Use the frontend application']);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
