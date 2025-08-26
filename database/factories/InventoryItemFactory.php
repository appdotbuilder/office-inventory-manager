<?php

namespace Database\Factories;

use App\Models\ItemType;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barcode' => fake()->unique()->numerify('##########'),
            'serial_number' => fake()->unique()->bothify('??####????'),
            'item_type_id' => ItemType::factory(),
            'location_id' => Location::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'custom_fields' => null,
            'status' => fake()->randomElement(['active', 'maintenance', 'retired']),
            'purchase_date' => fake()->optional()->dateTimeBetween('-2 years', 'now'),
            'purchase_price' => fake()->optional()->randomFloat(2, 100, 5000),
            'created_by' => User::factory(),
            'updated_by' => null,
        ];
    }

    /**
     * Indicate that the item is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the item is in maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
        ]);
    }

    /**
     * Indicate that the item is retired.
     */
    public function retired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'retired',
        ]);
    }

    /**
     * Indicate that the item has custom fields.
     */
    public function withCustomFields(): static
    {
        return $this->state(fn (array $attributes) => [
            'custom_fields' => [
                'warranty_expiry' => fake()->dateTimeBetween('now', '+3 years')->format('Y-m-d'),
                'supplier' => fake()->company(),
                'model_number' => fake()->bothify('??###-????'),
            ],
        ]);
    }
}