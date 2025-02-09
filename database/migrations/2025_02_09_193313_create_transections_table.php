<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('wallet_id')->constrained();
            $table->string('type'); // income, expense
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->string('category')->nullable();
            $table->string('source')->nullable(); // For income: salary, business, etc.
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'user_id', 'date']);
            $table->index(['tenant_id', 'wallet_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transections');
    }
};
