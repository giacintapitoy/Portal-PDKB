# Panduan Kontribusi

Panduan ini digunakan oleh empat anggota tim Portal PDKB selama development.

## Alur Kerja

1. Buat GitHub Issue untuk satu pekerjaan yang jelas.
2. Ambil versi terbaru dari `main`.
3. Buat branch dari `main` berdasarkan nomor issue.
4. Kerjakan dan commit perubahan yang berkaitan dengan issue tersebut.
5. Push branch, lalu buat Pull Request (PR) ke `main`.
6. Minimal satu anggota lain melakukan review.
7. Merge setelah pemeriksaan berhasil dan kriteria issue terpenuhi.
8. Hapus branch yang sudah di-merge.

Jangan melakukan push langsung ke `main`. Branch `main` harus selalu dalam kondisi yang dapat dijalankan.

## Penamaan Branch

Format:

```text
<area>/<nomor-issue>-<nama-singkat>
```

Area yang digunakan:

| Area | Kegunaan |
|---|---|
| `fe` | Antarmuka frontend |
| `be` | API, database, dan backend |
| `fullstack` | Satu fitur yang menyentuh frontend dan backend |
| `docs` | Dokumentasi |
| `fix` | Perbaikan bug |
| `chore` | Konfigurasi atau pemeliharaan proyek |

Contoh:

```text
fe/12-form-peralatan
be/13-api-peralatan
fullstack/18-riwayat-pemakaian
docs/4-alur-sertifikasi
fix/25-validasi-nomor-seri
```

Branch dibuat per pekerjaan, bukan per anggota dan bukan satu branch besar untuk seluruh frontend/backend.

## Commit

Gunakan format singkat:

```text
<tipe>: <perubahan>
```

Tipe yang digunakan: `feat`, `fix`, `docs`, `test`, `refactor`, dan `chore`.

Contoh:

```text
feat: add equipment form
fix: prevent duplicate serial number
docs: document certification flow
```

## Isi GitHub Issue

Setiap issue minimal berisi:

- Latar belakang atau kebutuhan
- Hasil yang diharapkan
- Kriteria penerimaan
- Area: `FE`, `BE`, `FULLSTACK`, `DOCS`, atau `FIX`
- Penanggung jawab

Gunakan label modul agar pekerjaan mudah dicari, misalnya `auth`, `peralatan`, `pemakaian`, `sertifikasi`, `reminder`, `laporan`, atau `audit-log`.

## Pull Request

PR minimal menjelaskan:

- Perubahan yang dibuat
- Cara memeriksa perubahan
- Screenshot untuk perubahan tampilan
- Issue terkait, misalnya `Closes #12`

PR sebaiknya kecil dan hanya menyelesaikan satu issue. Jika frontend membutuhkan API yang belum tersedia, sepakati kontrak request dan response pada issue sebelum mulai.

## Definition of Done

Pekerjaan dianggap selesai jika:

- Kriteria penerimaan pada issue terpenuhi.
- Perubahan sudah diperiksa sendiri.
- Pemeriksaan atau test yang relevan berhasil.
- Tidak ada data rahasia di source code.
- Dokumentasi diperbarui jika perilaku atau cara penggunaan berubah.
- PR sudah direview dan di-merge ke `main`.

## Pembagian Kerja

Pembagian anggota dicatat melalui assignee di GitHub Issue, bukan ditanam permanen dalam dokumen ini. Dengan begitu, anggota dapat berpindah fitur tanpa mengubah struktur repository.
