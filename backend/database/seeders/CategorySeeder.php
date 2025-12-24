<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Technology' => ['Web Development', 'App Development', 'Software Engineering', 'Data Science', 'IT Support'],
            'Healthcare' => ['Doctor', 'Nurse', 'Pharmacy', 'Dentist', 'Physiotherapy'],
            'Education' => ['School', 'College', 'Coaching', 'Online Tutor', 'Library'],
            'Business' => ['Consultancy', 'Marketing', 'Sales', 'Real Estate', 'Logistics'],
            'Creative' => ['Graphic Design', 'Photography', 'Videography', 'Writing', 'Art'],
            'Retail' => ['Clothing', 'Electronics', 'Grocery', 'Furniture', 'Jewelry'],
            'Food & Beverage' => ['Restaurant', 'Cafe', 'Bakery', 'Catering', 'Bar'],
        ];

        foreach ($categories as $cat => $subs) {
            $category = Category::firstOrCreate(['name' => $cat]);
            foreach ($subs as $sub) {
                SubCategory::firstOrCreate(['category_id' => $category->id, 'name' => $sub]);
            }
        }
    }
}
