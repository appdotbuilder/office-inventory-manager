<?php

namespace Database\Seeders;

use App\Models\ItemType;
use Illuminate\Database\Seeder;

class ItemTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $itemTypes = [
            ['name' => 'Desktop PC', 'description' => 'Desktop computers and workstations'],
            ['name' => 'Laptop', 'description' => 'Portable laptops and notebooks'],
            ['name' => 'Monitor', 'description' => 'Computer monitors and displays'],
            ['name' => 'Printer', 'description' => 'Printers and multifunction devices'],
            ['name' => 'Scanner', 'description' => 'Document scanners'],
            ['name' => 'Server', 'description' => 'Server hardware'],
            ['name' => 'Network Equipment', 'description' => 'Routers, switches, and network devices'],
            ['name' => 'Keyboard', 'description' => 'Computer keyboards'],
            ['name' => 'Mouse', 'description' => 'Computer mice and pointing devices'],
            ['name' => 'Tablet', 'description' => 'Tablet devices and iPads'],
        ];

        foreach ($itemTypes as $type) {
            ItemType::firstOrCreate(['name' => $type['name']], $type);
        }
    }
}