# CHANGELOG_FIXES.md

## 🧠 Catatan Perbaikan & Fitur
Berlaku untuk semua bug fix, regresi, dan catatan penting implementasi.

---

### Fix #2 — BelongsToMany import missing in Product model
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · app/Models/Product.php · "Return value must be of type App\Models\BelongsToMany, Illuminate\Database\Eloquent\Relations\BelongsToMany returned" · Class BelongsToMany tidak di-import · Tambah `use Illuminate\Database\Eloquent\Relations\BelongsToMany;` · ✅ HTTP 302 (redirect login, normal) · Selalu import semua relation class yang dipakai · BelongsToMany · Belum deploy

---

### Fix #1 — Fitur Bahan Baku: CRUD Ingredients + Relasi ke Produk
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · app/Models/Ingredient.php, app/Repositories/IngredientRepository.php, app/Services/IngredientService.php, app/Http/Controllers/IngredientController.php, database/migrations/2026_08_23_040254_create_ingredients_table.php, database/migrations/2026_08_23_040300_create_product_ingredient_table.php, app/Models/Product.php, app/Repositories/ProductRepository.php, app/Http/Controllers/ProductController.php, resources/js/Pages/Ingredients/Index.tsx, resources/js/Pages/Ingredients/Create.tsx, resources/js/Pages/Ingredients/Edit.tsx, resources/js/Pages/Products/Create.tsx, resources/js/Pages/Products/Edit.tsx, resources/js/Layouts/AuthenticatedLayout.tsx, resources/js/types/index.tsx, routes/web.php · Belum ada fitur bahan baku · Tidak ada tabel/model/relasi · Tambah migration `ingredients` + `product_ingredient`, model, repository, service, controller, halaman frontend (Index/Create/Edit), update form Create/Edit Produk, navigasi navbar · ✅ Build berhasil, migrasi berjalan, route terdaftar (`GET|HEAD ingredients`, `POST ingredients`, `GET|HEAD ingredients/create`, `PUT|PATCH ingredients/{ingredient}`, `DELETE ingredients/{ingredient}`) · CategoryRepository sebelumnya korup (berisi kode TableRepository) → diperbaiki dengan Write ulang · `ingredients.*` validation di controller (exists:ingredients,id, numeric|min:0) · product_ingredient pivot table: quantity (decimal 8,2), unit (string default 'g') · Foreign key cascade delete dari product_ingredient ke products dan ingredients · 2026_08_23_040254 · Belum deploy
