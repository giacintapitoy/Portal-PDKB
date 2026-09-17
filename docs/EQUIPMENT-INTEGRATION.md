# Kontrak Integrasi Peralatan

Dokumen ini menjadi batas antara frontend Portal PDKB dan backend yang akan
mengadopsi alur `pdkb-manguni`. Nama tabel dan framework backend boleh berubah,
tetapi perilaku berikut harus tetap sama.

## Perbedaan Sumber

| Area | Portal PDKB | `pdkb-manguni` | Keputusan integrasi |
|---|---|---|---|
| Identitas | Satu kode dan nomor seri per unit | Satu baris dapat mewakili banyak barang | Gunakan `trackingMode` |
| Kategori | Isolasi, Metal, K3, Pendukung, Inovasi | Divisi dan kelompok alat | Simpan divisi dan kategori |
| Ketersediaan | Status per unit | Dihitung dari jumlah | Backend menjadi sumber status |
| Kondisi | Baik, perlu pemeriksaan, rusak | Jumlah rusak dan perbaikan | Sesuaikan dengan mode pencatatan |
| Penghapusan | Nonaktif | Hapus tersedia di aplikasi lama | Gunakan nonaktif, bukan hapus permanen |

## Model Minimum

Satu entitas `equipment` mendukung dua cara pencatatan:

- `serialized`: satu record mewakili satu unit; nomor seri dapat dicatat.
- `bulk`: satu record mewakili stok barang sejenis; jumlah wajib dicatat.

Field inti:

| Field | Aturan |
|---|---|
| `id` | ID internal, tidak ditampilkan sebagai kode inventaris |
| `inventoryCode` | Unik dan tidak dapat diubah setelah dibuat |
| `trackingMode` | `serialized` atau `bulk` |
| `name` | Wajib |
| `division` | Jaringan, Gardu Induk, atau nilai master yang disetujui |
| `category` | Nilai master, bukan enum permanen di database |
| `serialNumber` | Opsional untuk `serialized`, kosong untuk `bulk` |
| `brand`, `model`, `size` | Opsional; mempertahankan data lama |
| `origin`, `acquiredAt`, `unit`, `location` | Metadata operasional |
| `condition` | `good`, `inspection_required`, `damaged`, atau `repair` |
| `availabilityStatus` | `available`, `in_use`, atau `inspection` |
| `nextInspectionAt` | Tanggal inspeksi berikutnya |
| `quantity` | Objek jumlah; untuk `serialized`, `total` selalu `1` |
| `active` | `false` berarti nonaktif; record tetap disimpan |
| `notes` | Catatan bebas |

`quantity.available` dihitung oleh backend:

```text
available = total - inUse - damaged - repair
```

Nilai negatif ditolak. Frontend tidak boleh menjadi sumber perhitungan stok.

## Endpoint Vertical Slice

```text
GET    /api/v1/equipment
GET    /api/v1/equipment/{id}
POST   /api/v1/equipment
PUT    /api/v1/equipment/{id}
PATCH  /api/v1/equipment/{id}/active
```

Filter daftar:

```text
GET /api/v1/equipment?search=&division=&category=&status=&active=&page=1
```

Response daftar:

```json
{
  "data": [
    {
      "id": 14,
      "inventoryCode": "PDKB-ISO-014",
      "trackingMode": "serialized",
      "name": "Hot Stick 6 Section",
      "division": "Jaringan",
      "category": "Isolasi",
      "serialNumber": "HS6-2021-014",
      "origin": "Pengadaan UPT Manado",
      "acquiredAt": "2021-03-12",
      "condition": "good",
      "availabilityStatus": "available",
      "location": "Gudang A",
      "nextInspectionAt": "2026-10-18",
      "quantity": {
        "total": 1,
        "available": 1,
        "inUse": 0,
        "damaged": 0,
        "repair": 0
      },
      "active": true,
      "notes": "Inspeksi visual sebelum digunakan."
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 1
  }
}
```

Error validasi menggunakan bentuk yang sama untuk seluruh endpoint:

```json
{
  "message": "Data peralatan tidak valid.",
  "errors": {
    "inventoryCode": ["Kode inventaris sudah digunakan."]
  }
}
```

## Aturan Server

- Kode inventaris unik diperiksa database.
- Perubahan jumlah dan transaksi pemakaian memakai transaksi database.
- Status dan jumlah tersedia tidak dipercaya dari input frontend.
- Nonaktif hanya diizinkan jika tidak ada pemakaian aktif.
- Tambah, ubah, dan nonaktif mencatat audit log dalam transaksi yang sama.
- Semua tanggal operasional mengikuti zona waktu yang disepakati sebelum deployment.

## Urutan Implementasi

1. Implementasikan migration/schema dan endpoint daftar.
2. Hubungkan daftar frontend ke `GET /api/v1/equipment`.
3. Implementasikan tambah, ubah, dan nonaktif.
4. Ganti state contoh setelah seluruh operasi lulus pengujian.
5. Baru lanjut ke peminjaman/pemakaian dan pengembalian.
