<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Repositories\IngredientRepository;
use Illuminate\Support\Facades\DB;

class IngredientService
{
    public function __construct(protected IngredientRepository $repository) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function create(array $data): object
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }

    public function deductStock(int $ingredientId, float $quantity): bool
    {
        $ingredient = Ingredient::lockForUpdate()->find($ingredientId);
        if (!$ingredient || $ingredient->stock < $quantity) {
            return false;
        }
        $ingredient->decrement('stock', $quantity);
        return true;
    }

    public function getLowStockIngredients(): array
    {
        $lowStock = Ingredient::where('stock', '<=', DB::raw('min_stock'))
            ->where('min_stock', '>', 0)
            ->get();

        $results = [];
        foreach ($lowStock as $ingredient) {
            $pivotRecords = DB::table('product_ingredient')
                ->where('ingredient_id', $ingredient->id)
                ->select('product_id', 'quantity as recipe_qty', 'unit')
                ->get();

            $productIds = $pivotRecords->pluck('product_id')->toArray();
            $products = Product::whereIn('id', $productIds)->get(['id', 'name']);
            $productMap = $products->keyBy('id');

            foreach ($pivotRecords as $pivot) {
                $product = $productMap->get($pivot->product_id);
                if ($product) {
                    $results[] = [
                        'product_id' => $pivot->product_id,
                        'product_name' => $product->name,
                        'ingredient_id' => $ingredient->id,
                        'ingredient_name' => $ingredient->name,
                        'stock' => $ingredient->stock,
                        'min_stock' => $ingredient->min_stock,
                        'unit' => $ingredient->unit,
                        'recipe_qty' => $pivot->recipe_qty,
                    ];
                }
            }
        }

        return $results;
    }
}
