<?php

namespace App\Http\Controllers;

use App\Models\BusinessCard;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class SocialLinkController extends Controller
{
    public function store(Request $request, BusinessCard $card)
    {
        if ($request->user()->id !== $card->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'platform' => 'required|string|max:50',
            'url' => 'required|url|max:255',
        ]);

        $link = $card->socialLinks()->create($validated);

        return response()->json($link, 201);
    }

    public function update(Request $request, SocialLink $socialLink)
    {
        if ($request->user()->id !== $socialLink->businessCard->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'platform' => 'string|max:50',
            'url' => 'url|max:255',
        ]);

        $socialLink->update($validated);

        return response()->json($socialLink);
    }

    public function destroy(Request $request, SocialLink $socialLink)
    {
        if ($request->user()->id !== $socialLink->businessCard->user_id) {
            abort(403);
        }

        $socialLink->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
