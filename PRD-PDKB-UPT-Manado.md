# Product Requirements Document (PRD)

## Sistem Informasi PDKB PLN UPT Manado

| Informasi | Keterangan |
|---|---|
| Status dokumen | Draft development — dapat berubah berdasarkan hasil validasi dan uji coba |
| Versi | 0.1 |
| Tanggal | 14 September 2026 |
| Pemilik kebutuhan | PLN UPT Manado — Bagian PDKB |
| Mitra pengembang | Universitas Sam Ratulangi (UNSRAT) |

## 1. Ringkasan

Sistem Informasi PDKB adalah aplikasi berbasis web untuk memusatkan pengelolaan data peralatan, riwayat pemakaian, sertifikasi personel, reminder masa berlaku, dan pelaporan dasar pada Bagian PDKB PLN UPT Manado.

Dokumen ini menjadi acuan awal selama development, bukan spesifikasi final. Detail kebutuhan dapat diperbarui setelah wawancara pengguna, pemeriksaan data lama, demo, dan user acceptance test (UAT). Setiap perubahan yang memengaruhi scope, jadwal, struktur data, atau alur utama harus dicatat pada bagian riwayat perubahan.

## 2. Latar Belakang

Saat ini data PDKB masih dikelola secara manual dan tersebar. Kondisi tersebut menyebabkan:

- Data peralatan berpotensi tidak sesuai dengan kondisi aktual.
- Riwayat asal-usul, penggunaan, kondisi, dan masa berlaku peralatan sulit ditelusuri.
- Format laporan belum seragam.
- Data sertifikasi dan kompetensi personel belum terintegrasi.
- Belum tersedia reminder masa berlaku peralatan dan sertifikat.
- Informasi SDM, pencapaian, regulasi, SOP, dan dokumen pendukung belum terpusat.

## 3. Tujuan Produk

1. Menyediakan satu sumber data PDKB yang terstruktur dan mudah ditelusuri.
2. Memudahkan pemantauan kondisi, ketersediaan, pemakaian, dan masa berlaku peralatan.
3. Memudahkan pemantauan sertifikasi dan masa berlaku kompetensi personel.
4. Mengurangi keterlambatan perpanjangan melalui reminder otomatis di dalam aplikasi.
5. Menghasilkan laporan dasar dengan format yang konsisten.
6. Menyediakan jejak perubahan data untuk mendukung akuntabilitas.

## 4. Indikator Keberhasilan Awal

Target berikut harus divalidasi bersama pihak PLN sebelum UAT:

- Seluruh peralatan aktif yang masuk scope MVP tercatat di dalam sistem.
- Pengguna dapat menemukan data peralatan atau sertifikasi melalui pencarian dan filter.
- Setiap penggunaan atau perubahan kondisi peralatan dapat ditelusuri.
- Sertifikat dan peralatan yang mendekati kedaluwarsa tampil pada daftar reminder.
- Laporan dasar dapat dihasilkan tanpa menyusun ulang data secara manual.
- Pengguna yang ditunjuk PLN dapat menyelesaikan skenario UAT utama.

## 5. Pengguna dan Hak Akses

Hak akses final harus dikonfirmasi selama development.

| Peran | Kewenangan awal |
|---|---|
| Administrator | Mengelola pengguna, master data, seluruh data operasional, dan konfigurasi reminder |
| Petugas/Operator | Menambah dan memperbarui data peralatan, pemakaian, sertifikasi, dan laporan sesuai kewenangan |
| Supervisor/Validator | Memeriksa data, melihat laporan, dan memvalidasi data apabila alur persetujuan diberlakukan |
| Pimpinan/Viewer | Melihat dashboard dan laporan tanpa mengubah data |

## 6. Scope MVP

### 6.1 Autentikasi dan Pengguna

- Login dan logout.
- Pengelolaan akun oleh administrator.
- Pembatasan menu dan tindakan berdasarkan peran.
- Penggantian kata sandi.

### 6.2 Manajemen Peralatan

- Menambah, melihat, mengubah, dan menonaktifkan data peralatan.
- Data minimal: kode/nomor inventaris, nama, kategori, nomor seri, asal-usul, tanggal perolehan jika tersedia, kondisi, status ketersediaan, lokasi, masa berlaku atau tanggal inspeksi berikutnya, dan catatan.
- Kategori awal: Isolasi, Metal, K3, Pendukung, Inovasi, dan kategori lain yang dapat dikelola administrator.
- Pencarian dan filter berdasarkan nama, kategori, nomor seri, kondisi, status, dan masa berlaku.
- Riwayat perubahan kondisi dan status peralatan.
- Lampiran foto atau dokumen jika disetujui pada validasi teknis.

