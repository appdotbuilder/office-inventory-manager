<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Models\InventoryItem;
use App\Models\ItemType;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;


class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = InventoryItem::with(['itemType', 'location', 'creator']);
        
        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%")
                  ->orWhereHas('itemType', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('location', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('item_type_id', $request->get('type'));
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location_id', $request->get('location'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $items = $query->latest()->paginate(10)->withQueryString();
        $itemTypes = ItemType::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        return Inertia::render('inventory/index', [
            'items' => $items,
            'itemTypes' => $itemTypes,
            'locations' => $locations,
            'filters' => $request->only(['search', 'type', 'location', 'status']),
            'canAdd' => auth()->user()->canAddItems(),
            'canUpdate' => auth()->user()->canUpdateItems(),
            'canDelete' => auth()->user()->canDeleteItems(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->canAddItems()) {
            abort(403, 'You do not have permission to add inventory items.');
        }

        $itemTypes = ItemType::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        return Inertia::render('inventory/create', [
            'itemTypes' => $itemTypes,
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryItemRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        $item = InventoryItem::create($data);

        return redirect()->route('inventory.show', $item)
            ->with('success', 'Inventory item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItem $inventory_item)
    {
        $inventory_item->load(['itemType', 'location', 'creator', 'updater']);

        return Inertia::render('inventory/show', [
            'item' => $inventory_item,
            'canUpdate' => auth()->user()->canUpdateItems(),
            'canDelete' => auth()->user()->canDeleteItems(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InventoryItem $inventory_item)
    {
        if (!auth()->user()->canUpdateItems()) {
            abort(403, 'You do not have permission to update inventory items.');
        }

        $inventory_item->load(['itemType', 'location']);
        $itemTypes = ItemType::active()->orderBy('name')->get();
        $locations = Location::active()->orderBy('name')->get();

        return Inertia::render('inventory/edit', [
            'item' => $inventory_item,
            'itemTypes' => $itemTypes,
            'locations' => $locations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventory_item)
    {
        $data = $request->validated();
        $data['updated_by'] = auth()->id();

        $inventory_item->update($data);

        return redirect()->route('inventory.show', $inventory_item)
            ->with('success', 'Inventory item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryItem $inventory_item)
    {
        if (!auth()->user()->canDeleteItems()) {
            abort(403, 'You do not have permission to delete inventory items.');
        }

        $inventory_item->delete();

        return redirect()->route('inventory.index')
            ->with('success', 'Inventory item deleted successfully.');
    }


}