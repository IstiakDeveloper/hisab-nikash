<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoneyFlowPayment extends Model
{
    protected $fillable = [
        'money_flow_id',
        'amount',
        'date',
        'payment_method',
        'note'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2'
    ];

    public function moneyFlow()
    {
        return $this->belongsTo(MoneyFlow::class);
    }

    protected static function booted()
    {
        static::created(function ($payment) {
            $payment->moneyFlow->updateStatus();
        });

        static::deleted(function ($payment) {
            $payment->moneyFlow->updateStatus();
        });
    }
}
