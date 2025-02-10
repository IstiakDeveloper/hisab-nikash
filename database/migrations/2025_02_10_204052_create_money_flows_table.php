<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('money_flows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('person_name');
            $table->string('type'); // give, receive
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('status')->default('pending'); // pending, partial, completed
            $table->decimal('remaining_amount', 12, 2);
            $table->date('due_date')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            // For quick querying
            $table->index(['tenant_id', 'user_id', 'type']);
            $table->index(['tenant_id', 'user_id', 'status']);
        });

        Schema::create('money_flow_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('money_flow_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('payment_method')->nullable(); // cash, bank, etc
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('money_flow_payments');
        Schema::dropIfExists('money_flows');
    }
};
