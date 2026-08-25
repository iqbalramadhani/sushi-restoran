<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductRepository implements RepositoryInterface
{
    public function __construct(protected Product $model) {}

    public function all(): Collection
    {
        return $this->model->with(['category', 'ingredients'])->get();
    }

    public function allWithOrderStatus(): Collection
    {
        $products = $this->model->with(['category', 'ingredients'])->get();

        $orderedIds = DB::table('order_items')
            ->distinct()
            ->pluck('product_id');

        $products->each(function ($product) use ($orderedIds) {
            $product->has_been_ordered = $orderedIds->contains($product->id);
        });

        return $products;
    }

    public function find(int $id): ?Product
    {
        return $this->model->with(['category', 'ingredients'])->find($id);
    }

    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $product = $this->model->findOrFail($id);
        $product->update($data);

        if (isset($data['ingredients'])) {
            $product->ingredients()->detach();
            foreach ($data['ingredients'] as $ing) {
                $product->ingredients()->attach($ing['ingredient_id'], [
                    'quantity' => $ing['quantity'] ?? 0,
                    'unit' => $ing['unit'] ?? 'g',
                ]);
            }
        }

        return true;
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    public function softDelete(int $id): bool
    {
        $product = $this->model->findOrFail($id);
        return (bool) $product->delete();
    }

    public function findByCategory(int $categoryId): Collection
    {
        return $this->model->where('category_id', $categoryId)->get();
    }

    public function available(): Collection
    {
        return $this->model->where('is_available', true)->with('category')->get();
    }
}
