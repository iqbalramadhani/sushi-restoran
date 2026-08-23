<?php

namespace Tests\Feature;

use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_index_page_returns_success(): void
    {
        $response = $this->actingAs($this->user)->get('/tables');

        $response->assertOk();
    }

    public function test_index_page_contains_tables(): void
    {
        Table::factory()->count(3)->create();

        $response = $this->actingAs($this->user)->get('/tables');

        $response->assertOk();
        $props = $response->inertiaProps();
        $this->assertCount(3, $props['tables']);
    }

    public function test_create_page_returns_success(): void
    {
        $response = $this->actingAs($this->user)->get('/tables/create');

        $response->assertOk();
    }

    public function test_table_can_be_created(): void
    {
        $response = $this->actingAs($this->user)->post('/tables', [
            'name' => 'Meja A1',
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertRedirect('/tables');
        $this->assertDatabaseHas('tables', ['name' => 'Meja A1', 'capacity' => 4]);
    }

    public function test_table_store_requires_name(): void
    {
        $response = $this->actingAs($this->user)->post('/tables', [
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_table_store_requires_capacity(): void
    {
        $response = $this->actingAs($this->user)->post('/tables', [
            'name' => 'Meja A1',
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('capacity');
    }

    public function test_table_store_requires_seat_count(): void
    {
        $response = $this->actingAs($this->user)->post('/tables', [
            'name' => 'Meja A1',
            'capacity' => 4,
        ]);

        $response->assertSessionHasErrors('seat_count');
    }

    public function test_table_store_rejects_duplicate_name(): void
    {
        Table::factory()->create(['name' => 'Meja A1']);

        $response = $this->actingAs($this->user)->post('/tables', [
            'name' => 'Meja A1',
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_table_store_rejects_invalid_capacity(): void
    {
        $response = $this->actingAs($this->user)->post('/tables', [
            'name' => 'Meja A1',
            'capacity' => 0,
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('capacity');
    }

    public function test_edit_page_returns_success(): void
    {
        $table = Table::factory()->create();

        $response = $this->actingAs($this->user)->get("/tables/{$table->id}/edit");

        $response->assertOk();
        $props = $response->inertiaProps();
        $this->assertArrayHasKey('table', $props);
        $this->assertSame($table->id, $props['table']['id']);
        $this->assertSame($table->name, $props['table']['name']);
    }

    public function test_table_can_be_updated(): void
    {
        $table = Table::factory()->create(['name' => 'Meja A1', 'capacity' => 4]);

        $response = $this->actingAs($this->user)->put("/tables/{$table->id}", [
            'name' => 'Meja B2',
            'capacity' => 6,
            'seat_count' => 6,
        ]);

        $response->assertRedirect('/tables');
        $table->refresh();
        $this->assertSame('Meja B2', $table->name);
        $this->assertSame(6, $table->capacity);
        $this->assertSame(6, $table->seat_count);
    }

    public function test_table_update_requires_name(): void
    {
        $table = Table::factory()->create();

        $response = $this->actingAs($this->user)->put("/tables/{$table->id}", [
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_table_update_rejects_duplicate_name(): void
    {
        Table::factory()->create(['name' => 'Meja B2']);
        $table = Table::factory()->create(['name' => 'Meja A1']);

        $response = $this->actingAs($this->user)->put("/tables/{$table->id}", [
            'name' => 'Meja B2',
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_table_can_be_deleted(): void
    {
        $table = Table::factory()->create();

        $response = $this->actingAs($this->user)->delete("/tables/{$table->id}");

        $response->assertRedirect('/tables');
        $this->assertDatabaseMissing('tables', ['id' => $table->id]);
    }

    public function test_table_delete_cascades_to_orders(): void
    {
        $table = Table::factory()->create();
        $order = \App\Models\Order::factory()->create(['table_id' => $table->id]);

        $response = $this->actingAs($this->user)->delete("/tables/{$table->id}");

        $response->assertRedirect('/tables');
        $this->assertDatabaseMissing('tables', ['id' => $table->id]);
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    public function test_occupy_table_changes_status(): void
    {
        $table = Table::factory()->create(['status' => 'available']);

        $response = $this->actingAs($this->user)->post("/tables/{$table->id}/occupy");

        $response->assertRedirect('/tables');
        $table->refresh();
        $this->assertSame('occupied', $table->status);
    }

    public function test_free_table_changes_status(): void
    {
        $table = Table::factory()->create(['status' => 'occupied']);

        $response = $this->actingAs($this->user)->post("/tables/{$table->id}/free");

        $response->assertRedirect('/tables');
        $table->refresh();
        $this->assertSame('available', $table->status);
    }

    public function test_unauthenticated_user_cannot_access_tables(): void
    {
        $response = $this->get('/tables');

        $response->assertRedirect('/login');
    }

    public function test_unauthenticated_user_cannot_create_table(): void
    {
        $response = $this->post('/tables', [
            'name' => 'Meja A1',
            'capacity' => 4,
            'seat_count' => 4,
        ]);

        $response->assertRedirect('/login');
    }

    public function test_unauthenticated_user_cannot_update_table(): void
    {
        $table = Table::factory()->create();

        $response = $this->put("/tables/{$table->id}", [
            'name' => 'Meja B2',
            'capacity' => 6,
            'seat_count' => 6,
        ]);

        $response->assertRedirect('/login');
    }

    public function test_unauthenticated_user_cannot_delete_table(): void
    {
        $table = Table::factory()->create();

        $response = $this->delete("/tables/{$table->id}");

        $response->assertRedirect('/login');
    }
}
