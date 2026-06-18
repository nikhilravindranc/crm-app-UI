"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import {
  House, CaretRight, MagnifyingGlass, Star, DotsThree,
  ChartBar, CaretDown, Plus,
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

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(r => r.id));
  const toggleOne   = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleFav   = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReports(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const tbl  = isDark ? "bg-[#1C1C1E] border-[#27272A]"  : "bg-[#f9fbff] border-[#E3ECFC]";
  const th   = isDark ? "bg-[#111113] border-[#27272A]"  : "bg-[#E3ECFC] border-[#E3ECFC]";
  const thTx = isDark ? "text-[#71717A]"                 : "text-[#0C2472]";
  const div  = isDark ? "divide-[#27272A]"               : "divide-[#EFF6FF]";
  const foot = isDark ? "border-[#27272A]"               : "border-[#EFF6FF]";

  return (
    <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-transparent"}`}>
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-auto transition-colors duration-300">
        <TopBar />

        <main className="flex-1 px-4 md:px-8 py-4 md:py-6 space-y-5 animate-fade-in">

          {/* ── Breadcrumb + Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <div className={`flex items-center gap-1 text-[11px] mb-2 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/reports" className={`font-medium transition-colors ${isDark ? "hover:text-[#A1A1AA]" : "hover:text-[#1D4ED8]"}`}>Reports</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className={`font-heading text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Reports</h1>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm border ${isDark ? "text-[#71717A] bg-[#1C1C1E] border-[#27272A]" : "text-slate-400 bg-[#f9fbff] border-[#E3ECFC]"}`}>
                  {ALL_REPORTS.length} total
                </span>
              </div>
            </div>

            <Button variant="contained" startIcon={<Plus size={16} weight="bold" />}
              onClick={() => router.push("/reports/create")}
              sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.8rem", px:2.5, py:0.9, mt:1, boxShadow: isDark ? "none" : "0 1px 8px #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#2563EB" } }}>
              Create Report
            </Button>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-2.5">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={collection} onChange={e => setCollection(e.target.value)}
                sx={{ borderRadius:"10px", bgcolor: isDark ? "#111113" : "#f9fbff", fontSize:"0.82rem", border: `1.5px solid ${isDark ? "#27272A" : "#E3ECFC"}`, color: isDark ? "#D4D4D8" : "#334155", "& .MuiOutlinedInput-notchedOutline":{ border:"none" }, "& .MuiSelect-select":{ py:"7px", px:"12px" }, "& .MuiSvgIcon-root":{ color: isDark ? "#52525B" : undefined } }}>
                {COLLECTIONS.map(c => <MenuItem key={c} value={c} sx={{ fontSize:"0.82rem" }}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 w-64 transition-all ${isDark ? "bg-[#111113] border-[#27272A] focus-within:border-[#3F3F46]" : "bg-[#f9fbff] border-[#E3ECFC] focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#4A7AE8]"}`}>
              <MagnifyingGlass size={14} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search All Reports" value={search} onChange={e => setSearch(e.target.value)}
                sx={{ flex:1, fontSize:"0.76rem", color: isDark ? "#A1A1AA" : "#334155", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }}
              />
              {search && <button onClick={() => setSearch("")} className={isDark ? "text-[#52525B] hover:text-[#A1A1AA]" : "text-slate-300 hover:text-slate-500"}>✕</button>}
            </div>

            <span className={`ml-auto text-[11px] font-medium px-3 py-1.5 rounded-lg ${isDark ? "text-[#52525B] bg-[#1C1C1E]" : "text-slate-400 bg-[#f9fbff]"}`}>{filtered.length} of {ALL_REPORTS.length} reports</span>
          </div>

          {/* ── Table ── */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${tbl}`}>
            <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
            <div style={{ minWidth: "780px" }}>
            {/* Header */}
            <div className={`grid items-center px-4 py-2.5 border-b ${th}`}
              style={{ gridTemplateColumns: "36px 36px 1fr 220px 160px 170px 180px 40px" }}>
              <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                sx={{ p:0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&.Mui-checked, &.MuiCheckbox-indeterminate":{ color: isDark ? "#52525B" : "#E3ECFC" } }} />
              {["Fav.", "Report Name", "Description", "Collection", "Last Accessed Date", "Created By"].map(h => (
                <div key={h} className={`font-heading text-[10.5px] font-bold uppercase tracking-wider ${thTx}`}>{h}</div>
              ))}
              <div />
            </div>

            {/* Rows */}
            <div className={`divide-y ${div}`}>
              {filtered.map(report => {
                const isSel = selected.includes(report.id);
                return (
                  <div key={report.id}
                    className={`grid items-center px-4 py-3 transition-all cursor-pointer group ${
                      isSel
                        ? isDark ? "bg-[#27272A]" : "bg-[#f9fbff]"
                        : isDark ? "hover:bg-[#27272A]" : "hover:bg-[#60A5FA]/[0.04]"
                    }`}
                    style={{ gridTemplateColumns: "36px 36px 1fr 220px 160px 170px 180px 40px" }}
                    onClick={() => router.push(`/reports/${report.id}`)}>

                    <Checkbox size="small" checked={isSel} onChange={() => toggleOne(report.id)} onClick={e => e.stopPropagation()}
                      sx={{ p:0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&.Mui-checked":{ color: isDark ? "#52525B" : "#E3ECFC" } }} />

                    <Tooltip title={report.isFavorite ? "Remove from favourites" : "Add to favourites"}>
                      <IconButton size="small" onClick={e => toggleFav(report.id, e)}
                        sx={{ p:0.25, borderRadius:"6px", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                        <Star size={15} weight={report.isFavorite ? "fill" : "regular"} color={report.isFavorite ? "#F59E0B" : isDark ? "#3F3F46" : "#E2E8F0"} />
                      </IconButton>
                    </Tooltip>

                    <div className="flex items-center gap-2 pr-2 min-w-0">
                      <span className={`font-heading text-[12.5px] font-semibold hover:underline truncate ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>
                        {report.name}
                      </span>
                      <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <DotsThree size={16} color={isDark ? "#52525B" : "#94A3B8"} weight="bold" />
                      </button>
                    </div>

                    <p className={`text-[12px] truncate pr-2 ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>
                      {report.description || <span className={isDark ? "text-[#3F3F46]" : "text-slate-200"}>—</span>}
                    </p>

                    <div className="pr-2">
                      {report.collection ? (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>
                          {report.collection}
                        </span>
                      ) : <span className={isDark ? "text-[#3F3F46] text-[12px]" : "text-slate-200 text-[12px]"}>—</span>}
                    </div>

                    <p className={`text-[12px] pr-2 ${report.lastAccessed === "—" ? (isDark ? "text-[#3F3F46]" : "text-slate-300") : (isDark ? "text-[#71717A]" : "text-slate-500")}`}>
                      {report.lastAccessed}
                    </p>

                    <p className={`text-[12px] truncate ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>{report.createdBy}</p>

                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip title="More actions">
                        <IconButton size="small" onClick={e => e.stopPropagation()}
                          sx={{ borderRadius:"6px", p:0.5, "&:hover":{ bgcolor: isDark ? "#27272A" : "#E3ECFC" } }}>
                          <DotsThree size={15} color={isDark ? "#52525B" : "#94A3B8"} weight="bold" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
            </div></div>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-[#27272A]" : "bg-[#f9fbff]"}`}>
                  <ChartBar size={22} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" />
                </div>
                <p className={`font-heading text-sm font-semibold ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>No reports found</p>
                <p className={`text-xs mt-1 ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>Try adjusting your search or collection filter</p>
              </div>
            )}

            {/* Pagination */}
            <div className={`flex items-center justify-end px-4 py-3 border-t gap-4 ${foot}`}>
              <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                <span>Rows per page:</span>
                <button className={`flex items-center gap-0.5 font-bold px-2 py-1 rounded-lg text-[11px] ${isDark ? "bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46]" : "bg-[#f9fbff] text-[#1D4ED8] hover:bg-[#E3ECFC]"}`}>
                  20 <CaretDown size={12} weight="duotone" />
                </button>
              </div>
              <span className={`text-[11px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>1–{filtered.length} of {ALL_REPORTS.length}</span>
              <div className="flex items-center gap-1">
                <button className={`w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30 font-bold text-sm ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#f9fbff] text-[#1D4ED8]"}`} disabled>‹</button>
                <button className={`w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-30 font-bold text-sm ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#f9fbff] text-[#1D4ED8]"}`} disabled>›</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
