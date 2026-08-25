<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements RepositoryInterface
{
    public function __construct(protected Category $model) {}

    public function all(): Collection
    {
        return $this->model->withCount('products')->get();
    }

    public function find(int $id): ?Category
    {
        return $this->model->find($id);
    }

    public function create(array $data): Category
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $category = $this->model->findOrFail($id);
        return $category->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }
}
