<?php

namespace Tests\Feature;

use App\Models\Equipment;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class EquipmentIndexTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_it_lists_and_filters_equipment(): void
    {
        Equipment::factory()->create([
            'inventory_code' => 'PDKB-ISO-014',
            'name' => 'Hot Stick 6 Section',
            'serial_number' => 'HS6-2021-014',
        ]);

        $this->getJson('/api/v1/equipment?search=HS6-2021')
            ->assertOk()
            ->assertJsonPath('data.0.inventoryCode', 'PDKB-ISO-014')
            ->assertJsonPath('data.0.quantity.available', 1)
            ->assertJsonCount(1, 'data');
    }

    public function test_seeded_equipment_is_available_from_the_api(): void
    {
        $this->seed();

        $this->getJson('/api/v1/equipment')
            ->assertOk()
            ->assertJsonCount(4, 'data');
    }

    public function test_valid_payload_creates_equipment_and_returns_201(): void
    {
        $response = $this->postJson('/api/v1/equipment', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('data.inventoryCode', 'PDKB-ISO-099')
            ->assertJsonPath('data.category', 'Isolasi')
            ->assertJsonPath('data.quantity.total', 1)
            ->assertJsonPath('data.quantity.available', 1);
        $this->assertDatabaseHas('equipment', [
            'inventory_code' => 'PDKB-ISO-099',
            'availability_status' => 'available',
        ]);
    }

    public function test_duplicate_inventory_code_returns_422_without_creating_equipment(): void
    {
        Equipment::factory()->create(['inventory_code' => 'PDKB-ISO-099']);

        $this->postJson('/api/v1/equipment', $this->payload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['inventoryCode']);
        $this->assertDatabaseCount('equipment', 1);
    }

    public function test_valid_payload_updates_equipment(): void
    {
        $equipment = Equipment::factory()->create(['inventory_code' => 'PDKB-ISO-099']);

        $response = $this->putJson("/api/v1/equipment/{$equipment->id}", [
            ...$this->payload(),
            'name' => 'Hot Stick Diperbarui',
            'active' => false,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Hot Stick Diperbarui')
            ->assertJsonPath('data.active', false);
        $this->assertDatabaseHas('equipment', [
            'id' => $equipment->id,
            'name' => 'Hot Stick Diperbarui',
            'active' => false,
        ]);
    }

    public function test_delete_soft_deletes_equipment_and_returns_204(): void
    {
        $equipment = Equipment::factory()->create();

        $this->deleteJson("/api/v1/equipment/{$equipment->id}")
            ->assertNoContent();

        $this->assertSoftDeleted($equipment);
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'inventoryCode' => 'PDKB-ISO-099',
            'name' => 'Hot Stick Baru',
            'category' => 'Isolasi',
            'serialNumber' => 'HS-099',
            'origin' => 'Pengadaan UPT Manado',
            'acquiredAt' => '2026-09-17',
            'condition' => 'good',
            'location' => 'Gudang A',
            'availabilityStatus' => 'available',
            'nextInspectionAt' => '2026-12-17',
            'active' => true,
            'notes' => null,
        ];
    }
}
