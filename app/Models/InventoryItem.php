<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\InventoryItem
 *
 * @property int $id
 * @property string $barcode
 * @property string $serial_number
 * @property int $item_type_id
 * @property int $location_id
 * @property string $name
 * @property string|null $description
 * @property array|null $custom_fields
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $purchase_date
 * @property float|null $purchase_price
 * @property int $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $creator
 * @property-read \App\Models\ItemType $itemType
 * @property-read \App\Models\Location $location
 * @property-read \App\Models\User|null $updater
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereBarcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereCustomFields($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereItemTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereLocationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem wherePurchaseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem wherePurchasePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereSerialNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryItem active()
 * @method static \Database\Factories\InventoryItemFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class InventoryItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'barcode',
        'serial_number',
        'item_type_id',
        'location_id',
        'name',
        'description',
        'custom_fields',
        'status',
        'purchase_date',
        'purchase_price',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'custom_fields' => 'array',
        'purchase_date' => 'date',
        'purchase_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the item type that owns this inventory item.
     */
    public function itemType(): BelongsTo
    {
        return $this->belongsTo(ItemType::class);
    }

    /**
     * Get the location that owns this inventory item.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the user who created this inventory item.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this inventory item.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to only include active items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}