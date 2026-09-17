<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\Loan;
use App\Models\LoanItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoanItem>
 */
class LoanItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'loan_id' => Loan::factory(),
            'equipment_id' => Equipment::factory(),
            'quantity' => 1,
            'condition_out' => 'good',
        ];
    }
}
