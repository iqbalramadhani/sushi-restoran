<?php

namespace App\Services;

use App\Repositories\UnitRepository;

class UnitService
{
    public function __construct(protected UnitRepository $repository) {}

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->repository->all();
    }

    public function create(array $data): object
    {
        return $this->repository->create($data);
    }

    public function findBySlug(string $slug): ?object
    {
        return $this->repository->findBySlug($slug);
    }
}
