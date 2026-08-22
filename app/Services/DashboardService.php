<?php

namespace App\Services;

use App\Repositories\OrderRepository;
use App\Repositories\TableRepository;

class DashboardService
{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected TableRepository $tableRepository
    ) {}

    public function getStats(): array
    {
        $orderStats = $this->orderRepository->todayStats();
        $tables = $this->tableRepository->all();

        $occupiedTables = $tables->where('status', 'occupied')->count();
        $availableTables = $tables->where('status', 'available')->count();

        return [
            'total_orders_today' => $orderStats['total_orders'],
            'revenue_today' => $orderStats['total_revenue'],
            'pending_orders' => $orderStats['pending_orders'],
            'completed_orders' => $orderStats['completed_orders'],
            'occupied_tables' => $occupiedTables,
            'available_tables' => $availableTables,
            'total_tables' => $tables->count(),
        ];
    }
}
