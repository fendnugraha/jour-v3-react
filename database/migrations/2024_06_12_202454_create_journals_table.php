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
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_issued')->index();
            $table->string('invoice', 60)->index();
            $table->string('description', 160);
            $table->string('debt_code', 60)->index();
            $table->string('cred_code', 60)->index();
            $table->integer('amount');
            $table->integer('fee_amount');
            $table->integer('status')->default(1);
            $table->string('trx_type', 60)->nullable();
            $table->string('rcv_pay', 30)->nullable();
            $table->integer('payment_status')->nullable();
            $table->integer('payment_nth')->nullable();
            $table->foreignId('user_id')->index();
            $table->foreignId('warehouse_id')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
