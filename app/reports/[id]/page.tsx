"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { getDataGridSx, ROWS_PER_PAGE_OPTIONS } from "@/lib/dataGridStyles";
import {
  ArrowLeft, FunnelSimple, PencilSimple, CaretDown,
  ChartBar, ArrowsClockwise, Info,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

const REPORT_DATA: Record<number, { name: string; updatedAt: string; columns: string[]; rows: string[][] }> = {
  1: { name:"compoent 1",              updatedAt:"Updated about 6 hours ago", columns:["STAGE"], rows:[["Identify Decision Makers"],["Needs Analysis"],["Proposal/Price Quote"],["Qualification"],["Value Proposition"]] },
  2: { name:"Account Wise Deal Summary",updatedAt:"Updated 18 minutes ago",  columns:["ACCOUNT NAME","TOTAL DEALS","TOTAL AMOUNT","AVG PROBABILITY"], rows:[["Sweany Inc","1","₹29,999","75%"],["RMVT","4","₹1,400,000","10%"],["SDL","2","₹210,000","43%"],["test","3","₹350,000","17%"]] },
  8: { name:"Deal with Stage",          updatedAt:"Updated May 19, 2026",     columns:["DEAL NAME","STAGE","AMOUNT","PROBABILITY"], rows:[["New","Proposal/Price Quote","₹29,999","75%"],["testing","Needs Analysis","₹500,000","20%"],["Smith","Value Proposition","₹100,000","40%"]] },
  9: { name:"Deal with Filter",         updatedAt:"Updated May 21, 2026",     columns:["DEAL NAME","STAGE","AMOUNT"], rows:[["New","Proposal/Price Quote","₹29,999"],["Test","Proposal/Price Quote","₹10,000"]] },
};

const DEFAULT_REPORT = { name:"Report", updatedAt:"Updated recently", columns:["NAME"], rows:[] };

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }   = use(params);
  const router   = useRouter();
  const { theme } = useTheme();
  const isDark   = theme === "dark";
  const reportId = parseInt(id);
  const report   = REPORT_DATA[reportId] ?? { ...DEFAULT_REPORT, name:`Report ${reportId}` };

  const [showDetails, setShowDetails] = useState(false);

  const card = isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]";
  const hdr  = isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]";

  return (
    <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-transparent"}`}>
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 flex flex-col animate-fade-in">

          {/* ── Report header ── */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${hdr}`}>
            <div className="flex items-center gap-3">
              <Tooltip title="Back to Reports">
                <IconButton size="small" onClick={() => router.push("/reports")}
                  sx={{ borderRadius:"8px", border:`1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, bgcolor: isDark ? "#27272A" : "transparent", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#EFF6FF" } }}>
                  <ArrowLeft size={17} color={isDark ? "#A1A1AA" : "#64748B"} weight="duotone" />
                </IconButton>
              </Tooltip>
              <h1 className={`font-heading text-[16px] font-bold ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>{report.name}</h1>
              <Tooltip title="Report information">
                <Info size={15} color={isDark ? "#3F3F46" : "#94A3B8"} weight="duotone" className="cursor-pointer" />
              </Tooltip>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[11.5px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{report.updatedAt}</span>
              <Tooltip title="Refresh">
                <IconButton size="small" sx={{ borderRadius:"8px", bgcolor: isDark ? "#27272A" : "transparent", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#EFF6FF" } }}>
                  <ArrowsClockwise size={16} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
                </IconButton>
              </Tooltip>
              <div className={`flex items-center border rounded-xl overflow-hidden shadow-sm ${isDark ? "border-[#3F3F46]" : "border-[#E3ECFC]"}`}>
                <Button variant="outlined" size="small"
                  startIcon={<PencilSimple size={13} weight="duotone" />}
                  onClick={() => router.push("/reports/create")}
                  sx={{ borderColor:"transparent", borderRadius:0, textTransform:"none", fontWeight:600, fontSize:"0.76rem", color: isDark ? "#A1A1AA" : "#475569", bgcolor: isDark ? "#1C1C1E" : "transparent", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF", color: isDark ? "#D4D4D8" : "#E3ECFC", borderColor:"transparent" } }}>
                  Edit
                </Button>
                <div className={`w-px h-6 ${isDark ? "bg-[#3F3F46]" : "bg-[#E3ECFC]"}`} />
                <IconButton size="small" sx={{ borderRadius:0, px:1, bgcolor: isDark ? "#1C1C1E" : "transparent", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                  <CaretDown size={12} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
                </IconButton>
              </div>
              <Button variant="contained" size="small"
                startIcon={<ChartBar size={14} weight="duotone" />}
                sx={{ bgcolor: isDark ? "#27272A" : "#1D4ED8", color: isDark ? "#F4F4F5" : "white", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.76rem", px:2, py:0.8, boxShadow: isDark ? "none" : "0 1px 8px #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#2563EB" } }}>
                Create Chart
              </Button>
            </div>
          </div>

          {/* ── Sub-toolbar ── */}
          <div className={`flex items-center justify-between px-6 py-3 border-b ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#EFF6FF]"}`}>
            <div className="flex items-center gap-3">
              <Button variant="outlined" size="small"
                startIcon={<FunnelSimple size={13} weight="duotone" />}
                sx={{ borderColor: isDark ? "#3F3F46" : "#E3ECFC", color: isDark ? "#A1A1AA" : "#E3ECFC", borderRadius:"8px", textTransform:"none", fontWeight:600, fontSize:"0.74rem", bgcolor: isDark ? "#27272A" : "#EFF6FF", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#E3ECFC" } }}>
                Filter
              </Button>
              <span className={`text-[12px] font-semibold ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>
                Total Records : <span className={isDark ? "text-[#D4D4D8]" : "text-[#1D4ED8]"}>{report.rows.length}</span>
              </span>
            </div>
            <button onClick={() => setShowDetails(v => !v)}
              className={`flex items-center gap-1 text-[12px] font-semibold transition-colors ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>
              Show Details
              <CaretDown size={12} weight="duotone" className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ── Results table (MUI DataGrid) ── */}
          <div className={`flex-1 mx-6 my-4 rounded-2xl border shadow-sm overflow-hidden ${card}`} style={{ minHeight: 400 }}>
            {report.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <ChartBar size={32} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" className="mb-3" />
                <p className={`font-heading text-sm font-semibold ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>No data to display</p>
                <p className={`text-xs mt-1 ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>Run the report to see results</p>
              </div>
            ) : (
              <div style={{ height: 500 }}>
                <DataGrid
                  disableColumnMenu
                  rows={report.rows.map((row, i) => {
                    const r: Record<string, string | number> = { id: i };
                    report.columns.forEach((col, j) => { r[col] = row[j] ?? ""; });
                    return r;
                  })}
                  columns={report.columns.map((col): GridColDef => ({
                    field: col, headerName: col, flex: 1, sortable: false,
                    renderHeader: () => <div className={`font-heading text-table-header uppercase tracking-wide ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{col}</div>,
                    renderCell: (params) => <p className={`m-0 text-table-cell font-medium ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>{params.value}</p>,
                  }))}
                  initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                  pageSizeOptions={ROWS_PER_PAGE_OPTIONS}
                  sx={getDataGridSx(isDark)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
