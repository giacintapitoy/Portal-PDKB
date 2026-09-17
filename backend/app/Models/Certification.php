<?php

namespace App\Models;

use Database\Factories\CertificationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['personnel_name', 'employee_number', 'division', 'name', 'certificate_number', 'issued_at', 'expires_at', 'active', 'notes'])]
class Certification extends Model
{
    /** @use HasFactory<CertificationFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['issued_at' => 'date', 'expires_at' => 'date', 'active' => 'boolean'];
    }
}
