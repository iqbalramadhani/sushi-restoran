<?php

namespace App\Services;

use App\Repositories\TableRepository;

class TableService
{
    public function __construct(protected TableRepository $repository) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function findById(int $id): ?\App\Models\Table
    {
        return $this->repository->find($id);
    }

    public function getAvailable(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->findByStatus('available');
    }

    public function occupy(int $id): bool
    {
        return $this->repository->update($id, ['status' => 'occupied']);
    }

    public function free(int $id): bool
    {
        return $this->repository->update($id, ['status' => 'available']);
    }

    public function create(array $data): object
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function destroy(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
