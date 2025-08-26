import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface InventoryItem {
    id: number;
    name: string;
    barcode: string;
    serial_number: string;
    status: 'active' | 'maintenance' | 'retired';
    item_type: {
        name: string;
    };
    location: {
        name: string;
    };
    creator: {
        name: string;
    };
    purchase_date?: string;
    purchase_price?: number;
    created_at: string;
    updated_at: string;
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
    items: {
        data: InventoryItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
    };
    itemTypes: ItemType[];
    locations: Location[];
    filters: {
        search?: string;
        type?: string;
        location?: string;
        status?: string;
    };
    canAdd: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: unknown;
}

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    retired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export default function InventoryIndex({ items, itemTypes, locations, filters, canAdd, canUpdate }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleSearch = () => {
        router.get(route('inventory.index'), {
            search: searchTerm,
            type: selectedType,
            location: selectedLocation,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedLocation('');
        setSelectedStatus('');
        router.get(route('inventory.index'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedType) params.append('type', selectedType);
        if (selectedLocation) params.append('location', selectedLocation);
        if (selectedStatus) params.append('status', selectedStatus);
        
        window.open(`${route('inventory.export')}?${params.toString()}`);
    };

    return (
        <AppShell>
            <Head title="Inventory Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📦 Inventory Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your office equipment and assets</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        {canAdd && (
                            <Link
                                href={route('inventory.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <span className="mr-2">➕</span>
                                Add Item
                            </Link>
                        )}
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <span className="mr-2">📊</span>
                            Export to Excel
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Search
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search items..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Types</option>
                                {itemTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Location
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Locations</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>{location.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Items ({items.total} total)
                        </h2>
                    </div>
                    
                    {items.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {Object.values(filters).some(v => v) ? 'Try adjusting your filters' : 'Get started by adding your first inventory item'}
                            </p>
                            {canAdd && (
                                <Link
                                    href={route('inventory.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <span className="mr-2">➕</span>
                                    Add First Item
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Identifiers
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Type & Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {items.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Added by {item.creator.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    <div>Barcode: {item.barcode}</div>
                                                    <div>Serial: {item.serial_number}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    <div>{item.item_type.name}</div>
                                                    <div className="text-gray-500 dark:text-gray-400">{item.location.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('inventory.show', item.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        View
                                                    </Link>
                                                    {canUpdate && (
                                                        <Link
                                                            href={route('inventory.edit', item.id)}
                                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {items.last_page > 1 && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {((items.current_page - 1) * items.per_page) + 1} to {Math.min(items.current_page * items.per_page, items.total)} of {items.total} results
                                </div>
                                <nav className="flex space-x-2">
                                    {items.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}