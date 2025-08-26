import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface InventoryItem {
    id: number;
    name: string;
    barcode: string;
    serial_number: string;
    description?: string;
    status: 'active' | 'maintenance' | 'retired';
    purchase_date?: string;
    purchase_price?: number;
    custom_fields?: Record<string, string>;
    item_type: {
        id: number;
        name: string;
    };
    location: {
        id: number;
        name: string;
    };
}

interface ItemType {
    id: number;
    name: string;
}

interface Location {
    id: number;
    name: string;
}

interface Props {
    item: InventoryItem;
    itemTypes: ItemType[];
    locations: Location[];
    [key: string]: unknown;
}

interface InventoryFormData {
    barcode: string;
    serial_number: string;
    item_type_id: string;
    location_id: string;
    name: string;
    description: string;
    status: string;
    purchase_date: string;
    purchase_price: string;
    custom_fields: Record<string, string>;
    [key: string]: string | number | Record<string, string>;
}

export default function EditInventoryItem({ item, itemTypes, locations }: Props) {
    const { data, setData, put, processing, errors } = useForm<InventoryFormData>({
        barcode: item.barcode,
        serial_number: item.serial_number,
        item_type_id: item.item_type.id.toString(),
        location_id: item.location.id.toString(),
        name: item.name,
        description: item.description || '',
        status: item.status,
        purchase_date: item.purchase_date || '',
        purchase_price: item.purchase_price?.toString() || '',
        custom_fields: item.custom_fields || {}
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update form data before submitting
        setData(prevData => ({
            ...prevData,
            item_type_id: parseInt(prevData.item_type_id).toString(),
            location_id: parseInt(prevData.location_id).toString(),
            purchase_price: prevData.purchase_price ? parseFloat(prevData.purchase_price).toString() : '',
            custom_fields: Object.keys(prevData.custom_fields).length > 0 ? prevData.custom_fields : {}
        }));

        put(route('inventory.update', item.id));
    };

    const addCustomField = () => {
        const fieldName = prompt('Enter custom field name:');
        if (fieldName && fieldName.trim()) {
            setData('custom_fields', {
                ...data.custom_fields,
                [fieldName.trim()]: ''
            });
        }
    };

    const removeCustomField = (fieldName: string) => {
        const newFields = { ...data.custom_fields };
        delete newFields[fieldName];
        setData('custom_fields', newFields);
    };

    const updateCustomField = (fieldName: string, value: string) => {
        setData('custom_fields', {
            ...data.custom_fields,
            [fieldName]: value
        });
    };

    const generateBarcode = () => {
        const barcode = Math.random().toString().slice(2, 12);
        setData('barcode', barcode);
    };

    return (
        <AppShell>
            <Head title={`Edit ${item.name} - Inventory Item`} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('inventory.show', item.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            ← Back to Item
                        </Link>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">✏️ Edit Inventory Item</h1>
                    <p className="text-gray-600 dark:text-gray-400">Update the details of this inventory item</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="e.g., Dell OptiPlex 7090"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Item Type *
                                    </label>
                                    <select
                                        value={data.item_type_id}
                                        onChange={(e) => setData('item_type_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a type</option>
                                        {itemTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.item_type_id && <p className="mt-1 text-sm text-red-600">{errors.item_type_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Location *
                                    </label>
                                    <select
                                        value={data.location_id}
                                        onChange={(e) => setData('location_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Select a location</option>
                                        {locations.map(location => (
                                            <option key={location.id} value={location.id}>{location.name}</option>
                                        ))}
                                    </select>
                                    {errors.location_id && <p className="mt-1 text-sm text-red-600">{errors.location_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="retired">Retired</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Additional details about this item..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Identifiers */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Identifiers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Barcode *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={generateBarcode}
                                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            Generate New
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.barcode}
                                        onChange={(e) => setData('barcode', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="e.g., 1234567890"
                                        required
                                    />
                                    {errors.barcode && <p className="mt-1 text-sm text-red-600">{errors.barcode}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Serial Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.serial_number}
                                        onChange={(e) => setData('serial_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="e.g., SN1234ABCD"
                                        required
                                    />
                                    {errors.serial_number && <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Purchase Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Purchase Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Purchase Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.purchase_date}
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {errors.purchase_date && <p className="mt-1 text-sm text-red-600">{errors.purchase_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Purchase Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.purchase_price}
                                        onChange={(e) => setData('purchase_price', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="0.00"
                                    />
                                    {errors.purchase_price && <p className="mt-1 text-sm text-red-600">{errors.purchase_price}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Custom Fields */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Custom Fields</h3>
                                <button
                                    type="button"
                                    onClick={addCustomField}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    + Add Custom Field
                                </button>
                            </div>
                            
                            {Object.keys(data.custom_fields).length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                                    No custom fields added. Click "Add Custom Field" to add additional properties.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {Object.entries(data.custom_fields).map(([fieldName, fieldValue]) => (
                                        <div key={fieldName} className="flex items-center space-x-2">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {fieldName}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={fieldValue}
                                                    onChange={(e) => updateCustomField(fieldName, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    placeholder={`Enter ${fieldName.toLowerCase()}...`}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomField(fieldName)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm mt-6"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route('inventory.show', item.id)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Updating...' : '💾 Update Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}