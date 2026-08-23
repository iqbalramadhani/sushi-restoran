<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\OrderRepository;

class OrderService
{
    public function __construct(
        protected OrderRepository $repository,
        protected IngredientService $ingredientService
    ) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function getPending(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->findByStatus('pending');
    }

    public function createOrder(int $tableId, int $userId, array $items): object
    {
        $order = $this->repository->create([
            'table_id' => $tableId,
            'user_id' => $userId,
            'status' => 'pending',
            'total' => 0,
        ]);

        $this->repository->addItems($order->id, $items);
        $this->deductIngredients($items);

        return $this->repository->find($order->id);
    }

    protected function deductIngredients(array $items): void
    {
        foreach ($items as $item) {
            $product = Product::with('ingredients')->find($item['product_id']);
            if (!$product) continue;

            foreach ($product->ingredients as $ingredient) {
                $qtyNeeded = $ingredient->pivot->quantity * $item['quantity'];
                $this->ingredientService->deductStock($ingredient->id, $qtyNeeded);
            }
        }
    }

    public function processOrder(int $id): bool
    {
        return $this->repository->updateStatus($id, 'processed');
    }

    public function completeOrder(int $id): bool
    {
        return $this->repository->updateStatus($id, 'completed');
    }

    public function cancelOrder(int $id): bool
    {
        return $this->repository->updateStatus($id, 'cancelled');
    }

    public function find(int $id): ?object
    {
        return $this->repository->find($id);
    }
}
