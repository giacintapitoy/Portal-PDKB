import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  Select,
  Spinner,
  Tab,
  TabList,
  Tooltip,
} from "@fluentui/react-components";
import {
  AlertRegular,
  ArrowDownloadRegular,
  BoxRegular,
  CalendarClockRegular,
  ChevronDownRegular,
  ClipboardTaskListLtrRegular,
  DocumentBulletListRegular,
  GridRegular,
  NavigationRegular,
  PeopleTeamRegular,
  SearchRegular,
  SettingsRegular,
} from "@fluentui/react-icons";

type Page = "dashboard" | "peralatan" | "pemakaian" | "sertifikasi" | "laporan";
type EquipmentStatus = "Tersedia" | "Digunakan" | "Inspeksi";

type Equipment = {
  code: string;
  name: string;
  category: string;
  location: string;
  status: EquipmentStatus;
  due: string;
};

const equipment: Equipment[] = [
  { code: "PDKB-ISO-014", name: "Hot Stick 6 Section", category: "Isolasi", location: "Gudang A", status: "Tersedia", due: "18 Okt 2026" },
  { code: "PDKB-K3-022", name: "Full Body Harness", category: "K3", location: "Tim Jaringan", status: "Digunakan", due: "27 Sep 2026" },
  { code: "PDKB-MTL-008", name: "Hydraulic Crimping Tool", category: "Metal", location: "Ruang Inspeksi", status: "Inspeksi", due: "21 Sep 2026" },
  { code: "PDKB-PND-031", name: "Insulation Tester", category: "Pendukung", location: "Gudang B", status: "Tersedia", due: "12 Des 2026" },
];

function matchesEquipment(item: Equipment, query: string, category: string) {
  const text = `${item.name} ${item.code} ${item.location}`.toLowerCase();
  return text.includes(query.toLowerCase()) && (category === "Semua" || item.category === category);
}

if (import.meta.env.DEV) {
  console.assert(matchesEquipment(equipment[0], "hot stick", "Isolasi"), "Pencarian peralatan harus cocok tanpa membedakan huruf");
  console.assert(!matchesEquipment(equipment[0], "hot stick", "K3"), "Filter kategori harus membatasi hasil");
}

const certifications = [
  { name: "Rian Tumbel", team: "PDKB GI", certification: "Pelaksana PDKB TM", due: "24 Sep 2026", days: 10 },
  { name: "Mario Rondonuwu", team: "PDKB Jaringan", certification: "K3 Kelistrikan", due: "9 Okt 2026", days: 25 },
  { name: "Yolanda Waworuntu", team: "PDKB GI", certification: "Pengawas Pekerjaan", due: "2 Nov 2026", days: 49 },
];

const navItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: GridRegular },
  { id: "peralatan" as const, label: "Peralatan", icon: BoxRegular },
  { id: "pemakaian" as const, label: "Pemakaian", icon: ClipboardTaskListLtrRegular },
  { id: "sertifikasi" as const, label: "Sertifikasi", icon: PeopleTeamRegular },
  { id: "laporan" as const, label: "Laporan", icon: DocumentBulletListRegular },
];

const pageTitles: Record<Page, { title: string; description: string }> = {
  dashboard: { title: "Ringkasan operasional", description: "Pantau peralatan, sertifikasi, dan pekerjaan yang perlu ditindaklanjuti. Data saat ini adalah contoh." },
  peralatan: { title: "Data peralatan", description: "Cari dan pantau status seluruh peralatan PDKB." },
  pemakaian: { title: "Riwayat pemakaian", description: "Pencatatan kegiatan dan penggunaan peralatan akan tersedia pada iterasi berikutnya." },
  sertifikasi: { title: "Sertifikasi personel", description: "Pantau masa berlaku kompetensi dan rencana sertifikasi." },
  laporan: { title: "Laporan", description: "Penyusunan laporan terstruktur akan tersedia setelah format PLN divalidasi." },
};

function StatusBadge({ status }: { status: EquipmentStatus }) {
  const appearance = status === "Tersedia" ? "filled" : "tint";
  const color = status === "Tersedia" ? "success" : status === "Inspeksi" ? "warning" : "informative";
  return <Badge appearance={appearance} color={color}>{status}</Badge>;
}

function EmptyFeature({ title, description }: { title: string; description: string }) {
  return (
    <section className="empty-state" aria-labelledby="empty-title">
      <ClipboardTaskListLtrRegular fontSize={28} aria-hidden="true" />
      <h2 id="empty-title">{title}</h2>
      <p>{description}</p>
    </section>
  );
}

