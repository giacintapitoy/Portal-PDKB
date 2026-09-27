<?php

use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PersonnelController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('personnel', PersonnelController::class)->only(['index', 'store', 'show', 'update']);
    Route::post('loans/{loan}/return', [LoanController::class, 'processReturn'])->name('loans.return');
    Route::apiResource('loans', LoanController::class)->only(['index', 'store', 'show']);
});
