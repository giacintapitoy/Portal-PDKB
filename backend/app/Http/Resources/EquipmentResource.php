<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'inventoryCode' => $this->inventory_code,
            'trackingMode' => $this->tracking_mode,
            'name' => $this->name,
            'division' => $this->division->name,
            'category' => $this->category->name,
            'serialNumber' => $this->serial_number,
            'brand' => $this->brand,
            'model' => $this->model,
            'size' => $this->size,
            'origin' => $this->origin,
            'acquiredAt' => $this->acquired_at?->toDateString(),
            'unit' => $this->unit,
            'location' => $this->location,
            'condition' => $this->condition,
            'availabilityStatus' => $this->availability_status,
            'nextInspectionAt' => $this->next_inspection_at->toDateString(),
            'quantity' => [
                'total' => $this->quantity_total,
                'available' => $this->availableQuantity(),
                'inUse' => $this->quantity_in_use,
                'damaged' => $this->quantity_damaged,
                'repair' => $this->quantity_repair,
            ],
            'active' => $this->active,
            'notes' => $this->notes,
        ];
    }
}
