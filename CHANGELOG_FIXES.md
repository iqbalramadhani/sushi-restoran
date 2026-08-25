# CHANGELOG_FIXES.md

## 🧠 Catatan Perbaikan & Fitur
Berlaku untuk semua bug fix, regresi, dan catatan penting implementasi.

---

### Fix #10 — Ubah Foreign Key Cascade ke Set Null pada products.category_id & orders.table_id
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-25 · database/migrations/2026_08_25_125345_update_products_category_id_to_set_null.php, database/migrations/2026_08_25_125559_update_orders_table_id_to_set_null.php · Saat kategori atau meja dihapus, semua produk/order terkait ikut terhapus (cascade) sehingga data histori transaksi hilang · Foreign key default di migration products & orders menggunakan `onDelete('cascade')` tanpa mempertimbangkan kebutuhan retain data · Buat migration baru untuk mengubah constraint: (1) `products.category_id` dari cascade ke set null, (2) `orders.table_id` dari cascade ke set null, dengan `->nullable()->change()` + dropForeign + re-add foreign nullOnDelete · ✅ Konfirmasi via `SHOW CREATE TABLE` — kedua tabel sekarang ON DELETE SET NULL · Foreign key cascade bisa menghapus data penting. Gunakan set null saat data turunan perlu dipertahankan sebagai arsip · products category_id cascade orders table_id · Sudah deploy

---

### Fix #9 — TypeError: Cannot read properties of undefined (reading 'ingredients') di Order Create
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-24 · resources/js/Pages/Orders/Create.tsx · `Uncaught TypeError: Cannot read properties of undefined (reading 'ingredients')` di Create.tsx:42 saat render awal · Default `selectedProductId = 0`, sehingga `products.find(p => p.id === 0)` return `undefined`, lalu `getMaxPossibleQty(undefined)` akses `.ingredients` → crash · Ganti `getMaxPossibleQty(products.find(p => p.id === selectedProductId)!)` dengan IIFE yang melakukan null-check sebelum memanggil fungsi · ✅ Build bersih · Selalu defensive check saat mengakses properti dari hasil `find()` yang bisa return undefined · Create.tsx ingredient · Belum deploy

---

### Fix #8 — Sinkronisasi Stok Bahan Baku dengan Order + Perbaikan Tampilan Halaman Create Order
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-24 · app/Services/OrderService.php, app/Http/Controllers/OrderController.php, resources/js/Pages/Orders/Create.tsx · (1) Order tetap dibuat meski stok bahan baku tidak cukup karena validasi stock tidak dilakukan sebelum order dibuat, (2) Cancel order tidak mengembalikan stok bahan baku yang sudah dipotong, (3) Frontend tidak menampilkan info stok sehingga user tidak tahu apakah bahan cukup sebelum order · Akar: `OrderService::deductIngredients()` memang sudah ada tapi hanya mengurangi stok tanpa validasi beforehand, dan `cancelOrder()` hanya mengubah status tanpa restore stok. `create()` di controller tidak eager-load `ingredients` sehingga frontend tidak punya data stok. · Fix: (1) Tambah method `validateIngredients()` di OrderService yang memeriksa stock setiap bahan baku sebelum order dibuat, throw Exception jika kurang, (2) Bungkus `createOrder()` dengan `DB::transaction()` agar atomik, (3) Tambah restore stock di `cancelOrder()` menggunakan `increment()` dalam transaction, (4) Update `OrderController::store()` catch Exception dan kembalikan `back()->withErrors(['stock' => ...])`, (5) Update `create()` controller eager-load `ingredients` pada products, (6) Redesign UI Create.tsx: section meja terpisah, quick add panel, grid produk dengan badge stock & status warna (hijau=k足够, kuning=rendah, merah=habis), sidebar keranjang dengan kontrol qty (+/-) per item, warning stock inline. · ✅ Build bersih, 1/1 order test passed · Stock validation harus dilakukan BEFORE create order, bukan after. Transaction penting agar order + deduction atomik atau rollback bersamaan. Cancel order harus reverse semua stock deduction · Order stock validation · Belum deploy

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

