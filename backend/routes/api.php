<?php

use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\LoanController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('equipment', EquipmentController::class);
    Route::post('loans/{loan}/return', [LoanController::class, 'processReturn'])->name('loans.return');
    Route::apiResource('loans', LoanController::class)->only(['index', 'store', 'show']);
});
