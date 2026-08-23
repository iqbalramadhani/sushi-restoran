<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\AccountRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('products', ProductController::class)->except(['show']);
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::resource('ingredients', IngredientController::class)->except(['show']);
    Route::post('/units', [UnitController::class, 'store'])->name('units.store');
    Route::resource('tables', TableController::class)->except(['show']);
    Route::post('/tables/{table}/occupy', [TableController::class, 'occupy'])->name('tables.occupy');
    Route::post('/tables/{table}/free', [TableController::class, 'free'])->name('tables.free');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/process', [OrderController::class, 'process'])->name('orders.process');
    Route::post('/orders/{order}/complete', [OrderController::class, 'complete'])->name('orders.complete');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('account-requests')->group(function () {
        Route::get('/', [AccountRequestController::class, 'index'])->name('account-requests.index');
        Route::get('/{accountRequest}', [AccountRequestController::class, 'show'])->name('account-requests.show');
        Route::post('/{accountRequest}/approve', [AccountRequestController::class, 'approve'])->name('account-requests.approve');
        Route::post('/{accountRequest}/reject', [AccountRequestController::class, 'reject'])->name('account-requests.reject');
    });
});

require __DIR__.'/auth.php';
