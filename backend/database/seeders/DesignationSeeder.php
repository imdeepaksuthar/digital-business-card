<?php

namespace Database\Seeders;

use App\Models\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designations = [
            'Proprietor',
            'Owner',
            'Founder',
            'Co-Founder',
            'CEO',
            'Director',
            'Manager',
            'Partner',
            'Sales Manager',
            'Marketing Head',
        ];

        foreach ($designations as $name) {
            Designation::firstOrCreate(['name' => $name]);
        }
    }
}
