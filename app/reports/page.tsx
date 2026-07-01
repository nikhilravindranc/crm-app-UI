"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useTheme } from "@/components/ThemeContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import {
  House, CaretRight, MagnifyingGlass, Plus, DotsThreeVertical,
  ChartBar, ChartPie, ChartLine, Rows,
} from "@phosphor-icons/react";

interface Report {
  id: string;
  name: string;
  description: string;
  collection: string;
  lastAccessedDate: string;
  createdBy: string;
  icon: React.ElementType;
  color: string;
}

const SAMPLE_REPORTS: Report[] = [
  { id: "r1", name: "Deal 30", description: "", collection: "Deal Reports", lastAccessedDate: "Now", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#6366F1" },
  { id: "r2", name: "Deal with Stage", description: "Deal with Stage", collection: "Deal Reports", lastAccessedDate: "Jun 22, 2026", createdBy: "pm@socialdnalabs.com", icon: ChartBar, color: "#8B5CF6" },
  { id: "r3", name: "Deal List", description: "", collection: "Deal Reports", lastAccessedDate: "Jun 19, 2026", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#EC4899" },
  { id: "r4", name: "Account Wise Deal Summary", description: "Account Wise Deal Summary", collection: "Deal Reports", lastAccessedDate: "Jun 5, 2026", createdBy: "Administrator", icon: ChartBar, color: "#14B8A6" },
];

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [reports] = useState<Report[]>(SAMPLE_REPORTS);

  const filtered = reports.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      <Sidebar />
      <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        <TopBar />

        <div className={`flex-1 overflow-auto ${isDark ? "bg-[#000000]" : "bg-white"}`}>
          {/* Header */}
          <div className={`px-8 py-6 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
            <div className="flex items-center gap-2 mb-4">
              <House size={16} weight="duotone" />
              <button className={`text-[12px] font-medium ${isDark ? "text-[#9CA3AF]" : "text-slate-500"} hover:underline`}>Dashboard</button>
              <CaretRight size={12} weight="duotone" />
              <button className={`text-[12px] font-medium ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Reports</button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-[24px] font-bold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Reports</h1>
                <p className={`text-[13px] mt-1 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Total Records: {filtered.length}</p>
              </div>
              <Button variant="contained" startIcon={<Plus size={16} weight="bold" />}
                sx={{ bgcolor: "#1D4ED8", color: "white", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "14px", px: 2.5, boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
                Create Report
              </Button>
            </div>

            {/* Search */}
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
              <MagnifyingGlass size={14} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search All Reports" value={search} onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "13px", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-[#E3ECFC] bg-white"}`}>
                  <th className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded" /></th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Report Name</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Description</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Collection</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Last Accessed</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Created By</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(report => (
                  <tr key={report.id} className={`border-b ${isDark ? "border-[#1C1C1E] hover:bg-[#111113]" : "border-[#EFF6FF] hover:bg-[#fafcff]"}`}>
                    <td className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: report.color + "18" }}>
                          <report.icon size={14} color={report.color} weight="duotone" />
                        </div>
                        <a href={`/reports/${report.id}`} className={`text-[14px] font-semibold hover:underline ${isDark ? "text-[#60A5FA]" : "text-[#1D4ED8]"}`}>{report.name}</a>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[13px] ${report.description ? (isDark ? "text-[#D4D4D8]" : "text-slate-600") : (isDark ? "text-[#3F3F46]" : "text-slate-300")}`}>{report.description || "—"}</td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{report.collection}</td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{report.lastAccessedDate}</td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{report.createdBy}</td>
                    <td className="px-6 py-4"><IconButton size="small" sx={{ color: isDark ? "#52525B" : "#CBD5E1" }}><DotsThreeVertical size={16} /></IconButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
            <span className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>1–{filtered.length} of {filtered.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
