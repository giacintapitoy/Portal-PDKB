<?php

namespace App\Models;

use Database\Factories\LoanItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['loan_id', 'equipment_id', 'quantity', 'returned_quantity', 'condition_out', 'condition_in', 'notes'])]
class LoanItem extends Model
{
    /** @use HasFactory<LoanItemFactory> */
    use HasFactory;

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
