<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class AdminController extends Controller
{
    public function migrate(): JsonResponse
    {
        Artisan::call('migrate', ['--force' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Migrations executed successfully.',
        ]);
    }

    public function seed(): JsonResponse
    {
        Artisan::call('db:seed', ['--class' => 'DatabaseSeeder', '--force' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Database seeded successfully.',
        ]);
    }

    public function migrateFresh(): JsonResponse
    {
        Artisan::call('migrate:fresh', ['--force' => true]);
        Artisan::call('db:seed', ['--class' => 'DatabaseSeeder', '--force' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Database reset and re-seeded successfully.',
        ]);
    }
}
