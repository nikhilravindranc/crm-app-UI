"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { getDataGridSx, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  House, CaretRight, MagnifyingGlass, Star, DotsThree,
  ChartBar, Plus,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

interface Report {
  id: number; name: string; description: string;
  collection: string; lastAccessed: string; createdBy: string;
  isFavorite: boolean;
}

const ALL_REPORTS: Report[] = [
  { id:1,  name:"compoent 1",                description:"",                         collection:"",            lastAccessed:"Now",              createdBy:"PM SDL",       isFavorite:false },
  { id:2,  name:"Account Wise Deal Summary", description:"Account Wise Deal Summary", collection:"Deal Reports", lastAccessed:"18 minutes ago",   createdBy:"Administrator",isFavorite:false },
  { id:3,  name:"Pie chart test 1",          description:"",                         collection:"",            lastAccessed:"18 minutes ago",   createdBy:"PM SDL",       isFavorite:false },
  { id:4,  name:"1231123",                   description:"afsdsdf",                  collection:"Deal Reports", lastAccessed:"about 2 hours ago", createdBy:"PM SDL",       isFavorite:false },
  { id:5,  name:"stage pie chart",           description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:6,  name:"Pie Chart",                 description:"",                         collection:"",            lastAccessed:"—",                 createdBy:"PM SDL",       isFavorite:false },
  { id:7,  name:"Untitled Report",           description:"",                         collection:"",            lastAccessed:"May 18, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:8,  name:"Deal with Stage",           description:"Deal with Stage",          collection:"Deal Reports", lastAccessed:"May 19, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:9,  name:"Deal with Filter",          description:"",                         collection:"Deal Reports", lastAccessed:"May 21, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:10, name:"Lead Summary",              description:"Monthly lead summary",     collection:"Lead Reports", lastAccessed:"May 20, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:11, name:"Contact Activity",          description:"",                         collection:"",            lastAccessed:"May 15, 2026",     createdBy:"PM SDL",       isFavorite:false },
  { id:12, name:"Revenue by Month",          description:"Monthly revenue breakdown",collection:"Deal Reports", lastAccessed:"May 10, 2026",     createdBy:"Administrator",isFavorite:false },
];

const COLLECTIONS = ["All Reports", "Deal Reports", "Lead Reports", "Contact Reports", "Account Reports"];

