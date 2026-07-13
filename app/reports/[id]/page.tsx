"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";
import WidgetCard from "@/components/shared/WidgetCard";
import MetricCard from "@/components/shared/MetricCard";
import { getModuleFields, SAMPLE_DATA } from "@/lib/moduleRelationships";
import { ReportGraphConfig, loadReportConfig } from "@/lib/reportGraphSerializer";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CaretDown, Info, PencilSimple, Plus, Rows, ChartBar, Funnel, Handshake, Users, TrendUp, X, ChartPie, ChartBarHorizontal, ChartDonut, ChartLine, ChartLineUp, GridFour, ArrowsLeftRight, Gauge, Trophy, ChartScatter } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

// Names for the built-in sample reports (matches app/reports/page.tsx listing)
const SAMPLE_REPORT_NAMES: Record<string, string> = {
  r1: "Deal 30",
  r2: "Deal with Stage",
  r3: "Deal List",
  r4: "Account Wise Deal Summary",
  r5: "Sales Pipeline",
  r6: "Revenue Trends",
  r7: "Account Performance",
  r8: "Customer Segmentation",
};

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

const CHART_TYPES: { key: string; label: string; icon: React.ElementType }[] = [
  { key: "column", label: "Column", icon: ChartBar },
  { key: "bar", label: "Bar", icon: ChartBarHorizontal },
  { key: "donut", label: "Donut", icon: ChartDonut },
  { key: "pie", label: "Pie", icon: ChartPie },
  { key: "treemap", label: "Treemap", icon: GridFour },
  { key: "butterfly", label: "Butterfly", icon: ArrowsLeftRight },
  { key: "live", label: "Live", icon: ChartLine },
  { key: "funnel", label: "Funnel", icon: Funnel },
  { key: "area", label: "Area", icon: ChartLineUp },
  { key: "progress", label: "Progress", icon: Gauge },
  { key: "scatter", label: "Scatter", icon: ChartScatter },
  { key: "basic-kpi", label: "Basic KPI", icon: Rows },
];

const MEASURE_OPTIONS = ["Count of Records", "Sum of Amount", "Average Probability", "Count of Unique"];
const GROUP_BY_OPTIONS = ["Contact Name", "Account Name", "Stage", "Probability", "Created By"];

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

// Matches the "Add Component" chart preview palette used on the dashboard builder
const PREVIEW_CHART_DATA = [
  { name: "Group A", value: 2 },
  { name: "Group B", value: 4 },
  { name: "Group C", value: 3 },
];
const PREVIEW_CHART_COLORS = ["#F59E0B", "#F59E0B", "#3B82F6"];

