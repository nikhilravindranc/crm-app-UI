"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import NewDealDrawer from "@/components/deals/NewDealDrawer";
import DealGridView from "@/components/deals/DealGridView";
import DealKanbanView from "@/components/deals/DealKanbanView";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";
import ColumnsDrawer from "@/components/leads/ColumnsDrawer";
import SortPopover, { type SortRow } from "@/components/leads/SortPopover";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { getDataGridSx, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  Plus, MagnifyingGlass, SlidersHorizontal, SortAscending, Columns,
  ArrowsDownUp, List, GridFour, Kanban, CaretDown, House, CaretRight,
  Trash, DotsThreeVertical, FunnelSimple, TrendUp,
  Handshake, CurrencyCircleDollar, Buildings, Pulse, ChartLineUp, User,
  UserCircle, CalendarBlank,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import { useTheme } from "@/components/ThemeContext";

// ---------------------------------------------
//  Types
// ---------------------------------------------
type DealStage = "Qualification" | "Needs Analysis" | "Value Proposition" |
  "Identify Decision Makers" | "Proposal/Price Quote" | "Negotiation/Review" | "Closed Won";

interface Deal {
  id: number; name: string; amount: number; account: string;
  stage: DealStage; probability: number; contactName: string;
  createdBy: string; modifiedBy: string; creation: string; modified: string;
  owner: string; ownerInitials: string;
}

// ---------------------------------------------
//  Data — exact from screenshot
// ---------------------------------------------
const ALL_DEALS: Deal[] = [
  { id:1,  name:"New",                         amount:29999,  account:"Sweany Inc",    stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"27 May 2026, 03:14 PM", modified:"30 May 2026, 02:10 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:2,  name:"Deal SDL 11",                 amount:500000, account:"SDL LEAD1",     stage:"Identify Decision Makers",  probability:60, contactName:"Lead SDL 11",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"15 Apr 2026, 11:13 AM", modified:"05 May 2026, 04:55 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:3,  name:"test deal john smith",        amount:200000, account:"Sears Homelife",stage:"Qualification",             probability:0,  contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:45 PM", modified:"14 Apr 2026, 07:45 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:4,  name:"testing",                     amount:500000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:30 PM", modified:"14 Apr 2026, 07:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:5,  name:"fsm enterprise application",  amount:800000, account:"RMVT",          stage:"Needs Analysis",            probability:20, contactName:"mmmm mmmm",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:53 PM", modified:"14 Apr 2026, 07:07 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:6,  name:"CRM Application",             amount:200000, account:"SDL",           stage:"Qualification",             probability:10, contactName:"SDL Test Test-SDL", createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 07:04 PM", modified:"14 Apr 2026, 07:04 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:7,  name:"fsm single user application", amount:200000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Raja rajan",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:40 PM", modified:"14 Apr 2026, 06:40 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:8,  name:"CRM Application",             amount:500000, account:"RMVT",          stage:"Qualification",             probability:0,  contactName:"Vishnutharan R",   createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"14 Apr 2026, 06:38 PM", modified:"14 Apr 2026, 06:38 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:9,  name:"Deal test",                   amount:150000, account:"test",          stage:"Qualification",             probability:10, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:35 PM", modified:"13 Apr 2026, 06:35 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:10, name:"test",                        amount:50000,  account:"test",          stage:"Needs Analysis",            probability:20, contactName:"test test",        createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:17 PM", modified:"13 Apr 2026, 06:34 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:11, name:"Smith",                       amount:100000, account:"test",          stage:"Value Proposition",         probability:40, contactName:"John Smith",       createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 06:00 PM", modified:"13 Apr 2026, 06:02 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:12, name:"Mike",                        amount:0,      account:"Speedy Motors", stage:"Qualification",             probability:0,  contactName:"Speedy Mike",      createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"13 Apr 2026, 05:56 PM", modified:"13 Apr 2026, 05:56 PM", owner:"PM SDL",    ownerInitials:"PM" },
  { id:13, name:"Test",                        amount:10000,  account:"SDL",           stage:"Proposal/Price Quote",      probability:75, contactName:"",                 createdBy:"PM SDL", modifiedBy:"PM SDL", creation:"25 Mar 2026, 08:10 PM", modified:"07 Apr 2026, 04:53 PM", owner:"PM SDL",    ownerInitials:"PM" },
];

// ---------------------------------------------
//  Stage config
// ---------------------------------------------
const STAGE_CFG: Record<DealStage, { bg: string; text: string; dot: string; bgDark: string; textDark: string }> = {
  "Qualification":            { bg: "#EFF6FF", text: "#0C2472", dot: "#94A3B8", bgDark: "rgba(96, 165, 250, 0.15)", textDark: "#60A5FA" },
  "Needs Analysis":           { bg: "#E3ECFC", text: "#0C2472", dot: "#3B82F6", bgDark: "rgba(52, 211, 153, 0.15)", textDark: "#34D399" },
  "Value Proposition":        { bg: "#E3ECFC", text: "#0C2472", dot: "#7C3AED", bgDark: "rgba(251, 191, 36, 0.15)", textDark: "#FBBF24" },
  "Identify Decision Makers": { bg: "#E3ECFC", text: "#0C2472", dot: "#0C2472", bgDark: "rgba(244, 114, 182, 0.15)", textDark: "#F472B6" },
  "Proposal/Price Quote":     { bg: "#EFF6FF", text: "#0C2472", dot: "#0C2472", bgDark: "rgba(167, 139, 250, 0.15)", textDark: "#A78BFA" },
  "Negotiation/Review":       { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", bgDark: "rgba(56, 189, 248, 0.15)", textDark: "#38BDF8" },
  "Closed Won":               { bg: "#DCFCE7", text: "#166534", dot: "#10B981", bgDark: "rgba(16, 185, 129, 0.15)", textDark: "#10B981" },
};

// ---------------------------------------------
//  Stage tabs
// ---------------------------------------------
const STAGE_TABS = [
  "All", "Qualification", "Needs Analysis", "Value Proposition",
  "Identify Decision Makers", "Proposal/Price Quote", "Negotiation/Review", "Closed Won",
];

// ---------------------------------------------
//  Column definitions
// ---------------------------------------------
const COL_DEFS: { key: string; label: string; width: string }[] = [
  { key: "dealName",    label: "Deal Name",       width: "1fr"   },
  { key: "amount",      label: "Amount",          width: "110px" },
  { key: "accountName", label: "Account Name",    width: "140px" },
  { key: "stage",       label: "Stage",           width: "180px" },
  { key: "probability", label: "Probability (%)", width: "110px" },
  { key: "contactName", label: "Contact Name",    width: "140px" },
  { key: "createdBy",   label: "Created By",      width: "130px" },
  { key: "modifiedBy",  label: "Modified By",     width: "130px" },
  { key: "creation",    label: "Creation",        width: "175px" },
  { key: "modified",    label: "Modified",        width: "175px" },
];

const DEFAULT_VISIBLE_COLS = new Set([
  "dealName", "amount", "accountName", "stage", "probability",
  "contactName", "creation", "modified",
]);

// ---------------------------------------------
//  Helpers
// ---------------------------------------------
const fmt = (n: number) => n === 0 ? "₹0" : `₹${n.toLocaleString("en-IN")}`;

function ColHeader({ label, icon: Icon, isDark = false }: { label: string; icon?: ElementType; isDark?: boolean }) {
  return (
    <div className={`font-heading flex items-center gap-1.5 text-table-header uppercase tracking-wide cursor-pointer transition-colors group select-none ${isDark ? "text-[#9CA3AF] hover:text-[#D4D4D8]" : "text-[#0C2472]"}`}>
      {Icon && <Icon size={13} weight="duotone" />}
      {label}
      <ArrowsDownUp size={12} weight="duotone" className={`opacity-30 group-hover:opacity-100 transition-opacity ${isDark ? "text-[#9CA3AF]" : "text-[#60A5FA]"}`} />
    </div>
  );
}

// ---------------------------------------------
//  Page
// ---------------------------------------------
export default function DealsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selected, setSelected]       = useState<number[]>([]);
  const [activeStage, setActiveStage] = useState("All");
  const [search, setSearch]           = useState("");
  const [view, setView]               = useState<"list" | "grid" | "kanban">("list");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortAnchor, setSortAnchor]   = useState<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [activeSorts,   setActiveSorts]   = useState<SortRow[]>([]);
  const [visibleCols, setVisibleCols]     = useState<Set<string>>(new Set(DEFAULT_VISIBLE_COLS));

  // Stage counts
  const stageCounts: Record<string, number> = { All: ALL_DEALS.length };
  ALL_DEALS.forEach(d => { stageCounts[d.stage] = (stageCounts[d.stage] ?? 0) + 1; });

  // Filtered deals
  const filtered = ALL_DEALS.filter(d => {
    const matchStage  = activeStage === "All" || d.stage === activeStage;
    const q           = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.account.toLowerCase().includes(q) || d.contactName.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  const totalValue = filtered.reduce((s, d) => s + d.amount, 0);

  // -- DataGrid column builders, keyed by COL_DEFS.key
  const COLUMN_BUILDERS: Record<string, GridColDef<Deal>> = {
    dealName: {
      field: "dealName", headerName: "Deal Name", flex: 1.8, minWidth: 160, sortable: false,
      renderHeader: () => <ColHeader label="Deal Name" icon={Handshake} isDark={isDark} />,
      renderCell: (params) => (
        <p className={`m-0 font-heading text-table-cell font-medium truncate ${isDark ? "text-[#FFFFFF]" : "text-slate-800"}`}>{params.row.name}</p>
      ),
    },
    amount: {
      field: "amount", headerName: "Amount", flex: 1, minWidth: 100, sortable: false,
      renderHeader: () => <ColHeader label="Amount" icon={CurrencyCircleDollar} isDark={isDark} />,
      renderCell: (params) => <p className={`m-0 text-table-cell font-medium truncate ${isDark ? "text-[#FFFFFF]" : "text-slate-800"}`}>{fmt(params.row.amount)}</p>,
    },
    accountName: {
      field: "accountName", headerName: "Account Name", flex: 1.3, minWidth: 120, sortable: false,
      renderHeader: () => <ColHeader label="Account Name" icon={Buildings} isDark={isDark} />,
      renderCell: (params) => (
        <p className={`m-0 text-table-cell truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>
          {params.row.account || <span className={isDark ? "text-[#9CA3AF]" : "text-slate-200"}>—</span>}
        </p>
      ),
    },
    stage: {
      field: "stage", headerName: "Stage", flex: 1.7, minWidth: 160, sortable: false,
      renderHeader: () => <ColHeader label="Stage" icon={Pulse} isDark={isDark} />,
      renderCell: (params) => {
        const cfg = STAGE_CFG[params.row.stage] ?? STAGE_CFG["Qualification"];
        return (
          <span className="self-center inline-flex items-center gap-1.5 text-badge-text px-2 py-[3px] rounded-full leading-none"
            style={{ backgroundColor: isDark ? cfg.bgDark : cfg.bg, color: isDark ? cfg.textDark : cfg.text }}>
            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: isDark ? cfg.textDark : cfg.dot }} />
            {params.row.stage}
          </span>
        );
      },
    },
    probability: {
      field: "probability", headerName: "Probability (%)", flex: 1, minWidth: 100, sortable: false,
      renderHeader: () => <ColHeader label="Probability (%)" icon={ChartLineUp} isDark={isDark} />,
      renderCell: (params) => {
        const cfg = STAGE_CFG[params.row.stage] ?? STAGE_CFG["Qualification"];
        return (
          <div className="flex items-center gap-1.5">
            <div className={`w-14 h-1 rounded-full overflow-hidden flex-shrink-0 ${isDark ? "bg-[#27272A]" : "bg-[#E3ECFC]"}`}>
              <div className="h-full rounded-full" style={{ width: `${params.row.probability}%`, backgroundColor: isDark ? cfg.textDark : cfg.dot }} />
            </div>
            <span className={`text-table-cell-secondary font-medium ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>{params.row.probability}%</span>
          </div>
        );
      },
    },
    contactName: {
      field: "contactName", headerName: "Contact Name", flex: 1.3, minWidth: 120, sortable: false,
      renderHeader: () => <ColHeader label="Contact Name" icon={User} isDark={isDark} />,
      renderCell: (params) => (
        <p className={`m-0 text-table-cell truncate ${isDark ? "text-[#A1A1AA]" : "text-slate-500"}`}>
          {params.row.contactName || <span className={isDark ? "text-[#9CA3AF]" : "text-slate-200"}>—</span>}
        </p>
      ),
    },
    createdBy: {
      field: "createdBy", headerName: "Created By", flex: 1.2, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Created By" icon={UserCircle} isDark={isDark} />,
      renderCell: (params) => <p className={`m-0 text-table-cell-secondary truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>{params.row.createdBy}</p>,
    },
    modifiedBy: {
      field: "modifiedBy", headerName: "Modified By", flex: 1.2, minWidth: 110, sortable: false,
      renderHeader: () => <ColHeader label="Modified By" icon={UserCircle} isDark={isDark} />,
      renderCell: (params) => <p className={`m-0 text-table-cell-secondary truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>{params.row.modifiedBy}</p>,
    },
    creation: {
      field: "creation", headerName: "Creation", flex: 1.5, minWidth: 150, sortable: false,
      renderHeader: () => <ColHeader label="Creation" icon={CalendarBlank} isDark={isDark} />,
      renderCell: (params) => <p className={`m-0 text-table-cell-secondary truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>{params.row.creation}</p>,
    },
    modified: {
      field: "modified", headerName: "Modified", flex: 1.5, minWidth: 150, sortable: false,
      renderHeader: () => <ColHeader label="Modified" icon={CalendarBlank} isDark={isDark} />,
      renderCell: (params) => <p className={`m-0 text-table-cell-secondary truncate ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>{params.row.modified}</p>,
    },
  };

  const gridColumns: GridColDef<Deal>[] = [
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

          {/* -- Breadcrumb + Header -- */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-caption text-slate-400 mb-2">
                <House size={16} weight="duotone" />
                <CaretRight size={12} weight="duotone" />
                <Link href="/deals" className={`transition-colors font-medium ${isDark ? "hover:text-[#D4D4D8]" : "hover:text-[#1D4ED8]"}`}>Deals</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-h1 text-slate-900 tracking-tight">Deals</h1>
                <span className="text-badge-text text-slate-400 bg-[#f9fbff] border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  {ALL_DEALS.length} total
                </span>
                {/* Total pipeline value */}
                <span className="flex items-center gap-1 text-badge-text text-[#059669] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <TrendUp size={10} weight="duotone" />
                  Pipeline: ₹{(ALL_DEALS.reduce((s, d) => s + d.amount, 0) / 100000).toFixed(1)}L
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {/* View toggle */}
              <div className={`flex items-center border rounded-xl p-0.5 gap-0.5 shadow-sm ${isDark ? "bg-[#000000] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                {[
                  { k: "list",   Icon: List,     label: "List"   },
                  { k: "grid",   Icon: GridFour, label: "Grid"   },
                  { k: "kanban", Icon: Kanban,   label: "Kanban" },
                ].map(({ k, Icon, label }) => (
                  <button key={k} onClick={() => setView(k as typeof view)}
                    className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-button-sm transition-all ${
                      view === k
                        ? isDark ? "bg-[#18181B] text-[#D4D4D8]" : "bg-[#f9fbff] text-[#1D4ED8]"
                        : isDark ? "text-[#9CA3AF] hover:bg-[#27272A] hover:text-[#D4D4D8]" : "text-slate-400 hover:text-slate-600"
                    }`}>
                    <Icon size={14} weight="duotone" />{label}
                  </button>
                ))}
              </div>

              <Button variant="contained"
                startIcon={<Plus size={16} weight="bold" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px", px: 2, py: 0.85, boxShadow: isDark ? "none" : "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "#2563EB", boxShadow: isDark ? "none" : "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: isDark ? "#9CA3AF" : "#0C2472" } }}>
                New Deal
              </Button>
            </div>
          </div>

          {/* -- Stage filter tabs -- */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STAGE_TABS.map(stage => {
              const cnt    = stageCounts[stage] ?? 0;
              const active = activeStage === stage;
              if (stage !== "All" && cnt === 0) return null;
              return (
                <button key={stage} onClick={() => setActiveStage(stage)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-button-sm whitespace-nowrap transition-all flex-shrink-0 border ${
                    active ? isDark ? "bg-[#18181B] text-white border-[#27272A] shadow-sm shadow-[#27272A]/10" : "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-sm shadow-[#1D4ED8]/20"
                           : isDark ? "bg-[#0A0A0A] text-[#A1A1AA] border-[#27272A] hover:bg-[#27272A] hover:text-[#FFFFFF]" : "bg-[#f9fbff] text-slate-600 border-[#E3ECFC] hover:bg-[#E3ECFC]"
                  }`}>
                  {stage}
                  {cnt > 0 && <span className={`text-badge-text px-2 py-0.5 rounded-full leading-none ${
                    active ? "bg-[#f9fbff]/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>{cnt}</span>}
                </button>
              );
            })}
          </div>

          {/* -- Toolbar -- */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#4A7AE8] transition-all ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search by deal name, account…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.76rem", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

            {/* Filters */}
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
                color: activeFilters.length > 0 ? "#fff" : isDark ? "#9CA3AF" : "#0C2472",
                bgcolor: activeFilters.length > 0 ? "#1D4ED8" : isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px",
                "&:hover": {
                  borderColor: activeFilters.length > 0 ? "#1640B8" : "#1D4ED8",
                  color: activeFilters.length > 0 ? "#fff" : "#0C2472",
                  bgcolor: activeFilters.length > 0 ? "#1640B8" : isDark ? "#0A0A0A" : "#DCE6FB",
                },
              }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            {/* Columns */}
            <Button variant="outlined" size="small"
              startIcon={<Columns size={14} weight="duotone" />}
              onClick={() => setColumnsOpen(true)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#9CA3AF" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px",
                "&:hover": { borderColor: isDark ? "#3F3F46" : "#E3ECFC", bgcolor: isDark ? "#0A0A0A" : "#f9fbff" },
              }}>
              Columns
            </Button>

            {/* Sort */}
            <Button variant="outlined" size="small"
              startIcon={<SortAscending size={14} weight="duotone" />}
              endIcon={<CaretDown size={11} weight="duotone" />}
              onClick={e => setSortAnchor(e.currentTarget)}
              sx={{
                borderColor: isDark ? "#27272A" : "#E3ECFC",
                color: isDark ? "#9CA3AF" : "#0C2472",
                bgcolor: isDark ? "#0F0F0F" : "#E3ECFC",
                borderRadius: "9px", textTransform: "none", fontWeight: 500, fontSize: "14px",
                "&:hover": { borderColor: isDark ? "#3F3F46" : "#E3ECFC", bgcolor: isDark ? "#0A0A0A" : "#f9fbff" },
              }}>
              Sort{activeSorts.length > 0 ? ` (${activeSorts.length})` : ""}
            </Button>

            {/* Filtered value */}
            <div className="ml-auto flex items-center gap-3">
              {filtered.length !== ALL_DEALS.length && (
                <span className="text-badge-text text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ₹{(totalValue / 100000).toFixed(1)}L filtered
                </span>
              )}
              <span className={`text-caption px-3 py-1.5 rounded-lg ${isDark ? "text-[#71717A] bg-[#18181B]" : "text-slate-400 bg-[#f9fbff]"}`}>
                {filtered.length} of {ALL_DEALS.length} records
              </span>
            </div>
          </div>

          {/* -- Bulk action bar -- */}
          {selected.length > 0 && (
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border animate-slide-up shadow-sm ${isDark ? "bg-[#18181B] border-[#27272A]" : "bg-[#EFF6FF] border-[#E3ECFC]"}`}>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#1D4ED8] text-white flex items-center justify-center text-badge-text">{selected.length}</span>
                <span className={`text-button-sm font-semibold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>selected</span>
              </div>
              <div className={`w-px h-4 ${isDark ? "bg-[#27272A]" : "bg-[#E3ECFC]"}`} />
              <button className={`text-button-sm font-medium transition-colors ${isDark ? "text-[#A1A1AA] hover:text-[#FAFAFA]" : "text-[#1D4ED8] hover:text-[#0C2472]"}`}>Update Stage</button>
              <button className={`text-button-sm font-medium transition-colors ${isDark ? "text-[#A1A1AA] hover:text-[#FAFAFA]" : "text-[#1D4ED8] hover:text-[#0C2472]"}`}>Assign Owner</button>
              <button onClick={() => setSelected([])} className={`ml-auto text-button-sm font-medium transition-colors ${isDark ? "text-[#9CA3AF] hover:text-[#A1A1AA]" : "text-slate-400 hover:text-slate-600"}`}>Clear</button>
              <button className={`flex items-center gap-1.5 text-button-sm font-medium transition-colors ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}>
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* -- GRID -- */}
          {view === "grid" && <DealGridView deals={filtered} />}

          {/* -- KANBAN -- */}
          {view === "kanban" && <DealKanbanView deals={filtered} />}

          {/* -- LIST (MUI DataGrid) -- */}
          {view === "list" && (
            <div className="rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden" style={{ height: 600 }}>
              <DataGrid<Deal>
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
                onRowClick={params => router.push(`/deals/${params.id}`)}
                initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                slots={{
                  noRowsOverlay: () => (
                    <div className="py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#f9fbff] flex items-center justify-center mx-auto mb-3">
                        <MagnifyingGlass size={22} color="#94A3B8" weight="duotone" />
                      </div>
                      <p className="font-heading text-slate-500 text-sm font-semibold">No deals found</p>
                      <p className="text-slate-300 text-xs mt-1">Try adjusting your search or stage filter</p>
                    </div>
                  ),
                }}
                sx={getDataGridSx(isDark)}
              />
            </div>
          )}
        </main>
      </div>

      {/* -- Panels -- */}
      <NewDealDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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

