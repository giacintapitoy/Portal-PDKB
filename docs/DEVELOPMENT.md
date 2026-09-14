# Dokumentasi Development

## Status

Branch pertama membangun fondasi frontend untuk memvalidasi struktur informasi PRD. Seluruh angka dan nama pada aplikasi masih berupa data contoh. Belum ada koneksi database, autentikasi nyata, atau API.

## Arah Desain

Portal ditujukan untuk penggunaan operasional internal. Antarmuka menggunakan Fluent UI dengan karakter enterprise yang tenang, aksesibel, dan cukup padat untuk pekerjaan harian.

- Warna aksen: teal gelap
- Tema: terang
- Radius komponen: 12 px, tombol mengikuti Fluent UI
- Motion: hanya feedback hover, active, serta transisi navigasi mobile
- Font: Segoe UI Variable dengan fallback system font

## Struktur

```text
src/
  App.tsx       shell, navigasi, dan tampilan fitur awal
  main.tsx      entry point dan Fluent UI provider
  styles.css    token visual dan layout responsif
```

Komponen baru dipisahkan dari `App.tsx` ketika fitur sudah memiliki alur dan data nyata. Pemisahan prematur dihindari agar perubahan hasil validasi PRD tetap murah.

## Cakupan Implementasi Awal

| Area PRD | Status |
|---|---|
| Shell dan navigasi | Tersedia |
| Dashboard ringkasan | UI dengan data contoh |
| Daftar dan filter peralatan | UI dengan data contoh |
| Daftar sertifikasi | UI dengan data contoh |
| Reminder masa berlaku | UI dengan data contoh |
| Pemakaian peralatan | Menunggu validasi alur |
| Laporan | Menunggu contoh format PLN |
| Autentikasi dan hak akses | Belum dimulai |
| API, database, dan audit log | Belum dimulai |

## Urutan Pengerjaan yang Disarankan

1. Validasi status peralatan, format nomor inventaris, dan alur pemakaian.
2. Tentukan backend, database, dan lingkungan deployment bersama tim.
3. Bangun autentikasi dan matriks hak akses.
4. Bangun vertical slice peralatan dari database sampai antarmuka.
5. Lanjutkan sertifikasi, reminder, pemakaian, laporan, dan audit log.

## Pemeriksaan

Jalankan sebelum membuat Pull Request:

```bash
npm run build
```

Perubahan tampilan diperiksa minimal pada lebar desktop 1440 px dan mobile 390 px. PR perubahan visual menyertakan screenshot.
