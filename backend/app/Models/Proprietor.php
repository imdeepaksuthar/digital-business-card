<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proprietor extends Model
{
    protected $fillable = [
        'business_card_id',
        'name',
        'photo',
        'designation',
        'phone',
        'email',
        'bio',
        'linkedin_url',
    ];

    public function businessCard(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessCard::class);
    }
}