### 6.3 Riwayat Pemakaian Peralatan

- Mencatat peralatan, kegiatan, tanggal mulai dan selesai, lokasi, pengguna atau tim, posisi jam terbang sebelum/sesudah atau durasi pemakaian, kondisi setelah digunakan, dan catatan.
- Menampilkan riwayat pemakaian pada detail peralatan.
- Memperbarui status ketersediaan berdasarkan alur pemakaian yang disepakati.
- Mencegah pencatatan pemakaian aktif ganda untuk peralatan yang sama, kecuali diizinkan oleh aturan bisnis PLN.

### 6.4 Sertifikasi dan Kompetensi

- Mengelola data personel dasar: nomor identitas pegawai, nama, unit/tim, dan jabatan atau posisi.
- Mencatat nama sertifikat/diklat, nomor sertifikat, lembaga penerbit, tanggal terbit, tanggal kedaluwarsa, status, dan lampiran.
- Pencarian dan filter berdasarkan personel, jenis sertifikat, unit/tim, status, dan masa berlaku.
- Mencatat rencana sertifikasi atau diklat berikutnya.

### 6.5 Reminder

- Menampilkan reminder peralatan dan sertifikat yang akan kedaluwarsa pada dashboard.
- Periode awal reminder: 90, 60, dan 30 hari sebelum tanggal kedaluwarsa; nilainya dapat dikonfigurasi administrator.
- Menandai data yang sudah kedaluwarsa.
- Kanal MVP adalah notifikasi di dalam aplikasi. Email atau WhatsApp hanya ditambahkan setelah kebutuhan, izin, dan infrastrukturnya dikonfirmasi.

### 6.6 Dashboard dan Laporan Dasar

- Ringkasan jumlah peralatan berdasarkan kategori, kondisi, dan status.
- Ringkasan sertifikat aktif, segera kedaluwarsa, dan kedaluwarsa.
- Daftar pemakaian per rentang tanggal.
- Filter laporan berdasarkan rentang tanggal dan kategori yang relevan.
- Ekspor laporan ke format yang disepakati, minimal CSV atau format cetak dari browser.

### 6.7 Audit Log

- Mencatat pengguna, waktu, jenis tindakan, dan data utama yang ditambah, diubah, atau dinonaktifkan.
- Audit log hanya dapat dilihat oleh peran yang ditentukan.

## 7. Di Luar Scope MVP

Fitur berikut dicatat untuk fase lanjutan dan tidak menjadi syarat selesainya MVP:

- CV lengkap, pengalaman, dan jam terbang per posisi kerja personel.
- Portal regulasi, SOP, prosedur, dan instruksi kerja.
- Dashboard infografis dan target kinerja lanjutan.
- Alur persetujuan berjenjang yang kompleks.
- Integrasi dengan sistem internal PLN lainnya.
- Notifikasi WhatsApp, SMS, atau email eksternal.
- Aplikasi mobile native.
- QR code atau barcode peralatan.

## 8. Alur Utama

### 8.1 Pendataan Peralatan

1. Operator membuka formulir peralatan.
2. Operator mengisi data wajib dan menyimpan.
3. Sistem memvalidasi kode inventaris/nomor seri sesuai aturan yang disepakati.
4. Peralatan muncul dalam daftar dan dapat dicari.
5. Perubahan berikutnya tercatat pada riwayat atau audit log.

### 8.2 Pemakaian Peralatan

1. Operator memilih peralatan yang tersedia.
2. Operator mencatat kegiatan dan waktu mulai pemakaian.
3. Sistem mengubah status peralatan sesuai aturan bisnis.
4. Setelah kegiatan selesai, operator mencatat waktu selesai, durasi/jam terbang, serta kondisi.
5. Sistem menyimpan riwayat dan memperbarui status peralatan.

### 8.3 Sertifikasi dan Reminder

1. Operator memilih personel dan mencatat data sertifikat.
2. Sistem menghitung status berdasarkan tanggal kedaluwarsa.
3. Sertifikat yang memasuki periode reminder muncul pada dashboard.
4. Setelah sertifikat diperpanjang, operator menambahkan data terbaru tanpa menghilangkan riwayat lama.

