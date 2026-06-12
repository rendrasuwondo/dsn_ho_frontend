# i-Plant — ERP Head Office Frontend (`erp-whu-frontend`)

> **i-Plant** — _Integration of Information in Plantation Management_

Aplikasi frontend **ERP Head Office (HO)** berbasis [Nuxt.js 2](https://v2.nuxt.com/) (Vue 2, SSR) untuk mendukung operasional manajemen perkebunan & pabrik kelapa sawit di lingkungan **DSN Group**. Aplikasi ini mencakup ±250 halaman yang terbagi ke dalam belasan modul: dashboard produksi, data warehouse RNA, manajemen pupuk (fertilizer), operasional mill/PKS (sortasi, grading, weighbridge), master data, workflow approval dokumen, hingga manajemen user, role, dan menu secara dinamis.

Frontend ini berkomunikasi dengan **backend API Laravel** (default: `http://localhost:8000`) menggunakan autentikasi Bearer token, dan menggunakan **AdminLTE 3** + **Bootstrap 4 / BootstrapVue** sebagai kerangka UI.

---

## Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Tech Stack](#-tech-stack)
3. [Arsitektur & Cara Kerja](#-arsitektur--cara-kerja)
4. [Modul Aplikasi](#-modul-aplikasi)
5. [Struktur Proyek](#-struktur-proyek)
6. [Konvensi Routing & Pola CRUD](#-konvensi-routing--pola-crud)
7. [Prasyarat](#-prasyarat)
8. [Instalasi & Menjalankan](#-instalasi--menjalankan)
9. [Konfigurasi](#-konfigurasi)
10. [Autentikasi & Otorisasi](#-autentikasi--otorisasi)
11. [State Management (Vuex)](#-state-management-vuex)
12. [Komponen, Mixin & Plugin](#-komponen-mixin--plugin)
13. [Linting & Code Style](#-linting--code-style)
14. [Catatan Pengembangan](#-catatan-pengembangan)
15. [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

- **Dashboard produksi interaktif** — akurasi, AVG BJR, produktivitas SKU, restan, ripeness, TBS ke PKS, dengan grafik FusionCharts/Chart.js dan filter global (PT → Estate → Afdeling → rentang tanggal).
- **Sidebar menu dinamis & role-based** — struktur menu dirender dari backend per user; akses tiap halaman divalidasi server-side, user tanpa hak akses otomatis dialihkan ke dashboard.
- **Manajemen pupuk end-to-end** — mulai dari master vendor/laboratorium, sampling & join sampling, input hasil analisa lab, klaim, hingga monitoring HAP & monitoring pupuk.
- **Operasional Mill/PKS** — sampling & grading FFB (internal/eksternal), approval berjenjang, spot cek, report sortasi harian/PKS multi-level (unit, PH, HO), monitoring weighbridge (WB), dan manajemen overtime karyawan.
- **Data Warehouse RNA** — repositori data riset agronomi: grading, losses, LSU, irradiation, oil content, organic production, soil, dengan fasilitas upload file massal.
- **Workflow engine UI** — konfigurasi document type, document matrix, process, role-process/role-department mapping, task, dan chart alur approval.
- **Administrasi sistem penuh** — CRUD user, role, menu/sub-menu, pemetaan menu-role & user-role, user-company, global parameter, konfigurasi dashboard, hingga integrasi notifikasi WA grading.
- **Audit trail akses menu** — setiap kunjungan halaman dicatat ke backend (`access_logs/daily`) melalui mixin global.
- **Format angka & mata uang Rupiah** otomatis (`Rp `, pemisah ribuan) via `vue-number-format` dan `v-money`.

---

## 🛠 Tech Stack

| Kategori          | Teknologi                                       | Versi            |
| ----------------- | ----------------------------------------------- | ---------------- |
| Framework         | Nuxt.js (mode SSR, target `server`)             | ^2.17.0          |
| View library      | Vue.js                                          | ^2.6.14          |
| UI framework      | Bootstrap + BootstrapVue                        | ^4.6.1 / ^2.21.2 |
| Template admin    | AdminLTE 3 (CSS + JS di `assets/` & `static/`)  | 3.x              |
| Ikon              | Font Awesome Free                               | 5.x              |
| Autentikasi       | @nuxtjs/auth-next (strategi `local`, Bearer)    | ^5.0.0           |
| HTTP client       | @nuxtjs/axios                                   | ^5.13.6          |
| Grafik            | FusionCharts (vue-fusioncharts), Chart.js       | ^3.20.0 / 3.1.0  |
| Notifikasi/dialog | vue-sweetalert2                                 | ^5.0.2           |
| Select/dropdown   | nuxt-multiselect                                | ^1.0.1           |
| Rich text editor  | @blowstack/ckeditor-nuxt                        | ^0.6.0           |
| Format angka      | @coders-tm/vue-number-format, v-money           | ^2.0.7 / ^0.8.1  |
| Cookie            | cookie-universal-nuxt                           | ^2.1.5           |
| Tabel dinamis     | vue-table-dynamic + DataTables (static plugins) | ^0.4.10          |
| Bundler           | Webpack                                         | ^4.46.0          |
| Code formatter    | Prettier                                        | ^2.5.1           |
| Font              | Quicksand (global), Audiowide (brand)           | Google Fonts     |

---

## 🏗 Arsitektur & Cara Kerja

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Nuxt 2 SSR Server (port 3000)               │
│                                                          │
│  layouts/admin.vue ──► Header + Sidebar (menu dinamis)   │
│  middleware: auth  ──► proteksi seluruh halaman          │
│  mixins/menuAccessLog ──► audit log akses menu           │
│  store/index.js    ──► filter global dashboard (Vuex)    │
└──────────────────────────┬──────────────────────────────┘
                           │  @nuxtjs/axios (Bearer token)
┌──────────────────────────▼──────────────────────────────┐
│           Backend API Laravel (localhost:8000)            │
│   /api/admin/login · /logout · /user · /profile          │
│   /api/admin/menu_user/{path} · /check_user_menu/{path}  │
│   /api/admin/access_logs/daily · /lov_* · CRUD modul     │
└──────────────────────────────────────────────────────────┘
```

Alur kerja utama:

1. **Login** — kredensial (`user_name`, `password`) dikirim ke `/api/admin/login`; token Bearer disimpan oleh `@nuxtjs/auth-next`, lalu data profil (department, company, activity group) disimpan ke cookies.
2. **Render halaman** — setiap halaman memakai layout `admin` yang menjalankan middleware `auth`.
3. **Menu dinamis** — komponen `Sidebar` memanggil `/api/admin/menu_user/{path}` (path di-encode dengan `*` sebagai pemisah) dan me-render HTML menu yang dikembalikan backend sesuai role user.
4. **Guard akses** — `/api/admin/check_user_menu/{path}` memvalidasi hak akses; jika jawaban `"Tidak"`, user di-redirect ke `/erp_ho/main/dashboard`.
5. **Audit log** — halaman yang menggunakan mixin `menuAccessLog` memanggil `recordMenuLog(menuName)` yang mengirim POST ke `/api/admin/access_logs/daily` (gagal log tidak mengganggu halaman).

---

## 📦 Modul Aplikasi

Seluruh halaman berada di bawah prefix route `/erp_ho/`. Rincian per modul (jumlah halaman berdasarkan struktur `pages/`):

### 🌱 Fertilizer (48 halaman) — Manajemen Pupuk

Modul terbesar, mencakup siklus pengelolaan pupuk dan analisa laboratorium:

- **Master:** fertilizer type, vendors, laboratory, vendor laboratory, laboratory vendor, parameter analisa
- **Sampling:** input sampel, join sampling, input join sampling, alert sampling
- **Analisa:** input hasil analisa (input/edit per ID)
- **Klaim:** claim, claim sample, detail claim sample, detail HAP
- **Monitoring:** monitoring HAP, monitoring pupuk, in monitor, in process PRC, in process RNA

### 🏭 Mill / PKS (38 halaman) — Operasional Pabrik

- **Grading & sampling:** sampling grading FFB, approve sampling grading (internal & eksternal, create/edit terpisah)
- **Spot cek:** spot cek, report spot cek (unit & PH)
- **Report sortasi:** report sortasi harian & sortasi PKS — masing-masing tersedia level unit, **PH**, dan **HO**; rekap harian TBS eksternal; rekap penerimaan eksternal sortasi; laporan harian grading
- **Weighbridge:** monitoring WB (unit, PH, HO)
- **Lainnya:** overtime & overtime employee, station, mill type, profile, map jabatan, email grading (user & admin)

### ⚙️ System (34 halaman) — Administrasi Sistem

- Users, roles, menu & sub-menu (CRUD penuh)
- Pemetaan akses: menu has role (v1 & v2), user has role (v1 & v2), user company
- Global parameter, konfigurasi dashboard, WA grading

### 🔁 Workflow (24 halaman) — Mesin Alur Dokumen

- Document type, document matrix, workflow init, process, task
- Pemetaan role-department & role-process, chart visualisasi alur

### 🗂 Master (20 halaman) — Master Data

- Company, department, employee (+ employee department, employee phone)
- PGS & PGS detail, upload file

### 📊 Dashboard (14 halaman) — Dashboard Produksi

- Akurasi, AVG BJR, produktivitas SKU, restan, ripeness, TBS PKS, home
- Dashboard announcement & dashboard menu code (CRUD)

### 🧪 Data Warehouse — RNA (13 halaman)

- Grading & grading PKS, losses & losses PKS, LSU, irradiation, oil content, organic production (estate & PKS), soil
- Upload file + detail upload

### 🏢 Admin (12 halaman)

- Company, site, location, position (CRUD)

### 📥 MDEX (8 halaman)

- Inflow (create per status), PIC, upload file + detail upload

### 👥 People & PeopleHub (13 halaman)

- Map department, map location, overtime (PeopleHub)

### 🔑 Lainnya

- **Login** (`/erp_ho/login`) — halaman login bertema i-Plant dengan link unduhan APK mobile & dokumen modul
- **Reset password** (`/erp_ho/reset_password`)
- **Modul** (`/erp_ho/modul`) — direktori dokumen modul i-Plant
- **E-Contract** (`/erp_ho/econtract`)
- **Main dashboard** (`/erp_ho/main/dashboard`) — landing page setelah login

---

## 📁 Struktur Proyek

```
erp-whu-frontend/
├── assets/
│   └── css/
│       ├── adminlte(.min).css        # Tema AdminLTE 3 (+ varian alt/)
│       └── fontawesome-free/         # Ikon Font Awesome
├── components/
│   ├── admin/
│   │   ├── header.vue                # Navbar atas: identitas user (NIK, company,
│   │   │                             #   department, afdeling), avatar, logout
│   │   ├── sidebar.vue               # Sidebar dinamis (menu HTML dari backend)
│   │   └── mill/                     # Section form khusus modul mill:
│   │       ├── approve_sampling_grading/{Internal,External}Section.vue
│   │       ├── report_sortasi_harian/{Nucleus,Plasma}.vue
│   │       ├── report_spot_cek/{Internal,External}Section.vue
│   │       └── spot_cek/{Internal,External}Section.vue
│   ├── view/header.vue               # Header untuk layout "view"
│   ├── FilterBar.vue                 # Filter global dashboard (PT/Estate/Afdeling/tanggal)
│   ├── LoadingBar.vue                # Overlay loading custom ($nuxt.$loading)
│   ├── NuxtLogo.vue / Tutorial.vue   # Bawaan scaffold Nuxt
├── layouts/
│   ├── admin.vue                     # Layout utama AdminLTE (middleware auth)
│   ├── auth.vue                      # Layout halaman login (gradient ungu)
│   └── view.vue                      # Layout tampilan tanpa sidebar
├── middleware/                       # (auth via @nuxtjs/auth-next, global)
├── mixins/
│   └── menuAccessLog.js              # recordMenuLog() → POST access_logs/daily
├── pages/
│   ├── index.vue                     # Redirect "/" → /erp_ho/login
│   └── erp_ho/                       # ±250 halaman, lihat "Modul Aplikasi"
├── plugins/
│   ├── chart.js                      # Registrasi FusionCharts + lisensi (client-only)
│   └── vue-number-format.js          # Format angka Rupiah (v-number & v-money)
├── static/
│   ├── img/                          # Logo DSN, ikon, gambar login
│   ├── js/                           # jQuery, Bootstrap bundle, adminlte.js
│   └── plugins/                      # DataTables, daterangepicker, dsb. (vendor)
├── store/
│   └── index.js                      # Vuex: state filter global dashboard
├── jsconfig.json                     # Alias path: ~/ dan @/ → root proyek
├── nuxt.config.js                    # Konfigurasi utama (lihat "Konfigurasi")
├── .prettierrc / .editorconfig       # Code style
└── package.json
```

---

## 🧭 Konvensi Routing & Pola CRUD

Nuxt 2 membuat route otomatis dari struktur folder `pages/`. Hampir semua modul mengikuti pola CRUD yang konsisten:

| File                                            | Route yang dihasilkan     | Fungsi                              |
| ----------------------------------------------- | ------------------------- | ----------------------------------- |
| `pages/erp_ho/<modul>/<fitur>/index.vue`        | `/erp_ho/<modul>/<fitur>` | Listing / tabel data                |
| `pages/erp_ho/<modul>/<fitur>/create/index.vue` | `.../create`              | Form tambah data                    |
| `pages/erp_ho/<modul>/<fitur>/edit/_id.vue`     | `.../edit/:id`            | Form ubah data                      |
| `pages/erp_ho/<modul>/<fitur>/_id.vue`          | `.../:id`                 | Halaman detail / child data         |
| `pages/erp_ho/<modul>/<fitur>/create/_id.vue`   | `.../create/:id`          | Tambah data anak milik parent `:id` |

Contoh nyata: `fertilizer/laboratory_vendor/_id.vue` menampilkan vendor milik laboratorium tertentu, dan `create/_id.vue`-nya menambah vendor untuk laboratorium tersebut.

---

## 📋 Prasyarat

- **Node.js 14–16** (Nuxt 2 + Webpack 4; versi Node yang lebih baru dapat memerlukan flag `--openssl-legacy-provider`)
- **npm** (proyek memakai `overrides`, gunakan npm ≥ 8 jika memungkinkan)
- **Backend API Laravel** yang berjalan dan dapat diakses (default `http://localhost:8000`), menyediakan endpoint `/api/admin/*`

---

## 🚀 Instalasi & Menjalankan

```bash
# 1. Clone repository
git clone <repository-url>
cd erp-whu-frontend

# 2. Install dependencies
npm install

# 3. Sesuaikan baseURL backend di nuxt.config.js (lihat bagian Konfigurasi)

# 4. Jalankan development server — berjalan di PORT 3000
npm run dev
```

Buka `http://localhost:3000` — root (`/`) otomatis dialihkan ke halaman login `/erp_ho/login`. Setelah login berhasil, user diarahkan ke `/erp_ho/main/dashboard`.

### Build Production

```bash
npm run build      # build aplikasi (SSR)
npm run start      # jalankan production server
```

### Generate Statis (tidak disarankan)

```bash
npm run generate
```

> Karena aplikasi sangat bergantung pada API dan auth per-request, mode `server` (SSR) adalah mode deploy yang dimaksud; `generate` hanya tersedia sebagai bawaan scaffold.

---

## ⚙️ Konfigurasi

Semua konfigurasi berada di **`nuxt.config.js`** (tidak menggunakan file `.env` — perubahan environment dilakukan langsung di file ini):

| Item              | Kunci                                  | Nilai default                                                            | Keterangan                                                                                       |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Base URL API      | `axios.baseURL`                        | `http://localhost:8000`                                                  | Ganti ke alamat server backend (contoh produksi yang dikomentari: `http://localhost:8004`) |
| Grievance URL     | `publicRuntimeConfig.grievanceBaseURL` | `http://localhost:8086/grievance`                                    | Base URL layanan grievance, dapat diakses via `$config.grievanceBaseURL`                         |
| Port dev          | script `dev`                           | `3000`                                                                   | Didefinisikan di `package.json` (`nuxt --port 3000`)                                             |
| Endpoint auth     | `auth.strategies.local.endpoints`      | `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/user` | Token Bearer, property `token`                                                                   |
| Redirect auth     | `auth.redirect`                        | login/logout/callback → `/erp_ho/login`; home → `/erp_ho/main/dashboard` |                                                                                                  |
| Middleware global | `middleware`                           | `['auth']`                                                               | Seluruh halaman terproteksi                                                                      |
| Head global       | `head`                                 | Font Quicksand, jQuery, Bootstrap bundle, adminlte.js                    | Dimuat dari `static/js/`                                                                         |
| CSS global        | `css`                                  | Font Awesome + AdminLTE minified                                         | Dari `assets/css/`                                                                               |

> ⚠️ **Sebelum deploy:** pastikan `axios.baseURL` dan `grievanceBaseURL` menunjuk ke server environment yang benar, karena nilainya di-hardcode di `nuxt.config.js`.

---

## 🔐 Autentikasi & Otorisasi

### Alur Login

1. User mengisi `user_name` dan `password` di `/erp_ho/login` (layout `auth`).
2. `this.$auth.loginWith('local', ...)` → `POST /api/admin/login`; token Bearer disimpan oleh auth module.
3. Setelah sukses, aplikasi memanggil `GET /api/admin/profile` dan menyimpan ke **cookies**: `department_code`, `company_code`, `activity_group_id`, `activity_group_code`.
4. Redirect ke `/erp_ho/main/dashboard`.

### Proteksi Halaman

- Middleware `auth` aktif **global** (di `nuxt.config.js`) — semua halaman butuh login.
- `components/admin/header.vue` memverifikasi token via `GET /api/admin/profile` saat mount; respons `401` memicu logout otomatis (hapus auth + semua cookies + redirect ke login).

### Otorisasi Menu (RBAC)

- **Menu dinamis:** `GET /api/admin/menu_user/{path}` — `path` adalah route saat ini dengan `/` diganti `*` (mis. `*erp_ho*master*employee`). Backend mengembalikan HTML menu sesuai role, dirender via `v-html` di sidebar.
- **Guard halaman:** `GET /api/admin/check_user_menu/{path}` — jika backend menjawab `"Tidak"`, user dipaksa kembali ke dashboard.
- Pemetaan role ↔ menu ↔ user dikelola dari modul **System** (menu has role, user has role, dsb.).

---

## 🗃 State Management (Vuex)

`store/index.js` menyimpan **state filter global dashboard** yang dipakai bersama oleh `FilterBar.vue` dan halaman-halaman dashboard:

| State                                     | Tipe        | Fungsi                                                                                                                                |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `company`, `department`, `afdeling`       | array       | Opsi LOV untuk multiselect (PT / Estate / Afdeling)                                                                                   |
| `companyId`, `departmentId`, `afdelingId` | object/null | Pilihan filter aktif                                                                                                                  |
| `dateStart`, `dateEnd`                    | string/null | Rentang tanggal                                                                                                                       |
| `queryString`                             | string      | Query string gabungan (`&company=...&department=...&afdeling=...&date_start=...&date_end=...`) yang ditempel ke request API dashboard |
| `search`                                  | number      | Counter pemicu refresh (`$nuxt.refresh()`) saat tombol **CARI** ditekan                                                               |

Perilaku berantai: memilih _Estate_ (department) otomatis memuat daftar _Afdeling_-nya via `GET /api/admin/lov_afdeling_department?department_id=...`.

---

## 🧩 Komponen, Mixin & Plugin

### Komponen Global (auto-import, `components: true`)

- **`FilterBar`** — kartu filter PT/Estate/Afdeling + date range + tombol CARI; menulis ke Vuex dan memicu refresh halaman.
- **`LoadingBar`** — overlay spinner fullscreen; terdaftar sebagai custom loading Nuxt (`this.$nuxt.$loading.start()/finish()`).
- **`admin/header`** — info user login (NIK, nama, kode company/department/afdeling beserta kode SAP), avatar (ui-avatars.com), dropdown logout, toggle sidebar.
- **`admin/sidebar`** — render menu dinamis + guard akses (lihat bagian Otorisasi).
- **`admin/mill/*`** — section form internal/eksternal yang dipakai ulang pada halaman approve sampling grading, spot cek, dan report sortasi harian (Nucleus/Plasma).

### Mixin

- **`mixins/menuAccessLog.js`** — method `recordMenuLog(menuName)`; mengirim `POST /api/admin/access_logs/daily` dengan payload `{ action, version: 'web' }`. Error ditelan (silent) agar halaman tetap berjalan bila logging gagal.

### Plugin

- **`plugins/chart.js`** _(client-only, `ssr: false`)_ — registrasi `vue-fusioncharts` + tema Fusion dan konfigurasi lisensi FusionCharts.
- **`plugins/vue-number-format.js`** _(SSR)_ — registrasi direktif/komponen `v-number` (prefix `Rp `, separator `,`, presisi 2) dan `v-money` (presisi 0).

---

## 🧹 Linting & Code Style

Proyek hanya menggunakan **Prettier** (tanpa ESLint rules tambahan):

```bash
npm run lint        # prettier --check .
npm run lintfix     # prettier --write --list-different .
```

Konfigurasi ada di `.prettierrc`, `.prettierignore`, dan `.editorconfig`.

---

## 📝 Catatan Pengembangan

- **File backup/duplikat di dalam repo** — terdapat sejumlah artefak pengembangan yang sebaiknya dibersihkan atau setidaknya tidak dijadikan acuan, misalnya: `_nuxt.config - Copy.js`, `pages/erp_ho/login/index - Copy.vue`, `login/index_1.vue`, `fertilizer/input_join_sampling/index.vue.old`, `index5.vue`, `join_sampling/index-cek.vue`, `static/favicon copy.ico`, `desktop.ini`, serta halaman uji `pages/erp_ho/test/` dan `dashboard_test/`.
- **Vendor library di-commit langsung** — jQuery, Bootstrap, AdminLTE, DataTables, dan plugin lain disertakan sebagai file statis di `static/js` & `static/plugins` (bukan dari npm), karena AdminLTE membutuhkannya di sisi global `<head>`.
- **Konfigurasi hardcoded** — `baseURL` axios dan `grievanceBaseURL` ditulis langsung di `nuxt.config.js`; pertimbangkan migrasi ke environment variable (`process.env`) bila diperlukan multi-environment.
- **Sidebar memakai `v-html`** — HTML menu sepenuhnya berasal dari backend; pastikan backend hanya mengembalikan konten tepercaya.
- **Kompatibilitas Node** — karena Webpack 4, gunakan Node 14/16. Pada Node ≥ 17, jalankan dengan `NODE_OPTIONS=--openssl-legacy-provider` bila muncul error `ERR_OSSL_EVP_UNSUPPORTED`.
- **Footer & versi** — versi aplikasi (`1.0.0`) tertera di footer layout `admin.vue` dan `package.json`.

---
