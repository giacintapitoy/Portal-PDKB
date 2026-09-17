# Strategi Pengujian

Dokumen ini menetapkan jenis pengujian, tool, dan cakupan pengujian Portal PDKB berdasarkan [PRD](../PRD-PDKB-UPT-Manado.md). Tool backend menyesuaikan teknologi yang dipilih nanti.

## Status Saat Ini

- Pemeriksaan yang berjalan hanya `npm run build` (TypeScript dan build Vite).
- `filterEquipment` memiliki `console.assert` pada mode development sebagai pengganti sementara unit test.
- Test runner, linter, dan CI belum dipasang.

## Prioritas

| Prioritas | Jenis pengujian |
|---|---|
| Wajib | Unit test, API test, black box, UAT, SUS |
| Nilai tambah | Component test, integration test, E2E, pengujian RBAC dan keamanan |
| Opsional | Load test, accessibility, compatibility lintas browser |

## Pengujian Fungsional

| Jenis | Tool | Cakupan |
|---|---|---|
| Unit test | Vitest (frontend); test runner bawaan bahasa backend | Fungsi murni: `filterEquipment`, `formatDate`, perhitungan status kedaluwarsa, penentuan periode reminder 90/60/30 hari, validasi kode inventaris |
| Component test | React Testing Library + Vitest | Form tambah peralatan menolak kode duplikat, filter dapat direset, dialog detail dapat dibuka dan ditutup |
| Integration test | Test client framework backend dengan database test terpisah | Pencegahan pemakaian aktif ganda, riwayat sertifikat lama tetap tersimpan, audit log tercatat, penyimpanan gagal tidak menghasilkan data setengah jadi |
| API test | Postman, dijalankan otomatis dengan Newman | Status code, struktur response, validasi input, dan hak akses setiap peran pada setiap endpoint |
| E2E test | Playwright | Alur utama PRD Bagian 8 dari login sampai ekspor laporan |
| Black box | Manual dengan tabel skenario | Equivalence partitioning dan boundary value analysis |

### Contoh Boundary Value: Reminder Sertifikat

Status dihitung dari tanggal kedaluwarsa terhadap tanggal hari ini (zona waktu Asia/Jakarta).

| Sisa hari | Hasil yang diharapkan |
|---:|---|
| 91 | Aktif, belum masuk reminder |
| 90 | Masuk reminder 90 hari |
| 89 | Masuk reminder 90 hari |
| 60 | Masuk reminder 60 hari |
| 31 | Masuk reminder 60 hari |
| 30 | Masuk reminder 30 hari |
| 0 | Masuk reminder 30 hari, berakhir hari ini |
| -1 | Kedaluwarsa |

Batas periode mengikuti konfigurasi administrator; tabel di atas memakai nilai awal PRD.

### Matriks Hak Akses

API test dan integration test memeriksa setiap kombinasi peran dan tindakan. Tindakan yang tidak diizinkan harus ditolak server (`403`), bukan hanya disembunyikan di antarmuka.

| Tindakan | Administrator | Operator | Supervisor | Viewer |
|---|:---:|:---:|:---:|:---:|
| Kelola pengguna | Ya | Tidak | Tidak | Tidak |
| Tambah/ubah peralatan | Ya | Ya | Tidak | Tidak |
| Catat pemakaian | Ya | Ya | Tidak | Tidak |
| Kelola sertifikasi | Ya | Ya | Tidak | Tidak |
| Lihat laporan | Ya | Ya | Ya | Ya |
| Lihat audit log | Ya | Tidak | Menunggu keputusan | Tidak |

Matriks ini mengikuti PRD Bagian 5 dan diperbarui setelah hak akses final dikonfirmasi PLN.

## Pengujian Nonfungsional

| Jenis | Tool | Dasar kebutuhan |
|---|---|---|
| Keamanan | OWASP ZAP, pengujian matriks hak akses | Otorisasi server, hashing kata sandi, validasi unggahan (PRD 11) |
| Kinerja | k6 atau JMeter | Pagination dan pencarian pada volume data PLN (PRD 11) |
| Accessibility | axe DevTools, Lighthouse | Nama aksesibel, fokus keyboard, kontras |
| Responsif dan kompatibilitas | Playwright dengan viewport 1440 px dan 390 px | [Dokumentasi development](DEVELOPMENT.md); browser target ditentukan bersama TI PLN |
| Backup dan pemulihan | Skrip dan prosedur uji | Kriteria penerimaan MVP nomor 8 |
| Validasi migrasi data | Skrip pembanding jumlah dan isi data Excel terhadap database | Risiko data lama tidak konsisten (PRD 16) |

## Pengujian dengan Pengguna

- **User Acceptance Test (UAT):** skenario disusun dari kriteria penerimaan PRD Bagian 12 dan disetujui perwakilan PLN.
- **System Usability Scale (SUS):** kuesioner 10 butir untuk petugas PDKB setelah UAT. Skor dicatat sebagai ukuran kemudahan penggunaan.

Setiap skenario UAT mencatat langkah, hasil yang diharapkan, hasil aktual, status, dan catatan temuan.

## Pembagian Tanggung Jawab

| Area | Pengujian |
|---|---|
| Backend | Integration test, API test, keamanan, kinerja |
| Frontend | Component test, E2E, accessibility, responsif, SUS |
| Data dan laporan | Unit test logika reminder dan laporan, validasi migrasi, backup dan pemulihan |

Black box dan UAT dikerjakan bersama. Penanggung jawab dicatat melalui assignee pada GitHub Issue.

## Otomasi

Setelah tool dipasang, GitHub Actions menjalankan pemeriksaan berikut pada setiap Pull Request:

1. `npm run build`
2. Lint (ESLint)
3. Unit dan component test
4. API test melalui Newman
5. E2E test Playwright

Pull Request hanya di-merge jika seluruh pemeriksaan berhasil, sesuai Definition of Done pada [Panduan Kontribusi](../CONTRIBUTING.md).
