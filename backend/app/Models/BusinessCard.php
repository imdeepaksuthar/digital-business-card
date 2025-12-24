<?php

namespace App\Models;

use App\Models\SocialLink;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class BusinessCard extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'tagline',
        'sub_header',
        'description',
        'founded_at',
        'category',
        'sub_category',
        'phone',
        'email',
        'website',
        'city',
        'state',
        'country',
        'pincode',
        'address',
        'latitude',
        'longitude',
        'map_url',
        'profile_photo',
        'cover_photo',
        'theme_color',
        'qr_code_path',
        'bank_details',
        'payment_qr_code',
        'primary_contact_designation',
        'business_hours',
        'google_map_embed_url',
        'years_of_experience',
    ];

    protected $casts = [
        'bank_details' => 'array',
        'business_hours' => 'array',
        'founded_at' => 'date',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function socialLinks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SocialLink::class);
    }
    
    public function products(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function proprietors(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Proprietor::class);
    }

    public function leads(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function paymentMethods(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function cardVisits(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CardVisit::class);
    }
}
