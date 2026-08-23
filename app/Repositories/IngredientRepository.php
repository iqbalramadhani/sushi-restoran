<?php

namespace App\Repositories;

use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Collection;

class IngredientRepository implements RepositoryInterface
{
    public function __construct(protected Ingredient $model) {}

    public function all(): Collection
    {
        return $this->model->get();
    }

    public function find(int $id): ?Ingredient
    {
        return $this->model->find($id);
    }

    public function create(array $data): Ingredient
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $ingredient = $this->model->findOrFail($id);
        return $ingredient->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }
}
