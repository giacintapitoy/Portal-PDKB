# Rencana Integrasi PDKB Manguni

Dokumen ini mengarahkan perluasan Portal PDKB menggunakan kebutuhan dan alur dari
[`pdkb-manguni`](https://github.com/giacintapitoy/pdkb-manguni). Integrasi dimulai
setelah frontend saat ini stabil dan kebutuhan telah divalidasi bersama pengguna.

## Prinsip

- Portal PDKB menjadi produk utama dan sumber dokumentasi kebutuhan.
- `pdkb-manguni` menjadi referensi alur inventaris, peminjaman, pengembalian,
  monitoring, dan laporan; source code tidak digabung langsung.
- Setiap domain hanya memiliki satu model data dan satu implementasi aktif.
- Backend dan database dipilih sebelum frontend dihubungkan ke data nyata.

## Keputusan Sebelum Implementasi

1. Inventaris mendukung per unit/nomor seri dan stok melalui `trackingMode`, sesuai
   [kontrak integrasi Peralatan](EQUIPMENT-INTEGRATION.md).
2. Samakan istilah status peralatan, peminjaman, kondisi, divisi, dan kelompok alat.
3. Validasi perbedaan alur PDKB Jaringan dan PDKB Gardu Induk.
4. Sepakati format laporan, data lama, role pengguna, dan target deployment.

## Tahapan

### 1. Stabilkan Frontend

- Pastikan daftar, tambah, detail, pencarian, dan filter peralatan konsisten.
- Pertahankan data contoh sampai kontrak API disetujui.
- Selesaikan pemeriksaan build, responsif, dan aksesibilitas dasar.

### 2. Susun Model Domain

- Petakan tabel inventaris, peminjaman, detail peminjaman, pengguna, dan log aktivitas.
- Tambahkan kebutuhan personel, sertifikasi, inspeksi, reminder, dan audit log.
- Buat rancangan relasi serta kamus data sebelum membuat endpoint.

### 3. Bangun Fondasi Backend

- Autentikasi dan otorisasi server.
- Migrasi database dan seed data pengembangan.
- API peralatan sebagai vertical slice pertama.
- Transaksi database dan audit log untuk perubahan penting.

### 4. Integrasikan Alur Operasional

Urutan implementasi:

1. Peralatan dan inspeksi.
2. Peminjaman/pemakaian dan pengembalian.
3. Personel dan sertifikasi.
4. Reminder.
5. Monitoring Jaringan/Gardu Induk.
6. Laporan dan ekspor.

### 5. Validasi

- Migrasikan sampel data, bukan seluruh data lama sekaligus.
- Jalankan skenario utama dari login sampai laporan.
- Lakukan UAT dengan pengguna PDKB sebelum deployment.

## Pembagian Domain Tim

Pembagian final tetap melalui GitHub Issue, tetapi tiga domain awalnya adalah:

| Domain | Cakupan |
|---|---|
| Peralatan | Inventaris, kondisi, inspeksi, dan riwayat |
| Operasional | Peminjaman/pemakaian, pengembalian, dan monitoring |
| Personel | Sertifikasi, reminder, laporan, dan validasi pengguna |

Kontributor lintas domain menangani kontrak data, konsistensi UI, review, dan integrasi.

## Batas Fase Pertama

Fase pertama selesai ketika alur peralatan memakai database nyata, dilindungi hak
akses, memiliki audit log, dan lulus build serta skenario uji utama. Modul lain tidak
dimulai sebelum vertical slice ini stabil.
