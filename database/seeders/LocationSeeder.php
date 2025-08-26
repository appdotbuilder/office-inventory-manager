<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['name' => 'Main Office - Floor 1', 'description' => 'Ground floor offices and reception area'],
            ['name' => 'Main Office - Floor 2', 'description' => 'Second floor offices and meeting rooms'],
            ['name' => 'IT Department', 'description' => 'Information Technology department'],
            ['name' => 'Conference Room A', 'description' => 'Large conference room'],
            ['name' => 'Conference Room B', 'description' => 'Small meeting room'],
            ['name' => 'Reception Area', 'description' => 'Front desk and waiting area'],
            ['name' => 'Server Room', 'description' => 'Data center and server equipment'],
            ['name' => 'Storage Room', 'description' => 'Equipment storage and supplies'],
            ['name' => 'Marketing Department', 'description' => 'Marketing and communications team'],
            ['name' => 'Finance Department', 'description' => 'Accounting and finance team'],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate(['name' => $location['name']], $location);
        }
    }
}