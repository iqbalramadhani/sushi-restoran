<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_unit_can_be_stored(): void
    {
        $response = $this->actingAs($this->user)->post('/units', [
            'name' => 'Sudu',
        ]);

        $response->assertRedirect('/units');
        $this->assertDatabaseHas('units', ['name' => 'Sudu', 'slug' => 'sudu']);
    }

    public function test_unit_store_requires_name(): void
    {
        $response = $this->actingAs($this->user)->post('/units', []);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('name');
    }

    public function test_unit_store_rejects_duplicate_name(): void
    {
        \App\Models\Unit::factory()->create(['name' => 'Gram']);

        $response = $this->actingAs($this->user)->post('/units', [
            'name' => 'Gram',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors('name');
    }

    public function test_unit_name_slug_is_generated(): void
    {
        $this->actingAs($this->user)->post('/units', [
            'name' => 'Sendok makan',
        ]);

        $this->assertDatabaseHas('units', ['name' => 'Sendok makan', 'slug' => 'sendok-makan']);
    }

    public function test_unauthenticated_user_cannot_store_unit(): void
    {
        $response = $this->post('/units', ['name' => 'Sudu']);

        $response->assertRedirect('/login');
    }
}
