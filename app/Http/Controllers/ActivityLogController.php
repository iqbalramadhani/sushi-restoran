<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function __construct(protected ActivityLogService $service) {}

    public function index(): Response
    {
        return Inertia::render('ActivityLogs/Index', [
            'logs' => $this->service->getAll(),
        ]);
    }
}
