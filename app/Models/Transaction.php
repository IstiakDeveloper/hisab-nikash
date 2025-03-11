<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'account_id',
        'category_id',
        'amount',
        'type',
        'date',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($transaction) {
            $transaction->account->updateBalance($transaction);
        });

        static::updated(function ($transaction) {
            // This is simplified. In a real app, you'd need to calculate the difference
            // between original and updated values and adjust balance accordingly
            $transaction->account->updateBalance($transaction);
        });

        static::deleted(function ($transaction) {
            // Reverse the transaction effect when deleted
            if ($transaction->type == 'income') {
                $transaction->account->balance -= $transaction->amount;
            } elseif ($transaction->type == 'expense') {
                $transaction->account->balance += $transaction->amount;
            }

            $transaction->account->save();
        });
    }

    /**
     * Get the user that owns the transaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the account associated with the transaction.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Get the category associated with the transaction.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
