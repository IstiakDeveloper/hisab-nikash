<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'user_id',
        'wallet_id',
        'type',
        'amount',
        'date',
        'category',
        'source',
        'note'
    ];

    protected $casts = [
        'date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    protected static function booted()
    {
        static::created(function ($transaction) {
            $transaction->wallet->updateBalance();
        });

        static::deleted(function ($transaction) {
            $transaction->wallet->updateBalance();
        });
    }
}
