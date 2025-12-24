<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SocialPlatformController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\SocialPlatform::all());
    }
}
