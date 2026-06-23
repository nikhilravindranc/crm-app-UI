"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewAccountDrawer from "@/components/accounts/NewAccountDrawer";
import AccountGridView from "@/components/accounts/AccountGridView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { getDataGridSx, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, House, CaretRight, Trash,
  DotsThreeVertical, Phone, FunnelSimple, CaretDown, Buildings,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";
import { useTheme } from "@/components/ThemeContext";

// ─────────────────────────────────────────────
//  Data — exact from screenshot
// ─────────────────────────────────────────────
interface Account {
  id: number; name: string;
  ownerName: string; ownerEmail: string; ownerInitials: string;
  phone: string; accountType: string;
  modifiedByName: string; modifiedByEmail: string;
  creation: string; modified: string;
}

const ALL_ACCOUNTS: Account[] = [
  { id:1,  name:"XYZ",          ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"01111111111", accountType:"",           modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"27 May 2026, 03:14 PM", modified:"27 May 2026, 03:14 PM" },
  { id:2,  name:"Sweany Inc",   ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"6663636",     accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"27 May 2026, 02:38 PM", modified:"27 May 2026, 02:45 PM" },
  { id:3,  name:"Lee Industries",ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",   ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"15 May 2026, 09:31 AM", modified:"15 May 2026, 09:31 AM" },
  { id:4,  name:"SDL LEAD1",    ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"15 Apr 2026, 11:13 AM", modified:"15 Apr 2026, 11:13 AM" },
  { id:5,  name:"RMVT",         ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:43 PM" },
  { id:6,  name:"test",         ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"9977887788", accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"13 Apr 2026, 06:00 PM", modified:"13 Apr 2026, 06:17 PM" },
  { id:7,  name:"Speedy Motors", ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",   ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM" },
  { id:8,  name:"SDL Test",     ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"16 Mar 2026, 07:25 PM", modified:"08 Apr 2026, 04:47 PM" },
  { id:9,  name:"Test 1233333", ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"Individual",  modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"23 Mar 2026, 05:16 PM", modified:"23 Mar 2026, 05:16 PM" },
  { id:10, name:"SDL",          ownerName:"PM SDL", ownerEmail:"pm@socialdnalabs.com",    ownerInitials:"PM", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"26 Jun 2025, 04:11 PM", modified:"16 Mar 2026, 07:45 PM" },
  { id:11, name:"Sears Homelife",ownerName:"Admin", ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"08 Jul 2025, 11:15 AM", modified:"16 Mar 2026, 07:45 PM" },
  { id:12, name:"dfgdfg",       ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"25 Jul 2025, 05:16 PM", modified:"16 Mar 2026, 07:45 PM" },
  { id:13, name:"I&T",          ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"28 Jul 2025, 10:13 AM", modified:"16 Mar 2026, 07:45 PM" },
  { id:14, name:"dd",           ownerName:"Admin",  ownerEmail:"admin@mailinator.com",    ownerInitials:"AD", phone:"",           accountType:"",            modifiedByName:"PM SDL", modifiedByEmail:"pm@socialdnalabs.com", creation:"28 Jul 2025, 10:14 AM", modified:"16 Mar 2026, 07:45 PM" },
];

// ─────────────────────────────────────────────
//  Account type config
// ─────────────────────────────────────────────
const TYPE_CFG: Record<string, { bg: string; text: string; dot: string; bgDark: string; textDark: string }> = {
  "Individual": { bg: "#EFF6FF", text: "#0C2472", dot: "#E3ECFC", bgDark: "rgba(96, 165, 250, 0.15)", textDark: "#E3ECFC" },
  "Customer":   { bg: "#DCFCE7", text: "#166534", dot: "#10B981", bgDark: "rgba(16, 185, 129, 0.15)", textDark: "#10B981" },
  "Partner":    { bg: "#E3ECFC", text: "#0C2472", dot: "#3B82F6", bgDark: "rgba(52, 211, 153, 0.15)", textDark: "#34D399" },
  "Prospect":   { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", bgDark: "rgba(251, 191, 36, 0.15)", textDark: "#FBBF24" },
  "Vendor":     { bg: "#E3ECFC", text: "#0C2472", dot: "#E3ECFC", bgDark: "rgba(244, 114, 182, 0.15)", textDark: "#F472B6" },
  "Analyst":    { bg: "#EFF6FF", text: "#475569", dot: "#94A3B8", bgDark: "rgba(167, 139, 250, 0.15)", textDark: "#A78BFA" },
  "Competitor": { bg: "#FEF2F2", text: "#991B1B", dot: "#EF4444", bgDark: "rgba(244, 63, 94, 0.15)", textDark: "#F43F5E" },
};

// ─────────────────────────────────────────────
//  Column defs — all fixed px (horizontal scroll)
// ─────────────────────────────────────────────
const COL_DEFS = [
  { key: "accountName", label: "Account Name",  width: "200px" },
  { key: "accountOwner",label: "Account Owner", width: "175px" },
  { key: "phone",       label: "Phone",         width: "130px" },
  { key: "accountType", label: "Account Type",  width: "130px" },
  { key: "modifiedBy",  label: "Modified by",   width: "175px" },
  { key: "creation",    label: "Creation",      width: "165px" },
  { key: "modified",    label: "Modified",      width: "165px" },
];
const DEFAULT_VISIBLE = new Set(["accountName", "accountOwner", "phone", "accountType", "modifiedBy", "creation", "modified"]);

const AVATAR_PAL = ["#7C3AED", "#10B981", "#F59E0B", "#DB2777"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];

function ColHeader({ label, isDark = false }: { label: string; isDark?: boolean }) {
  return (
    <div className={`font-heading flex items-center gap-0.5 text-table-header uppercase tracking-wide cursor-pointer transition-colors group select-none ${isDark ? "text-[#737373] hover:text-[#D4D4D8]" : "text-[#0C2472]"}`}>
      {label}
      <ArrowsDownUp size={12} weight="duotone" className={`opacity-30 group-hover:opacity-100 transition-opacity ${isDark ? "text-[#52525B]" : "text-[#60A5FA]"}`} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function AccountsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selected, setSelected]       = useState<number[]>([]);
  const [search, setSearch]           = useState("");
  const [view, setView]               = useState<"list" | "grid">("list");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE));

  const filtered = ALL_ACCOUNTS.filter(a => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.ownerName.toLowerCase().includes(q);
  });

  // ── DataGrid column builders, keyed by COL_DEFS.key
  const COLUMN_BUILDERS: Record<string, GridColDef<Account>> = {
    accountName: {
      field: "accountName", headerName: "Account Name", flex: 1.8, minWidth: 180, sortable: false,
      renderHeader: () => <ColHeader label="Account Name" isDark={isDark} />,
      renderCell: (params) => {
        const acc = params.row;
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0"
              style={{ backgroundColor: avatarColor(acc.name) }}>
              {acc.name.substring(0, 2).toUpperCase()}
            </div>
            <p className="m-0 font-heading text-table-cell font-medium text-[#1D4ED8] truncate hover:underline cursor-pointer">{acc.name}</p>
          </div>
        );
      },
    },
    accountOwner: {
      field: "accountOwner", headerName: "Account Owner", flex: 1.5, minWidth: 150, sortable: false,
      renderHeader: () => <ColHeader label="Account Owner" isDark={isDark} />,
      renderCell: (params) => {
        const acc = params.row;
        return (
          <Tooltip title={`${acc.ownerName} · ${acc.ownerEmail}`} placement="top">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar src={OWNER_AVATARS[acc.ownerName]} sx={{ width: 20, height: 20, bgcolor: avatarColor(acc.ownerName), fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>{acc.ownerInitials}</Avatar>
              <span className="text-table-cell-secondary text-slate-500 truncate">{acc.ownerEmail}</span>
            </div>
          </Tooltip>
        );
      },
    },
    phone: {
      field: "phone", headerName: "Phone", flex: 1.1, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Phone" isDark={isDark} />,
      renderCell: (params) => (
        <div className="text-table-cell text-slate-500 font-mono truncate">
          {params.row.phone
            ? <span className="flex items-center gap-1"><Phone size={11} color="#E3ECFC" weight="duotone" />{params.row.phone}</span>
            : <span className="text-slate-200">—</span>}
        </div>
      ),
    },
    accountType: {
      field: "accountType", headerName: "Account Type", flex: 1.1, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Account Type" isDark={isDark} />,
      renderCell: (params) => {
        const typCfg = TYPE_CFG[params.row.accountType] || { bg: "#EFF6FF", text: "#475569", dot: "#94A3B8" };
        return params.row.accountType ? (
          <span className="self-center inline-flex items-center gap-1.5 text-badge-text px-2 py-[3px] rounded-full leading-none"
            style={{ backgroundColor: typCfg.bg, color: typCfg.text }}>
            <span className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: typCfg.dot }} />
            {params.row.accountType}
          </span>
        ) : <span className="text-slate-200 text-table-cell">—</span>;
      },
    },
    modifiedBy: {
      field: "modifiedBy", headerName: "Modified by", flex: 1.5, minWidth: 150, sortable: false,
      renderHeader: () => <ColHeader label="Modified by" isDark={isDark} />,
      renderCell: (params) => {
        const acc = params.row;
        return (
          <Tooltip title={`${acc.modifiedByName} · ${acc.modifiedByEmail}`} placement="top">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar src={OWNER_AVATARS[acc.modifiedByName]} sx={{ width: 20, height: 20, bgcolor: avatarColor(acc.modifiedByName), fontSize: "0.48rem", fontWeight: 800, flexShrink: 0 }}>{acc.modifiedByName.substring(0, 2).toUpperCase()}</Avatar>
              <span className="text-table-cell-secondary text-slate-500 truncate">{acc.modifiedByEmail}</span>
            </div>
          </Tooltip>
        );
      },
    },
    creation: {
      field: "creation", headerName: "Creation", flex: 1.4, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="Creation" isDark={isDark} />,
      renderCell: (params) => <p className="m-0 text-table-cell-secondary text-slate-400 truncate">{params.row.creation}</p>,
    },
    modified: {
      field: "modified", headerName: "Modified", flex: 1.4, minWidth: 140, sortable: false,
      renderHeader: () => <ColHeader label="Modified" isDark={isDark} />,
      renderCell: (params) => <p className="m-0 text-table-cell-secondary text-slate-400 truncate">{params.row.modified}</p>,
    },
  };

  const gridColumns: GridColDef<Account>[] = [
    ...COL_DEFS.filter(c => visibleCols.has(c.key)).map(c => COLUMN_BUILDERS[c.key]),
    {
      field: "actions", headerName: "", width: 50, sortable: false, disableColumnMenu: true,
      renderCell: () => (
        <div className="flex justify-end w-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip title="Actions">
            <IconButton size="small" onClick={e => e.stopPropagation()} sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: "#E3ECFC" } }}>
              <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-transparent font-sans">
      <Sidebar />

      <div className={`sidebar-content flex-1 flex flex-col min-h-screen overflow-auto transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        <TopBar />

        <main className="flex-1 px-4 md:px-8 py-3 md:py-4 space-y-3 animate-fade-in">

          {/* ══ Breadcrumb + Header ══ */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-caption text-slate-400 mb-2">
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/accounts" className={`transition-colors font-medium ${isDark ? "hover:text-[#D4D4D8]" : "hover:text-[#1D4ED8]"}`}>Accounts</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-h1 text-slate-900 tracking-tight">Accounts</h1>
                <span className="text-badge-text text-slate-400 bg-[#f9fbff] border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_ACCOUNTS.length} total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* View toggle */}
              <div className={`flex items-center border rounded-xl p-0.5 gap-0.5 shadow-sm ${isDark ? "bg-[#000000] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                {[
                  { k: "list", Icon: List,     label: "List" },
                  { k: "grid", Icon: GridFour, label: "Grid" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)}
                    className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-button-sm transition-all ${
                      view === k
                        ? isDark ? "bg-[#18181B] text-[#D4D4D8]" : "bg-[#f9fbff] text-[#1D4ED8]"
                        : isDark ? "text-[#737373] hover:bg-[#27272A] hover:text-[#D4D4D8]" : "text-slate-400 hover:text-slate-600"
                    }`}>
                    <Icon size={14} weight="duotone" />{label}
                  </button>
                ))}
              </div>

              <Button variant="contained"
                startIcon={<Plus size={16} weight="bold" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px", px: 2, py: 0.85, boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: isDark ? "#52525B" : "#0C2472" } }}>
                New Account
              </Button>
            </div>
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#4A7AE8] transition-all ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by account name, owner…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.76rem", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

            <Button variant="outlined" size="small"
              startIcon={activeFilters.length > 0
                ? <Badge badgeContent={activeFilters.length} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: "0.55rem", height: 14, minWidth: 14 } }}>
                    <FunnelSimple size={14} weight="duotone" />
                  </Badge>
                : <FunnelSimple size={14} weight="duotone" />
              }
              onClick={e => setFiltersAnchor(e.currentTarget)}
              sx={{
                borderColor: activeFilters.length > 0 ? "#1D4ED8" : isDark ? "#27272A" : "#E3ECFC",
                color: activeFilters.length > 0 ? "#fff" : isDark ? "#737373" : "#0C2472",
                bgcolor: activeFilters.length > 0 ? "#1D4ED8" : isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "13px",
                "&:hover": {
                  borderColor: activeFilters.length > 0 ? "#1640B8" : "#1D4ED8",
                  color: activeFilters.length > 0 ? "#fff" : "#0C2472",
                  bgcolor: activeFilters.length > 0 ? "#1640B8" : isDark ? "#0A0A0A" : "#DCE6FB",
                },
              }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#737373" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "13px",
                "&:hover": { borderColor: "#E3ECFC", bgcolor: isDark ? "#0A0A0A" : "#f9fbff" },
              }}>
              Columns
            </Button>

            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#737373" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "13px",
                "&:hover": { borderColor: "#E3ECFC", bgcolor: isDark ? "#0A0A0A" : "#f9fbff" },
              }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>

            <span className="ml-auto text-caption text-slate-400 bg-[#f9fbff] px-3 py-1.5 rounded-lg">
              {filtered.length} of {ALL_ACCOUNTS.length} records
            </span>
          </div>

          {/* ══ Bulk action bar ══ */}
          {selected.length > 0 && (
            <div className="flex items-center gap-3 bg-[#0C2472] text-white px-4 py-2.5 rounded-xl animate-slide-up shadow-lg shadow-[#0C2472]/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#1D4ED8] flex items-center justify-center text-badge-text">{selected.length}</span>
                <span className="text-button-sm">selected</span>
              </div>
              <div className="w-px h-4 bg-[#f9fbff]/15" />
              <button className="text-button-sm text-inherit hover:text-white transition-colors">Assign Owner</button>
              <button className="text-button-sm text-inherit hover:text-white transition-colors">Update Type</button>
              <button onClick={() => setSelected([])} className="ml-auto text-button-sm text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-button-sm text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ GRID VIEW ══ */}
          {view === "grid" && (
            <AccountGridView accounts={filtered.map(a => ({
              id: a.id, name: a.name, ownerName: a.ownerName, ownerInitials: a.ownerInitials,
              phone: a.phone, accountType: a.accountType, creation: a.creation,
            }))} />
          )}

          {/* ══ LIST VIEW (MUI DataGrid) ══ */}
          {view === "list" && (
            <div className="rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden" style={{ height: 600 }}>
              <DataGrid<Account>
                rows={filtered}
                columns={gridColumns}
                getRowId={row => row.id}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={44}
                columnHeaderHeight={40}
                rowSelectionModel={selected}
                onRowSelectionModelChange={model => setSelected(model as number[])}
                onRowClick={params => router.push(`/accounts/${params.id}`)}
                initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                slots={{
                  noRowsOverlay: () => (
                    <div className="py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#f9fbff] flex items-center justify-center mx-auto mb-3">
                        <Buildings size={22} color="#E3ECFC" weight="duotone" />
                      </div>
                      <p className="font-heading text-slate-500 text-sm font-semibold">No accounts found</p>
                      <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  ),
                }}
                sx={getDataGridSx(isDark)}
              />
            </div>
          )}
        </main>
      </div>

      {/* ══ Panels ══ */}
      <NewAccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FiltersDrawer
        anchor={filtersAnchor} onClose={() => setFiltersAnchor(null)}
        filters={activeFilters} onChange={setActiveFilters}
      />
      <ColumnsDrawer
        open={columnsOpen} onClose={() => setColumnsOpen(false)}
        selected={visibleCols} onChange={setVisibleCols}
      />
      <SortPopover
        anchor={sortAnchor} onClose={() => setSortAnchor(null)}
        sorts={activeSorts} onChange={setActiveSorts}
      />
    </div>
  );
}

