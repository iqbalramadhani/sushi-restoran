<?php

namespace App\Repositories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Collection;

class TableRepository implements RepositoryInterface
{
    public function __construct(protected Table $model) {}

    public function all(): Collection
    {
        return $this->model->get();
    }

    public function find(int $id): ?Table
    {
        return $this->model->find($id);
    }

    public function create(array $data): Table
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $table = $this->model->findOrFail($id);
        return $table->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    public function findByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }
}
