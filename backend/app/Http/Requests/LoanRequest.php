<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'borrowerName' => ['required', 'string', 'max:255'],
            'division' => ['required', 'string', 'max:255'],
            'purpose' => ['required', 'string'],
            'borrowedAt' => ['required', 'date'],
            'dueAt' => ['required', 'date', 'after_or_equal:borrowedAt'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.equipmentId' => ['required', 'integer', 'distinct', 'exists:equipment,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.conditionOut' => ['required', 'string', 'max:32'],
        ];
    }
}
