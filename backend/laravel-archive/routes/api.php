<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/applications', [PublicApplicationController::class, 'index']);
Route::post('/applications', [PublicApplicationController::class, 'store']);
Route::get('/applications/{referenceId}', [PublicApplicationController::class, 'show']);
Route::patch('/applications/{referenceId}/status', [PublicApplicationController::class, 'updateStatus']);
Route::delete('/applications/{referenceId}', [PublicApplicationController::class, 'destroy']);

Route::get('/complaints', [PublicContentController::class, 'listComplaints']);
Route::post('/complaints', [PublicContentController::class, 'storeComplaint']);
Route::get('/announcements', [PublicContentController::class, 'listAnnouncements']);
Route::post('/announcements', [PublicContentController::class, 'storeAnnouncement']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/register-admin', [AuthController::class, 'registerAdmin']);
Route::post('/auth/login', [AuthController::class, 'login']);
