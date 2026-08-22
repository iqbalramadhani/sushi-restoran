<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OrderRepository implements RepositoryInterface
{
    public function __construct(protected Order $model) {}

    public function all(): Collection
    {
        return $this->model->with(['table', 'user', 'items.product'])->get();
    }

    public function find(int $id): ?Order
    {
        return $this->model->with(['table', 'user', 'items.product'])->find($id);
    }

    public function findByTable(int $tableId): Collection
    {
        return $this->model->where('table_id', $tableId)->get();
    }

    public function findByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->with(['table', 'items.product'])->get();
    }

    public function create(array $data): Order
    {
        return $this->model->create($data);
    }

    public function addItems(int $orderId, array $items): void
    {
        $order = $this->model->findOrFail($orderId);
        $total = 0;

        foreach ($items as $item) {
            $product = \App\Models\Product::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['quantity'];
            $total += $subtotal;

            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
        }

        $order->update(['total' => $total]);
    }

    public function updateStatus(int $id, string $status): bool
    {
        $order = $this->model->findOrFail($id);
        $data = ['status' => $status];

        if ($status === 'completed') {
            $data['completed_at'] = now();
        }

        return $order->update($data);
    }

    public function todayStats(): array
    {
        $today = now()->startOfDay();
        $tomorrow = now()->endOfDay();

        return [
            'total_orders' => $this->model->whereBetween('created_at', [$today, $tomorrow])->count(),
            'total_revenue' => $this->model->whereBetween('created_at', [$today, $tomorrow])
                ->sum('total'),
            'pending_orders' => $this->model->whereBetween('created_at', [$today, $tomorrow])
                ->where('status', 'pending')->count(),
            'completed_orders' => $this->model->whereBetween('created_at', [$today, $tomorrow])
                ->where('status', 'completed')->count(),
        ];
    }
}
