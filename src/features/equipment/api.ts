import type { Equipment, EquipmentCondition, EquipmentStatus } from "./data";

type ApiEquipment = {
  id: number;
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
    id: item.id,
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

const conditionsToApi: Record<EquipmentCondition, ApiEquipment["condition"]> = {
  Baik: "good",
  "Perlu pemeriksaan": "inspection_required",
  Rusak: "damaged",
};

const statusesToApi: Record<EquipmentStatus, ApiEquipment["availabilityStatus"]> = {
  Tersedia: "available",
  Digunakan: "in_use",
  Inspeksi: "inspection",
};

async function requestEquipment(path: string, method: "POST" | "PUT", item: Equipment): Promise<Equipment> {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "/api/v1";
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      inventoryCode: item.code,
      name: item.name,
      category: item.category,
      serialNumber: item.serialNumber === "-" ? null : item.serialNumber,
      origin: item.origin,
      acquiredAt: item.acquiredAt ?? null,
      condition: conditionsToApi[item.condition],
      location: item.location,
      availabilityStatus: statusesToApi[item.status],
      nextInspectionAt: item.nextInspection,
      active: item.active,
      notes: item.notes ?? null,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    const errors = payload?.errors && Object.values(payload.errors).flat();
    throw new Error(Array.isArray(errors) && errors.length ? String(errors[0]) : "Peralatan gagal disimpan.");
  }

  return mapEquipment(payload.data as ApiEquipment);
}

export function saveEquipment(item: Equipment): Promise<Equipment> {
  return requestEquipment(item.id ? `/equipment/${item.id}` : "/equipment", item.id ? "PUT" : "POST", item);
}
