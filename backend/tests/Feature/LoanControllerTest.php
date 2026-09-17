<?php

namespace Tests\Feature;

use App\Models\Equipment;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class LoanControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_borrow_and_return_updates_inventory_atomically(): void
    {
        $equipment = Equipment::factory()->create(['quantity_total' => 2]);

        $loan = $this->postJson('/api/v1/loans', [
            'borrowerName' => 'Tim Jaringan A', 'division' => 'Jaringan', 'purpose' => 'Pemeliharaan jaringan',
            'borrowedAt' => '2026-09-17 08:00:00', 'dueAt' => '2026-09-18 17:00:00',
            'items' => [['equipmentId' => $equipment->id, 'quantity' => 1, 'conditionOut' => 'good']],
        ])->assertCreated()->assertJsonPath('data.items.0.quantity', 1)->json('data');

        $this->assertDatabaseHas('equipment', ['id' => $equipment->id, 'quantity_in_use' => 1, 'availability_status' => 'in_use']);

        $this->postJson("/api/v1/loans/{$loan['id']}/return", [
            'returnedAt' => '2026-09-18 15:00:00',
            'items' => [['id' => $loan['items'][0]['id'], 'quantity' => 1, 'conditionIn' => 'good']],
        ])->assertOk()->assertJsonPath('data.status', 'returned');

        $this->assertDatabaseHas('equipment', ['id' => $equipment->id, 'quantity_in_use' => 0, 'availability_status' => 'available']);
        $this->assertDatabaseCount('activity_logs', 2);
    }

    public function test_rejects_loan_when_stock_is_unavailable(): void
    {
        $equipment = Equipment::factory()->create(['quantity_total' => 1, 'quantity_in_use' => 1]);

        $this->postJson('/api/v1/loans', [
            'borrowerName' => 'Tim Jaringan A', 'division' => 'Jaringan', 'purpose' => 'Pemeliharaan jaringan',
            'borrowedAt' => '2026-09-17 08:00:00', 'dueAt' => '2026-09-18 17:00:00',
            'items' => [['equipmentId' => $equipment->id, 'quantity' => 1, 'conditionOut' => 'good']],
        ])->assertUnprocessable()->assertJsonValidationErrors(['items']);

        $this->assertDatabaseCount('loans', 0);
    }
}
