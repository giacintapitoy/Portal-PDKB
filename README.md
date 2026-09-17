# Portal PDKB

Portal berbasis web untuk membantu digitalisasi pengelolaan data Bagian PDKB PLN UPT Manado dalam proyek kerja sama dengan Universitas Sam Ratulangi (UNSRAT).

> **Status:** tahap perencanaan dan development. Kebutuhan dapat berubah setelah validasi dengan pengguna PLN.

## Scope MVP

- Pengguna dan hak akses
- Data serta riwayat peralatan
- Pencatatan pemakaian peralatan
- Data personel dan sertifikasi
- Reminder masa berlaku
- Dashboard dan laporan dasar
- Audit log

Detail kebutuhan dan kriteria penerimaan tersedia di [PRD](PRD-PDKB-UPT-Manado.md).

Aturan branch, commit, dan kolaborasi tersedia di [Panduan Kontribusi](CONTRIBUTING.md).

## Teknologi

### Frontend

- **React 19** untuk antarmuka berbasis komponen
- **TypeScript** untuk type safety
- **Vite** sebagai development server dan build tool
- **Fluent UI React Components** untuk komponen UI yang aksesibel
- **Lucide React** sebagai satu-satunya keluarga ikon
- **Inter** melalui `@fontsource/inter`
- **CSS native** dengan token dari Soft Blue Dashboard Design System

### Backend

- **Laravel 13** untuk REST API dan aturan bisnis
- **PostgreSQL 17** untuk penyimpanan data
- **Docker Compose** untuk menjalankan PostgreSQL secara konsisten

## Struktur Frontend

```text
src/
  App.tsx       shell, navigasi, dashboard, dan halaman awal
  features/
    equipment/  fitur Peralatan dan data contoh
  main.tsx      entry point, font, dan konfigurasi Fluent UI
  styles.css    design tokens, komponen visual, dan responsive layout
public/
  pln-logo.png  aset logo PLN
```

## Menjalankan Aplikasi dengan Docker

Seluruh stack dapat dijalankan dengan satu perintah:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/v1`
- PostgreSQL: `localhost:5432`

Setelah image pertama selesai dibuat, jalankan berikutnya cukup dengan
`docker compose up`. Migration dan seeder Laravel berjalan otomatis ketika
container backend dimulai. Hentikan stack dengan `docker compose down`.

## Menjalankan Tanpa Docker

```bash
npm install
npm run dev
```

Aplikasi tersedia melalui alamat lokal yang ditampilkan oleh Vite.

Build produksi:

```bash
npm run build
```

Backend membutuhkan PHP 8.3+, Composer, PostgreSQL, dan ekstensi `pdo_pgsql`.

```bash
cp backend/.env.example backend/.env
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API tersedia di `http://localhost:8000/api`. Pemeriksaan backend dijalankan dari
folder `backend` dengan `php artisan test` dan `vendor/bin/pint --test`.

Implementasi saat ini menggunakan data contoh untuk validasi antarmuka. Lihat [dokumentasi teknis](docs/DEVELOPMENT.md), [modul Peralatan](docs/features/EQUIPMENT.md), [strategi pengujian](docs/TESTING.md), dan [roadmap branch](docs/BRANCH-ROADMAP.md).

Rencana perluasan menggunakan alur dari proyek magang tersedia di [rencana integrasi PDKB Manguni](docs/INTEGRATION-PLAN.md) dan [kontrak integrasi Peralatan](docs/EQUIPMENT-INTEGRATION.md).

## Tahapan

1. Validasi kebutuhan dan alur kerja
2. Desain awal
3. Pembangunan MVP
4. Pengujian internal
5. User Acceptance Test (UAT)
6. Perbaikan dan deployment
