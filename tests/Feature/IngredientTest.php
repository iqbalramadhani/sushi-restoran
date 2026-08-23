<?php

namespace Tests\Feature;

use App\Models\Ingredient;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IngredientTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_index_page_returns_success(): void
    {
        $response = $this->actingAs($this->user)->get('/ingredients');

        $response->assertOk();
    }

    public function test_create_page_returns_success(): void
    {
        $response = $this->actingAs($this->user)->get('/ingredients/create');

        $response->assertOk();
    }

    public function test_create_page_includes_units(): void
    {
        \App\Models\Unit::factory()->create(['name' => 'Gram']);
        \App\Models\Unit::factory()->create(['name' => 'Mililiter']);

        $response = $this->actingAs($this->user)->get('/ingredients/create');

        $response->assertOk();
        $props = $response->inertiaProps();
        $this->assertArrayHasKey('units', $props);
        $this->assertCount(2, $props['units']);
    }

    public function test_ingredient_can_be_created(): void
    {
        Unit::factory()->create(['name' => 'Gram']);

        $response = $this->actingAs($this->user)->post('/ingredients', [
            'name' => 'Gula',
            'unit' => 'Gram',
        ]);

        $response->assertRedirect('/ingredients');
        $this->assertDatabaseHas('ingredients', ['name' => 'Gula', 'unit' => 'Gram']);
    }

    public function test_ingredient_store_requires_name(): void
    {
        $response = $this->actingAs($this->user)->post('/ingredients', [
            'unit' => 'Gram',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_ingredient_store_requires_unit(): void
    {
        $response = $this->actingAs($this->user)->post('/ingredients', [
            'name' => 'Gula',
        ]);

        $response->assertSessionHasErrors('unit');
    }

    public function test_ingredient_store_rejects_unit_over_max_length(): void
    {
        $response = $this->actingAs($this->user)->post('/ingredients', [
            'name' => 'Gula',
            'unit' => 'sangat_panang_kali_ini',
        ]);

        $response->assertSessionHasErrors('unit');
    }

    public function test_edit_page_returns_success(): void
    {
        $ingredient = Ingredient::factory()->create();

        $response = $this->actingAs($this->user)->get("/ingredients/{$ingredient->id}/edit");

        $response->assertOk();
        $props = $response->inertiaProps();
        $this->assertArrayHasKey('ingredient', $props);
        $this->assertSame($ingredient->id, $props['ingredient']['id']);
    }

    public function test_ingredient_can_be_updated(): void
    {
        $ingredient = Ingredient::factory()->create(['name' => 'Gula', 'unit' => 'Gram']);
        Unit::factory()->create(['name' => 'Sendok']);

        $response = $this->actingAs($this->user)->put("/ingredients/{$ingredient->id}", [
            'name' => 'Gula Merah',
            'unit' => 'Sendok',
        ]);

        $response->assertRedirect('/ingredients');
        $ingredient->refresh();
        $this->assertSame('Gula Merah', $ingredient->name);
        $this->assertSame('Sendok', $ingredient->unit);
        $this->assertSame('gula-merah', $ingredient->slug);
    }

    public function test_ingredient_can_be_deleted(): void
    {
        $ingredient = Ingredient::factory()->create();

        $response = $this->actingAs($this->user)->delete("/ingredients/{$ingredient->id}");

        $response->assertRedirect('/ingredients');
        $this->assertDatabaseMissing('ingredients', ['id' => $ingredient->id]);
    }

    public function test_unauthenticated_user_cannot_access_ingredients(): void
    {
        $response = $this->get('/ingredients');

        $response->assertRedirect('/login');
    }
}
