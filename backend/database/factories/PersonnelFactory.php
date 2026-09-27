<?php

namespace Database\Factories;

use App\Models\Personnel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Personnel>
 */
class PersonnelFactory extends Factory
{
    protected $model = Personnel::class;

    public function definition(): array
    {
        return [
            'employee_id' => fake()->unique()->bothify('PG-####'),
            'name' => fake()->name(),
            'team' => fake()->randomElement(['PDKB GI', 'PDKB Jaringan']),
            'position' => fake()->jobTitle(),
            'status' => 'active',
        ];
    }
}
