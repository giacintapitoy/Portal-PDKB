# Roadmap Branch

Branch dibuat dari `main` hanya ketika issue sudah memiliki penanggung jawab. Jangan membuat seluruh branch sekaligus karena branch kosong akan tertinggal dari `main` sebelum dikerjakan.

| Urutan | Pekerjaan | Branch saat mulai | Ketergantungan |
|---|---|---|---|
| 1 | Dashboard shell | `fe/1-dashboard-shell` | Sedang menunggu review |
| 2 | Autentikasi dan hak akses | `fullstack/<issue>-auth-rbac` | Keputusan backend |
| 3 | Master data peralatan | `fullstack/<issue>-data-peralatan` | Autentikasi |
| 4 | Riwayat pemakaian | `fullstack/<issue>-riwayat-pemakaian` | Data peralatan dan validasi alur |
| 5 | Personel dan sertifikasi | `fullstack/<issue>-sertifikasi` | Autentikasi |
| 6 | Reminder masa berlaku | `fullstack/<issue>-reminder` | Peralatan dan sertifikasi |
| 7 | Laporan dasar | `fullstack/<issue>-laporan-dasar` | Contoh format laporan PLN |
| 8 | Audit log | `be/<issue>-audit-log` | Seluruh alur perubahan data |
| 9 | Deployment dan backup | `chore/<issue>-deployment` | MVP lulus UAT |

## Jika Frontend dan Backend Dikerjakan Terpisah

Pecah satu pekerjaan menjadi dua issue yang memiliki kontrak data yang sama:

```text
be/<issue>-api-peralatan
fe/<issue>-halaman-peralatan
```

Gunakan `fullstack` jika satu anggota mengerjakan alur dari database sampai antarmuka. Pembagian anggota dicatat melalui assignee pada GitHub Issue.

## Aturan Mulai

1. Buat issue dan tulis kriteria penerimaan.
2. Tentukan penanggung jawab.
3. Ambil nomor issue untuk nama branch.
4. Buat branch dari `main` terbaru.
5. Selesaikan melalui Pull Request, lalu hapus branch setelah merge.
