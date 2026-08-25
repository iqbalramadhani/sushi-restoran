# 🍣 Restoran — Restaurant Management System

A full-stack restaurant management web application built with **Laravel 13**, **React 19**, and **Inertia.js**. Designed for internal staff use to manage tables, menus, orders, ingredients, and user accounts — with a role-based access control system and an admin approval workflow for new accounts.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Username-based login with session management via Laravel Breeze |
| 👥 **Account Request Flow** | New users submit a request; admin approves/rejects before account is created |
| 🪑 **Table Management** | Track table occupancy and availability in real time |
| 🍱 **Product & Category Management** | Full CRUD for menu items organized by category |
| 📦 **Ingredient & Unit Management** | Track raw ingredients and their units of measure |
| 🛒 **Order Management** | Create and manage orders with multiple order items per order |
| 📊 **Dashboard** | Overview of key restaurant stats via a dedicated dashboard view |
| 🛡️ **Role-Based Access** | Admin and Staff roles with differentiated access |

---

## 🛠️ Tech Stack

### Backend
- **PHP 8.3** + **Laravel 13**
- **Inertia.js** (server-side adapter) — seamless SPA-like routing without a separate API
- **Laravel Breeze** — authentication scaffolding
- **Laravel Sanctum** — API token authentication
- **Ziggy** — server-side route definitions exposed to the frontend
- **MySQL** — relational database

### Frontend
- **React 19** with **TypeScript**
- **Inertia.js** (React adapter) — replaces traditional API calls
- **Tailwind CSS v3** + `@tailwindcss/forms`
- **Vite 8** — fast asset bundling and HMR
- **Lucide React** — icon library

### Infrastructure & DevOps
- **Docker** + **Docker Compose** — containerized development and production environments
- **GitHub Actions** — CI/CD pipeline (test → build → deploy)
- **GHCR (GitHub Container Registry)** — Docker image hosting
- **VPS deployment** via SSH

---

## 🏗️ Architecture

This project follows a clean, layered architecture:

```
┌─────────────────────────────────────────────┐
│              React + Inertia.js              │  ← Frontend (TypeScript, Tailwind)
├─────────────────────────────────────────────┤
│         Controllers (thin layer)            │  ← HTTP layer
├─────────────────────────────────────────────┤
│      Services (business logic)              │  ← OrderService, DashboardService, etc.
├─────────────────────────────────────────────┤
│   Repositories (data access abstraction)    │  ← RepositoryInterface pattern
├─────────────────────────────────────────────┤
│          Eloquent Models + MySQL            │  ← Persistence
└─────────────────────────────────────────────┘
```

**Key design decisions:**
- **Repository pattern** — decouples Eloquent from business logic for testability
- **Service layer** — keeps controllers thin; all business rules live in services
- **Inertia.js** — eliminates the need for a REST API while keeping full React interactivity
- **Form Request validation** — all input validation in dedicated `Request` classes

---

## 🗂️ Project Structure

```
app/
├── Http/
│   ├── Controllers/   # ProductController, OrderController, TableController, etc.
│   └── Requests/      # LoginRequest, StoreProductRequest, etc.
├── Models/            # User, Order, OrderItem, Product, Table, Category, ...
├── Repositories/      # Repository pattern with RepositoryInterface
└── Services/          # OrderService, DashboardService, ProductService, TableService

resources/js/
├── Pages/             # React pages: Auth, Products, Tables, Orders, Dashboard, ...
├── Layouts/           # AuthenticatedLayout, GuestLayout
└── types/             # TypeScript type definitions

database/
├── migrations/        # Schema migrations
└── seeders/           # RestaurantSeeder (default admin & staff users)
```

---

## 🚀 Local Development Setup

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ & npm
- MySQL 8.0+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/iqbalramadhani/sushi-restoran.git
cd sushi-restoran

# 2. Install dependencies
composer install && npm install

# 3. Set up environment
cp .env.example .env
php artisan key:generate

# 4. Configure database in .env, then run migrations
php artisan migrate --force

# 5. Seed default users
php artisan db:seed

# 6. Start development servers
npm run dev
# In another terminal:
php artisan serve
```

The app will be available at `http://localhost:8000`.

### Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `SeCur3P@sswrD!` | Admin |
| `staff` | `St@ffP@ss99!` | Staff |

---

## 🐳 Docker Setup

```bash
# Start all services (app + MySQL)
docker compose up -d

# Run migrations inside the container
docker compose exec app php artisan migrate --force
```

For production, use the production compose file:

```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## ✅ Running Tests

```bash
# Run all tests
php artisan test

# Run auth tests only
php artisan test --filter=Auth

# Run a single test class
php artisan test --filter=RegistrationTest
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline runs on every push:

1. **Test** — Spins up MySQL, installs dependencies, runs migrations, and executes PHPUnit tests
2. **Build** — Builds a multi-stage Docker image (PHP-FPM + pre-compiled Vite assets) and pushes it to GHCR
3. **Deploy** — SSHs into the VPS, pulls the latest code, and restarts the Docker Compose service

> The build & deploy stages only run on pushes to the `main` branch.

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
