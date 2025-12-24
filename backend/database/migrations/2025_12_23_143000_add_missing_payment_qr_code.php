<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            if (!Schema::hasColumn('business_cards', 'payment_qr_code')) {
                $table->string('payment_qr_code')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('business_cards', function (Blueprint $table) {
            $table->dropColumn('payment_qr_code');
        });
    }
};
