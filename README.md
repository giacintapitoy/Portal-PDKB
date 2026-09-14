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

- React dan TypeScript
- Vite
- Fluent UI

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

Implementasi saat ini menggunakan data contoh untuk validasi antarmuka. Lihat [dokumentasi teknis](docs/DEVELOPMENT.md) dan [roadmap branch](docs/BRANCH-ROADMAP.md).

## Tahapan

1. Validasi kebutuhan dan alur kerja
2. Desain awal
3. Pembangunan MVP
4. Pengujian internal
5. User Acceptance Test (UAT)
6. Perbaikan dan deployment
