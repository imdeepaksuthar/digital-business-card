<?php

namespace App\Http\Controllers;

use App\Models\BusinessCard;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(BusinessCard $card)
    {
        return $card->products;
    }

    public function store(Request $request, BusinessCard $card)
    {
        if ($request->user()->id !== $card->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        $product = $card->products()->create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->businessCard->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'image' => 'nullable|string',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->businessCard->user_id) {
            abort(403);
        }

        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
