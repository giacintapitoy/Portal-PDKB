import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  Tab,
  TabList,
  Tooltip,
} from "@fluentui/react-components";
import {
  Bell,
  Boxes,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Download,
  FileChartColumn,
  LayoutDashboard,
  Menu as MenuIcon,
  PackageCheck,
  PanelLeftClose,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";
import EquipmentPage from "./features/equipment/EquipmentPage";
import { fetchEquipment } from "./features/equipment/api";
import { formatDate, initialEquipment, type Equipment, type EquipmentStatus } from "./features/equipment/data";

type Page = "dashboard" | "peralatan" | "pemakaian" | "sumber-daya-manusia" | "sertifikasi" | "laporan";
const certifications = [
  { name: "Rian Tumbel", team: "PDKB GI", certification: "Pelaksana PDKB TM", due: "24 Sep 2026", days: 10 },
  { name: "Mario Rondonuwu", team: "PDKB Jaringan", certification: "K3 Kelistrikan", due: "9 Okt 2026", days: 25 },
  { name: "Yolanda Waworuntu", team: "PDKB GI", certification: "Pengawas Pekerjaan", due: "2 Nov 2026", days: 49 },
];

const staffProfiles = [
  { name: "Admin PDKB", role: "Administrator", team: "Manajemen PDKB", status: "Aktif", initials: "AR" },
  { name: "Rian Tumbel", role: "Pelaksana PDKB TM", team: "PDKB GI", status: "Aktif", initials: "RT" },
  { name: "Mario Rondonuwu", role: "Pelaksana PDKB Jaringan", team: "PDKB Jaringan", status: "Aktif", initials: "MR" },
  { name: "Yolanda Waworuntu", role: "Pengawas Pekerjaan", team: "PDKB GI", status: "Cuti", initials: "YW" },
];

const navItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "peralatan" as const, label: "Peralatan", icon: Boxes },
  { id: "pemakaian" as const, label: "Pemakaian", icon: ClipboardList },
  { id: "sumber-daya-manusia" as const, label: "SDM PDKB", icon: UserRound },
  { id: "sertifikasi" as const, label: "Sertifikasi", icon: UsersRound },
  { id: "laporan" as const, label: "Laporan", icon: FileChartColumn },
];

const pageTitles: Record<Page, { title: string; description: string }> = {
  dashboard: { title: "Ringkasan operasional", description: "Pantau peralatan, sertifikasi, dan pekerjaan yang perlu ditindaklanjuti. Data saat ini adalah contoh." },
  peralatan: { title: "Data peralatan", description: "Cari dan pantau status seluruh peralatan PDKB." },
  pemakaian: { title: "Riwayat pemakaian", description: "Pencatatan kegiatan dan penggunaan peralatan akan tersedia pada iterasi berikutnya." },
  "sumber-daya-manusia": { title: "Sumber daya manusia", description: "Kelola profil dan informasi anggota serta staf PDKB UPT Manado." },
  sertifikasi: { title: "Sertifikasi personel", description: "Pantau masa berlaku kompetensi dan rencana sertifikasi." },
  laporan: { title: "Laporan", description: "Penyusunan laporan terstruktur akan tersedia setelah format PLN divalidasi." },
};

function StatusBadge({ active, status }: { active: boolean; status: EquipmentStatus }) {
  if (!active) return <Badge appearance="tint">Nonaktif</Badge>;
  const appearance = status === "Tersedia" ? "filled" : "tint";
  const color = status === "Tersedia" ? "success" : status === "Inspeksi" ? "warning" : "informative";
  return <Badge appearance={appearance} color={color}>{status}</Badge>;
}

