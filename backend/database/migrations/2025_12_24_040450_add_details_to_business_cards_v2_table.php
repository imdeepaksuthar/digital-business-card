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
            $table->string('primary_contact_designation')->nullable();
            $table->json('business_hours')->nullable();
            $table->text('google_map_embed_url')->nullable();
            $table->integer('years_of_experience')->nullable();
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
