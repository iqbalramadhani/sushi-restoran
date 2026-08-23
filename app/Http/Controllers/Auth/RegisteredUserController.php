<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AccountRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'lowercase', 'max:255', Rule::unique(AccountRequest::class)],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', function ($attribute, $value, $fail) {
                if (User::where('email', $value)->exists()) {
                    $fail('The '.$attribute.' has already been taken.');
                }
                if (AccountRequest::where('email', $value)->exists()) {
                    $fail('The '.$attribute.' has already been taken.');
                }
            }],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        AccountRequest::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->wantsJson()) {
            return inertia()->location(route('register.success'));
        }
        return redirect()->route('register.success');
    }
}
