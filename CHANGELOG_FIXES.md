# CHANGELOG_FIXES.md

## 🧠 Catatan Perbaikan & Fitur
Berlaku untuk semua bug fix, regresi, dan catatan penting implementasi.

---

### ⚠️ PENTING — `migrate:fresh` DILARANG di Local MAUPUN Production
**Command ini akan MENGHAPUS SEMUA DATA, jangan pernah dijalankan!**

```bash
# ❌ JANGAN jalankan ini — akan menghapus seluruh database!
php artisan migrate:fresh --seed
```

| Command | Dampak | Kapan Digunakan |
|---------|--------|-----------------|
| `php artisan migrate:fresh --seed` | **Menghapus semua tabel + isi ulang** | ⛔ DILARANG — Local MAUPUN Production |
| `php artisan migrate` | Menambah tabel/kolom baru tanpa menghapus data | ✅ Production & Local |
| `php artisan migrate --force` | Migrasi otomatis tanpa konfirmasi | ✅ Production CI/CD |
| `php artisan db:seed` | Mengisi data tambahan | ✅ Setelah migrate |
| `php artisan test` | Menjalankan test suite | ✅ Test suite pakai SQLite memory, aman |

**Bahaya `migrate:fresh`:**
- ❌ Menghapus seluruh tabel database (users, products, orders, ingredients, units, dll)
- ❌ Semua data hilang permanen — tidak bisa dikembalikan
- ❌ Seed hanya mengisi data dummy, data asli sudah terhapus

**Aturan:**
1. `migrate:fresh` → **DILARANG DI KEMANA PUN** (local & production)
2. Gunakan `php artisan migrate` untuk menambah/memperbarui tabel
3. Gunakan `php artisan test` untuk testing — dia pakai SQLite in-memory, tidak mengotori DB utama
4. Selalu backup database sebelum migrasi besar
5. `.env` development & production harus dipisah

---

### Fix #2 — BelongsToMany import missing in Product model
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · app/Models/Product.php · "Return value must be of type App\Models\BelongsToMany, Illuminate\Database\Eloquent\Relations\BelongsToMany returned" · Class BelongsToMany tidak di-import · Tambah `use Illuminate\Database\Eloquent\Relations\BelongsToMany;` · ✅ HTTP 302 (redirect login, normal) · Selalu import semua relation class yang dipakai · BelongsToMany · Belum deploy

---

### Fix #3 — Satuan Bahan Baku Dinamis + Unit Management
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · database/migrations/2026_08_23_043528_create_units_table.php, app/Models/Unit.php, app/Repositories/UnitRepository.php, app/Services/UnitService.php, app/Http/Controllers/UnitController.php, app/Http/Controllers/IngredientController.php, resources/js/Pages/Ingredients/Create.tsx, resources/js/Pages/Ingredients/Edit.tsx, resources/js/types/index.tsx, database/factories/UnitFactory.php, database/factories/IngredientFactory.php, database/seeders/RestaurantSeeder.php, database/seeders/DatabaseSeeder.php, routes/web.php, tests/Feature/IngredientTest.php, tests/Feature/UnitTest.php · Satuan bahan baku hardcoded di dropdown (gram/ml/potong) · Tidak ada tabel satuan → satuan custom tidak persisten · Tambah migration `units`, model `Unit` dengan `HasFactory`, repository, service, controller `POST /units`, update `IngredientController` kirim `units` ke Inertia, form Create/Edit pakai dropdown dinamis + opsi "+ Tambah Satuan Baru" via fetch() (bukan router.post agar tidak konflik Inertia response) · ✅ 41/41 test passed, login admin@restoran.com berhasil, satuan custom tersimpan ke DB · 6 satuan default di-seed (Gram, Mililiter, Potong, Buah, Sendok, Cakar) + Admin user di-seed · Gunakan `fetch()` untuk non-Inertia endpoint; `router.post()` hanya untuk Inertia endpoint · InertiaNonJsonResponse · Belum deploy

---

### Fix #2 — BelongsToMany import missing in Product model
