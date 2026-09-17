<?php

namespace App\Models;

use Database\Factories\EquipmentInspectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['equipment_id', 'inspected_at', 'result', 'next_inspection_at', 'notes', 'inspected_by'])]
class EquipmentInspection extends Model
{
    /** @use HasFactory<EquipmentInspectionFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['inspected_at' => 'date', 'next_inspection_at' => 'date'];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }
}
