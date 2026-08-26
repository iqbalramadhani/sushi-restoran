<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    protected function logActivity(
        string $action,
        object $subject,
        ?Request $request = null
    ): void {
        $user = Auth::check() ? Auth::user() : null;
        $description = $this->buildDescription($action, $subject);

        app(ActivityLogService::class)->log(
            $action,
            get_class($subject),
            $subject->id,
            $description,
            $user,
            $request
        );
    }

    protected function buildDescription(string $action, object $subject): ?string
    {
        $name = $subject->name ?? $subject->username ?? 'ID #' . $subject->id;

        return match ($action) {
            'order_created' => "Order #{$subject->id} dibuat di meja {$subject->table_id}",
            'order_processed' => "Order #{$subject->id} diproses",
            'order_completed' => "Order #{$subject->id} selesai",
            'order_cancelled' => "Order #{$subject->id} dibatalkan",
            'product_created' => "Produk '{$name}' dibuat",
            'product_updated' => "Produk '{$name}' diperbarui",
            'product_deleted' => "Produk '{$name}' dihapus",
            'product_soft_deleted' => "Produk '{$name}' dipindahkan ke sampah",
            'table_created' => "Meja '{$name}' dibuat",
            'table_updated' => "Meja '{$name}' diperbarui",
            'table_deleted' => "Meja '{$name}' dihapus",
            'table_occupied' => "Meja '{$name}' diduduki",
            'table_freed' => "Meja '{$name}' dikosongkan",
            'account_request_approved' => "Pengajuan akun dari '{$name}' disetujui",
            'account_request_rejected' => "Pengajuan akun dari '{$name}' ditolak",
            default => null,
        };
    }
}
