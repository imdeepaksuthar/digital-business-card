<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessCardController;
use App\Http\Controllers\SocialLinkController;
use App\Http\Controllers\SocialPlatformController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/cards/{slug}', [BusinessCardController::class, 'show']);
Route::post('/leads', [BusinessCardController::class, 'storeLead']);
Route::post('/analytics', [BusinessCardController::class, 'trackAnalytics']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);

    // Business Cards
    Route::get('/cards', [BusinessCardController::class, 'index']);
    Route::post('/cards', [BusinessCardController::class, 'store']);
    Route::put('/cards/{businessCard}', [BusinessCardController::class, 'update']);
    Route::delete('/cards/{businessCard}', [BusinessCardController::class, 'destroy']);

    // Social Links
    Route::post('/cards/{card}/social-links', [SocialLinkController::class, 'store']);
    Route::put('/social-links/{socialLink}', [SocialLinkController::class, 'update']);
    Route::delete('/social-links/{socialLink}', [SocialLinkController::class, 'destroy']);

    // Products
    Route::get('/cards/{card}/products', [App\Http\Controllers\ProductController::class, 'index']);
    Route::post('/cards/{card}/products', [App\Http\Controllers\ProductController::class, 'store']);
    Route::put('/products/{product}', [App\Http\Controllers\ProductController::class, 'update']);
    Route::delete('/products/{product}', [App\Http\Controllers\ProductController::class, 'destroy']);

    // Proprietors
    Route::get('/cards/{card}/proprietors', [App\Http\Controllers\ProprietorController::class, 'index']);
    Route::post('/cards/{card}/proprietors', [App\Http\Controllers\ProprietorController::class, 'store']);
    Route::put('/proprietors/{proprietor}', [App\Http\Controllers\ProprietorController::class, 'update']);
    Route::delete('/proprietors/{proprietor}', [App\Http\Controllers\ProprietorController::class, 'destroy']);
    // Social Platforms
    Route::get('/social-platforms', [SocialPlatformController::class, 'index']);
    Route::get('/designations', [DesignationController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
});