### Fix #7 — TypeError: Cannot read properties of undefined (reading 'map') di halaman Create Produk
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-24 · resources/js/Pages/Products/Create.tsx, resources/js/Pages/Products/Edit.tsx · `Uncaught TypeError: Cannot read properties of undefined (reading 'map')` di Create.tsx:123 saat rendering dropdown bahan baku · (1) Backend mengembalikan `ingredients` sebagai array 3 item (terverifikasi via curl + decode `data-page`), (2) Browser memuat bundle build lama (`Create-BhiKInBo.js` dari 22:42) sementara source diubah 23:09, (3) Ada 3 instance Vite berjalan di port 5173/5174/5175 — browser terhubung ke yang salah satu yang cache-nya stale · Fix: (1) Tambah optional chaining `ingredients?.map(...)` di Create.tsx:123 dan Edit.tsx:111 agar aman jika prop null/undefined, (2) Tambah default parameter `{ categories = [], ingredients = [] }` di Create.tsx function signature · Hard refresh (Cmd+Shift+R) di browser untuk clear stale Vite HMR cache · `ingredients` sebenarnya hadir di backend (3 record: Minyak, gula, Beras) — crash murni karena bundle lama di-cache browser · Optional chaining di semua `.map()` yang menerima prop dari Inertia · Create.tsx ingredient dropdown · Belum deploy

---

### Fix #4 — Login username + system pengajuan akun dengan approval admin
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · database/migrations/2026_08_23_073433_add_username_to_users_table.php, database/migrations/2026_08_23_074213_create_account_requests_table.php, app/Models/User.php, app/Models/AccountRequest.php, app/Http/Controllers/Auth/AuthenticatedSessionController.php, app/Http/Controllers/Auth/RegisteredUserController.php, app/Http/Controllers/Auth/ConfirmablePasswordController.php, app/Http/Controllers/AccountRequestController.php, app/Http/Requests/Auth/LoginRequest.php, app/Http/Middleware/HandleInertiaRequests.php, routes/web.php, routes/auth.php, resources/js/Pages/Auth/Login.tsx, resources/js/Pages/Auth/Register.tsx, resources/js/Pages/Auth/RegisterSuccess.tsx, resources/js/Pages/AccountRequests/Index.tsx, resources/js/Pages/AccountRequests/Show.tsx, database/seeders/RestaurantSeeder.php, database/factories/UserFactory.php, tests/Feature/Auth/AuthenticationTest.php, tests/Feature/Auth/RegistrationTest.php · Login sebelumnya pakai email yang kurang intuitif untuk user internal restoran · Akar masalah: email field wajib tapi user lebih suka username yang sederhana · Fix: (1) Tambah kolom `username` unique ke tabel users via migration baru, (2) Update LoginRequest validate & attempt pakai `username`, (3) Ubah RegisteredUserController simpan ke table `account_requests` bukan langsung buat user — flow baru jadi "Ajukan Akun" menunggu approval admin, (4) Buat AccountRequestController untuk approve/reject request, (5) Blokir login user dengan `email_verified_at` null, (6) Hapus middleware `verified` dari web routes, (7) Seeder update pakai `updateOrCreate` dengan username `admin` & `staff`, password kuat `SeCur3P@sswrD!` & `St@ffP@ss99!`, (8) Frontend: Login ganti field email→username, Register ubah jadi formulir ajukan dengan status success page, Admin bisa kelola request di halaman `/account-requests`. · ✅ 64/64 test passed, migrate berhasil, seeders berjalan, frontend build bersih · Password default user sudah diganti dari "password" ke password yang lebih kuat · Logout otomatis saat approve karena Auth::login() mengubah session · Gunakan `updateOrCreate` bukan `firstOrCreate` di seeder karena email unik constraint bisa konflik dengan data lama · Belum deploy

---

### Fix #3 — Satuan Bahan Baku Dinamis + Unit Management
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · database/migrations/2026_08_23_043528_create_units_table.php, app/Models/Unit.php, app/Repositories/UnitRepository.php, app/Services/UnitService.php, app/Http/Controllers/UnitController.php, app/Http/Controllers/IngredientController.php, resources/js/Pages/Ingredients/Create.tsx, resources/js/Pages/Ingredients/Edit.tsx, resources/js/types/index.tsx, database/factories/UnitFactory.php, database/factories/IngredientFactory.php, database/seeders/RestaurantSeeder.php, database/seeders/DatabaseSeeder.php, routes/web.php, tests/Feature/IngredientTest.php, tests/Feature/UnitTest.php · Satuan bahan baku hardcoded di dropdown (gram/ml/potong) · Tidak ada tabel satuan → satuan custom tidak persisten · Tambah migration `units`, model `Unit` dengan `HasFactory`, repository, service, controller `POST /units`, update `IngredientController` kirim `units` ke Inertia, form Create/Edit pakai dropdown dinamis + opsi "+ Tambah Satuan Baru" via fetch() (bukan router.post agar tidak konflik Inertia response) · ✅ 41/41 test passed, login admin@restoran.com berhasil, satuan custom tersimpan ke DB · 6 satuan default di-seed (Gram, Mililiter, Potong, Buah, Sendok, Cakar) + Admin user di-seed · Gunakan `fetch()` untuk non-Inertia endpoint; `router.post()` hanya untuk Inertia endpoint · InertiaNonJsonResponse · Belum deploy

