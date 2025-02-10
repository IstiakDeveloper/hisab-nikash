<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoneyFlow extends Model
{
    protected $fillable = [
        'tenant_id',
        'user_id',
        'person_name',
        'type',
        'amount',
        'date',
        'status',
        'remaining_amount',
        'due_date',
        'note'
    ];

    protected $casts = [
        'date' => 'date',
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2'
    ];

    public function payments()
    {
        return $this->hasMany(MoneyFlowPayment::class);
    }

    public function updateStatus()
    {
        $totalPaid = $this->payments()->sum('amount');
        $this->remaining_amount = $this->amount - $totalPaid;

        if ($this->remaining_amount <= 0) {
            $this->status = 'completed';
        } elseif ($totalPaid > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }

    // Helper scopes for querying
    public function scopeReceivable($query)
    {
        return $query->where('type', 'receive')->where('status', '!=', 'completed');
    }

    public function scopePayable($query)
    {
        return $query->where('type', 'give')->where('status', '!=', 'completed');
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('status', '!=', 'completed');
    }
}
