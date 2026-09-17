<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'action' => 'equipment.updated',
            'subject_type' => Equipment::class,
            'description' => fake()->sentence(),
        ];
    }
}
