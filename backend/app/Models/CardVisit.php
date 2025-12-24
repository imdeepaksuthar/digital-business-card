<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CardVisit extends Model
{
    protected $fillable = [
        'business_card_id',
        'ip_address',
        'user_agent',
        'visit_date',
        'type',
        'metadata',
    ];

    protected $casts = [
        'visit_date' => 'datetime',
        'metadata' => 'array',
    ];

    public function businessCard(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessCard::class);
    }
}