function EquipmentTable({ rows }: { rows: Equipment[] }) {
  if (!rows.length) {
    return <EmptyFeature title="Peralatan tidak ditemukan" description="Ubah kata pencarian atau pilih kategori lain." />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Peralatan</th>
            <th scope="col">Kategori</th>
            <th scope="col">Lokasi</th>
            <th scope="col">Status</th>
            <th scope="col">Inspeksi berikutnya</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.code}>
              <td><strong>{item.name}</strong><span>{item.code}</span></td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td><StatusBadge status={item.status} /></td>
              <td>{item.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <>
      <MessageBar intent="warning" className="attention-bar">
        <MessageBarBody><strong>3 sertifikasi dan 2 inspeksi</strong> memerlukan tindak lanjut dalam 60 hari.</MessageBarBody>
      </MessageBar>

      <section className="metric-grid" aria-label="Ringkasan data">
        <Card className="metric metric-primary">
          <span>Total peralatan</span><strong>184</strong><small>171 aktif digunakan</small>
        </Card>
        <Card className="metric">
          <span>Sedang digunakan</span><strong>12</strong><small>6 kegiatan berjalan</small>
        </Card>
        <Card className="metric">
          <span>Perlu inspeksi</span><strong>7</strong><small>2 jatuh tempo bulan ini</small>
        </Card>
        <Card className="metric">
          <span>Sertifikat aktif</span><strong>46</strong><small>3 segera berakhir</small>
        </Card>
      </section>

      <div className="dashboard-grid">
        <section className="panel equipment-panel" aria-labelledby="equipment-heading">
          <div className="panel-heading">
            <div><h2 id="equipment-heading">Peralatan terbaru</h2><p>Status inventaris yang terakhir diperbarui.</p></div>
            <Button appearance="subtle" onClick={() => setPage("peralatan")}>Lihat semua</Button>
          </div>
          <EquipmentTable rows={equipment.slice(0, 3)} />
        </section>

        <section className="panel reminder-panel" aria-labelledby="reminder-heading">
          <div className="panel-heading">
            <div><h2 id="reminder-heading">Jatuh tempo</h2><p>Urutan berdasarkan waktu terdekat.</p></div>
            <CalendarClockRegular fontSize={22} aria-hidden="true" />
          </div>
          <div className="reminder-list">
            {certifications.map((item) => (
              <article className="reminder" key={item.name}>
                <div><strong>{item.name}</strong><span>{item.certification}</span><small>{item.team}</small></div>
                <div className="due"><strong>{item.days} hari</strong><span>{item.due}</span></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredEquipment = useMemo(
    () => equipment.filter((item) => matchesEquipment(item, query, category)),
    [category, query],
  );

  const navigate = (nextPage: Page) => {
    setLoading(true);
    setPage(nextPage);
    setMobileNavOpen(false);
    window.setTimeout(() => setLoading(false), 220);
  };

  const currentPage = pageTitles[page];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><span className="brand-mark">P</span><div><strong>Portal PDKB</strong><small>UPT Manado</small></div></div>
        <nav aria-label="Navigasi utama">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button className={page === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)} key={id}>
              <Icon fontSize={20} aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Button appearance="subtle" icon={<SettingsRegular />} className="settings-button">Pengaturan</Button>
          <div className="profile"><span>AR</span><div><strong>Admin PDKB</strong><small>Administrator</small></div></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <Button className="menu-button" appearance="subtle" icon={<NavigationRegular />} aria-label="Buka navigasi" onClick={() => setMobileNavOpen((open) => !open)} />
          <div className="mobile-brand">Portal PDKB</div>
          <div className="topbar-actions">
            <Tooltip content="Notifikasi" relationship="label"><Button appearance="subtle" icon={<AlertRegular />} aria-label="Notifikasi" /></Tooltip>
            <Menu>
              <MenuTrigger disableButtonEnhancement><Button appearance="subtle" iconPosition="after" icon={<ChevronDownRegular />}>Admin PDKB</Button></MenuTrigger>
              <MenuPopover><MenuList><MenuItem>Profil</MenuItem><MenuItem>Keluar</MenuItem></MenuList></MenuPopover>
            </Menu>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div><p className="context-label">PDKB UPT MANADO</p><h1>{currentPage.title}</h1><p>{currentPage.description}</p></div>
            {page === "peralatan" && <Button appearance="primary" icon={<BoxRegular />}>Tambah peralatan</Button>}
            {page === "sertifikasi" && <Button appearance="primary" icon={<PeopleTeamRegular />}>Tambah sertifikasi</Button>}
            {page === "laporan" && <Button appearance="primary" icon={<ArrowDownloadRegular />}>Ekspor laporan</Button>}
          </div>

          {loading ? <div className="loading-state"><Spinner label="Memuat data" /></div> : (
            <>
              {page === "dashboard" && <Dashboard setPage={navigate} />}
              {page === "peralatan" && (
                <section className="panel">
                  <div className="toolbar">
                    <Input aria-label="Cari peralatan" contentBefore={<SearchRegular />} placeholder="Cari nama, kode, atau lokasi" value={query} onChange={(_, data) => setQuery(data.value)} />
                    <Select aria-label="Filter kategori" value={category} onChange={(_, data) => setCategory(data.value)}>
                      <option>Semua</option><option>Isolasi</option><option>K3</option><option>Metal</option><option>Pendukung</option>
                    </Select>
                  </div>
                  <EquipmentTable rows={filteredEquipment} />
                </section>
              )}
              {page === "sertifikasi" && (
                <section className="panel">
                  <TabList defaultSelectedValue="jatuh-tempo"><Tab value="jatuh-tempo">Segera berakhir</Tab><Tab value="aktif">Aktif</Tab><Tab value="rencana">Rencana diklat</Tab></TabList>
                  <div className="certification-list">
                    {certifications.map((item) => <article key={item.name}><div><strong>{item.name}</strong><span>{item.team}</span></div><div><strong>{item.certification}</strong><span>Berakhir {item.due}</span></div><Badge color={item.days <= 30 ? "warning" : "informative"}>{item.days} hari</Badge></article>)}
                  </div>
                </section>
              )}
              {page === "pemakaian" && <EmptyFeature title="Modul pemakaian belum dibangun" description="Alur pencatatan perlu divalidasi dengan petugas PDKB sebelum implementasi." />}
              {page === "laporan" && <EmptyFeature title="Format laporan belum tersedia" description="Tambahkan contoh laporan resmi PLN agar struktur ekspor dapat dibuat dengan tepat." />}
            </>
          )}
        </div>
      </main>
      {mobileNavOpen && <button className="backdrop" aria-label="Tutup navigasi" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
