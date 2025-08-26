<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemTypeController;
use App\Http\Controllers\LocationController;
use App\Services\InventoryExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard redirects to inventory
    Route::get('dashboard', function () {
        return redirect()->route('inventory.index');
    })->name('dashboard');

    // Inventory management routes
    Route::resource('inventory', InventoryController::class, [
        'parameters' => ['inventory' => 'inventory_item']
    ]);
    
    // Export route
    Route::get('inventory-export', function (Request $request, InventoryExportService $exportService) {
        return $exportService->exportToCsv($request);
    })->name('inventory.export');

    // Item types management (admin only)
    Route::resource('item-types', ItemTypeController::class, [
        'parameters' => ['item-types' => 'item_type']
    ]);

    // Locations management (admin only)
    Route::resource('locations', LocationController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
