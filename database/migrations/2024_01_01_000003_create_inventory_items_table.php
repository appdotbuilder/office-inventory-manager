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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique()->comment('Barcode number');
            $table->string('serial_number')->unique()->comment('Serial number');
            $table->foreignId('item_type_id')->constrained();
            $table->foreignId('location_id')->constrained();
            $table->string('name')->comment('Item name/title');
            $table->text('description')->nullable()->comment('Item description');
            $table->json('custom_fields')->nullable()->comment('Custom fields as JSON');
            $table->enum('status', ['active', 'maintenance', 'retired'])->default('active')->comment('Item status');
            $table->date('purchase_date')->nullable()->comment('Purchase date');
            $table->decimal('purchase_price', 10, 2)->nullable()->comment('Purchase price');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('barcode');
            $table->index('serial_number');
            $table->index('item_type_id');
            $table->index('location_id');
            $table->index('status');
            $table->index(['item_type_id', 'status']);
            $table->index(['location_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};