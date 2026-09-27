<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PersonnelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $personnel = $this->route('personnel');

        return [
            'employeeId' => ['required', 'string', 'max:255', Rule::unique('personnel', 'employee_id')->ignore($personnel)],
            'name' => ['required', 'string', 'max:255'],
            'team' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'leave', 'inactive'])],
        ];
    }
}
