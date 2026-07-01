"use client";
import { useState, use } from "react";
import { useTheme } from "@/components/ThemeContext";
import WidgetCard from "@/components/shared/WidgetCard";
import MetricCard from "@/components/shared/MetricCard";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CaretDown, Info, PencilSimple, Plus, Rows, ChartBar, Funnel, Handshake, Users, TrendUp } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportData {
  contactName: string;
  createdBy: string;
  dealName: string;
  amount: number;
  modifiedBy: string;
  accountName: string;
  probability: number;
  stage: string;
}

const CHART_DATA_PIE = [
  { name: "John Smith", value: 4 },
  { name: "Speedy Mike", value: 2 },
  { name: "SDL Test Test-SDL", value: 1 },
  { name: "Raja rajan", value: 3 },
  { name: "Lead SDL 11", value: 1 },
  { name: "mmmmm mmmm", value: 1 },
  { name: "Vishnutharan R", value: 1 },
];

const CHART_DATA_BAR = [
  { name: "Vishnutharan R", "John Smith": 30, "Speedy Mike": 40 },
  { name: "test test", "John Smith": 50, "Speedy Mike": 35 },
  { name: "Speedy Mike", "John Smith": 45, "Speedy Mike": 25 },
  { name: "SDL Test Test-SDL", "John Smith": 60, "Speedy Mike": 20 },
  { name: "Raja rajan", "John Smith": 75, "Speedy Mike": 50 },
  { name: "mmmmm mmmm", "John Smith": 40, "Speedy Mike": 30 },
  { name: "Lead SDL 11", "John Smith": 55, "Speedy Mike": 45 },
];

const CHART_DATA_HORIZONTAL = [
  { name: "Vishnutharan R", value: 800000 },
  { name: "test test", value: 400000 },
  { name: "Speedy Mike", value: 650000 },
  { name: "SDL Test Test-SDL", value: 900000 },
  { name: "Raja rajan", value: 500000 },
  { name: "mmmmm mmmm", value: 300000 },
  { name: "Lead SDL 11", value: 700000 },
];

const TABLE_DATA: ReportData[] = [
  { contactName: "", createdBy: "pm@socialdnalabs.com", dealName: "New", amount: 29999, modifiedBy: "pm@socialdnalabs.com", accountName: "Sweany Inc", probability: 75, stage: "Proposal/Price Quote" },
  { contactName: "", createdBy: "pm@socialdnalabs.com", dealName: "Test", amount: 10000, modifiedBy: "pm@socialdnalabs.com", accountName: "SDL", probability: 75, stage: "Proposal/Price Quote" },
  { contactName: "John Smith", createdBy: "pm@socialdnalabs.com", dealName: "Smith", amount: 100000, modifiedBy: "pm@socialdnalabs.com", accountName: "test", probability: 40, stage: "Value Proposition" },
  { contactName: "John Smith", createdBy: "pm@socialdnalabs.com", dealName: "test deal john smith", amount: 200000, modifiedBy: "pm@socialdnalabs.com", accountName: "Sears Homelife", probability: 0, stage: "Qualification" },
  { contactName: "Lead SDL 11", createdBy: "pm@socialdnalabs.com", dealName: "Deal SDL 11", amount: 500000, modifiedBy: "pm@socialdnalabs.com", accountName: "SDL LEAD1", probability: 75, stage: "Proposal/Price Quote" },
];

const COLORS_LIGHT = ["#0C2472", "#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#14B8A6"];
const COLORS_DARK = ["#60A5FA", "#34D399", "#FBBF24", "#F472B6", "#A78BFA", "#38BDF8", "#FB923C"];

