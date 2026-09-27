import { useMemo, useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Select,
} from "@fluentui/react-components";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, X } from "lucide-react";

type PersonStatus = "Aktif" | "Cuti" | "Nonaktif";

type Person = {
  employeeId: string;
  name: string;
  team: string;
  position: string;
  status: PersonStatus;
};

const storageKey = "pdkb-people";
const pageSize = 6;

const samplePeople: Person[] = [
  { employeeId: "PG-001", name: "Admin PDKB", team: "Manajemen PDKB", position: "Administrator", status: "Aktif" },
  { employeeId: "PG-002", name: "Rian Tumbel", team: "PDKB GI", position: "Pelaksana PDKB TM", status: "Aktif" },
  { employeeId: "PG-003", name: "Mario Rondonuwu", team: "PDKB Jaringan", position: "Pelaksana PDKB Jaringan", status: "Aktif" },
  { employeeId: "PG-004", name: "Yolanda Waworuntu", team: "PDKB GI", position: "Pengawas Pekerjaan", status: "Cuti" },
];

function loadPeople(): Person[] {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return samplePeople;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as Person[] : samplePeople;
  } catch {
    return samplePeople;
  }
}

function statusColor(status: PersonStatus) {
  if (status === "Aktif") return "success" as const;
  if (status === "Cuti") return "warning" as const;
  return "informative" as const;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>(loadPeople);
  const [query, setQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [formPerson, setFormPerson] = useState<Person | null>();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(0);

  const teams = useMemo(() => [...new Set(people.map((person) => person.team))].sort(), [people]);
  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return people.filter((person) => {
      const matchesQuery = [person.employeeId, person.name, person.team, person.position]
        .some((value) => value.toLocaleLowerCase("id-ID").includes(normalizedQuery));
      return matchesQuery
        && (teamFilter === "Semua" || person.team === teamFilter)
        && (statusFilter === "Semua" || person.status === statusFilter);
    });
  }, [people, query, statusFilter, teamFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredPeople.length / pageSize));
  const visiblePeople = filteredPeople.slice(page * pageSize, (page + 1) * pageSize);

  const updatePeople = (nextPeople: Person[]) => {
    setPeople(nextPeople);
    localStorage.setItem(storageKey, JSON.stringify(nextPeople));
  };

  const savePerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const person: Person = {
      employeeId: String(values.get("employeeId") ?? "").trim(),
      name: String(values.get("name") ?? "").trim(),
      team: String(values.get("team") ?? "").trim(),
      position: String(values.get("position") ?? "").trim(),
      status: String(values.get("status") ?? "Aktif") as PersonStatus,
    };
    const duplicateId = people.some((current) =>
      current.employeeId.toLocaleLowerCase("id-ID") === person.employeeId.toLocaleLowerCase("id-ID")
      && current.employeeId !== formPerson?.employeeId,
    );

    if (duplicateId) {
      setFormError("Nomor identitas pegawai sudah digunakan.");
      return;
    }

    const nextPeople = formPerson
      ? people.map((current) => current.employeeId === formPerson.employeeId ? person : current)
      : [person, ...people];
    updatePeople(nextPeople);
    setNotice(`Data ${person.name} berhasil ${formPerson ? "diperbarui" : "ditambahkan"}.`);
    setFormError("");
    setFormPerson(undefined);
  };

  const openForm = (person?: Person) => {
    setFormError("");
    setFormPerson(person ?? null);
  };

  return (
    <>
      {notice && <MessageBar intent="success" className="people-notice"><MessageBarBody>{notice}</MessageBarBody></MessageBar>}
      <section className="panel people-management" aria-labelledby="people-list-title">
        <div className="feature-toolbar">
          <div>
            <h2 id="people-list-title">Data personel</h2>
            <p>{filteredPeople.length} dari {people.length} personel ditampilkan</p>
          </div>
          <Button appearance="primary" icon={<Plus size={16} strokeWidth={1.75} />} onClick={() => openForm()}>Tambah personel</Button>
        </div>

        <div className="people-filters" aria-label="Pencarian dan filter personel">
          <div className="search-field">
            <label htmlFor="people-search">Cari personel</label>
            <Input
              id="people-search"
              contentBefore={<Search size={17} strokeWidth={1.75} />}
              contentAfter={query ? <Button className="search-clear" appearance="subtle" size="small" icon={<X size={14} />} aria-label="Hapus pencarian" onClick={() => { setQuery(""); setPage(0); }} /> : undefined}
              placeholder="Nama, nomor identitas, tim, atau jabatan"
              value={query}
              onChange={(_, data) => { setQuery(data.value); setPage(0); }}
            />
          </div>
          <label className="filter-field">
            <span>Unit/tim</span>
            <Select value={teamFilter} onChange={(_, data) => { setTeamFilter(data.value); setPage(0); }}>
              <option value="Semua">Semua unit/tim</option>
              {teams.map((team) => <option key={team} value={team}>{team}</option>)}
            </Select>
          </label>
          <label className="filter-field">
            <span>Status</span>
            <Select value={statusFilter} onChange={(_, data) => { setStatusFilter(data.value); setPage(0); }}>
              <option value="Semua">Semua status</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Nonaktif">Nonaktif</option>
            </Select>
          </label>
        </div>

        {visiblePeople.length ? (
          <div className="table-wrap">
            <table className="people-table">
              <thead><tr><th scope="col">Nomor identitas</th><th scope="col">Nama</th><th scope="col">Unit/tim</th><th scope="col">Jabatan/posisi</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Aksi</span></th></tr></thead>
              <tbody>{visiblePeople.map((person) => (
                <tr key={person.employeeId}>
                  <td>{person.employeeId}</td>
                  <td><strong>{person.name}</strong></td>
                  <td>{person.team}</td>
                  <td>{person.position}</td>
                  <td><Badge color={statusColor(person.status)}>{person.status}</Badge></td>
                  <td className="people-actions">
                    <Button appearance="subtle" icon={<Eye size={15} />} aria-label={`Lihat profil ${person.name}`} onClick={() => setSelectedPerson(person)} />
                    <Button appearance="subtle" icon={<Pencil size={15} />} aria-label={`Ubah data ${person.name}`} onClick={() => openForm(person)} />
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty"><Search size={24} /><h3>Personel tidak ditemukan</h3><p>Ubah kata pencarian atau filter yang dipilih.</p><Button appearance="secondary" onClick={() => { setQuery(""); setTeamFilter("Semua"); setStatusFilter("Semua"); setPage(0); }}>Reset filter</Button></div>
        )}

        <div className="people-pagination">
          <span>Halaman {page + 1} dari {pageCount}</span>
          <div>
            <Button appearance="subtle" icon={<ChevronLeft size={16} />} aria-label="Halaman sebelumnya" disabled={page === 0} onClick={() => setPage((current) => current - 1)} />
            <Button appearance="subtle" icon={<ChevronRight size={16} />} aria-label="Halaman berikutnya" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => current + 1)} />
          </div>
        </div>
      </section>

      <p className="people-data-note">Data contoh dan perubahan saat ini tersimpan hanya di browser ini; sinkronisasi server belum tersedia.</p>

      <Dialog open={formPerson !== undefined} onOpenChange={(_, data) => { if (!data.open) setFormPerson(undefined); }}>
        <DialogSurface className="equipment-dialog">
          <form key={formPerson?.employeeId ?? "new-person"} onSubmit={savePerson}>
            <DialogBody>
              <DialogTitle>{formPerson ? "Ubah personel" : "Tambah personel"}</DialogTitle>
              <DialogContent>
                <p className="dialog-description">Masukkan identitas dan penugasan personel PDKB.</p>
                {formError && <MessageBar intent="error"><MessageBarBody>{formError}</MessageBarBody></MessageBar>}
                <div className="equipment-form">
                  <Field label="Nomor identitas pegawai" required><Input name="employeeId" required defaultValue={formPerson?.employeeId} placeholder="Contoh: PG-005" /></Field>
                  <Field label="Nama lengkap" required><Input name="name" required defaultValue={formPerson?.name} /></Field>
                  <Field label="Unit/tim" required><Input name="team" required defaultValue={formPerson?.team} placeholder="Contoh: PDKB GI" /></Field>
                  <Field label="Jabatan/posisi" required><Input name="position" required defaultValue={formPerson?.position} /></Field>
                  <Field label="Status" required><Select name="status" required defaultValue={formPerson?.status ?? "Aktif"}><option value="Aktif">Aktif</option><option value="Cuti">Cuti</option><option value="Nonaktif">Nonaktif</option></Select></Field>
                </div>
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" type="button" onClick={() => setFormPerson(undefined)}>Batal</Button>
                <Button appearance="primary" type="submit">Simpan personel</Button>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>

      <Dialog open={Boolean(selectedPerson)} onOpenChange={(_, data) => { if (!data.open) setSelectedPerson(null); }}>
        <DialogSurface className="equipment-dialog detail-dialog">
          {selectedPerson && <DialogBody>
            <DialogTitle>Profil personel</DialogTitle>
            <DialogContent>
              <div className="person-detail-heading">
                <span>{selectedPerson.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>
                <div><h2>{selectedPerson.name}</h2><p>{selectedPerson.position}</p></div>
                <Badge color={statusColor(selectedPerson.status)}>{selectedPerson.status}</Badge>
              </div>
              <dl className="equipment-details">
                <div><dt>Nomor identitas pegawai</dt><dd>{selectedPerson.employeeId}</dd></div>
                <div><dt>Unit/tim</dt><dd>{selectedPerson.team}</dd></div>
                <div><dt>Jabatan/posisi</dt><dd>{selectedPerson.position}</dd></div>
                <div><dt>Status kepegawaian</dt><dd>{selectedPerson.status}</dd></div>
              </dl>
              <p className="people-data-note">Data sertifikasi dan rencana diklat dikelola pada menu Sertifikasi.</p>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" icon={<Pencil size={15} />} onClick={() => { openForm(selectedPerson); setSelectedPerson(null); }}>Ubah data</Button>
              <Button appearance="primary" onClick={() => setSelectedPerson(null)}>Tutup</Button>
            </DialogActions>
          </DialogBody>}
        </DialogSurface>
      </Dialog>
    </>
  );
}