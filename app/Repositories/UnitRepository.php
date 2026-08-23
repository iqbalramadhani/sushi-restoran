<?php

namespace App\Repositories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Collection;

class UnitRepository implements RepositoryInterface
{
    public function __construct(protected Unit $model) {}

    public function all(): Collection
    {
        return $this->model->orderBy('name')->get();
    }

    public function find(int $id): ?Unit
    {
        return $this->model->find($id);
    }

    public function create(array $data): Unit
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $unit = $this->model->findOrFail($id);
        return $unit->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    public function findBySlug(string $slug): ?Unit
    {
        return $this->model->where('slug', $slug)->first();
    }
}