export default function ReportsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reports, setReports]       = useState<Report[]>(ALL_REPORTS);
  const [selected, setSelected]     = useState<number[]>([]);
  const [collection, setCollection] = useState("All Reports");
  const [search, setSearch]         = useState("");

  const filtered = reports.filter(r => {
    const matchCol = collection === "All Reports" || r.collection === collection;
    const q        = search.toLowerCase();
    const matchQ   = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchCol && matchQ;
  });

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  // ── DataGrid column definitions
  const gridColumns: GridColDef<Report>[] = [
    {
      field: "isFavorite", headerName: "Fav.", width: 50, sortable: false, disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title={params.row.isFavorite ? "Remove from favourites" : "Add to favourites"}>
          <IconButton size="small" onClick={e => toggleFav(params.row.id, e)}
            sx={{ p: 0.25, borderRadius: "6px", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
            <Star size={15} weight={params.row.isFavorite ? "fill" : "regular"} color={params.row.isFavorite ? "#F59E0B" : isDark ? "#3F3F46" : "#E2E8F0"} />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "name", headerName: "Report Name", flex: 1.7, minWidth: 180, sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className={`font-heading text-table-cell font-medium hover:underline truncate ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{params.row.name}</span>
          <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <DotsThree size={16} color={isDark ? "#52525B" : "#94A3B8"} weight="bold" />
          </button>
        </div>
      ),
    },
    {
      field: "description", headerName: "Description", flex: 1.8, minWidth: 180, sortable: false,
      renderCell: (params) => (
        <p className={`m-0 text-table-cell truncate ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>
          {params.row.description || <span className={isDark ? "text-[#3F3F46]" : "text-slate-200"}>—</span>}
        </p>
      ),
    },
    {
      field: "collection", headerName: "Collection", flex: 1.3, minWidth: 130, sortable: false,
      renderCell: (params) => params.row.collection ? (
        <span className={`self-center text-badge-text px-2 py-0.5 rounded-full leading-none ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>{params.row.collection}</span>
      ) : <span className={isDark ? "text-[#3F3F46] text-table-cell" : "text-slate-200 text-table-cell"}>—</span>,
    },
    {
      field: "lastAccessed", headerName: "Last Accessed Date", flex: 1.4, minWidth: 150, sortable: false,
      renderCell: (params) => (
        <p className={`m-0 text-table-cell-secondary ${params.row.lastAccessed === "—" ? (isDark ? "text-[#3F3F46]" : "text-slate-300") : (isDark ? "text-[#71717A]" : "text-slate-500")}`}>{params.row.lastAccessed}</p>
      ),
    },
    {
      field: "createdBy", headerName: "Created By", flex: 1.5, minWidth: 150, sortable: false,
      renderCell: (params) => <p className={`m-0 text-table-cell-secondary truncate ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>{params.row.createdBy}</p>,
    },
    {
      field: "actions", headerName: "", width: 50, sortable: false, disableColumnMenu: true,
      renderCell: () => (
        <div className="flex justify-end w-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip title="More actions">
            <IconButton size="small" onClick={e => e.stopPropagation()}
              sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: isDark ? "#27272A" : "#E3ECFC" } }}>
              <DotsThree size={15} color={isDark ? "#52525B" : "#94A3B8"} weight="bold" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-transparent"}`}>
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-auto transition-colors duration-300">
        <TopBar />

        <main className="flex-1 px-4 md:px-8 py-3 md:py-4 space-y-3 animate-fade-in">

          {/* ── Breadcrumb + Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <div className={`flex items-center gap-1 text-caption mb-2 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/reports" className={`font-medium transition-colors ${isDark ? "hover:text-[#A1A1AA]" : "hover:text-[#1D4ED8]"}`}>Reports</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className={`font-heading text-h1 tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Reports</h1>
                <span className={`text-badge-text px-2 py-0.5 rounded-full shadow-sm border ${isDark ? "text-[#71717A] bg-[#1C1C1E] border-[#27272A]" : "text-slate-400 bg-[#f9fbff] border-[#E3ECFC]"}`}>
                  {ALL_REPORTS.length} total
                </span>
              </div>
            </div>

            <Button variant="contained" startIcon={<Plus size={16} weight="bold" />}
              onClick={() => router.push("/reports/create")}
              sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius:"9px", textTransform:"none", fontWeight:500, fontSize:"14px", px:2.5, py:0.9, mt:1, boxShadow: isDark ? "none" : "0 1px 8px #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#2563EB" } }}>
              Create Report
            </Button>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-2.5">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={collection} onChange={e => setCollection(e.target.value)}
                sx={{ borderRadius:"10px", bgcolor: isDark ? "#111113" : "#f9fbff", fontSize:"14px", border: `1.5px solid ${isDark ? "#27272A" : "#E3ECFC"}`, color: isDark ? "#D4D4D8" : "#334155", "& .MuiOutlinedInput-notchedOutline":{ border:"none" }, "& .MuiSelect-select":{ py:"7px", px:"12px" }, "& .MuiSvgIcon-root":{ color: isDark ? "#52525B" : undefined } }}>
                {COLLECTIONS.map(c => <MenuItem key={c} value={c} sx={{ fontSize:"14px" }}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 w-64 transition-all ${isDark ? "bg-[#111113] border-[#27272A] focus-within:border-[#3F3F46]" : "bg-[#f9fbff] border-[#E3ECFC] focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#4A7AE8]"}`}>
              <MagnifyingGlass size={14} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search All Reports" value={search} onChange={e => setSearch(e.target.value)}
                sx={{ flex:1, fontSize:"14px", color: isDark ? "#A1A1AA" : "#334155", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }}
              />
              {search && <button onClick={() => setSearch("")} className={isDark ? "text-[#52525B] hover:text-[#A1A1AA]" : "text-slate-300 hover:text-slate-500"}>✕</button>}
            </div>

            <span className={`ml-auto text-caption px-3 py-1.5 rounded-lg ${isDark ? "text-[#52525B] bg-[#1C1C1E]" : "text-slate-400 bg-[#f9fbff]"}`}>{filtered.length} of {ALL_REPORTS.length} reports</span>
          </div>

          {/* ── Table (MUI DataGrid) ── */}
          <div className="rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden" style={{ height: 600 }}>
            <DataGrid<Report>
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
              onRowClick={params => router.push(`/reports/${params.id}`)}
              initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
              pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
              slots={{
                noRowsOverlay: () => (
                  <div className="py-16 text-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-[#27272A]" : "bg-[#f9fbff]"}`}>
                      <ChartBar size={22} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" />
                    </div>
                    <p className={`font-heading text-sm font-semibold ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>No reports found</p>
                    <p className={`text-xs mt-1 ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>Try adjusting your search or collection filter</p>
                  </div>
                ),
              }}
              sx={getDataGridSx(isDark)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
