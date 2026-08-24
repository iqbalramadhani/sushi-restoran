<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\Product;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\DB;

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
        $this->validateIngredients($items);

        return DB::transaction(function () use ($tableId, $userId, $items) {
            $order = $this->repository->create([
                'table_id' => $tableId,
                'user_id' => $userId,
                'status' => 'pending',
                'total' => 0,
            ]);

            $this->repository->addItems($order->id, $items);
            $this->deductIngredients($items);

            return $this->repository->find($order->id);
        });
    }

    protected function validateIngredients(array $items): void
    {
        $errors = [];

        foreach ($items as $item) {
            $product = Product::with('ingredients')->find($item['product_id']);
            if (!$product) {
                $errors[] = "Produk dengan ID {$item['product_id']} tidak ditemukan.";
                continue;
            }

            foreach ($product->ingredients as $ingredient) {
                $qtyNeeded = $ingredient->pivot->quantity * $item['quantity'];
                if ($ingredient->stock < $qtyNeeded) {
                    $errors[] = "Stok {$ingredient->name} tidak cukup untuk '{$product->name}'. Tersisa {$ingredient->stock} {$ingredient->unit}, diperlukan {$qtyNeeded} {$ingredient->unit}.";
                }
            }
        }

        if (!empty($errors)) {
            throw new \Exception(implode(' ', $errors));
        }
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
        return DB::transaction(function () use ($id) {
            $order = $this->repository->find($id);
            if (!$order || $order->status === 'cancelled') {
                return false;
            }

            foreach ($order->items as $item) {
                $product = Product::with('ingredients')->find($item->product_id);
                if (!$product) continue;

                foreach ($product->ingredients as $ingredient) {
                    $qtyToRestore = $ingredient->pivot->quantity * $item->quantity;
                    Ingredient::lockForUpdate()->find($ingredient->id)?->increment('stock', $qtyToRestore);
                }
            }

            return $this->repository->updateStatus($id, 'cancelled');
        });
    }

    public function find(int $id): ?object
    {
        return $this->repository->find($id);
    }
}
