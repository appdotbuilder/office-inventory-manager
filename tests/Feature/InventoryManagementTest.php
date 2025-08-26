<?php

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Location;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
    $this->operator = User::factory()->operator()->create();
    $this->user = User::factory()->user()->create();
    
    $this->itemType = ItemType::factory()->create(['name' => 'PC']);
    $this->location = Location::factory()->create(['name' => 'Office 101']);
});

test('admin can view inventory index', function () {
    $response = $this->actingAs($this->admin)
        ->get(route('inventory.index'));

    $response->assertStatus(200);
});

test('admin can create inventory item', function () {
    $itemData = [
        'barcode' => '1234567890',
        'serial_number' => 'SN123456',
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'name' => 'Test PC',
        'description' => 'Test description',
        'status' => 'active',
        'purchase_date' => '2024-01-01',
        'purchase_price' => 999.99,
    ];

    $response = $this->actingAs($this->admin)
        ->post(route('inventory.store'), $itemData);

    $response->assertRedirect();
    $this->assertDatabaseHas('inventory_items', [
        'barcode' => '1234567890',
        'serial_number' => 'SN123456',
        'name' => 'Test PC',
    ]);
});

test('user can add inventory items', function () {
    $itemData = [
        'barcode' => '1234567891',
        'serial_number' => 'SN123457',
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'name' => 'User PC',
        'status' => 'active',
    ];

    $response = $this->actingAs($this->user)
        ->post(route('inventory.store'), $itemData);

    $response->assertRedirect();
    $this->assertDatabaseHas('inventory_items', [
        'name' => 'User PC',
        'created_by' => $this->user->id,
    ]);
});

test('operator can update inventory items', function () {
    $item = InventoryItem::factory()->create([
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'created_by' => $this->user->id,
    ]);

    $updateData = [
        'barcode' => $item->barcode,
        'serial_number' => $item->serial_number,
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'name' => 'Updated Item Name',
        'status' => 'maintenance',
    ];

    $response = $this->actingAs($this->operator)
        ->put(route('inventory.update', $item), $updateData);

    $response->assertRedirect();
    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'name' => 'Updated Item Name',
        'status' => 'maintenance',
        'updated_by' => $this->operator->id,
    ]);
});

test('user cannot update inventory items', function () {
    $item = InventoryItem::factory()->create([
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'created_by' => $this->user->id,
    ]);

    $response = $this->actingAs($this->user)
        ->put(route('inventory.update', $item), []);

    $response->assertStatus(403);
});

test('only admin can delete inventory items', function () {
    $item = InventoryItem::factory()->create([
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'created_by' => $this->user->id,
    ]);

    // User cannot delete
    $response = $this->actingAs($this->user)
        ->delete(route('inventory.destroy', $item));
    $response->assertStatus(403);

    // Operator cannot delete
    $response = $this->actingAs($this->operator)
        ->delete(route('inventory.destroy', $item));
    $response->assertStatus(403);

    // Admin can delete
    $response = $this->actingAs($this->admin)
        ->delete(route('inventory.destroy', $item));
    $response->assertRedirect();
    $this->assertDatabaseMissing('inventory_items', ['id' => $item->id]);
});

test('inventory export generates csv', function () {
    InventoryItem::factory(3)->create([
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'created_by' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get(route('inventory.export'));

    $response->assertStatus(200);
    expect($response->headers->get('content-type'))->toContain('text/csv');
    expect($response->headers->get('content-disposition'))->toContain('attachment; filename=');
});

test('inventory search works', function () {
    $item = InventoryItem::factory()->create([
        'name' => 'Dell OptiPlex 7090',
        'item_type_id' => $this->itemType->id,
        'location_id' => $this->location->id,
        'created_by' => $this->admin->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get(route('inventory.index', ['search' => 'Dell']));

    $response->assertStatus(200);
});