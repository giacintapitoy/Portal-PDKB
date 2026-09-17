<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'equipment';

    protected $attributes = [
        'quantity_total' => 1,
        'quantity_in_use' => 0,
        'quantity_damaged' => 0,
        'quantity_repair' => 0,
    ];

    protected $fillable = [
        'inventory_code', 'tracking_mode', 'name', 'division_id', 'category_id',
        'serial_number', 'brand', 'model', 'size', 'origin', 'acquired_at', 'unit',
        'location', 'condition', 'availability_status', 'next_inspection_at', 'active', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'acquired_at' => 'date',
            'next_inspection_at' => 'date',
            'active' => 'boolean',
        ];
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EquipmentCategory::class, 'category_id');
    }

    public function availableQuantity(): int
    {
        return max(0, $this->quantity_total - $this->quantity_in_use - $this->quantity_damaged - $this->quantity_repair);
    }
}
