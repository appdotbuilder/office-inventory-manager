<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Location;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create operator user
        User::factory()->create([
            'name' => 'Operator User',
            'email' => 'operator@example.com',
            'role' => 'operator',
        ]);

        // Create regular user
        User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'role' => 'user',
        ]);

        // Seed item types and locations
        $this->call([
            ItemTypeSeeder::class,
            LocationSeeder::class,
        ]);

        // Create some sample inventory items
        InventoryItem::factory(50)
            ->recycle(User::all())
            ->recycle(ItemType::all())
            ->recycle(Location::all())
            ->create();
    }
}