const STAGE_CHIP: Record<string, { bg: string; fg: string }> = {
  "Proposal/Price Quote": { bg: "#E3ECFC", fg: "#0C2472" },
  "Value Proposition": { bg: "#EFF6FF", fg: "#0C2472" },
  "Qualification": { bg: "#FEF3C7", fg: "#92400E" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
      {label && <p className="text-slate-400 text-[12px] mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold text-[13px]" style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const totalRecords = 14;
  const totalAmount = TABLE_DATA.reduce((s, r) => s + r.amount, 0);
  const avgProbability = Math.round(TABLE_DATA.reduce((s, r) => s + r.probability, 0) / TABLE_DATA.length);

  const cellSx = {
    borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`,
    py: "14px",
    backgroundColor: isDark ? "#18181B" : "#f9fbff",
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      
      <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
       

        <div className={`flex-1 overflow-auto ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
          <main className="px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className={isDark ? "text-[#9CA3AF] hover:text-white" : "text-slate-500 hover:text-slate-700"}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className={`text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>Deal 30</h1>
                <Tooltip title="Report info">
                  <IconButton size="small" sx={{ color: isDark ? "#71717A" : "#64748B" }}>
                    <Info size={16} weight="duotone" />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Updated 26 days ago</span>
                <Tooltip title="Refresh">
                  <IconButton size="small" sx={{ color: isDark ? "#71717A" : "#64748B", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </IconButton>
                </Tooltip>
                <Button
                  href={`/reports/${id}/edit`}
                  size="small"
                  variant="outlined"
                  startIcon={<PencilSimple size={16} weight="duotone" />}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", color: isDark ? "#D4D4D8" : "#0C2472", borderColor: isDark ? "#27272A" : "#E3ECFC", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} weight="duotone" />}
                  sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
                  Create Chart
                </Button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tooltip title="Filter">
                  <IconButton size="small" sx={{ color: isDark ? "#71717A" : "#64748B" }}>
                    <Funnel size={18} weight="duotone" />
                  </IconButton>
                </Tooltip>
                <span className={`text-[14px] font-bold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>Total Records : {totalRecords}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button size="small" sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, color: isDark ? "#D4D4D8" : "#64748B" }}>
                  Show Details
                  <CaretDown size={12} weight="duotone" className="ml-1" />
                </Button>
                <div className="flex gap-1">
                  <Tooltip title="Grid view">
                    <IconButton size="small" onClick={() => setViewMode("grid")}
                      sx={{ color: viewMode === "grid" ? "#1D4ED8" : (isDark ? "#71717A" : "#64748B"), bgcolor: viewMode === "grid" ? (isDark ? "#27272A" : "#EFF6FF") : "transparent" }}>
                      <ChartBar size={16} weight="duotone" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List view">
                    <IconButton size="small" onClick={() => setViewMode("list")}
                      sx={{ color: viewMode === "list" ? "#1D4ED8" : (isDark ? "#71717A" : "#64748B"), bgcolor: viewMode === "list" ? (isDark ? "#27272A" : "#EFF6FF") : "transparent" }}>
                      <Rows size={16} weight="duotone" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Summary metric cards — matches Dashboard KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <MetricCard title="Total Records" value={totalRecords} icon={<Rows size={18} weight="duotone" />} fill="#D6E4F9" accent="#2F6FED" isDark={isDark} />
              <MetricCard title="Total Deal Amount" value={`₹${(totalAmount / 1000).toFixed(0)}k`} icon={<Handshake size={18} weight="duotone" />} fill="#FAE3D0" accent="#E0883F" isDark={isDark} />
              <MetricCard title="Avg. Probability" value={`${avgProbability}%`} icon={<TrendUp size={18} weight="duotone" />} fill="#D0E5E0" accent="#2E9E7B" isDark={isDark} />
              <MetricCard title="Contacts Involved" value={new Set(TABLE_DATA.map(r => r.contactName).filter(Boolean)).size} icon={<Users size={18} weight="duotone" />} fill="#F5D9E1" accent="#DB5E8C" isDark={isDark} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <WidgetCard title="Count by Contact Name" subtitle="Deals grouped by contact" isDark={isDark}>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={CHART_DATA_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={78} paddingAngle={2} dataKey="value">
                      {CHART_DATA_PIE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: isDark ? "#9CA3AF" : "#6B7280" }} iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </WidgetCard>

              <WidgetCard title="Amount by Contact Name" subtitle="Deal value distribution" isDark={isDark}>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={CHART_DATA_HORIZONTAL} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barSize={11}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#6B7280", fontWeight: 500 }} axisLine={false} tickLine={false} width={110} />
                    <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={isDark ? "#60A5FA" : "#0C2472"} />
                  </BarChart>
                </ResponsiveContainer>
              </WidgetCard>
            </div>

            <WidgetCard title="Count of Contact Name" subtitle="Deal count per rep, compared" isDark={isDark}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={CHART_DATA_BAR} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272A" : "#F0F2F5"} vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? "#9CA3AF" : "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
                  <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: isDark ? "#9CA3AF" : "#6B7280" }} iconSize={8} />
                  <Bar dataKey="John Smith" fill={isDark ? "#60A5FA" : "#0C2472"} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Speedy Mike" fill={isDark ? "#FBBF24" : "#F59E0B"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </WidgetCard>

            {/* Data Table — matches RecentDeals styling */}
            <WidgetCard title="Report Data" subtitle={`${TABLE_DATA.length} of ${totalRecords} records`} isDark={isDark} noPadding>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Contact Name", "Created By", "Deal Name", "Amount", "Modified By", "Account Name", "Probability", "Stage"].map(h => (
                        <TableCell key={h} sx={{ backgroundColor: isDark ? "#111111" : "#EFF6FF", color: isDark ? "#9CA3AF" : "#0C2472", borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`, fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TABLE_DATA.map((row, idx) => {
                      const chip = STAGE_CHIP[row.stage] || { bg: "#F1F5F9", fg: "#475569" };
                      return (
                        <TableRow key={idx} hover sx={{ "&:hover td": { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(29,78,216,0.04)" }, cursor: "pointer", "& td": cellSx }}>
                          <TableCell><span className={`text-[14px] font-medium ${isDark ? "text-[#E2E8F0]" : "text-slate-700"}`}>{row.contactName || "—"}</span></TableCell>
                          <TableCell><span className="text-[12px] text-slate-400 font-medium">{row.createdBy}</span></TableCell>
                          <TableCell><span className={`text-[14px] font-semibold ${isDark ? "text-[#FFFFFF]" : "text-slate-800"}`}>{row.dealName}</span></TableCell>
                          <TableCell><span className={`text-[14px] font-bold ${isDark ? "text-[#FFFFFF]" : "text-slate-800"}`}>₹{row.amount.toLocaleString("en-IN")}</span></TableCell>
                          <TableCell><span className="text-[12px] text-slate-400 font-medium">{row.modifiedBy}</span></TableCell>
                          <TableCell><span className={`text-[13px] font-medium ${isDark ? "text-[#D4D4D8]" : "text-slate-600"}`}>{row.accountName}</span></TableCell>
                          <TableCell><span className={`text-[13px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{row.probability}%</span></TableCell>
                          <TableCell>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: isDark ? "rgba(39,39,42,0.8)" : chip.bg, color: isDark ? "#A1A1AA" : chip.fg }}>
                              {row.stage}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={`px-6 py-4 flex justify-between items-center border-t ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                <span className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Rows per page: 25</span>
                <span className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>1–{TABLE_DATA.length} of {totalRecords}</span>
              </div>
            </WidgetCard>
          </main>
        </div>
      </div>
  );
}
