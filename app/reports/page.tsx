"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import {
  House, CaretRight, MagnifyingGlass, Plus, DotsThreeVertical, Star,
  ChartBar, ChartPie, ChartLine, Rows, X,
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
  tags: string[];
  isPinned: boolean;
}

const SAMPLE_REPORTS: Report[] = [
  { id: "r1", name: "Deal 30", description: "", collection: "Deal Reports", lastAccessedDate: "Now", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#6366F1", tags: ["deals", "sales", "active"], isPinned: true },
  { id: "r2", name: "Deal with Stage", description: "Deal with Stage", collection: "Deal Reports", lastAccessedDate: "Jun 22, 2026", createdBy: "pm@socialdnalabs.com", icon: ChartBar, color: "#8B5CF6", tags: ["deals", "pipeline", "analytics"], isPinned: false },
  { id: "r3", name: "Deal List", description: "", collection: "Deal Reports", lastAccessedDate: "Jun 19, 2026", createdBy: "pm@socialdnalabs.com", icon: Rows, color: "#EC4899", tags: ["deals", "sales"], isPinned: false },
  { id: "r4", name: "Account Wise Deal Summary", description: "Account Wise Deal Summary", collection: "Deal Reports", lastAccessedDate: "Jun 5, 2026", createdBy: "Administrator", icon: ChartBar, color: "#14B8A6", tags: ["accounts", "deals", "summary"], isPinned: true },
];

export default function ReportsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Sales"]);

  // Get all categories with counts
  const allCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    reports.forEach(r => categoryMap.set(r.collection, (categoryMap.get(r.collection) || 0) + 1));
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [reports]);

  // Get pinned reports
  const pinnedReports = reports.filter(r => r.isPinned);

  // Filter reports by search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [reports, search]);

  const toggleCategory = (category: string) =>
    setExpandedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);

  const togglePin = (reportId: string) => {
    setReports(prev => prev.map(r =>
      r.id === reportId ? { ...r, isPinned: !r.isPinned } : r
    ));
  };

  return (
    <div className={`sidebar-content flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      {/* Left Sidebar - Pinned & Categories */}
      <aside className={`w-60 flex-shrink-0 border-r flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-[#E3ECFC] bg-[#f9fbff]"}`}>
        {/* Sidebar Header */}
        <div className={`px-4 pt-5 pb-4 border-b transition-colors duration-300 ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm flex-shrink-0">
              <ChartBar size={15} color="#fff" weight="duotone" />
            </div>
            <div>
              <div className={`font-heading text-[14px] font-bold leading-tight ${isDark ? "text-[#FFFFFF]" : "text-slate-900"}`}>Reports</div>
              <div className="text-[12px] text-slate-400 leading-tight">Browse &amp; organize</div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5">
          {/* Pinned Reports Section */}
          {pinnedReports.length > 0 && (
            <div>
              <div className={`flex items-center gap-1.5 px-2 py-1.5 min-h-[32px] ${isDark ? "text-[#475569]" : "text-slate-400"}`}>
                <ChartBar size={13} weight="duotone" />
                <span className="font-heading text-[13px] font-bold uppercase tracking-widest truncate">Pinned</span>
              </div>
              <div className="space-y-0.5 mb-1.5">
                {pinnedReports.map(report => (
                  <button key={report.id}
                    onClick={() => router.push(`/reports/${report.id}`)}
                    className={`relative flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all min-h-[36px] outline-none focus:outline-none focus-visible:ring-2 ${
                      isDark ? "focus-visible:ring-[#3B82F6]" : "focus-visible:ring-[#1D4ED8]"
                    } ${
                      isDark ? "text-[#9CA3AF] hover:bg-[#1D4ED8]/15 hover:text-[#93C5FD]" : "text-slate-500 hover:bg-[#EFF6FF]/60 hover:text-slate-700"
                    }`}>
                    <report.icon size={13} color={report.color} weight="duotone" />
                    <span className="flex-1 truncate text-left">{report.name}</span>
                    <Star size={13} color={report.color} weight="fill" className="flex-shrink-0 opacity-80" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Section */}
          <div>
            <div className={`flex items-center gap-1.5 px-2 py-1.5 min-h-[32px] ${isDark ? "text-[#475569]" : "text-slate-400"}`}>
              <ChartBar size={13} weight="duotone" />
              <span className="font-heading text-[13px] font-bold uppercase tracking-widest truncate">Categories</span>
            </div>
            <div className="space-y-0.5">
              {allCategories.map(({ name, count }) => {
                const isOpen = expandedCategories.includes(name);
                return (
                  <div key={name}>
                    <button
                      onClick={() => toggleCategory(name)}
                      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg transition-colors group min-h-[32px] outline-none ${isDark ? "hover:bg-[#1D4ED8]/15" : "hover:bg-[#EFF6FF]"}`}>
                      <span className={`font-heading text-[13px] font-bold uppercase tracking-widest transition-colors truncate ${isDark ? "text-[#475569] group-hover:text-[#64748B]" : "text-slate-400 group-hover:text-slate-500"}`}>
                        {name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-[#27272A] text-[#9CA3AF]" : "bg-[#E3ECFC] text-slate-500"}`}>{count}</span>
                        <ChartBar size={10} weight="bold" color={isDark ? "#475569" : "#CBD5E1"} className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Expandable Category Reports */}
                    {isOpen && (
                      <div className="space-y-0.5 mb-1.5">
                        {reports.filter(r => r.collection === name).map(report => (
                          <button key={report.id}
                            onClick={() => router.push(`/reports/${report.id}`)}
                            className={`relative flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all min-h-[36px] outline-none focus:outline-none focus-visible:ring-2 ${
                              isDark ? "focus-visible:ring-[#3B82F6]" : "focus-visible:ring-[#1D4ED8]"
                            } ${
                              isDark ? "text-[#9CA3AF] hover:bg-[#1D4ED8]/15 hover:text-[#93C5FD]" : "text-slate-500 hover:bg-[#EFF6FF]/60 hover:text-slate-700"
                            }`}>
                            <report.icon size={13} color={report.color} weight="duotone" />
                            <span className="flex-1 truncate text-left">{report.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Right Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
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
                onClick={() => router.push("/reports/new/edit")}
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
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Tags</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Last Accessed</th>
                  <th className={`px-6 py-4 text-left text-[12px] font-semibold uppercase ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Created By</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(report => (
                  <tr key={report.id} className={`border-b cursor-pointer ${isDark ? "border-[#1C1C1E] hover:bg-[#111113]" : "border-[#EFF6FF] hover:bg-[#fafcff]"}`}
                    onClick={() => router.push(`/reports/${report.id}`)}>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}><input type="checkbox" className="w-4 h-4 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: report.color + "18" }}>
                          <report.icon size={14} color={report.color} weight="duotone" />
                        </div>
                        <span className={`text-[14px] font-semibold ${isDark ? "text-[#60A5FA]" : "text-[#1D4ED8]"}`}>{report.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[13px] ${report.description ? (isDark ? "text-[#D4D4D8]" : "text-slate-600") : (isDark ? "text-[#3F3F46]" : "text-slate-300")}`}>{report.description || "—"}</td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {report.tags.slice(0, 2).map(tag => (
                          <span key={tag} className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? "bg-[#18181B] text-[#71717A]" : "bg-[#E3ECFC] text-[#4A5675]"}`}>{tag}</span>
                        ))}
                        {report.tags.length > 2 && <span className={`text-[11px] font-semibold ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>+{report.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{report.lastAccessedDate}</td>
                    <td className={`px-6 py-4 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{report.createdBy}</td>
                    <td className="px-6 py-4 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <Tooltip title={report.isPinned ? "Unpin" : "Pin"}>
                        <IconButton size="small" onClick={() => togglePin(report.id)}
                          sx={{ color: report.isPinned ? "#F59E0B" : (isDark ? "#52525B" : "#CBD5E1") }}>
                          <Star size={16} weight={report.isPinned ? "fill" : "duotone"} />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" sx={{ color: isDark ? "#52525B" : "#CBD5E1" }}><DotsThreeVertical size={16} /></IconButton>
                    </td>
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
  );
}
