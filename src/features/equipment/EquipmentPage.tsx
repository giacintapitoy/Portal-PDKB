import { type Dispatch, type FormEvent, type SetStateAction, useMemo, useState } from "react";
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
  Textarea,
} from "@fluentui/react-components";
import { Eye, Pencil, Plus, Search, X } from "lucide-react";
import { filterEquipment, formatDate, type Equipment, type EquipmentStatus } from "./data";

function StatusBadge({ active, status }: { active: boolean; status: EquipmentStatus }) {
  if (!active) return <Badge appearance="tint">Nonaktif</Badge>;
  const appearance = status === "Tersedia" ? "filled" : "tint";
  const color = status === "Tersedia" ? "success" : status === "Inspeksi" ? "warning" : "informative";
  return <Badge appearance={appearance} color={color}>{status}</Badge>;
}

type EquipmentPageProps = {
  rows: Equipment[];
  setRows: Dispatch<SetStateAction<Equipment[]>>;
};

export default function EquipmentPage({ rows, setRows }: EquipmentPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [formItem, setFormItem] = useState<Equipment | null>();
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredRows = useMemo(
    () => filterEquipment(rows, query, category, status),
    [rows, query, category, status],
  );

  const saveEquipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") ?? "").trim();

    if (!formItem && rows.some((item) => item.code.toLocaleLowerCase("id-ID") === code.toLocaleLowerCase("id-ID"))) {
      setFormError("Kode inventaris sudah digunakan. Masukkan kode yang berbeda.");
      return;
    }

    const item: Equipment = {
      active: formItem?.active ?? true,
      code,
      name: String(form.get("name")),
      category: String(form.get("category")),
      serialNumber: String(form.get("serialNumber")),
      origin: String(form.get("origin")),
      acquiredAt: String(form.get("acquiredAt")) || undefined,
      condition: String(form.get("condition")) as Equipment["condition"],
      location: String(form.get("location")),
      status: String(form.get("status")) as EquipmentStatus,
      nextInspection: String(form.get("nextInspection")),
      notes: String(form.get("notes")) || undefined,
    };

    setRows((current) => formItem ? current.map((row) => row.code === formItem.code ? item : row) : [item, ...current]);
    setNotice(`${item.name} berhasil ${formItem ? "diperbarui" : "ditambahkan"} sebagai data contoh.`);
    setFormError("");
    setFormItem(undefined);
    event.currentTarget.reset();
  };

  return (
    <>
      {notice && <MessageBar intent="success" className="equipment-notice"><MessageBarBody>{notice}</MessageBarBody></MessageBar>}

      <section className="panel equipment-management" aria-labelledby="equipment-list-title">
        <div className="feature-toolbar">
          <div>
            <h2 id="equipment-list-title">Daftar peralatan</h2>
            <p>{filteredRows.length} dari {rows.length} peralatan ditampilkan</p>
          </div>
          <Button appearance="primary" icon={<Plus size={16} strokeWidth={1.75} />} onClick={() => setFormItem(null)}>Tambah peralatan</Button>
        </div>

        <section className="equipment-filters" aria-labelledby="equipment-filter-title">
          <h3 id="equipment-filter-title" className="sr-only">Filter peralatan</h3>
          <div className="search-field">
            <label htmlFor="equipment-search">Cari peralatan</label>
            <Input
              id="equipment-search"
              contentBefore={<Search size={17} strokeWidth={1.75} />}
              contentAfter={query ? <Button className="search-clear" appearance="subtle" size="small" icon={<X size={14} strokeWidth={1.75} />} aria-label="Hapus pencarian" onClick={() => setQuery("")} /> : undefined}
              placeholder="Nama, kode, nomor seri, atau lokasi"
              value={query}
              onChange={(_, data) => setQuery(data.value)}
            />
          </div>
          <label className="filter-field">
            <span>Kategori</span>
            <Select value={category} onChange={(_, data) => setCategory(data.value)}><option value="Semua">Semua kategori</option><option>Isolasi</option><option>Metal</option><option>K3</option><option>Pendukung</option><option>Inovasi</option></Select>
          </label>
          <label className="filter-field">
            <span>Status</span>
            <Select value={status} onChange={(_, data) => setStatus(data.value)}><option value="Semua">Semua status</option><option>Tersedia</option><option>Digunakan</option><option>Inspeksi</option><option>Nonaktif</option></Select>
          </label>
        </section>

        {filteredRows.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th scope="col">Peralatan</th><th scope="col">Nomor seri</th><th scope="col">Kategori</th><th scope="col">Lokasi</th><th scope="col">Status</th><th scope="col">Inspeksi</th><th scope="col"><span className="sr-only">Aksi</span></th></tr></thead>
              <tbody>{filteredRows.map((item) => (
                <tr key={item.code}>
                  <td><strong>{item.name}</strong><span>{item.code}</span></td>
                  <td>{item.serialNumber}</td><td>{item.category}</td><td>{item.location}</td><td><StatusBadge active={item.active} status={item.status} /></td><td>{formatDate(item.nextInspection)}</td>
                  <td><Button appearance="subtle" icon={<Eye size={15} strokeWidth={1.75} />} aria-label={`Lihat ${item.name}`} onClick={() => setSelected(item)}><span className="action-label">Lihat</span></Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty"><Search size={24} strokeWidth={1.75} /><h3>Peralatan tidak ditemukan</h3><p>Ubah kata pencarian atau filter yang dipilih.</p><Button appearance="secondary" onClick={() => { setQuery(""); setCategory("Semua"); setStatus("Semua"); }}>Reset filter</Button></div>
        )}
      </section>

      <Dialog open={formItem !== undefined} onOpenChange={(_, data) => { if (!data.open) setFormItem(undefined); setFormError(""); }}>
        <DialogSurface className="equipment-dialog">
          <form key={formItem?.code ?? "new"} onSubmit={saveEquipment}>
            <DialogBody>
              <DialogTitle>{formItem ? "Ubah peralatan" : "Tambah peralatan"}</DialogTitle>
              <DialogContent>
                <p className="dialog-description">Lengkapi identitas dan status awal peralatan. Data tersimpan sementara pada sesi ini.</p>
                {formError && <MessageBar intent="error"><MessageBarBody>{formError}</MessageBarBody></MessageBar>}
                <div className="equipment-form">
                  <Field label="Kode inventaris" required><Input name="code" required readOnly={Boolean(formItem)} defaultValue={formItem?.code} placeholder="Contoh: PDKB-ISO-015" /></Field>
                  <Field label="Nama peralatan" required><Input name="name" required defaultValue={formItem?.name} /></Field>
                  <Field label="Nomor seri" required><Input name="serialNumber" required defaultValue={formItem?.serialNumber} /></Field>
                  <Field label="Kategori" required><Select name="category" required defaultValue={formItem?.category ?? ""}><option value="">Pilih kategori</option><option>Isolasi</option><option>Metal</option><option>K3</option><option>Pendukung</option><option>Inovasi</option></Select></Field>
                  <Field label="Asal-usul" required><Input name="origin" required defaultValue={formItem?.origin} /></Field>
                  <Field label="Tanggal perolehan"><Input name="acquiredAt" type="date" defaultValue={formItem?.acquiredAt} /></Field>
                  <Field label="Kondisi" required><Select name="condition" required defaultValue={formItem?.condition ?? "Baik"}><option>Baik</option><option>Perlu pemeriksaan</option><option>Rusak</option></Select></Field>
                  <Field label="Status" required><Select name="status" required defaultValue={formItem?.status ?? "Tersedia"}><option>Tersedia</option><option>Digunakan</option><option>Inspeksi</option></Select></Field>
                  <Field label="Lokasi" required><Input name="location" required defaultValue={formItem?.location} /></Field>
                  <Field label="Inspeksi berikutnya" required><Input name="nextInspection" type="date" required defaultValue={formItem?.nextInspection} /></Field>
                  <Field className="form-wide" label="Catatan"><Textarea name="notes" resize="vertical" defaultValue={formItem?.notes} /></Field>
                </div>
              </DialogContent>
              <DialogActions><Button appearance="secondary" type="button" onClick={() => setFormItem(undefined)}>Batal</Button><Button appearance="primary" type="submit">Simpan peralatan</Button></DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>

      <Dialog open={Boolean(selected)} onOpenChange={(_, data) => !data.open && setSelected(null)}>
        <DialogSurface className="equipment-dialog detail-dialog">
          {selected && <DialogBody><DialogTitle>{selected.name}</DialogTitle><DialogContent>
            <div className="detail-status"><StatusBadge active={selected.active} status={selected.status} /><span>{selected.code}</span></div>
            <dl className="equipment-details">
              <div><dt>Nomor seri</dt><dd>{selected.serialNumber}</dd></div><div><dt>Kategori</dt><dd>{selected.category}</dd></div>
              <div><dt>Kondisi</dt><dd>{selected.condition}</dd></div><div><dt>Lokasi</dt><dd>{selected.location}</dd></div>
              <div><dt>Asal-usul</dt><dd>{selected.origin}</dd></div><div><dt>Tanggal perolehan</dt><dd>{selected.acquiredAt ? formatDate(selected.acquiredAt) : "Belum dicatat"}</dd></div>
              <div><dt>Inspeksi berikutnya</dt><dd>{formatDate(selected.nextInspection)}</dd></div><div><dt>Catatan</dt><dd>{selected.notes || "Tidak ada catatan"}</dd></div>
            </dl>
            <section className="history-preview"><h3>Riwayat terbaru</h3><div><span>14 Sep 2026</span><p>Status diperiksa oleh Admin PDKB.</p></div><div><span>8 Sep 2026</span><p>Lokasi diperbarui menjadi {selected.location}.</p></div></section>
          </DialogContent><DialogActions>
            <Button appearance="secondary" icon={<Pencil size={15} />} onClick={() => { setFormItem(selected); setSelected(null); }}>Ubah</Button>
            <Button appearance="secondary" onClick={() => {
              const active = !selected.active;
              if (!active && !window.confirm(`Nonaktifkan ${selected.name}?`)) return;
              setRows((current) => current.map((item) => item.code === selected.code ? { ...item, active } : item));
              setNotice(`${selected.name} berhasil ${active ? "diaktifkan kembali" : "dinonaktifkan"}.`);
              setSelected(null);
            }}>{selected.active ? "Nonaktifkan" : "Aktifkan kembali"}</Button>
            <Button appearance="primary" onClick={() => setSelected(null)}>Tutup</Button>
          </DialogActions></DialogBody>}
        </DialogSurface>
      </Dialog>
    </>
  );
}
