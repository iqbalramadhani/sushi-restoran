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
        return $this->model->with('category')->get();
    }

    public function find(int $id): ?Product
    {
        return $this->model->with('category')->find($id);
    }

    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $product = $this->model->findOrFail($id);
        return $product->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
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
