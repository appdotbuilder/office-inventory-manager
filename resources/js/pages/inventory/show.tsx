import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    created_at: string;
    updated_at: string;
    item_type: {
        id: number;
        name: string;
        description?: string;
    };
    location: {
        id: number;
        name: string;
        description?: string;
    };
    creator: {
        name: string;
        email: string;
    };
    updater?: {
        name: string;
        email: string;
    };
}

interface Props {
    item: InventoryItem;
    canUpdate: boolean;
    canDelete: boolean;
    [key: string]: unknown;
}

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    retired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusIcons = {
    active: '✅',
    maintenance: '🔧',
    retired: '❌'
};

export default function ShowInventoryItem({ item, canUpdate, canDelete }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this inventory item? This action cannot be undone.')) {
            router.delete(route('inventory.destroy', item.id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <Head title={`${item.name} - Inventory Item`} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('inventory.index')}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            ← Back to Inventory
                        </Link>
                    </div>
                    
                    <div className="flex space-x-3">
                        {canUpdate && (
                            <Link
                                href={route('inventory.edit', item.id)}
                                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                <span className="mr-2">✏️</span>
                                Edit Item
                            </Link>
                        )}
                        
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <span className="mr-2">🗑️</span>
                                Delete Item
                            </button>
                        )}
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {item.name}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center">
                                    <span className="mr-1">📦</span>
                                    {item.item_type.name}
                                </span>
                                <span className="flex items-center">
                                    <span className="mr-1">📍</span>
                                    {item.location.name}
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusColors[item.status]}`}>
                                <span className="mr-1">{statusIcons[item.status]}</span>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                        </div>
                    </div>
                    
                    {item.description && (
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{item.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Identifiers & Basic Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            🏷️ Identifiers & Details
                        </h2>
                        
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Barcode</dt>
                                <dd className="text-lg font-mono text-gray-900 dark:text-white">{item.barcode}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</dt>
                                <dd className="text-lg font-mono text-gray-900 dark:text-white">{item.serial_number}</dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Item Type</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    <div className="font-medium">{item.item_type.name}</div>
                                    {item.item_type.description && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.item_type.description}</div>
                                    )}
                                </dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    <div className="font-medium">{item.location.name}</div>
                                    {item.location.description && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.location.description}</div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Purchase Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            💰 Purchase Information
                        </h2>
                        
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Date</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {item.purchase_date ? formatDate(item.purchase_date) : 'Not specified'}
                                </dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Price</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    {item.purchase_price ? `$${item.purchase_price.toFixed(2)}` : 'Not specified'}
                                </dd>
                            </div>
                            
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</dt>
                                <dd>
                                    <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${statusColors[item.status]}`}>
                                        <span className="mr-1">{statusIcons[item.status]}</span>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Custom Fields */}
                {item.custom_fields && Object.keys(item.custom_fields).length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            🔧 Custom Fields
                        </h2>
                        
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(item.custom_fields).map(([fieldName, fieldValue]) => (
                                <div key={fieldName}>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{fieldName}</dt>
                                    <dd className="text-gray-900 dark:text-white">{fieldValue || 'Not specified'}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                {/* Record Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        📋 Record Information
                    </h2>
                    
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                            <dd className="text-gray-900 dark:text-white">
                                <div className="font-medium">{item.creator.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.creator.email}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">{formatDateTime(item.created_at)}</div>
                            </dd>
                        </div>
                        
                        {item.updater && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated By</dt>
                                <dd className="text-gray-900 dark:text-white">
                                    <div className="font-medium">{item.updater.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.updater.email}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-500">{formatDateTime(item.updated_at)}</div>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </AppShell>
    );
}