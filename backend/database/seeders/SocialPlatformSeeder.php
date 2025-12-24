<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialPlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = [
            [
                'name' => 'Instagram',
                'base_url' => 'https://instagram.com/',
                'icon' => 'instagram',
            ],
            [
                'name' => 'Facebook',
                'base_url' => 'https://facebook.com/',
                'icon' => 'facebook',
            ],
            [
                'name' => 'Twitter (X)',
                'base_url' => 'https://x.com/',
                'icon' => 'twitter',
            ],
            [
                'name' => 'LinkedIn',
                'base_url' => 'https://linkedin.com/in/',
                'icon' => 'linkedin',
            ],
            [
                'name' => 'YouTube',
                'base_url' => 'https://youtube.com/@',
                'icon' => 'youtube',
            ],
             [
                'name' => 'WhatsApp',
                'base_url' => 'https://wa.me/',
                'icon' => 'message-circle',
            ],
        ];

        foreach ($platforms as $platform) {
            \App\Models\SocialPlatform::create($platform);
        }
    }
}
