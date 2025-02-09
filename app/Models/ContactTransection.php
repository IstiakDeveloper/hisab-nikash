<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactTransaction extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'user_id',
        'contact_id',
        'wallet_id',
        'type',
        'amount',
        'date',
        'note'
    ];

    protected $casts = [
        'date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    protected static function booted()
    {
        static::created(function ($transaction) {
            $transaction->contact->updateBalance();
            $transaction->wallet->updateBalance();
        });

        static::deleted(function ($transaction) {
            $transaction->contact->updateBalance();
            $transaction->wallet->updateBalance();
        });
    }
}
