export type PersonStatus = "Aktif" | "Cuti" | "Nonaktif";

export type Person = {
  id: number;
  employeeId: string;
  name: string;
  team: string;
  position: string;
  status: PersonStatus;
};

export type PersonInput = Omit<Person, "id"> & { id?: number };

export type PeopleFilters = {
  search: string;
  team: string;
  status: string;
  page: number;
};

export type PeoplePageResult = {
  data: Person[];
  teams: string[];
  total: number;
  currentPage: number;
  lastPage: number;
};

type ApiPerson = Omit<Person, "status"> & {
  status: "active" | "leave" | "inactive";
};

const statusFromApi: Record<ApiPerson["status"], PersonStatus> = {
  active: "Aktif",
  leave: "Cuti",
  inactive: "Nonaktif",
};

const statusToApi: Record<PersonStatus, ApiPerson["status"]> = {
  Aktif: "active",
  Cuti: "leave",
  Nonaktif: "inactive",
};

function mapPerson(person: ApiPerson): Person {
  if (!(person.status in statusFromApi)) {
    throw new Error("Status personel dari API tidak dikenali.");
  }

  return { ...person, status: statusFromApi[person.status] };
}

function apiBaseUrl(): string {
  return import.meta.env.VITE_API_URL ?? "/api/v1";
}

export async function fetchPeople(filters: PeopleFilters, signal?: AbortSignal): Promise<PeoplePageResult> {
  const params = new URLSearchParams({ page: String(filters.page), perPage: "6" });
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.team && filters.team !== "Semua") params.set("team", filters.team);
  if (filters.status && filters.status !== "Semua") params.set("status", statusToApi[filters.status as PersonStatus]);

  const response = await fetch(`${apiBaseUrl()}/personnel?${params}`, { signal, headers: { Accept: "application/json" } });
  const payload: unknown = await response.json();
  if (!response.ok) throw apiError(payload, "Data personel gagal dimuat.");
  if (!isRecord(payload) || !Array.isArray(payload.data) || !isRecord(payload.meta)) {
    throw new Error("Format response API personel tidak valid.");
  }

  return {
    data: (payload.data as ApiPerson[]).map(mapPerson),
    teams: Array.isArray(payload.teams) ? payload.teams.filter((team): team is string => typeof team === "string") : [],
    total: numberValue(payload.meta.total),
    currentPage: numberValue(payload.meta.current_page),
    lastPage: numberValue(payload.meta.last_page),
  };
}

export async function savePerson(person: PersonInput): Promise<Person> {
  const method = person.id ? "PUT" : "POST";
  const path = person.id ? `/personnel/${person.id}` : "/personnel";
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      employeeId: person.employeeId,
      name: person.name,
      team: person.team,
      position: person.position,
      status: statusToApi[person.status],
    }),
  });
  const payload: unknown = await response.json();
  if (!response.ok) throw apiError(payload, "Data personel gagal disimpan.");
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new Error("Format response API personel tidak valid.");
  }

  return mapPerson(payload.data as ApiPerson);
}

function apiError(payload: unknown, fallback: string): Error {
  if (isRecord(payload) && isRecord(payload.errors)) {
    const firstError = Object.values(payload.errors).flat().find((message): message is string => typeof message === "string");
    if (firstError) return new Error(firstError);
  }

  if (isRecord(payload) && typeof payload.message === "string") return new Error(payload.message);
  return new Error(fallback);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function numberValue(value: unknown): number {
  return typeof value === "number" ? value : Number(value) || 0;
}