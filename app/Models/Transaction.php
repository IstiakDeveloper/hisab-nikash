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
        'category_id',
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

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public static function boot()
    {
        parent::boot();

        static::created(function ($transaction) {
            $wallet = $transaction->wallet;
            $wallet->updateBalance($transaction->amount, $transaction->type);
        });

        static::updated(function ($transaction) {
            $wallet = $transaction->wallet;
            $wallet->updateBalance($transaction->amount, $transaction->type);
        });

        static::deleted(function ($transaction) {
            $wallet = $transaction->wallet;
            $wallet->updateBalance(-$transaction->amount, $transaction->type);
        });
    }
}
