<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('equipment_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('inventory_code')->unique();
            $table->string('tracking_mode', 16);
            $table->string('name');
            $table->foreignId('division_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained('equipment_categories')->restrictOnDelete();
            $table->string('serial_number')->nullable()->unique();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('size')->nullable();
            $table->string('origin');
            $table->date('acquired_at')->nullable();
            $table->string('unit')->default('unit');
            $table->string('location');
            $table->string('condition', 32)->default('good');
            $table->string('availability_status', 16)->default('available');
            $table->date('next_inspection_at');
            $table->unsignedInteger('quantity_total')->default(1);
            $table->unsignedInteger('quantity_in_use')->default(0);
            $table->unsignedInteger('quantity_damaged')->default(0);
            $table->unsignedInteger('quantity_repair')->default(0);
            $table->boolean('active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['active', 'availability_status']);
            $table->index('next_inspection_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('equipment_categories');
        Schema::dropIfExists('divisions');
    }
};
