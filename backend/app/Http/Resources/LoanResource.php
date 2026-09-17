<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'borrowerName' => $this->borrower_name,
            'division' => $this->division->name,
            'purpose' => $this->purpose,
            'borrowedAt' => $this->borrowed_at->toISOString(),
            'dueAt' => $this->due_at->toISOString(),
            'returnedAt' => $this->returned_at?->toISOString(),
            'status' => $this->status,
            'notes' => $this->notes,
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item): array => [
                'id' => $item->id,
                'equipmentId' => $item->equipment_id,
                'equipmentName' => $item->equipment->name,
                'inventoryCode' => $item->equipment->inventory_code,
                'quantity' => $item->quantity,
                'returnedQuantity' => $item->returned_quantity,
                'conditionOut' => $item->condition_out,
                'conditionIn' => $item->condition_in,
                'notes' => $item->notes,
            ])),
        ];
    }
}
