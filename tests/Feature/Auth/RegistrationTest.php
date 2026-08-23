<?php

namespace Tests\Feature\Auth;

use App\Models\AccountRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_submit_account_request(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertGuest();
        $response->assertRedirect(route('register.success'));

        $this->assertDatabaseHas('account_requests', [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'status' => 'pending',
        ]);
    }

    public function test_cannot_register_with_duplicate_username(): void
    {
        AccountRequest::create([
            'name' => 'Existing User',
            'username' => 'existinguser',
            'email' => 'existing@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'existinguser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('username');
    }

    public function test_cannot_register_with_duplicate_email(): void
    {
        AccountRequest::create([
            'name' => 'Existing User',
            'username' => 'existinguser',
            'email' => 'existing@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'existing@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
    }
}
