<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $service) {}

    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => $this->service->getStats(),
        ]);
    }
}
