<?php

namespace App\Repositories;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityLogRepository implements RepositoryInterface
{
    public function __construct(protected ActivityLog $model) {}

    public function paginate(int $perPage = 30): LengthAwarePaginator
    {
        return $this->model->with('user')->orderByDesc('created_at')->paginate($perPage);
    }

    public function all(): Collection
    {
        return $this->model->with('user')->orderByDesc('created_at')->get();
    }

    public function find(int $id): ?ActivityLog
    {
        return $this->model->with('user')->find($id);
    }

    public function create(array $data): ActivityLog
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return false;
    }

    public function delete(int $id): bool
    {
        return false;
    }
}
