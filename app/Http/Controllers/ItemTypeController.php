<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemTypeRequest;
use App\Models\ItemType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $itemTypes = ItemType::withCount('inventoryItems')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('item-types/index', [
            'itemTypes' => $itemTypes,
            'canManage' => auth()->user()->isAdmin(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage item types.');
        }

        return Inertia::render('item-types/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemTypeRequest $request)
    {
        ItemType::create($request->validated());

        return redirect()->route('item-types.index')
            ->with('success', 'Item type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemType $item_type)
    {
        $item_type->load(['inventoryItems.location']);

        return Inertia::render('item-types/show', [
            'itemType' => $item_type,
            'canManage' => auth()->user()->isAdmin(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemType $item_type)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage item types.');
        }

        return Inertia::render('item-types/edit', [
            'itemType' => $item_type,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreItemTypeRequest $request, ItemType $item_type)
    {
        $item_type->update($request->validated());

        return redirect()->route('item-types.show', $item_type)
            ->with('success', 'Item type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemType $item_type)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage item types.');
        }

        if ($item_type->inventoryItems()->count() > 0) {
            return redirect()->back()
                ->withErrors(['error' => 'Cannot delete item type that has inventory items.']);
        }

        $item_type->delete();

        return redirect()->route('item-types.index')
            ->with('success', 'Item type deleted successfully.');
    }
}