<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            $table->string('cover_photo')->nullable()->after('profile_photo');
            $table->string('sub_header')->nullable()->after('tagline');
            $table->date('founded_at')->nullable()->after('description');
            $table->string('category')->nullable()->after('founded_at');
            $table->string('sub_category')->nullable()->after('category');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('pincode')->nullable()->after('country');
            $table->text('map_url')->nullable()->after('pincode');
            $table->json('bank_details')->nullable()->after('map_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            //
        });
    }
};
