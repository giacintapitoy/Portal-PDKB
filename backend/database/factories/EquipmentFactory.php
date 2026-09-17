<?php

namespace Database\Factories;

use App\Models\Division;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'inventory_code' => fake()->unique()->bothify('PDKB-???-###'),
            'tracking_mode' => 'serialized',
            'name' => fake()->words(3, true),
            'division_id' => Division::factory(),
            'category_id' => EquipmentCategory::factory(),
            'serial_number' => fake()->unique()->bothify('SN-####-????'),
            'origin' => 'Pengadaan UPT Manado',
            'location' => 'Gudang A',
            'next_inspection_at' => '2026-10-18',
        ];
    }
}
