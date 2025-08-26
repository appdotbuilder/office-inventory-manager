<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLocationRequest;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::withCount('inventoryItems')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('locations/index', [
            'locations' => $locations,
            'canManage' => auth()->user()->isAdmin(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage locations.');
        }

        return Inertia::render('locations/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLocationRequest $request)
    {
        Location::create($request->validated());

        return redirect()->route('locations.index')
            ->with('success', 'Location created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        $location->load(['inventoryItems.itemType']);

        return Inertia::render('locations/show', [
            'location' => $location,
            'canManage' => auth()->user()->isAdmin(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage locations.');
        }

        return Inertia::render('locations/edit', [
            'location' => $location,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreLocationRequest $request, Location $location)
    {
        $location->update($request->validated());

        return redirect()->route('locations.show', $location)
            ->with('success', 'Location updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'You do not have permission to manage locations.');
        }

        if ($location->inventoryItems()->count() > 0) {
            return redirect()->back()
                ->withErrors(['error' => 'Cannot delete location that has inventory items.']);
        }

        $location->delete();

        return redirect()->route('locations.index')
            ->with('success', 'Location deleted successfully.');
    }
}