### 8.4 Laporan

1. Pengguna memilih jenis laporan dan filter.
2. Sistem menampilkan data sesuai hak akses.
3. Pengguna mencetak atau mengekspor hasil.

## 9. Aturan Bisnis Awal

- Data historis tidak dihapus permanen melalui antarmuka; data dinonaktifkan agar riwayat tetap tersedia.
- Nomor inventaris harus unik apabila memang digunakan sebagai identitas resmi PLN.
- Nomor sertifikat dan aturan keunikannya akan mengikuti hasil validasi data nyata.
- Status kedaluwarsa dihitung dari tanggal pada data, bukan diisi manual.
- Riwayat sertifikat lama tetap disimpan setelah perpanjangan.
- Hanya pengguna berwenang yang dapat mengubah master data dan data tervalidasi.
- Zona waktu sistem menggunakan Asia/Jakarta kecuali ditentukan lain oleh PLN.

## 10. Data Utama

| Entitas | Isi utama |
|---|---|
| Pengguna | Akun, nama, peran, status |
| Personel | Identitas pegawai, nama, unit/tim, posisi, status |
| Peralatan | Identitas, kategori, seri, asal-usul, kondisi, status, lokasi, masa berlaku |
| Riwayat peralatan | Perubahan kondisi, status, lokasi, waktu, pengguna pencatat |
| Pemakaian | Peralatan, kegiatan, personel/tim, waktu, durasi/jam terbang, kondisi akhir |
| Sertifikasi | Personel, jenis, nomor, penerbit, tanggal terbit/kedaluwarsa, lampiran |
| Rencana diklat | Personel, kegiatan, rencana waktu, status |
| Audit log | Pengguna, tindakan, waktu, objek, ringkasan perubahan |

## 11. Kebutuhan Nonfungsional

### Keamanan

- Kata sandi disimpan menggunakan mekanisme hashing yang aman.
- Seluruh halaman internal hanya dapat diakses setelah autentikasi.
- Otorisasi diterapkan di sisi server, bukan hanya menyembunyikan menu.
- Validasi file, ukuran, dan tipe dilakukan untuk setiap unggahan.
- Konfigurasi rahasia tidak disimpan di source code.
- Kebijakan keamanan tambahan mengikuti arahan TI PLN.

### Keandalan dan Data

- Sistem menyediakan mekanisme backup dan pemulihan yang diuji sebelum produksi.
- Kegagalan penyimpanan tidak boleh menghasilkan data setengah jadi.
- Migrasi data lama dilakukan menggunakan template yang disetujui dan hasilnya diverifikasi.

### Kinerja

- Halaman daftar menggunakan pagination.
- Pencarian dan filter harus tetap layak digunakan pada volume data aktual; target angka ditentukan setelah memperoleh estimasi data PLN.

### Kemudahan Penggunaan

- Antarmuka menggunakan Bahasa Indonesia.
- Formulir menandai kolom wajib dan menampilkan pesan kesalahan yang jelas.
- Tampilan dapat digunakan pada komputer dan perangkat tablet/ponsel melalui browser responsif.

### Kompatibilitas dan Deployment

- Browser dan lingkungan server target ditentukan bersama tim TI PLN.
- Lokasi hosting, domain, SSL, jaringan internal, serta mekanisme pemeliharaan harus disepakati sebelum deployment.

## 12. Kriteria Penerimaan MVP

MVP dapat diajukan untuk UAT apabila:

1. Pengguna dapat login dan hanya mengakses tindakan sesuai perannya.
2. Operator dapat mengelola dan mencari data peralatan.
3. Operator dapat mencatat pemakaian serta melihat riwayat peralatan.
4. Operator dapat mengelola personel dasar dan sertifikasinya.
5. Sistem menampilkan reminder berdasarkan tanggal kedaluwarsa secara benar.
6. Pengguna dapat memfilter dan mengekspor/mencetak laporan dasar.
7. Perubahan penting tercatat pada audit log.
8. Skenario backup dan pemulihan berhasil diuji.
9. Tidak terdapat defect kritis yang menyebabkan kehilangan data, kebocoran hak akses, atau alur utama tidak dapat digunakan.
10. Perwakilan PLN menyetujui hasil UAT atau mencatat perbaikan yang harus diselesaikan.