---

### Fix #2 — BelongsToMany import missing in Product model
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · app/Models/Product.php · "Return value must be of type App\Models\BelongsToMany, Illuminate\Database\Eloquent\Relations\BelongsToMany returned" · Class BelongsToMany tidak di-import · Tambah `use Illuminate\Database\Eloquent\Relations\BelongsToMany;` · ✅ HTTP 302 (redirect login, normal) · Selalu import semua relation class yang dipakai · BelongsToMany · Belum deploy

---

### Fix #5 — UI Improvements: Price formatting & Ingredient display in Edit form
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · resources/js/Pages/Products/Create.tsx, resources/js/Pages/Products/Edit.tsx, app/Models/Product.php, app/Models/Ingredient.php, resources/js/types/index.tsx · (1) Input harga menampilkan format ribuan otomatis saat diketik tapi validasi browser menolak karena pattern regex, (2) Bahan baku tidak muncul di form edit karena pivot tidak menyertakan field id · Fix: (1) Hapus atribut `pattern="[0-9]*"` dari input harga (value dengan titik pemisah tidak cocok regex), gunakan `toLocaleString('id-ID')` untuk format real-time, (2) Tambah `'id'` ke `withPivot()` di Product dan Ingredient model agar pivot record ID tersedia di frontend, (3) Update TypeScript interface `ProductIngredient` untuk mencocokkan struktur data, (4) Bulatkan qty bahan baku dengan `Math.round()` agar tidak tampil desimal `.00` · ✅ 64/64 test passed, build bersih · Pivot Laravel default tidak menyertakan primary key kecuali di-spesifikasikan di withPivot · Use `toLocaleString('id-ID')` bukan manual replace untuk format ribuan yang lebih reliable · Produk Ingredient · Belum deploy

---

### Fix #6 — Inertia SPA Navigation: Eliminate full page reload on navigation, form submit, login & logout
Tanggal · File · Masalah · Akar · Fix · Verifikasi · Pelajaran · Log Keyword · Deploy
2026-08-23 · app/Http/Controllers/ProductController.php, app/Http/Controllers/IngredientController.php, app/Http/Controllers/TableController.php, app/Http/Controllers/OrderController.php, app/Http/Controllers/Auth/AuthenticatedSessionController.php, app/Http/Controllers/Auth/RegisteredUserController.php, resources/js/Layouts/AuthenticatedLayout.tsx · Perpindahan menu, submit form, login, dan logout masih memicu full page reload · (1) `to_route()` di controller mengembalikan redirect HTTP biasa (302) bukan Inertia navigation, (2) NavLink di layout menggunakan tag `<a>` HTML biasa, (3) Logout menggunakan form `<form action>` standar, (4) Login controller selalu redirect tanpa cek Inertia request · Fix: (1) Ganti semua `to_route()` di controller CRUD dengan `session()->flash()` + `inertia()->location()` untuk Inertia-aware redirect, (2) Ubah NavLink dari `<a>` ke `<Link href>` dari Inertia, (3) Logout ubah dari form action ke `router.post(route('logout'))`, (4) Auth controller cek `$request->wantsJson()` untuk menentukan respons Inertia vs plain redirect · ✅ 64/64 test passed, build bersih · `to_route()` = Laravel redirect biasa → full reload; `inertia()->location()` = Inertia SPA navigation · `wantsJson()` mendeteksi header `X-Inertia: true` yang dikirim Inertia frontend · Selalu gunakan `inertia()->location()` bukan `redirect()` di controller yang dipakai Inertia · Semua CRUD controller, Auth · Belum deploy
