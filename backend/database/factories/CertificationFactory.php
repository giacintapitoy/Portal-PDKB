<?php

namespace Database\Factories;

use App\Models\Certification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Certification>
 */
class CertificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'personnel_name' => fake()->name(),
            'employee_number' => fake()->unique()->numerify('########'),
            'division' => 'Jaringan',
            'name' => 'Sertifikasi PDKB',
            'certificate_number' => fake()->unique()->bothify('CERT-####-????'),
            'issued_at' => '2026-01-01',
            'expires_at' => '2027-01-01',
            'active' => true,
        ];
    }
}
