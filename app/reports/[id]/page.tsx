"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
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
  const thBg = isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#E3ECFC] border-[#E3ECFC]";
  const div  = isDark ? "divide-[#27272A]"              : "divide-[#EFF6FF]";
  const foot = isDark ? "border-[#27272A]"              : "border-[#EFF6FF]";

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
                sx={{ bgcolor: isDark ? "#27272A" : "#E3ECFC", color: isDark ? "#F4F4F5" : undefined, borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.76rem", px:2, py:0.8, boxShadow: isDark ? "none" : "0 1px 8px #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#E3ECFC" } }}>
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

          {/* ── Results table ── */}
          <div className={`flex-1 mx-6 my-4 rounded-2xl border shadow-sm overflow-hidden ${card}`}>
            {report.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <ChartBar size={32} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" className="mb-3" />
                <p className={`font-heading text-sm font-semibold ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>No data to display</p>
                <p className={`text-xs mt-1 ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>Run the report to see results</p>
              </div>
            ) : (
              <>
                <div className={`border-b ${thBg}`}>
                  <div className="grid px-4 py-2.5" style={{ gridTemplateColumns:`repeat(${report.columns.length}, 1fr)` }}>
                    {report.columns.map(col => (
                      <div key={col} className={`font-heading text-[10.5px] font-bold uppercase tracking-wider ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{col}</div>
                    ))}
                  </div>
                </div>
                <div className={`divide-y ${div}`}>
                  {report.rows.map((row, i) => (
                    <div key={i} className={`grid px-4 py-3 transition-colors ${isDark ? "hover:bg-[#27272A]" : "hover:bg-[#60A5FA]/[0.04]"}`}
                      style={{ gridTemplateColumns:`repeat(${report.columns.length}, 1fr)` }}>
                      {row.map((cell, j) => (
                        <p key={j} className={`text-[12.5px] font-medium ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>{cell}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className={`flex items-center justify-end px-4 py-3 border-t gap-4 ${foot}`}>
              <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                <span>Rows per page:</span>
                <button className={`flex items-center gap-0.5 font-bold px-2 py-1 rounded-lg text-[11px] ${isDark ? "bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46]" : "bg-[#f9fbff] text-[#1D4ED8] hover:bg-[#E3ECFC]"}`}>
                  25 <CaretDown size={12} weight="duotone" />
                </button>
              </div>
              <span className={`text-[11px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>1–{report.rows.length} of {report.rows.length}</span>
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
