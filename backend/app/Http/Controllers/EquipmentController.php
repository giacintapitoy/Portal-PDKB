<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
}
