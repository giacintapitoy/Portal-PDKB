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
}
