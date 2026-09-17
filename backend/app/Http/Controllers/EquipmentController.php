<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentRequest;
use App\Http\Resources\EquipmentResource;
use App\Models\Division;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class EquipmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $equipment = Equipment::query()
            ->with(['division', 'category'])
            ->when($request->string('search')->trim()->value(), function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('inventory_code', "%{$search}%")
                        ->orWhereLike('serial_number', "%{$search}%")
                        ->orWhereLike('location', "%{$search}%");
                });
            })
            ->when($request->filled('division'), fn ($query) => $query->whereRelation('division', 'name', $request->string('division')->value()))
            ->when($request->filled('category'), fn ($query) => $query->whereRelation('category', 'name', $request->string('category')->value()))
            ->when($request->filled('status'), fn ($query) => $query->where('availability_status', $request->string('status')->value()))
            ->when($request->has('active'), fn ($query) => $query->where('active', $request->boolean('active')))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(20);

        return EquipmentResource::collection($equipment);
    }

    public function store(EquipmentRequest $request): EquipmentResource
    {
        $equipment = Equipment::create($this->attributes($request));

        return new EquipmentResource($equipment->load(['division', 'category']));
    }

    public function show(Equipment $equipment): EquipmentResource
    {
        return new EquipmentResource($equipment->load(['division', 'category']));
    }

    public function update(EquipmentRequest $request, Equipment $equipment): EquipmentResource
    {
        $equipment->update($this->attributes($request));

        return new EquipmentResource($equipment->load(['division', 'category']));
    }

    public function destroy(Equipment $equipment): Response
    {
        $equipment->delete();

        return response()->noContent();
    }

    /** @return array<string, mixed> */
    private function attributes(EquipmentRequest $request): array
    {
        $data = $request->validated();

        return [
            'inventory_code' => $data['inventoryCode'],
            'tracking_mode' => $data['trackingMode'] ?? 'serialized',
            'name' => $data['name'],
            'division_id' => Division::firstOrCreate(['name' => $data['division'] ?? 'Jaringan'])->id,
            'category_id' => EquipmentCategory::firstOrCreate(['name' => $data['category']])->id,
            'serial_number' => $data['serialNumber'] ?? null,
            'brand' => $data['brand'] ?? null,
            'model' => $data['model'] ?? null,
            'size' => $data['size'] ?? null,
            'origin' => $data['origin'],
            'acquired_at' => $data['acquiredAt'] ?? null,
            'unit' => $data['unit'] ?? 'unit',
            'location' => $data['location'],
            'condition' => $data['condition'],
            'availability_status' => $data['availabilityStatus'],
            'next_inspection_at' => $data['nextInspectionAt'],
            'active' => $data['active'] ?? true,
            'notes' => $data['notes'] ?? null,
        ];
    }
}
