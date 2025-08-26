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
        Schema::create('item_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Type name (PC, Printer, Monitor, etc.)');
            $table->text('description')->nullable()->comment('Type description');
            $table->boolean('is_active')->default(true)->comment('Whether this type is active');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_types');
    }
};