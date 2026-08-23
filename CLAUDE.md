# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Restaurant management system built with Laravel 13 (PHP 8.3) backend and React frontend via Inertia.js. Uses TypeScript for frontend, Tailwind CSS for styling, and Vite for asset bundling.

## Development Commands

```bash
# Install dependencies
composer install && npm install

# Start development server (Laravel + Vite)
npm run dev
# or
php artisan dev

# Build for production
npm run build

# Run PHP tests
composer test

# Run single test
php artisan test --filter=TestName

# Clear config/cache
php artisan config:clear
php artisan cache:clear

# Run migrations only (NEVER use migrate:fresh — it deletes all data!)
php artisan migrate --force
```

## Architecture

### Backend Structure
- **Controllers**: `app/Http/Controllers/` - RESTful controllers for Products, Tables, Orders, Dashboard, Profile, Auth, and AccountRequest
- **Models**: `app/Models/` - Eloquent models (User, AccountRequest, Category, Table, Product, Order, OrderItem)
- **Repositories**: `app/Repositories/` - Custom repository pattern with `RepositoryInterface` for data access layer
- **Services**: `app/Services/` - Business logic services (OrderService, DashboardService, ProductService, TableService)
- **Requests**: `app/Http/Requests/` - Form request validation including LoginRequest (uses username)
- **Middleware**: `app/Http/Middleware/` - Inertia request handler with auth sharing

### Frontend Structure
- **Entry Point**: `resources/js/app.tsx` - Inertia app initialization with React 19
- **Pages**: `resources/js/Pages/` - React components organized by feature (Auth, Products, Tables, Orders, Profile, Dashboard, AccountRequests)
- **Layouts**: `resources/js/Layouts/` - AuthenticatedLayout and GuestLayout
- **Types**: `resources/js/types/` - TypeScript type definitions
- **Styling**: Tailwind CSS v3 with forms plugin

### Key Patterns
- Inertia.js handles server-rendered page transitions with React
- Ziggy provides TypeScript-safe route helpers (`window.route()`)
- Repository pattern abstracts Eloquent queries
- Services contain business logic, controllers stay thin
- Auth via Laravel Breeze with Inertia/React stack

### Database Schema
Core entities: Users (with roles), AccountRequests (pending approval), Categories, Tables (with occupancy status), Products, Orders, OrderItems

### Routing
- Web routes: `routes/web.php` - Resource routes for products/tables, custom order routes, account-requests admin routes
- Auth routes: `routes/auth.php` - Breeze authentication flows (login, register, password reset)
- Authenticated routes protected by `auth` middleware (verified middleware removed)
- Account request routes: `/account-requests` (index, show, approve, reject)

## Authentication System

### Login
- Users log in with `username` (not email)
- `LoginRequest` validates username + password
- Login blocked if `email_verified_at` is null (account not approved yet)

### Registration (Account Request System)
- Registration creates an `AccountRequest` record with `status = pending`
- No user is created at registration time
- User is redirected to `/register/success` page
- Admin reviews requests at `/account-requests`
- On approve: new User is created, assigned `staff` role by default, and admin is logged in as the new user
- On reject: request status set to `rejected`, admin can add optional notes

### Default Users (from seeder)
| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@restoran.com | SeCur3P@sswrD! | admin |
| staff | staff@restoran.com | St@ffP@ss99! | staff |

## Testing

Tests are in `tests/` directory. Uses PHPUnit. Follow Laravel testing conventions with Feature and Unit test classes.

```bash
# Run all tests
php artisan test

# Run auth tests only
php artisan test --filter=Auth

# Run single test class
php artisan test --filter=RegistrationTest
```

## Important Notes

### ⚠️ NEVER run `php artisan migrate:fresh`
This command deletes ALL database tables. Use `php artisan migrate` instead.

### Password Security
Default seeder passwords are strong. Do not use weak passwords like "password" in production.

### Account Request Flow
When approving a request, the admin's session is replaced with the new user's session (via `Auth::login()`).
