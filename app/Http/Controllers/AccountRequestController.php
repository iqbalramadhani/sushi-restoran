<?php

namespace App\Http\Controllers;

use App\Models\AccountRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AccountRequestController extends Controller
{
    public function index(): Response
    {
        $requests = AccountRequest::with('approver')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('AccountRequests/Index', [
            'requests' => $requests,
        ]);
    }

    public function show(AccountRequest $accountRequest): Response
    {
        return Inertia::render('AccountRequests/Show', [
            'request' => $accountRequest->load('approver'),
        ]);
    }

    public function approve(Request $request, AccountRequest $accountRequest): RedirectResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:500',
            'role' => 'nullable|in:admin,staff',
        ]);

        $user = User::create([
            'name' => $accountRequest->name,
            'username' => $accountRequest->username,
            'email' => $accountRequest->email,
            'password' => $accountRequest->password,
            'role' => $request->input('role', 'staff'),
            'email_verified_at' => now(),
        ]);

        event(new Registered($user));

        $accountRequest->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'notes' => $request->input('notes'),
        ]);

        Auth::login($user);

        return redirect()->route('dashboard');
    }

    public function reject(AccountRequest $accountRequest, Request $request): RedirectResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $accountRequest->update([
            'status' => 'rejected',
            'approved_by' => $request->user()->id,
            'notes' => $request->input('notes'),
        ]);

        return redirect()->route('account-requests.index');
    }
}
