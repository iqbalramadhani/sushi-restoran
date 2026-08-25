<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService
{
    public function __construct(protected ProductRepository $repository) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function getAllWithOrderStatus(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->allWithOrderStatus();
    }

    public function getAvailable(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->available();
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

    public function softDelete(int $id): bool
    {
        return $this->repository->softDelete($id);
    }
}
