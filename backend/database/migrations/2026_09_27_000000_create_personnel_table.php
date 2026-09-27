<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnel', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('team');
            $table->string('position');
            $table->string('status', 16)->default('active');
            $table->timestamps();

            $table->index(['team', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnel');
    }
};
