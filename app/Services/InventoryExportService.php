<?php

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InventoryExportService
{
    /**
     * Export inventory data to CSV.
     */
    public function exportToCsv(Request $request): StreamedResponse
    {
        $query = InventoryItem::with(['itemType', 'location', 'creator']);
        
        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('item_type_id', $request->get('type'));
        }

        if ($request->filled('location')) {
            $query->where('location_id', $request->get('location'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        $response = new StreamedResponse(function () use ($items) {
            $handle = fopen('php://output', 'w');
            
            // Add BOM for proper UTF-8 encoding in Excel
            fwrite($handle, "\xEF\xBB\xBF");
            
            // CSV headers
            fputcsv($handle, [
                'ID',
                'Name',
                'Barcode',
                'Serial Number',
                'Type',
                'Location',
                'Status',
                'Purchase Date',
                'Purchase Price',
                'Description',
                'Created By',
                'Created At',
                'Updated At'
            ]);

            foreach ($items as $item) {
                fputcsv($handle, [
                    $item->id,
                    $item->name,
                    $item->barcode,
                    $item->serial_number,
                    $item->itemType->name,
                    $item->location->name,
                    ucfirst($item->status),
                    $item->purchase_date?->format('Y-m-d') ?? '',
                    $item->purchase_price ?? '',
                    $item->description ?? '',
                    $item->creator->name,
                    $item->created_at->format('Y-m-d H:i:s'),
                    $item->updated_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="inventory-export-' . date('Y-m-d-H-i-s') . '.csv"');

        return $response;
    }
}