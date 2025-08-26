<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->canAddItems();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'barcode' => 'required|string|unique:inventory_items,barcode|max:255',
            'serial_number' => 'required|string|unique:inventory_items,serial_number|max:255',
            'item_type_id' => 'required|exists:item_types,id',
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'custom_fields' => 'nullable|array',
            'status' => 'required|in:active,maintenance,retired',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0|max:999999.99',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'barcode.required' => 'Barcode number is required.',
            'barcode.unique' => 'This barcode already exists in the inventory.',
            'serial_number.required' => 'Serial number is required.',
            'serial_number.unique' => 'This serial number already exists in the inventory.',
            'item_type_id.required' => 'Item type is required.',
            'item_type_id.exists' => 'Selected item type is invalid.',
            'location_id.required' => 'Location is required.',
            'location_id.exists' => 'Selected location is invalid.',
            'name.required' => 'Item name is required.',
        ];
    }
}