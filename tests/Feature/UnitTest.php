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

        $response->assertJsonStructure(['id', 'name', 'slug']);
        $this->assertSame('Sudu', $response->json('name'));
        $this->assertSame('sudu', $response->json('slug'));
        $this->assertDatabaseHas('units', ['name' => 'Sudu', 'slug' => 'sudu']);
    }

    public function test_unit_store_requires_name(): void
    {
        $response = $this->actingAs($this->user)->postJson('/units', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }

    public function test_unit_store_rejects_duplicate_name(): void
    {
        \App\Models\Unit::factory()->create(['name' => 'Gram']);

        $response = $this->actingAs($this->user)->postJson('/units', [
            'name' => 'Gram',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }

    public function test_unit_name_slug_is_generated(): void
    {
        $response = $this->actingAs($this->user)->postJson('/units', [
            'name' => 'Sendok makan',
        ]);

        $this->assertSame('sendok-makan', $response->json('slug'));
    }

    public function test_unauthenticated_user_cannot_store_unit(): void
    {
        $response = $this->postJson('/units', ['name' => 'Sudu']);

        $response->assertUnauthorized();
    }
}
