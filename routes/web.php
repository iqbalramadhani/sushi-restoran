<?php

use App\Http\Controllers\AdminController;
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

// Admin migration and seeding routes
Route::prefix('admin')->group(function () {
    Route::get('/migrate', [AdminController::class, 'migrate'])->name('admin.migrate');
    Route::get('/seed', [AdminController::class, 'seed'])->name('admin.seed');
    Route::get('/reset-and-seed', [AdminController::class, 'migrateFresh'])->name('admin.migrate.fresh');
});

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('units', UnitController::class)->except(['show']);
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('products', ProductController::class)->except(['show']);
    Route::delete('/products/{product}/soft-destroy', [ProductController::class, 'softDestroy'])->name('products.soft-destroy');
    Route::resource('ingredients', IngredientController::class)->except(['show']);
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
    Route::prefix('account-requests')->group(function () {
        Route::get('/', [AccountRequestController::class, 'index'])->name('account-requests.index');
        Route::get('/{accountRequest}', [AccountRequestController::class, 'show'])->name('account-requests.show');
        Route::post('/{accountRequest}/approve', [AccountRequestController::class, 'approve'])->name('account-requests.approve');
        Route::post('/{accountRequest}/reject', [AccountRequestController::class, 'reject'])->name('account-requests.reject');
    });
});

require __DIR__.'/auth.php';
