<?php

namespace App\Http\Controllers;

use App\Models\BusinessCard;
use App\Models\Proprietor;
use Illuminate\Http\Request;

class ProprietorController extends Controller
{
    public function index(BusinessCard $card)
    {
        return $card->proprietors;
    }

    public function store(Request $request, BusinessCard $card)
    {
        if ($request->user()->id !== $card->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|string',
            'designation' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $proprietor = $card->proprietors()->create($validated);

        return response()->json($proprietor, 201);
    }

    public function update(Request $request, Proprietor $proprietor)
    {
        if ($request->user()->id !== $proprietor->businessCard->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'photo' => 'nullable|string',
            'designation' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        $proprietor->update($validated);

        return response()->json($proprietor);
    }

    public function destroy(Request $request, Proprietor $proprietor)
    {
        if ($request->user()->id !== $proprietor->businessCard->user_id) {
            abort(403);
        }

        $proprietor->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
