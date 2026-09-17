export type EquipmentStatus = "Tersedia" | "Digunakan" | "Inspeksi";
export type EquipmentCondition = "Baik" | "Perlu pemeriksaan" | "Rusak";

export type Equipment = {
  id?: number;
  active: boolean;
  code: string;
  name: string;
  category: string;
  serialNumber: string;
  origin: string;
  acquiredAt?: string;
  condition: EquipmentCondition;
  location: string;
  status: EquipmentStatus;
  nextInspection: string;
  notes?: string;
};

export const initialEquipment: Equipment[] = [
  { active: true, code: "PDKB-ISO-014", name: "Hot Stick 6 Section", category: "Isolasi", serialNumber: "HS6-2021-014", origin: "Pengadaan UPT Manado", acquiredAt: "2021-03-12", condition: "Baik", location: "Gudang A", status: "Tersedia", nextInspection: "2026-10-18", notes: "Inspeksi visual sebelum digunakan." },
  { active: true, code: "PDKB-K3-022", name: "Full Body Harness", category: "K3", serialNumber: "FBH-2023-022", origin: "Pengadaan UPT Manado", acquiredAt: "2023-07-08", condition: "Baik", location: "Tim Jaringan", status: "Digunakan", nextInspection: "2026-09-27" },
  { active: true, code: "PDKB-MTL-008", name: "Hydraulic Crimping Tool", category: "Metal", serialNumber: "HCT-2020-008", origin: "Transfer Unit Suluttenggo", acquiredAt: "2020-11-19", condition: "Perlu pemeriksaan", location: "Ruang Inspeksi", status: "Inspeksi", nextInspection: "2026-09-21", notes: "Tekanan hidrolik perlu diverifikasi." },
  { active: true, code: "PDKB-PND-031", name: "Insulation Tester", category: "Pendukung", serialNumber: "IT-2024-031", origin: "Pengadaan UPT Manado", acquiredAt: "2024-02-15", condition: "Baik", location: "Gudang B", status: "Tersedia", nextInspection: "2026-12-12" },
];

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function filterEquipment(rows: Equipment[], query: string, category: string, status: string) {
  const needle = query.trim().toLocaleLowerCase("id-ID");
  return rows.filter((item) => {
    const text = `${item.name} ${item.code} ${item.serialNumber} ${item.location}`.toLocaleLowerCase("id-ID");
    return (!needle || text.includes(needle))
      && (category === "Semua" || item.category === category)
      && (status === "Semua" || (status === "Nonaktif" ? !item.active : item.active && item.status === status));
  });
}

if (import.meta.env.DEV) {
  console.assert(filterEquipment(initialEquipment, "hs6-2021", "Isolasi", "Tersedia").length === 1, "Filter peralatan harus mencari nomor seri dan menggabungkan filter");
  console.assert(filterEquipment([{ ...initialEquipment[0], active: false }], "", "Semua", "Nonaktif").length === 1, "Filter peralatan harus menampilkan data nonaktif");
}
