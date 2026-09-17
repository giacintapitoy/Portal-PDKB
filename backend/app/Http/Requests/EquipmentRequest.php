<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipmentRequest extends FormRequest
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
        $equipment = $this->route('equipment');

        return [
            'inventoryCode' => ['required', 'string', 'max:255', Rule::unique('equipment', 'inventory_code')->ignore($equipment)],
            'trackingMode' => ['sometimes', Rule::in(['serialized', 'quantity'])],
            'name' => ['required', 'string', 'max:255'],
            'division' => ['sometimes', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'serialNumber' => ['nullable', 'string', 'max:255', Rule::unique('equipment', 'serial_number')->ignore($equipment)],
            'brand' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:255'],
            'origin' => ['required', 'string', 'max:255'],
            'acquiredAt' => ['nullable', 'date'],
            'unit' => ['sometimes', 'string', 'max:32'],
            'location' => ['required', 'string', 'max:255'],
            'condition' => ['required', Rule::in(['good', 'inspection_required', 'damaged', 'repair'])],
            'availabilityStatus' => ['required', Rule::in(['available', 'in_use', 'inspection'])],
            'nextInspectionAt' => ['required', 'date'],
            'active' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