function ChartTypePreview({ chartType, isDark }: { chartType: string; isDark: boolean }) {
  if (chartType === "donut" || chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={PREVIEW_CHART_DATA} cx="50%" cy="50%" innerRadius={chartType === "donut" ? 38 : 0} outerRadius={62} paddingAngle={2} dataKey="value" nameKey="name">
            {PREVIEW_CHART_DATA.map((_, i) => <Cell key={i} fill={PREVIEW_CHART_COLORS[i]} stroke="none" />)}
          </Pie>
          <RechartsTooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (chartType === "bar" || chartType === "funnel" || chartType === "butterfly") {
    return (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={PREVIEW_CHART_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={14}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#6B7280", fontWeight: 500 }} axisLine={false} tickLine={false} width={60} />
          <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {PREVIEW_CHART_DATA.map((_, i) => <Cell key={i} fill={PREVIEW_CHART_COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  // column / default (also used for live, area, progress, scatter, treemap, basic-kpi previews)
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={PREVIEW_CHART_DATA} margin={{ top: 6, right: 8, left: -20, bottom: 0 }} barSize={36}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272A" : "#F0F2F5"} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
        <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {PREVIEW_CHART_DATA.map((_, i) => <Cell key={i} fill={PREVIEW_CHART_COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CreatedChart {
  id: string;
  name: string;
  chartType: string;
  measure: string;
  groupBy: string;
}

// Groups rows by `groupByKey` and aggregates by the chosen measure (records count, sum of a numeric field, etc.)
function aggregateChartRows(
  rows: Record<string, any>[],
  groupByKey: string,
  measure: string,
  numericFieldForMeasure?: (measure: string) => string | null
): { name: string; value: number }[] {
  const groups = new Map<string, Record<string, any>[]>();
  rows.forEach((row) => {
    const key = String(row[groupByKey] ?? "—");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  });

  return Array.from(groups.entries()).map(([name, groupRows]) => {
    let value = groupRows.length; // default: Count of Records
    if (measure === "Average Probability") {
      const nums = groupRows.map((r) => Number(r.probability) || 0);
      value = nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0;
    } else if (measure === "Count of Unique") {
      value = new Set(groupRows.map((r) => r[groupByKey])).size;
    } else if (numericFieldForMeasure) {
      const field = numericFieldForMeasure(measure);
      if (field) {
        value = groupRows.reduce((s, r) => {
          const raw = r[field];
          const num = typeof raw === "number" ? raw : parseFloat(String(raw ?? "").replace(/[^0-9.-]/g, ""));
          return s + (isNaN(num) ? 0 : num);
        }, 0);
      }
    }
    return { name, value };
  });
}

function CreatedChartCard({
  chart,
  data,
  isDark,
  onDelete,
}: {
  chart: CreatedChart;
  data: { name: string; value: number }[];
  isDark: boolean;
  onDelete: () => void;
}) {
  const colors = ["#F59E0B", "#3B82F6", "#10B981", "#EC4899", "#8B5CF6", "#14B8A6", "#F97316"];

  return (
    <WidgetCard title={chart.name} subtitle={`${chart.measure} by ${chart.groupBy}`} isDark={isDark}>
      <div className="relative">
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{ position: "absolute", top: -4, right: -4, zIndex: 1, borderRadius: "8px", border: `1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, "&:hover": { bgcolor: isDark ? "#27272A" : "#FEE2E2" } }}
        >
          <X size={13} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
        </IconButton>
        {data.length === 0 ? (
          <div className={`text-center py-10 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>No data to chart.</div>
        ) : chart.chartType === "donut" || chart.chartType === "pie" ? (
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={chart.chartType === "donut" ? 45 : 0} outerRadius={78} paddingAngle={2} dataKey="value" nameKey="name">
                {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} stroke="none" />)}
              </Pie>
              <RechartsTooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: isDark ? "#9CA3AF" : "#6B7280" }} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        ) : chart.chartType === "bar" || chart.chartType === "funnel" || chart.chartType === "butterfly" ? (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barSize={16}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#6B7280", fontWeight: 500 }} axisLine={false} tickLine={false} width={110} />
              <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272A" : "#F0F2F5"} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? "#9CA3AF" : "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#9CA3AF" }} axisLine={false} tickLine={false} width={30} />
              <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </WidgetCard>
  );
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addChartOpen, setAddChartOpen] = useState(false);
  const [chartType, setChartType] = useState("column");
  const [chartName, setChartName] = useState("");
  const [measure, setMeasure] = useState(MEASURE_OPTIONS[0]);
  const [groupBy, setGroupBy] = useState(GROUP_BY_OPTIONS[0]);
  const [sortBy, setSortBy] = useState("Default");
  const [savedConfig, setSavedConfig] = useState<ReportGraphConfig | null>(null);
  const [configChecked, setConfigChecked] = useState(false);
  const [charts, setCharts] = useState<CreatedChart[]>([]);

  useEffect(() => {
    setSavedConfig(loadReportConfig(id));
    setConfigChecked(true);
    const raw = localStorage.getItem(`report-charts-${id}`);
    setCharts(raw ? JSON.parse(raw) : []);
  }, [id]);

  const handleCreateChart = () => {
    const newChart: CreatedChart = {
      id: `chart-${Date.now()}`,
      name: chartName.trim() || "Untitled Chart",
      chartType,
      measure,
      groupBy,
    };
    setCharts((prev) => {
      const next = [...prev, newChart];
      localStorage.setItem(`report-charts-${id}`, JSON.stringify(next));
      return next;
    });
    setAddChartOpen(false);
    setChartName("");
    setChartType("column");
  };

  const handleDeleteChart = (chartId: string) => {
    setCharts((prev) => {
      const next = prev.filter((c) => c.id !== chartId);
      localStorage.setItem(`report-charts-${id}`, JSON.stringify(next));
      return next;
    });
  };

  const reportTitle = savedConfig?.name ?? SAMPLE_REPORT_NAMES[id] ?? "Deal 30";

  const totalRecords = 14;
  const totalAmount = TABLE_DATA.reduce((s, r) => s + r.amount, 0);
  const avgProbability = Math.round(TABLE_DATA.reduce((s, r) => s + r.probability, 0) / TABLE_DATA.length);

  const cellSx = {
    borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`,
    py: "14px",
    backgroundColor: isDark ? "#18181B" : "#f9fbff",
  };

  // Saved (custom-built) report: render its own data instead of the static Deal 30 mock
  if (configChecked && savedConfig) {
    const primaryModule = savedConfig.primaryModule;
    const fieldNames = savedConfig.selectedFields[primaryModule] || [];
    const allModuleFields = getModuleFields(primaryModule);
    const sampleRows = SAMPLE_DATA[primaryModule] || [];

    const filteredRows = sampleRows.filter((row: any) => {
      return savedConfig.filters.every((filter) => {
        if (filter.module !== primaryModule) return true;
        const value = row[filter.fieldName];
        switch (filter.operator) {
          case "equals":
            return value === filter.value;
          case "contains":
            return String(value ?? "").toLowerCase().includes(filter.value.toLowerCase());
          case "starts with":
            return String(value ?? "").toLowerCase().startsWith(filter.value.toLowerCase());
          case "ends with":
            return String(value ?? "").toLowerCase().endsWith(filter.value.toLowerCase());
          case "is empty":
            return !value;
          case "is not empty":
            return !!value;
          default:
            return true;
        }
      });
    });

    const columns = fieldNames.map((fieldName) => {
      const field = allModuleFields.find((f) => f.name === fieldName);
      return { name: fieldName, label: field?.label || fieldName, type: field?.type || "text" };
    });

    const numericColumns = columns.filter((c) => c.type === "currency" || c.type === "number");
    const customMeasureOptions = ["Count of Records", ...numericColumns.map((c) => `Sum of ${c.label}`)];
    const customGroupByOptions = columns.map((c) => c.label);
    const findColumnByLabel = (label: string) => columns.find((c) => c.label === label);

    const chartsData = charts.map((chart) => {
      const groupByCol = findColumnByLabel(chart.groupBy);
      const data = groupByCol
        ? aggregateChartRows(filteredRows, groupByCol.name, chart.measure, (measure) => {
            const match = measure.match(/^Sum of (.+)$/);
            if (!match) return null;
            return findColumnByLabel(match[1])?.name ?? null;
          })
        : [];
      return { chart, data };
    });

    return (
      <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
        <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
          <div className={`flex-1 overflow-auto ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
            <main className="px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => router.push("/reports")} className={isDark ? "text-[#9CA3AF] hover:text-white" : "text-slate-500 hover:text-slate-700"}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className={`text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>{reportTitle}</h1>
                  <Tooltip title="Report info">
                    <IconButton size="small" sx={{ color: isDark ? "#71717A" : "#64748B" }}>
                      <Info size={16} weight="duotone" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Updated {new Date(savedConfig.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <Tooltip title="Refresh">
                    <IconButton size="small" sx={{ color: isDark ? "#71717A" : "#64748B", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </IconButton>
                  </Tooltip>
                  <Button
                    onClick={() => router.push(`/reports/${id}/edit`)}
                    size="small"
                    variant="outlined"
                    startIcon={<PencilSimple size={16} weight="duotone" />}
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", color: isDark ? "#D4D4D8" : "#0C2472", borderColor: isDark ? "#27272A" : "#E3ECFC", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setMeasure(customMeasureOptions[0]);
                      setGroupBy(customGroupByOptions[0] ?? "");
                      setAddChartOpen(true);
                    }}
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
                  <span className={`text-[14px] font-bold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>Total Records : {filteredRows.length}</span>
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

              {/* Created Charts */}
              {chartsData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {chartsData.map(({ chart, data }) => (
                    <CreatedChartCard key={chart.id} chart={chart} data={data} isDark={isDark} onDelete={() => handleDeleteChart(chart.id)} />
                  ))}
                </div>
              )}

              {/* Data Table */}
              <WidgetCard title="Report Data" subtitle={`${filteredRows.length} of ${filteredRows.length} record${filteredRows.length !== 1 ? "s" : ""}`} isDark={isDark} noPadding>
                {columns.length === 0 ? (
                  <div className={`text-center py-10 text-[14px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>No fields selected for this report.</div>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {columns.map((col) => (
                            <TableCell key={col.name} sx={{ backgroundColor: isDark ? "#111111" : "#EFF6FF", color: isDark ? "#9CA3AF" : "#0C2472", borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`, fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{col.label}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRows.map((row: any, idx: number) => (
                          <TableRow key={idx} hover sx={{ "&:hover td": { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(29,78,216,0.04)" }, "& td": cellSx }}>
                            {columns.map((col) => (
                              <TableCell key={col.name}><span className={`text-[13px] ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{row[col.name] ?? "—"}</span></TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </WidgetCard>
            </main>
          </div>
        </div>

        {/* Add Chart Modal */}
        <Dialog open={addChartOpen} onClose={() => { setAddChartOpen(false); setChartName(""); setChartType("column"); }} maxWidth="md" fullWidth
          PaperProps={{ sx: { borderRadius: "16px", bgcolor: isDark ? "#1C1C1E" : "#fff", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(12,36,114,0.10)" } }}>

          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
            <span className={`font-heading text-[16px] font-bold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Add Chart</span>
            <IconButton size="small" onClick={() => setAddChartOpen(false)}
              sx={{ borderRadius: "9px", border: `1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
              <X size={16} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
            </IconButton>
          </div>

          {/* Chart Type Selection */}
          <div className={`px-6 pt-4 ${isDark ? "bg-[#111113]" : "bg-[#F8FAFF]"}`}>
            <div className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>Select Type</div>
            <div className="grid grid-cols-6 gap-2.5 pb-4">
              {CHART_TYPES.map(ct => (
                <button key={ct.key} onClick={() => setChartType(ct.key)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border-2 transition-colors ${
                    chartType === ct.key
                      ? isDark ? "border-[#3B82F6] bg-[#1D4ED8]/10" : "border-[#1D4ED8] bg-[#EFF6FF]"
                      : isDark ? "border-[#27272A] hover:border-[#3F3F46]" : "border-[#E3ECFC] hover:border-[#93C5FD]"
                  }`}>
                  <ct.icon size={20} weight="duotone" color={chartType === ct.key ? "#1D4ED8" : (isDark ? "#9CA3AF" : "#64748B")} />
                  <span className={`text-[10px] font-semibold truncate w-full text-center ${chartType === ct.key ? (isDark ? "text-[#93C5FD]" : "text-[#1D4ED8]") : (isDark ? "text-[#9CA3AF]" : "text-slate-500")}`}>{ct.label}</span>
                </button>
              ))}
            </div>
          </div>

          <DialogContent sx={{ p: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-0">
              {/* Configuration */}
              <div className="px-6 py-5 space-y-4">
                <div className={`text-[13px] font-bold ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Configuration</div>

                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                  <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Chart Name</label>
                  <input value={chartName} onChange={e => setChartName(e.target.value)} placeholder="Untitled chart"
                    className={`px-3 py-2 text-[13px] border rounded-lg outline-none ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8] placeholder-[#52525B]" : "bg-white border-[#E3ECFC] text-slate-700 placeholder-slate-400"}`} />
                </div>

                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                  <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Measure (Y-Axis)</label>
                  <select value={measure} onChange={e => setMeasure(e.target.value)}
                    className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                    {customMeasureOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                  <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Group By (X-Axis)</label>
                  <select value={groupBy} onChange={e => setGroupBy(e.target.value)}
                    className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                    {customGroupByOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                  <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                    <option value="Default">Default</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className={`px-5 py-5 border-l ${isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-[#E3ECFC] bg-[#F8FAFF]"}`}>
                <div className={`text-[12px] font-bold mb-3 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Preview</div>
                <div className={`w-full rounded-lg border overflow-hidden ${isDark ? "border-[#27272A] bg-[#111113]" : "border-[#E3ECFC] bg-white"}`}>
                  <ChartTypePreview chartType={chartType} isDark={isDark} />
                  <p className={`text-center text-[11px] pb-3 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                    {chartName ? chartName : "Untitled"}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>

          {/* Actions */}
          <div className={`flex items-center justify-end gap-2 px-6 py-3 border-t ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
            <Button onClick={() => { setAddChartOpen(false); setChartName(""); setChartType("column"); }}
              sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 600, fontSize: "13px" }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateChart}
              sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600, fontSize: "13px", borderRadius: "9px", boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
              Done
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      
      <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
       

        <div className={`flex-1 overflow-auto ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
          <main className="px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => router.push("/reports")} className={isDark ? "text-[#9CA3AF] hover:text-white" : "text-slate-500 hover:text-slate-700"}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className={`text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>{reportTitle}</h1>
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
                  onClick={() => {
                    setMeasure(MEASURE_OPTIONS[0]);
                    setGroupBy(GROUP_BY_OPTIONS[0]);
                    setAddChartOpen(true);
                  }}
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

            {/* Created Charts */}
            {charts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {charts.map((chart) => {
                  const groupKeyMap: Record<string, string> = {
                    "Contact Name": "contactName",
                    "Account Name": "accountName",
                    "Stage": "stage",
                    "Probability": "probability",
                    "Created By": "createdBy",
                  };
                  const groupByKey = groupKeyMap[chart.groupBy] ?? "stage";
                  const data = aggregateChartRows(TABLE_DATA, groupByKey, chart.measure, (measure) =>
                    measure === "Sum of Amount" ? "amount" : null
                  );
                  return <CreatedChartCard key={chart.id} chart={chart} data={data} isDark={isDark} onDelete={() => handleDeleteChart(chart.id)} />;
                })}
              </div>
            )}

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

      {/* Add Chart Modal */}
      <Dialog open={addChartOpen} onClose={() => { setAddChartOpen(false); setChartName(""); setChartType("column"); }} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", bgcolor: isDark ? "#1C1C1E" : "#fff", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(12,36,114,0.10)" } }}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
          <span className={`font-heading text-[16px] font-bold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Add Chart</span>
          <IconButton size="small" onClick={() => setAddChartOpen(false)}
            sx={{ borderRadius: "9px", border: `1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
            <X size={16} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
          </IconButton>
        </div>

        {/* Chart Type Selection */}
        <div className={`px-6 pt-4 ${isDark ? "bg-[#111113]" : "bg-[#F8FAFF]"}`}>
          <div className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>Select Type</div>
          <div className="grid grid-cols-6 gap-2.5 pb-4">
            {CHART_TYPES.map(ct => (
              <button key={ct.key} onClick={() => setChartType(ct.key)}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border-2 transition-colors ${
                  chartType === ct.key
                    ? isDark ? "border-[#3B82F6] bg-[#1D4ED8]/10" : "border-[#1D4ED8] bg-[#EFF6FF]"
                    : isDark ? "border-[#27272A] hover:border-[#3F3F46]" : "border-[#E3ECFC] hover:border-[#93C5FD]"
                }`}>
                <ct.icon size={20} weight="duotone" color={chartType === ct.key ? "#1D4ED8" : (isDark ? "#9CA3AF" : "#64748B")} />
                <span className={`text-[10px] font-semibold truncate w-full text-center ${chartType === ct.key ? (isDark ? "text-[#93C5FD]" : "text-[#1D4ED8]") : (isDark ? "text-[#9CA3AF]" : "text-slate-500")}`}>{ct.label}</span>
              </button>
            ))}
          </div>
        </div>

        <DialogContent sx={{ p: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-0">
            {/* Configuration */}
            <div className="px-6 py-5 space-y-4">
              <div className={`text-[13px] font-bold ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Configuration</div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Chart Name</label>
                <input value={chartName} onChange={e => setChartName(e.target.value)} placeholder="Untitled chart"
                  className={`px-3 py-2 text-[13px] border rounded-lg outline-none ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8] placeholder-[#52525B]" : "bg-white border-[#E3ECFC] text-slate-700 placeholder-slate-400"}`} />
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Measure (Y-Axis)</label>
                <select value={measure} onChange={e => setMeasure(e.target.value)}
                  className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                  {MEASURE_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Group By (X-Axis)</label>
                <select value={groupBy} onChange={e => setGroupBy(e.target.value)}
                  className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                  {GROUP_BY_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <label className={`text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className={`px-3 py-2 text-[13px] border rounded-lg outline-none cursor-pointer ${isDark ? "bg-[#0A0A0A] border-[#3F3F46] text-[#D4D4D8]" : "bg-white border-[#E3ECFC] text-slate-700"}`}>
                  <option value="Default">Default</option>
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
              </div>
            </div>

            {/* Preview */}
            <div className={`px-5 py-5 border-l ${isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-[#E3ECFC] bg-[#F8FAFF]"}`}>
              <div className={`text-[12px] font-bold mb-3 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Preview</div>
              <div className={`w-full rounded-lg border overflow-hidden ${isDark ? "border-[#27272A] bg-[#111113]" : "border-[#E3ECFC] bg-white"}`}>
                <ChartTypePreview chartType={chartType} isDark={isDark} />
                <p className={`text-center text-[11px] pb-3 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                  {chartName ? chartName : "Untitled"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>

        {/* Actions */}
        <div className={`flex items-center justify-end gap-2 px-6 py-3 border-t ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
          <Button onClick={() => { setAddChartOpen(false); setChartName(""); setChartType("column"); }}
            sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 600, fontSize: "13px" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateChart}
            sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600, fontSize: "13px", borderRadius: "9px", boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
            Done
          </Button>
        </div>
      </Dialog>
      </div>
  );
}
