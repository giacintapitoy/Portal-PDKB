# Modul Peralatan — Frontend

Dokumen ini mencatat implementasi frontend modul Peralatan berdasarkan PRD. Karena proyek masih dalam tahap development, detail status, validasi, dan alur kerja dapat berubah setelah dikonfirmasi bersama pengguna PLN.

## Cakupan Iterasi

- Daftar peralatan dalam tabel responsif.
- Pencarian berdasarkan nama, kode inventaris, nomor seri, dan lokasi.
- Filter kategori dan status yang dapat digabungkan dengan pencarian.
- Form tambah peralatan dengan validasi bawaan browser.
- Validasi kode inventaris unik pada data sesi aktif.
- Detail identitas, kondisi, jadwal inspeksi, catatan, dan contoh riwayat terbaru.
- Empty state dan notifikasi hasil penambahan data.

## Data yang Dicatat

| Field | Wajib | Catatan |
|---|---:|---|
| Kode inventaris | Ya | Unik pada data sesi aktif |
| Nama peralatan | Ya | Nama yang mudah dikenali petugas |
| Nomor seri | Ya | Aturan format menunggu konfirmasi PLN |
| Kategori | Ya | Isolasi, Metal, K3, Pendukung, atau Inovasi |
| Asal-usul | Ya | Contoh: pengadaan atau transfer unit |
| Tanggal perolehan | Tidak | Menggunakan input tanggal native |
| Kondisi | Ya | Baik, Perlu pemeriksaan, atau Rusak |
| Status | Ya | Tersedia, Digunakan, atau Inspeksi |
| Lokasi | Ya | Lokasi penyimpanan atau tim pengguna |
| Inspeksi berikutnya | Ya | Menggunakan input tanggal native |
| Catatan | Tidak | Informasi teknis tambahan |

## Alur Pengguna

1. Pengguna membuka menu **Peralatan**.
2. Pengguna mencari atau menyaring tabel untuk menemukan data.
3. Tombol **Lihat** membuka detail dan riwayat terbaru.
4. Tombol **Tambah peralatan** membuka formulir.
5. Browser memeriksa field wajib dan aplikasi memeriksa duplikasi kode inventaris.
6. Data baru tampil di urutan teratas dan notifikasi keberhasilan diberikan.

## Perilaku Responsif dan Aksesibilitas

- Desktop menampilkan seluruh kolom penting.
- Mobile mempertahankan nama, kode, status, inspeksi, dan aksi; kolom pendukung tetap tersedia melalui detail.
- Setiap filter dan tombol ikon memiliki nama aksesibel.
- Header tabel menggunakan cakupan kolom dan fokus keyboard mengikuti token desain.
- Preferensi reduced motion dihormati oleh stylesheet global.

## Status Data dan Integrasi

Data saat ini merupakan contoh dan hanya disimpan pada state React. Refresh browser mengembalikan data awal. Kontrak API belum dibuat karena teknologi backend dan aturan bisnis PLN belum ditentukan.

Saat backend tersedia, state lokal pada `EquipmentPage` menjadi titik integrasi untuk operasi daftar dan tambah. Validasi kode inventaris unik wajib ditegakkan kembali pada database agar aman terhadap penambahan bersamaan.

## Belum Termasuk

- Ubah dan nonaktifkan peralatan.
- Unggah lampiran atau dokumen inspeksi.
- Riwayat yang berasal dari audit log nyata.
- Filter kondisi dan rentang masa berlaku.
- Pagination, ekspor, QR code, dan barcode.
- Hak akses operator dan administrator.

Fitur tersebut ditambahkan setelah definisi status, proses inspeksi, format nomor inventaris, hak akses, dan kontrak API dikonfirmasi.

## Pemeriksaan Penerimaan

- Pencarian nomor seri dapat menemukan peralatan yang benar.
- Pencarian, kategori, dan status bekerja bersamaan.
- Filter dapat direset ketika tidak ada hasil.
- Form tidak dapat dikirim jika field wajib kosong.
- Kode inventaris duplikat ditolak dengan pesan yang jelas.
- Data yang berhasil ditambahkan langsung muncul pada tabel.
- Detail dapat dibuka dan ditutup menggunakan keyboard.
- Layout tetap terbaca pada desktop 1440 px dan mobile 390 px.
