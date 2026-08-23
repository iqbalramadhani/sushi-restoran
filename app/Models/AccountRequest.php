<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountRequest extends Model
{
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'status',
        'approved_by',
        'notes',
    ];

    protected $hidden = [
        'password',
    ];

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
