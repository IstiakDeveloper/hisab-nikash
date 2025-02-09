<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'address',
        'current_balance'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(ContactTransaction::class);
    }

    public function updateBalance()
    {
        $received = $this->transactions()->where('type', 'give')->sum('amount');
        $given = $this->transactions()->where('type', 'receive')->sum('amount');

        $this->current_balance = $received - $given;
        $this->save();
    }
}
