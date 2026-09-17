# Dokumentasi Development

## Status

Branch pertama membangun fondasi frontend untuk memvalidasi struktur informasi PRD. Seluruh angka dan nama pada aplikasi masih berupa data contoh. Belum ada koneksi database, autentikasi nyata, atau API.

## Arah Desain

Portal ditujukan untuk penggunaan operasional internal. Antarmuka menggunakan Fluent UI dan mengikuti `DESIGN_SYSTEM_SOFT_BLUE_DASHBOARD.md` sebagai sumber visual utama.

- Warna utama: Soft Blue `#1694F5`
- Surface: putih dan biru sangat muda
- Tema: terang
- Radius kartu: 12-14 px
- Motion: hanya feedback hover, active, serta transisi navigasi mobile
- Font: Inter yang disimpan sebagai dependency lokal
- Ikon: Lucide outline, stroke 1.75 px
- Sidebar: dapat dibuka dan ditutup pada desktop, serta menjadi drawer pada mobile
- Brand: logo PLN transparan dari aset yang diberikan pemilik proyek
- Karakter Apple digunakan sebagai referensi kejernihan hierarchy, ketegasan kontras, dan kenyamanan kontrol. Bukan peniruan komponen native Apple atau glass effect.
- Kontrol pencarian memakai label tetap, ikon yang menyatu, tombol hapus kontekstual, dan focus ring biru yang jelas.

## Struktur

```text
src/
  App.tsx       shell, navigasi, dashboard, dan tampilan fitur awal
  features/
    equipment/  halaman, tipe data, filter, dan data contoh Peralatan
  main.tsx      entry point dan Fluent UI provider
  styles.css    token visual dan layout responsif
```

Komponen baru dipisahkan dari `App.tsx` ketika fitur sudah memiliki alur dan data nyata. Pemisahan prematur dihindari agar perubahan hasil validasi PRD tetap murah.

## Cakupan Implementasi Awal

| Area PRD | Status |
|---|---|
| Shell dan navigasi | Tersedia |
| Dashboard ringkasan | UI dengan data contoh |
| Daftar, filter, tambah, dan detail peralatan | UI interaktif dengan data sesi |
| Daftar sertifikasi | UI dengan data contoh |
| Reminder masa berlaku | UI dengan data contoh |
| Pemakaian peralatan | Menunggu validasi alur |
| Laporan | Menunggu contoh format PLN |
| Autentikasi dan hak akses | Belum dimulai |
| API, database, dan audit log | Belum dimulai |

## Urutan Pengerjaan yang Disarankan

1. Validasi status peralatan, format nomor inventaris, dan form modul Peralatan yang sudah dibuat.
2. Tentukan backend, database, dan lingkungan deployment bersama tim.
3. Bangun autentikasi dan matriks hak akses.
4. Sambungkan modul Peralatan ke API, lalu tambahkan ubah, nonaktifkan, dan riwayat nyata.
5. Lanjutkan sertifikasi, reminder, pemakaian, laporan, dan audit log.

Dokumentasi cakupan, field, validasi, dan batasan modul tersedia di [Modul Peralatan](features/EQUIPMENT.md).

## Pemeriksaan

Jalankan sebelum membuat Pull Request:

```bash
npm run build
```

Perubahan tampilan diperiksa minimal pada lebar desktop 1440 px dan mobile 390 px. PR perubahan visual menyertakan screenshot.

Jenis pengujian, tool, dan cakupannya tersedia di [Strategi Pengujian](TESTING.md).