## 13. Tahapan Development

1. **Discovery dan validasi:** wawancara pengguna, mengumpulkan contoh data/laporan, menyepakati peran dan alur kerja.
2. **Desain awal:** wireframe, struktur data, dan prototipe alur utama.
3. **Pembangunan MVP:** autentikasi, peralatan, pemakaian, sertifikasi, reminder, laporan, dan audit log.
4. **Pengujian internal:** pengujian fungsi, hak akses, validasi data, serta backup/pemulihan.
5. **Demo dan UAT:** diuji menggunakan skenario serta sampel data PLN.
6. **Perbaikan dan deployment:** menyelesaikan temuan prioritas, menyiapkan server, dokumentasi, serta pelatihan.

Jadwal rinci ditentukan setelah discovery karena jumlah pengguna, volume data, format laporan, teknologi, dan infrastruktur belum dikonfirmasi.

## 14. Pengelolaan Perubahan Requirement

Selama tahap development, perubahan diperbolehkan dengan proses ringan berikut:

1. Perubahan dicatat dengan alasan dan pihak pengusul.
2. Tim menilai dampaknya terhadap alur, data, keamanan, jadwal, dan scope MVP.
3. Perubahan diklasifikasikan menjadi:
   - **Klarifikasi:** tidak mengubah scope atau jadwal secara berarti; dapat langsung dimasukkan.
   - **Perubahan MVP:** diperlukan agar alur utama berfungsi; harus disetujui penanggung jawab PLN dan tim pengembang.
   - **Fase lanjutan:** bermanfaat tetapi tidak menghalangi penggunaan MVP; dimasukkan ke backlog.
4. Keputusan dan versi PRD diperbarui sebelum implementasi perubahan besar.

## 15. Pertanyaan Terbuka

- Siapa saja pengguna nyata dan siapa penanggung jawab persetujuan requirement?
- Apakah PDKB GI dan PDKB Jaringan memiliki alur serta format data yang berbeda?
- Apa definisi resmi status dan kondisi peralatan?
- Bagaimana alur pemakaian, pengembalian, inspeksi, perbaikan, dan penghapusan peralatan?
- Bagaimana perhitungan jam terbang peralatan dan personel?
- Berapa jumlah peralatan, personel, sertifikat, laporan, dan pengguna aktif?
- Apakah data lama tersedia dalam Excel dan seberapa konsisten formatnya?
- Apa contoh format laporan resmi yang wajib dipertahankan?
- Apakah data perlu melalui validasi supervisor sebelum dianggap resmi?
- Kanal reminder apa yang benar-benar diperlukan?
- Di mana aplikasi dan file lampiran akan disimpan?
- Apa kebijakan PLN mengenai keamanan, retensi data, backup, dan akses jaringan?

## 16. Risiko Awal

| Risiko | Mitigasi awal |
|---|---|
| Scope berkembang tanpa batas | Tetapkan MVP dan pindahkan kebutuhan tambahan ke backlog |
| Data lama tidak konsisten | Gunakan template migrasi dan validasi sampel sebelum impor penuh |
| Alur aplikasi tidak sesuai pekerjaan lapangan | Demo singkat dan rutin kepada pengguna nyata |
| Pengingat tidak ditindaklanjuti | Tentukan pemilik tindak lanjut, bukan hanya menampilkan notifikasi |
| Hak akses tidak tepat | Validasi matriks peran bersama PLN dan uji setiap peran |
| Kehilangan atau kebocoran data | Terapkan backup, audit log, otorisasi server, dan kebijakan TI PLN |

## 17. Riwayat Perubahan

| Versi | Tanggal | Perubahan | Status/Persetujuan |
|---|---|---|---|
| 0.1 | 14 September 2026 | Draft awal berdasarkan dokumen proyek kerja sama UNSRAT dan PLN UPT Manado | Menunggu validasi |

## 18. Persetujuan Awal

Dokumen ini disepakati sebagai arah awal development dan tetap dapat berubah melalui proses pada Bagian 14.

| Peran | Nama | Tanggal | Catatan |
|---|---|---|---|
| Penanggung jawab PLN |  |  |  |
| Perwakilan pengguna PDKB |  |  |  |
| Penanggung jawab UNSRAT |  |  |  |
| Tim pengembang |  |  |  |
