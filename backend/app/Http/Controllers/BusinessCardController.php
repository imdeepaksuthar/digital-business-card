<?php

namespace App\Http\Controllers;

use App\Models\BusinessCard;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BusinessCardController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->businessCards()->with('socialLinks')->get();
    }

    public function show(Request $request, $slug)
    {
        $card = BusinessCard::where('slug', $slug)
            ->with(['socialLinks', 'products', 'proprietors', 'paymentMethods'])
            ->firstOrFail();

        // Track Visit
        $card->cardVisits()->create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'visit_date' => now(),
            'type' => 'view',
        ]);

        return response()->json($card);
    }

    public function store(Request $request)
    {
        // Enforce single card limit
        if ($request->user()->businessCards()->exists()) {
            return response()->json(['message' => 'You can only create one digital business card.'], 403);
        }

        $validated = $this->validateCard($request);
        $slug = $this->generateSlug($validated['business_name']);

        $card = new BusinessCard($validated);
        $card->user_id = $request->user()->id;
        $card->slug = $slug;
        $card->save();

        $this->handleFileUploads($request, $card);
        $this->syncRelations($request, $card);
        
        $card->refresh()->load(['socialLinks', 'products', 'proprietors']);

        return response()->json($card, 201);
    }

    public function update(Request $request, BusinessCard $businessCard)
    {
        if ($request->user()->id !== $businessCard->user_id) {
            abort(403);
        }

        $validated = $this->validateCard($request);
        $businessCard->fill($validated);
        $businessCard->save();

        $this->handleFileUploads($request, $businessCard);
        $this->syncRelations($request, $businessCard);

        return response()->json($businessCard->load(['socialLinks', 'products', 'proprietors']));
    }

    private function validateCard(Request $request)
    {
        return $request->validate([
            'business_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'sub_header' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'founded_at' => 'nullable|date',
            'category' => 'nullable|string',
            'sub_category' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'pincode' => 'nullable|string',
            'map_url' => 'nullable|url',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'theme_color' => 'nullable|string|max:7',
            'payment_qr_code' => 'nullable|image', 
            'primary_contact_designation' => 'nullable|string',
            'business_hours' => 'nullable|array',
            'google_map_embed_url' => 'nullable|string',
            'years_of_experience' => 'nullable|integer',
            'bank_details' => 'nullable|array', // JSON cast
        ]);
    }

    private function generateSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;
        while (BusinessCard::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }
        return $slug;
    }

    private function handleFileUploads(Request $request, BusinessCard $card)
    {
        if ($request->hasFile('profile_photo')) {
            $card->profile_photo = $this->uploadFile($request->file('profile_photo'), 'cards/' . $card->id);
        }
        if ($request->hasFile('cover_photo')) {
            $card->cover_photo = $this->uploadFile($request->file('cover_photo'), 'cards/' . $card->id);
        }
        if ($request->hasFile('payment_qr_code')) {
            $card->payment_qr_code = $this->uploadFile($request->file('payment_qr_code'), 'cards/' . $card->id);
        }
        $card->save();
    }

    private function uploadFile($file, $path)
    {
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('storage/' . $path), $filename);
        return asset('storage/' . $path . '/' . $filename);
    }

    private function syncRelations(Request $request, BusinessCard $card)
    {
        // Sync Social Links
        $currentLinkIds = [];
        if ($request->has('social_links')) {
            foreach ($request->social_links as $linkData) {
                // If pure JSON string, decode it? No, formData arrays come as array in Laravel
                if (is_string($linkData)) $linkData = json_decode($linkData, true);
                
                $link = $card->socialLinks()->updateOrCreate(
                    ['platform' => $linkData['platform']],
                    ['url' => $linkData['url']]
                );
                $currentLinkIds[] = $link->id;
            }
        }
        $card->socialLinks()->whereNotIn('id', $currentLinkIds)->delete();

        // Sync Products
        $currentProductIds = [];
        if ($request->products) {
            foreach ($request->products as $index => $prodData) {
                 if (is_string($prodData)) $prodData = json_decode($prodData, true); // Fallback

                 $product = $card->products()->updateOrCreate(
                     ['id' => $prodData['id'] ?? null],
                     [
                         'name' => $prodData['name'],
                         'price' => $prodData['price'] ?? null,
                         'description' => $prodData['description'] ?? null,
                         'link' => $prodData['link'] ?? null,
                         'category' => $prodData['category'] ?? null,
                     ]
                 );
                 
                 // Handle Product Image
                 if ($request->hasFile("products.{$index}.imageFile")) {
                     $product->image = $this->uploadFile($request->file("products.{$index}.imageFile"), 'products');
                     $product->save();
                 }
                 
                 $currentProductIds[] = $product->id;
            }
        }
        $card->products()->whereNotIn('id', $currentProductIds)->delete();

        // Sync Proprietors
        $currentOwnerIds = [];
        if ($request->proprietors) {
            foreach ($request->proprietors as $index => $ownerData) {
                 if (is_string($ownerData)) $ownerData = json_decode($ownerData, true);

                 $owner = $card->proprietors()->updateOrCreate(
                     ['id' => $ownerData['id'] ?? null],
                     [
                         'name' => $ownerData['name'],
                         'designation' => $ownerData['designation'] ?? null,
                         'phone' => $ownerData['phone'] ?? null,
                         'email' => $ownerData['email'] ?? null,
                         'bio' => $ownerData['bio'] ?? null,
                         'linkedin_url' => $ownerData['linkedin_url'] ?? null,
                     ]
                 );

                 // Handle Proprietor Photo
                 if ($request->hasFile("proprietors.{$index}.photoFile")) {
                     $owner->photo = $this->uploadFile($request->file("proprietors.{$index}.photoFile"), 'proprietors');
                     $owner->save();
                 }

                 $currentOwnerIds[] = $owner->id;
            }
        }
        $card->proprietors()->whereNotIn('id', $currentOwnerIds)->delete();

        // Sync Payment Methods
        $currentPaymentIds = [];
        if ($request->payment_methods) {
            foreach ($request->payment_methods as $paymentData) {
                 if (is_string($paymentData)) $paymentData = json_decode($paymentData, true);

                 $payment = $card->paymentMethods()->updateOrCreate(
                     ['id' => $paymentData['id'] ?? null],
                     [
                         'type' => $paymentData['type'],
                         'details' => $paymentData['details'] ?? [], 
                         'is_active' => $paymentData['is_active'] ?? true,
                     ]
                 );
                 $currentPaymentIds[] = $payment->id;
            }
        }
        $card->paymentMethods()->whereNotIn('id', $currentPaymentIds)->delete();
    }

    public function destroy(Request $request, BusinessCard $businessCard)
    {
        if ($request->user()->id !== $businessCard->user_id) {
            abort(403);
        }

        $businessCard->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function storeLead(Request $request)
    {
        $validated = $request->validate([
            'business_card_id' => 'required|exists:business_cards,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string',
        ]);
        
        $lead = \App\Models\Lead::create($validated); // Using FQCN to avoid import issues if not added
        
        return response()->json($lead, 201);
    }

    public function trackAnalytics(Request $request)
    {
        $validated = $request->validate([
            'business_card_id' => 'required|exists:business_cards,id',
            'type' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $visit = \App\Models\CardVisit::create([
            'business_card_id' => $validated['business_card_id'],
            'type' => $validated['type'],
            'metadata' => $validated['metadata'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'visit_date' => now(),
        ]);

        return response()->json($visit, 201);
    }
}