function EmptyFeature({ title, description }: { title: string; description: string }) {
  return (
    <section className="empty-state" aria-labelledby="empty-title">
      <ClipboardList size={26} strokeWidth={1.75} aria-hidden="true" />
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
              <td><StatusBadge active={item.active} status={item.status} /></td>
              <td>{formatDate(item.nextInspection)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ equipment, setPage }: { equipment: Equipment[]; setPage: (page: Page) => void }) {
  const activeEquipment = equipment.filter((item) => item.active);
  const usedEquipment = activeEquipment.filter((item) => item.status === "Digunakan").length;
  const inspectionEquipment = activeEquipment.filter((item) => item.condition === "Perlu pemeriksaan").length;

  return (
    <>
      <MessageBar intent="warning" className="attention-bar">
        <MessageBarBody><strong>3 sertifikasi dan 2 inspeksi</strong> memerlukan tindak lanjut dalam 60 hari.</MessageBarBody>
      </MessageBar>

      <div className="dashboard-grid">
        <section className="panel equipment-panel" aria-labelledby="equipment-heading">
          <div className="panel-heading">
            <div><h2 id="equipment-heading">Peralatan terbaru</h2><p>Status inventaris yang terakhir diperbarui.</p></div>
            <Button appearance="subtle" onClick={() => setPage("peralatan")}>Lihat semua</Button>
          </div>
          <EquipmentTable rows={equipment.slice(0, 3)} />
        </section>

        <div className="dashboard-side">
          <section className="metric-grid" aria-label="Ringkasan data">
            <Card className="metric">
              <span className="metric-icon cyan"><PackageCheck size={18} strokeWidth={1.75} /></span>
              <span className="metric-copy"><small>Total peralatan aktif</small><strong>{activeEquipment.length}</strong></span>
            </Card>
            <Card className="metric">
              <span className="metric-icon purple"><ClipboardList size={18} strokeWidth={1.75} /></span>
              <span className="metric-copy"><small>Sedang digunakan</small><strong>{usedEquipment}</strong></span>
            </Card>
            <Card className="metric">
              <span className="metric-icon yellow"><Wrench size={18} strokeWidth={1.75} /></span>
              <span className="metric-copy"><small>Perlu inspeksi</small><strong>{inspectionEquipment}</strong></span>
            </Card>
            <Card className="metric">
              <span className="metric-icon green"><ShieldCheck size={18} strokeWidth={1.75} /></span>
              <span className="metric-copy"><small>Sertifikat aktif</small><strong>46</strong></span>
            </Card>
          </section>

          <section className="reminder-banner" aria-labelledby="reminder-heading">
            <div>
              <h2 id="reminder-heading">Tiga sertifikasi segera berakhir</h2>
              <p>Jadwal terdekat pada 24 September 2026.</p>
            </div>
            <Button appearance="secondary" onClick={() => setPage("sertifikasi")}>Tinjau</Button>
            <CalendarClock size={54} strokeWidth={1.25} aria-hidden="true" />
          </section>
        </div>
      </div>
    </>
  );
}

function HumanResourcesPage() {
  return (
    <section className="panel people-management" aria-labelledby="people-list-title">
      <div className="feature-toolbar">
        <div><h2 id="people-list-title">Profil anggota dan staf</h2><p>{staffProfiles.length} anggota terdaftar di unit PDKB UPT Manado</p></div>
        <Button appearance="primary" icon={<UserRound size={16} strokeWidth={1.75} />}>Tambah anggota</Button>
      </div>
      <div className="people-grid">
        {staffProfiles.map((person) => (
          <article className="person-card" key={person.name}>
            <div className="person-avatar" aria-hidden="true">{person.initials}</div>
            <div className="person-copy"><h3>{person.name}</h3><p>{person.role}</p><span>{person.team}</span></div>
            <Badge color={person.status === "Aktif" ? "success" : "warning"}>{person.status}</Badge>
            <Button appearance="subtle">Lihat profil</Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [equipment, setEquipment] = useState(initialEquipment);
  const [equipmentApiError, setEquipmentApiError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("pdkb-sidebar") === "collapsed");

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileNavOpen(false);
  };

  const currentPage = pageTitles[page];

  useEffect(() => {
    const controller = new AbortController();

    fetchEquipment(controller.signal)
      .then(setEquipment)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEquipmentApiError("API belum dapat dihubungi. Data contoh tetap digunakan.");
      });

    return () => controller.abort();
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((collapsed) => {
      localStorage.setItem("pdkb-sidebar", collapsed ? "expanded" : "collapsed");
      return !collapsed;
    });
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img src="/pln-logo.png" alt="PLN" />
          <div className="brand-copy"><strong>Portal PDKB</strong><small>UPT Manado</small></div>
          <Tooltip content={sidebarCollapsed ? "Buka sidebar" : "Tutup sidebar"} relationship="label">
            <Button className="collapse-button" appearance="subtle" icon={<PanelLeftClose size={17} strokeWidth={1.75} />} aria-label={sidebarCollapsed ? "Buka sidebar" : "Tutup sidebar"} aria-expanded={!sidebarCollapsed} onClick={toggleSidebar} />
          </Tooltip>
        </div>
        <nav aria-label="Navigasi utama">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Tooltip content={label} relationship="label" positioning="after" key={id}>
              <button className={page === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)} aria-current={page === id ? "page" : undefined}>
                <Icon size={17} strokeWidth={1.75} aria-hidden="true" /><span>{label}</span>
              </button>
            </Tooltip>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Tooltip content="Pengaturan" relationship="label" positioning="after">
            <Button appearance="subtle" icon={<Settings size={17} strokeWidth={1.75} />} className="settings-button"><span>Pengaturan</span></Button>
          </Tooltip>
          <Tooltip content="Admin PDKB" relationship="label" positioning="after">
            <div className="profile"><span>AR</span><div><strong>Admin PDKB</strong><small>Administrator</small></div></div>
          </Tooltip>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <Button className="menu-button" appearance="subtle" icon={<MenuIcon size={18} strokeWidth={1.75} />} aria-label="Buka navigasi" onClick={() => setMobileNavOpen((open) => !open)} />
          <div className="mobile-brand"><img src="/pln-logo.png" alt="" /><span>Portal PDKB</span></div>
          <div className="topbar-actions">
            <Tooltip content="Notifikasi" relationship="label"><Button appearance="subtle" icon={<Bell size={17} strokeWidth={1.75} />} aria-label="Notifikasi" /></Tooltip>
            <Menu>
              <MenuTrigger disableButtonEnhancement><Button appearance="subtle" iconPosition="after" icon={<ChevronDown size={15} strokeWidth={1.75} />}>Admin PDKB</Button></MenuTrigger>
              <MenuPopover><MenuList><MenuItem>Profil</MenuItem><MenuItem>Keluar</MenuItem></MenuList></MenuPopover>
            </Menu>
          </div>
        </header>

        <div className="content">
          {equipmentApiError && <MessageBar intent="warning"><MessageBarBody>{equipmentApiError}</MessageBarBody></MessageBar>}
          <div className="page-heading">
            <div><h1>{currentPage.title}</h1><p>{currentPage.description}</p></div>
            {page === "sertifikasi" && <Button appearance="primary" icon={<UsersRound size={16} strokeWidth={1.75} />}>Tambah sertifikasi</Button>}
            {page === "laporan" && <Button appearance="primary" icon={<Download size={16} strokeWidth={1.75} />}>Ekspor laporan</Button>}
          </div>

          <>
              {page === "dashboard" && <Dashboard equipment={equipment} setPage={navigate} />}
              {page === "peralatan" && <EquipmentPage rows={equipment} setRows={setEquipment} />}
              {page === "sumber-daya-manusia" && <HumanResourcesPage />}
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
        </div>
      </main>
      {mobileNavOpen && <button className="backdrop" aria-label="Tutup navigasi" onClick={() => setMobileNavOpen(false)} />}
    </div>
  );
}
