<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('table_id')
                ->nullable()
                ->change();
            $table->dropForeign(['table_id']);
            $table->foreign('table_id')->references('id')->on('tables')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
            $table->foreignId('table_id')->constrained()->cascadeOnDelete()->change();
        });
    }
};
