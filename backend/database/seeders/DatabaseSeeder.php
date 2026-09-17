<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $divisions = collect(['Jaringan', 'Gardu Induk'])
            ->mapWithKeys(fn (string $name): array => [$name => Division::updateOrCreate(['name' => $name])]);

        $categories = collect(['Isolasi', 'Metal', 'K3', 'Pendukung', 'Inovasi'])
            ->mapWithKeys(fn (string $name): array => [$name => EquipmentCategory::updateOrCreate(['name' => $name])]);

        $equipment = [
            ['inventory_code' => 'PDKB-ISO-014', 'name' => 'Hot Stick 6 Section', 'category' => 'Isolasi', 'serial_number' => 'HS6-2021-014', 'acquired_at' => '2021-03-12', 'location' => 'Gudang A', 'condition' => 'good', 'availability_status' => 'available', 'next_inspection_at' => '2026-10-18', 'notes' => 'Inspeksi visual sebelum digunakan.'],
            ['inventory_code' => 'PDKB-K3-022', 'name' => 'Full Body Harness', 'category' => 'K3', 'serial_number' => 'FBH-2023-022', 'acquired_at' => '2023-07-08', 'location' => 'Tim Jaringan', 'condition' => 'good', 'availability_status' => 'in_use', 'next_inspection_at' => '2026-09-27'],
            ['inventory_code' => 'PDKB-MTL-008', 'name' => 'Hydraulic Crimping Tool', 'category' => 'Metal', 'serial_number' => 'HCT-2020-008', 'acquired_at' => '2020-11-19', 'location' => 'Ruang Inspeksi', 'condition' => 'inspection_required', 'availability_status' => 'inspection', 'next_inspection_at' => '2026-09-21', 'notes' => 'Tekanan hidrolik perlu diverifikasi.'],
            ['inventory_code' => 'PDKB-PND-031', 'name' => 'Insulation Tester', 'category' => 'Pendukung', 'serial_number' => 'IT-2024-031', 'acquired_at' => '2024-02-15', 'location' => 'Gudang B', 'condition' => 'good', 'availability_status' => 'available', 'next_inspection_at' => '2026-12-12'],
        ];

        foreach ($equipment as $item) {
            Equipment::updateOrCreate(
                ['inventory_code' => $item['inventory_code']],
                [
                    ...Arr::except($item, 'category'),
                    'tracking_mode' => 'serialized',
                    'division_id' => $divisions['Jaringan']->id,
                    'category_id' => $categories[$item['category']]->id,
                    'origin' => 'Pengadaan UPT Manado',
                ],
            );
        }
    }
}
