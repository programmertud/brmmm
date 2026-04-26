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
    Schema::table('applications', function (Blueprint $table) {
        $table->string('reference_id')->unique();
        $table->string('full_name');
        $table->string('address');
        $table->string('contact');
        $table->string('certificate_type');
        $table->text('purpose');
        $table->string('status')->default('Pending');
    });
}

public function down(): void
{
    Schema::table('applications', function (Blueprint $table) {
        $table->dropColumn([
            'reference_id',
            'full_name',
            'address',
            'contact',
            'certificate_type',
            'purpose',
            'status',
        ]);
    });
}
};
