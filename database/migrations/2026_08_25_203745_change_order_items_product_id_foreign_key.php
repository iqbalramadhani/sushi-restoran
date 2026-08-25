<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the old cascade constraint
        DB::statement('ALTER TABLE order_items DROP FOREIGN KEY order_items_product_id_foreign');

        // Re-add with RESTRICT so deleting a product does NOT delete order items
        DB::statement("
            ALTER TABLE order_items
            ADD CONSTRAINT order_items_product_id_foreign
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the restrict constraint
        DB::statement('ALTER TABLE order_items DROP FOREIGN KEY order_items_product_id_foreign');

        // Restore cascade behavior
        DB::statement("
            ALTER TABLE order_items
            ADD CONSTRAINT order_items_product_id_foreign
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ");
    }
};
