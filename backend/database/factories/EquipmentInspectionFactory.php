<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\EquipmentInspection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EquipmentInspection>
 */
class EquipmentInspectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'equipment_id' => Equipment::factory(),
            'inspected_at' => '2026-09-17',
            'result' => 'good',
            'next_inspection_at' => '2027-03-17',
        ];
    }
}
