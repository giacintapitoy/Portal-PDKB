<?php

namespace Tests\Feature;

use App\Models\Personnel;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class PersonnelApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_it_lists_searches_and_filters_personnel(): void
    {
        Personnel::factory()->create([
            'employee_id' => 'PG-101',
            'name' => 'Rian Tumbel',
            'team' => 'PDKB GI',
            'status' => 'active',
        ]);
        Personnel::factory()->create([
            'employee_id' => 'PG-102',
            'name' => 'Mario Rondonuwu',
            'team' => 'PDKB Jaringan',
            'status' => 'leave',
        ]);

        $this->getJson('/api/v1/personnel?search=Rian&team=PDKB%20GI&status=active')
            ->assertOk()
            ->assertJsonPath('data.0.employeeId', 'PG-101')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('teams.0', 'PDKB GI')
            ->assertJsonCount(1, 'data');
    }

    public function test_it_creates_personnel_and_rejects_duplicate_employee_ids(): void
    {
        $this->postJson('/api/v1/personnel', $this->payload())
            ->assertCreated()
            ->assertJsonPath('data.employeeId', 'PG-201')
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('personnel', ['employee_id' => 'PG-201']);

        $this->postJson('/api/v1/personnel', $this->payload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['employeeId']);

        $this->assertDatabaseCount('personnel', 1);
    }

    public function test_it_updates_and_shows_personnel(): void
    {
        $personnel = Personnel::factory()->create(['employee_id' => 'PG-202']);

        $this->putJson("/api/v1/personnel/{$personnel->id}", [
            ...$this->payload(),
            'employeeId' => 'PG-202-UPDATED',
            'status' => 'inactive',
        ])->assertOk()
            ->assertJsonPath('data.employeeId', 'PG-202-UPDATED')
            ->assertJsonPath('data.status', 'inactive');

        $this->getJson("/api/v1/personnel/{$personnel->id}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Petugas Baru');

        $this->assertDatabaseHas('personnel', [
            'id' => $personnel->id,
            'employee_id' => 'PG-202-UPDATED',
            'status' => 'inactive',
        ]);
    }

    public function test_it_rejects_an_invalid_personnel_status(): void
    {
        $this->postJson('/api/v1/personnel', [...$this->payload(), 'status' => 'unknown'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    /** @return array<string, string> */
    private function payload(): array
    {
        return [
            'employeeId' => 'PG-201',
            'name' => 'Petugas Baru',
            'team' => 'PDKB GI',
            'position' => 'Pelaksana PDKB TM',
            'status' => 'active',
        ];
    }
}
