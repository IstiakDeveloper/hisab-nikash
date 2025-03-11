<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'balance',
        'account_type',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'decimal:2',
    ];

    /**
     * Get the user that owns the account.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the account.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Update the account balance based on a transaction.
     *
     * @param Transaction $transaction
     * @return void
     */
    public function updateBalance(Transaction $transaction)
    {
        if ($transaction->type == 'income') {
            $this->balance += $transaction->amount;
        } elseif ($transaction->type == 'expense') {
            $this->balance -= $transaction->amount;
        }

        $this->save();
    }
}
