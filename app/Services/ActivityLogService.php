<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\ActivityLogRepository;
use Illuminate\Http\Request;

class ActivityLogService
{
    public function __construct(protected ActivityLogRepository $repository) {}

    public function log(
        string $action,
        string $subjectType,
        int $subjectId,
        ?string $description,
        ?User $user = null,
        ?Request $request = null
    ): void {
        try {
            $this->repository->create([
                'user_id' => $user?->id,
                'action' => $action,
                'subject_type' => $subjectType,
                'subject_id' => $subjectId,
                'description' => $description,
                'ip_address' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Log::warning('Activity log failed: ' . $e->getMessage());
        }
    }

    public function getAll()
    {
        return $this->repository->all();
    }
}
