<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'business_card_id',
        'name',
        'image',
        'price',
        'description',
        'link',
        'category',
    ];

    public function businessCard(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessCard::class);
    }
}
