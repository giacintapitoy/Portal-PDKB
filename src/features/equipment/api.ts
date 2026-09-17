import type { Equipment, EquipmentCondition, EquipmentStatus } from "./data";

type ApiEquipment = {
  active: boolean;
  acquiredAt: string | null;
  availabilityStatus: "available" | "in_use" | "inspection";
  category: string;
  condition: "good" | "inspection_required" | "damaged" | "repair";
  inventoryCode: string;
  location: string;
  name: string;
  nextInspectionAt: string;
  notes: string | null;
  origin: string;
  serialNumber: string | null;
};

const conditions: Record<ApiEquipment["condition"], EquipmentCondition> = {
  good: "Baik",
  inspection_required: "Perlu pemeriksaan",
  damaged: "Rusak",
  repair: "Perlu pemeriksaan",
};

const statuses: Record<ApiEquipment["availabilityStatus"], EquipmentStatus> = {
  available: "Tersedia",
  in_use: "Digunakan",
  inspection: "Inspeksi",
};

export function mapEquipment(item: ApiEquipment): Equipment {
  if (!(item.condition in conditions) || !(item.availabilityStatus in statuses)) {
    throw new Error("Status peralatan dari API tidak dikenali.");
  }

  return {
    active: item.active,
    code: item.inventoryCode,
    name: item.name,
    category: item.category,
    serialNumber: item.serialNumber ?? "-",
    origin: item.origin,
    acquiredAt: item.acquiredAt ?? undefined,
    condition: conditions[item.condition],
    location: item.location,
    status: statuses[item.availabilityStatus],
    nextInspection: item.nextInspectionAt,
    notes: item.notes ?? undefined,
  };
}

export async function fetchEquipment(signal?: AbortSignal): Promise<Equipment[]> {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "/api/v1";
  const response = await fetch(`${apiBaseUrl}/equipment`, { signal });

  if (!response.ok) {
    throw new Error(`API peralatan merespons ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray(payload.data)) {
    throw new Error("Format response API peralatan tidak valid.");
  }

  return (payload.data as ApiEquipment[]).map(mapEquipment);
}
