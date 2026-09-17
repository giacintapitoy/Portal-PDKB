<?php

namespace Database\Factories;

use App\Models\Division;
use App\Models\Loan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('LOAN-########-??????'),
            'borrower_name' => fake()->name(),
            'division_id' => Division::factory(),
            'purpose' => fake()->sentence(),
            'borrowed_at' => '2026-09-17 08:00:00',
            'due_at' => '2026-09-18 17:00:00',
            'status' => 'borrowed',
        ];
    }
}
