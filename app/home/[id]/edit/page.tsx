"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useTheme } from "@/components/ThemeContext";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  CaretRight, House, MagnifyingGlass, X, Trash, PencilSimple,
  ChartBar, Table, Plus, Rows, ChartLine, ChartPie, ArrowUp, ArrowDown,
} from "@phosphor-icons/react";
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList,
} from "recharts";

interface DashboardComponent {
  id: string;
  type: "kpi" | "chart" | "table" | "report";
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  category: "dashboard" | "report";
}

interface CanvasItem {
  id: string;
  componentId: string;
  title: string;
  type: string;
  icon: React.ElementType;
  color: string;
}

// Sample data
const SAMPLE_DATA = {
  accounts: { count: 142, change: 12, changeType: "increase", spark: [14, 18, 16, 22, 20, 26, 28, 30, 34, 38, 40, 42] },
  contacts: { count: 356, change: 28, changeType: "increase", spark: [80, 95, 88, 102, 110, 118, 122, 130, 138, 145, 150, 160] },
  leads: { count: 89, change: 5, changeType: "increase", spark: [40, 42, 38, 45, 48, 44, 50, 52, 55, 58, 60, 62] },
  deals: { count: 34, change: 3, changeType: "decrease", spark: [40, 38, 42, 39, 36, 38, 35, 34, 32, 33, 30, 31] },
  dealsByStage: [
    { stage: "New", value: 12000, color: "#0C2472" },
    { stage: "Contacted", value: 28000, color: "#10B981" },
    { stage: "Qualified", value: 45000, color: "#3B82F6" },
    { stage: "Won", value: 95000, color: "#F59E0B" },
  ],
  leadsBySource: [
    { source: "Website", count: 34, color: "#0C2472" },
    { source: "Email", count: 28, color: "#3B82F6" },
    { source: "Referral", count: 18, color: "#10B981" },
    { source: "Direct", count: 9, color: "#F59E0B" },
  ],
  revenueTrend: [
    { month: "Jan", revenue: 145000 },
    { month: "Feb", revenue: 158000 },
    { month: "Mar", revenue: 151000 },
    { month: "Apr", revenue: 172000 },
    { month: "May", revenue: 181000 },
    { month: "Jun", revenue: 191000 },
  ],
  recentDeals: [
    { name: "Acme Corp Deal", amount: 29900, stage: "Qualified", owner: "John Smith", date: "Jun 28" },
    { name: "Tech Solutions", amount: 18500, stage: "Contacted", owner: "Sarah Lee", date: "Jun 26" },
    { name: "Global Industries", amount: 125000, stage: "Won", owner: "Mike Johnson", date: "Jun 25" },
  ],
  tasks: [
    { title: "Follow up with Acme Corp", dueDate: "Today", priority: "High", owner: "You" },
    { title: "Prepare proposal for TechCorp", dueDate: "Jun 30", priority: "High", owner: "Sarah Lee" },
    { title: "Schedule meeting with client", dueDate: "Jul 2", priority: "Medium", owner: "You" },
  ],
};

const AVAILABLE_COMPONENTS: DashboardComponent[] = [
  { id: "kpi-accounts", type: "kpi", title: "Accounts", icon: Rows, color: "#1D4ED8", description: "Total accounts count", category: "dashboard" },
  { id: "kpi-contacts", type: "kpi", title: "Contacts", icon: Rows, color: "#10B981", description: "Total contacts", category: "dashboard" },
  { id: "kpi-leads", type: "kpi", title: "Leads", icon: Rows, color: "#F59E0B", description: "Total leads", category: "dashboard" },
  { id: "kpi-deals", type: "kpi", title: "Deals", icon: Rows, color: "#8B5CF6", description: "Total deals", category: "dashboard" },
  { id: "chart-pie", type: "chart", title: "Stage Wise Deal Amount", icon: ChartPie, color: "#EC4899", description: "Deal distribution by stage", category: "dashboard" },
  { id: "chart-bar", type: "chart", title: "Lead Source Wise", icon: ChartBar, color: "#06B6D4", description: "Leads by source", category: "dashboard" },
  { id: "chart-line", type: "chart", title: "Revenue Trend", icon: ChartLine, color: "#14B8A6", description: "Revenue over time", category: "dashboard" },
  { id: "table-deals", type: "table", title: "Deal 30", icon: Table, color: "#6366F1", description: "Latest 30 deals", category: "dashboard" },
  { id: "table-tasks", type: "table", title: "Tasks", icon: Table, color: "#A855F7", description: "Recent tasks", category: "dashboard" },
];

const KPI_FILL: Record<string, { fill: string; accent: string }> = {
  "kpi-accounts": { fill: "#D6E4F9", accent: "#2F6FED" },
  "kpi-contacts": { fill: "#D0E5E0", accent: "#2E9E7B" },
  "kpi-leads": { fill: "#FAE3D0", accent: "#E0883F" },
  "kpi-deals": { fill: "#F5D9E1", accent: "#DB5E8C" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-white/10">
      {label && <p className="text-slate-400 text-[11px] mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold text-[12px]" style={{ color: p.color || p.fill }}>{p.value.toLocaleString('en-US')}</p>
      ))}
    </div>
  );
};

// Component renderers — mirror Dashboard's KPICard / DealStageChart / RevenueChart / RecentDeals language
function KPICardPreview({ componentId, isDark }: { componentId: string; isDark: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataMap: Record<string, any> = {
    "kpi-accounts": SAMPLE_DATA.accounts,
    "kpi-contacts": SAMPLE_DATA.contacts,
    "kpi-leads": SAMPLE_DATA.leads,
    "kpi-deals": SAMPLE_DATA.deals,
  };
  const data = dataMap[componentId];
  if (!data) return null;
  const { fill, accent } = KPI_FILL[componentId];
  const isPositive = data.changeType === "increase";

  const W = 72, H = 26;
  const max = Math.max(...data.spark);
  const min = Math.min(...data.spark);
  const range = max - min || 1;
  const coords = data.spark.map((d: number, i: number) => ({
    x: (i / (data.spark.length - 1)) * W,
    y: H - ((d - min) / range) * (H - 4) - 2,
  }));
  const linePts = coords.map((c: { x: number; y: number }) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

  return (
    <div className="px-5 py-4" style={{ backgroundColor: isDark ? "#111111" : fill + "40" }}>
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-[26px] font-extrabold tracking-tight leading-none ${isDark ? "text-white" : "text-[#0C2472]"}`}>{data.count}</div>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full ${isDark ? "bg-black/40" : "bg-white/70"} ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />} {data.change}%
          </span>
        </div>
        <svg width={W} height={H}>
          <polyline points={linePts} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={coords[coords.length - 1].x.toFixed(1)} cy={coords[coords.length - 1].y.toFixed(1)} r="2.4" fill={accent} />
        </svg>
      </div>
    </div>
  );
}

function LeadSourceBarChart({ isDark }: { isDark: boolean }) {
  const data = SAMPLE_DATA.leadsBySource;
  return (
    <div className="px-5 py-4">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={10}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: isDark ? "#9CA3AF" : "#6B7280", fontWeight: 500 }} axisLine={false} tickLine={false} width={64} />
          <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: isDark ? "#18181B" : "#EFF6FF" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" style={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }} />
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StageWisePieChart({ isDark }: { isDark: boolean }) {
  const data = SAMPLE_DATA.dealsByStage;
  return (
    <div className="px-5 py-4">
      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={2} dataKey="value" nameKey="stage">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
          </Pie>
          <RechartsTooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {data.map(item => (
          <div key={item.stage} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className={`text-[11px] font-medium ${isDark ? "text-[#9CA3AF]" : "text-slate-600"}`}>{item.stage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueTrendChart({ isDark }: { isDark: boolean }) {
  const stroke = isDark ? "#60A5FA" : "#0C2472";
  return (
    <div className="px-5 py-4">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={SAMPLE_DATA.revenueTrend} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272A" : "#F0F2F5"} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <RechartsTooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke={stroke} strokeWidth={2} fill={stroke} fillOpacity={isDark ? 0.15 : 0.08} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function DealsTable({ isDark }: { isDark: boolean }) {
  const data = SAMPLE_DATA.recentDeals;
  const stageStyle: Record<string, { bg: string; fg: string }> = {
    Won: { bg: isDark ? "rgba(16,185,129,0.15)" : "#D1FAE5", fg: isDark ? "#34D399" : "#047857" },
    Qualified: { bg: isDark ? "rgba(59,130,246,0.15)" : "#E3ECFC", fg: isDark ? "#60A5FA" : "#0C2472" },
    Contacted: { bg: isDark ? "rgba(245,158,11,0.15)" : "#FEF3C7", fg: isDark ? "#FBBF24" : "#92400E" },
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead>
          <tr>
            {["Deal", "Amount", "Stage"].map(h => (
              <th key={h} className="px-5 py-2 text-left font-bold uppercase tracking-wider text-[10.5px]"
                style={{ backgroundColor: isDark ? "#111111" : "#EFF6FF", color: isDark ? "#9CA3AF" : "#0C2472" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((deal, i) => {
            const s = stageStyle[deal.stage] || { bg: "#F1F5F9", fg: "#475569" };
            return (
              <tr key={i} className="border-t" style={{ borderColor: isDark ? "#27272A" : "#E3ECFC" }}>
                <td className={`px-5 py-2.5 font-semibold ${isDark ? "text-[#E2E8F0]" : "text-slate-800"}`}>{deal.name}</td>
                <td className={`px-5 py-2.5 font-bold ${isDark ? "text-white" : "text-slate-800"}`}>${deal.amount.toLocaleString('en-US')}</td>
                <td className="px-5 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold" style={{ backgroundColor: s.bg, color: s.fg }}>{deal.stage}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TasksTable({ isDark }: { isDark: boolean }) {
  const data = SAMPLE_DATA.tasks;
  const prioColor: Record<string, string> = { High: "#EF4444", Medium: "#F59E0B", Low: "#10B981" };
  return (
    <div className="px-5 py-4 space-y-3">
      {data.map((task, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: prioColor[task.priority] }} />
          <div className="flex-1 min-w-0">
            <p className={`text-[13px] font-medium leading-snug ${isDark ? "text-[#E2E8F0]" : "text-slate-700"}`}>{task.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400 font-medium">{task.dueDate}</span>
              <span className={`text-[11px] ${isDark ? "text-slate-600" : "text-slate-300"}`}>·</span>
              <span className="text-[11px] text-slate-400">{task.owner}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComponentPreview({ item, isDark }: { item: CanvasItem; isDark: boolean }) {
  switch (item.type) {
    case "kpi":
      return <KPICardPreview componentId={item.componentId} isDark={isDark} />;
    case "chart":
      if (item.componentId === "chart-pie") return <StageWisePieChart isDark={isDark} />;
      if (item.componentId === "chart-bar") return <LeadSourceBarChart isDark={isDark} />;
      if (item.componentId === "chart-line") return <RevenueTrendChart isDark={isDark} />;
      return <LeadSourceBarChart isDark={isDark} />;
    case "table":
      if (item.componentId === "table-deals") return <DealsTable isDark={isDark} />;
      if (item.componentId === "table-tasks") return <TasksTable isDark={isDark} />;
      return <DealsTable isDark={isDark} />;
    default:
      return null;
  }
}

export default function HomePageEditorPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    { id: "c1", componentId: "kpi-accounts", title: "Accounts", type: "kpi", icon: Rows, color: "#1D4ED8" },
    { id: "c2", componentId: "kpi-contacts", title: "Contacts", type: "kpi", icon: Rows, color: "#10B981" },
    { id: "c3", componentId: "kpi-leads", title: "Leads", type: "kpi", icon: Rows, color: "#F59E0B" },
    { id: "c4", componentId: "kpi-deals", title: "Deals", type: "kpi", icon: Rows, color: "#8B5CF6" },
    { id: "c5", componentId: "chart-pie", title: "Stage Wise Deal Amount", type: "chart", icon: ChartPie, color: "#EC4899" },
    { id: "c6", componentId: "chart-bar", title: "Lead Source Wise", type: "chart", icon: ChartBar, color: "#06B6D4" },
    { id: "c7", componentId: "table-deals", title: "Deal 30", type: "table", icon: Table, color: "#6366F1" },
    { id: "c8", componentId: "table-tasks", title: "Tasks", type: "table", icon: Table, color: "#A855F7" },
  ]);
  const [draggedItem, setDraggedItem] = useState<DashboardComponent | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const filtered = AVAILABLE_COMPONENTS.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const dashboardComps = filtered.filter(c => c.category === "dashboard");

  const handleDragStart = (component: DashboardComponent) => {
    setDraggedItem(component);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const newItem: CanvasItem = {
        id: `c${Date.now()}`,
        componentId: draggedItem.id,
        title: draggedItem.title,
        type: draggedItem.type,
        icon: draggedItem.icon,
        color: draggedItem.color,
      };
      setCanvasItems([...canvasItems, newItem]);
      setDraggedItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setCanvasItems(canvasItems.filter(item => item.id !== id));
  };

  const handleEditStart = (item: CanvasItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setCustomizeOpen(true);
  };

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      setCanvasItems(canvasItems.map(item =>
        item.id === editingId ? { ...item, title: editTitle.trim() } : item
      ));
      setCustomizeOpen(false);
      setEditingId(null);
    }
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const idx = canvasItems.findIndex(item => item.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === canvasItems.length - 1)) return;
    const newItems = [...canvasItems];
    if (direction === "up") {
      [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
    } else {
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    }
    setCanvasItems(newItems);
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      <Sidebar />
      <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        <TopBar />

        {/* Header */}
        <div className={`px-8 py-4 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
          <div className="flex items-center gap-2 mb-3">
            <House size={16} weight="duotone" />
            <button className={`text-[12px] font-medium ${isDark ? "text-[#9CA3AF]" : "text-slate-500"} hover:underline`}>Home</button>
            <CaretRight size={12} weight="duotone" />
            <button className={`text-[12px] font-medium ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Home Page V1</button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className={`text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>Home Page Editor</h1>
            <div className="flex items-center gap-2">
              <Button variant="text" sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", px: 2.5, "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                Cancel
              </Button>
              <Button variant="contained" sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", px: 3, boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar */}
          <div className={`w-72 flex-shrink-0 border-r flex flex-col ${isDark ? "border-[#27272A] bg-[#0A0A0A]" : "border-[#E3ECFC] bg-white"}`}>
            <div className={`px-4 py-4 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
              <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                <MagnifyingGlass size={13} color="#94A3B8" weight="duotone" />
                <input placeholder="Search components" value={search} onChange={e => setSearch(e.target.value)}
                  className={`flex-1 text-[13px] outline-none bg-transparent ${isDark ? "text-[#D4D4D8] placeholder-[#52525B]" : "text-slate-700 placeholder-slate-400"}`} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
              {dashboardComps.length > 0 && (
                <div>
                  <div className={`text-[11px] font-bold uppercase tracking-widest px-2 mb-2 ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`}>Dashboard Components</div>
                  <div className="space-y-1">
                    {dashboardComps.map(comp => (
                      <div key={comp.id} draggable onDragStart={() => handleDragStart(comp)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-move transition-colors border ${isDark ? "border-[#27272A] hover:bg-[#1C1C1E] hover:border-[#3F3F46]" : "border-[#E3ECFC] hover:bg-[#f9fbff]"}`}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: comp.color + "1F" }}>
                          <comp.icon size={13} color={comp.color} weight="duotone" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13px] font-semibold truncate ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{comp.title}</div>
                          <div className={`text-[11px] truncate ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{comp.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className={`p-4 md:p-8 min-h-full ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {canvasItems.map((item, idx) => (
                  <div key={item.id}
                    className="rounded-2xl border overflow-hidden group backdrop-blur-xl transition-all duration-200 hover:shadow-lg"
                    style={{
                      backgroundColor: isDark ? "#0A0A0A" : "rgba(255, 255, 255, 0.6)",
                      borderColor: isDark ? "#27272A" : "rgba(255,255,255,0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                    }}>
                    {/* Header */}
                    <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + "1F" }}>
                        <item.icon size={14} color={item.color} weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-bold truncate ${isDark ? "text-white" : "text-[#0C2472]"}`}>{item.title}</p>
                      </div>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditStart(item)}
                          sx={{ p: 0.4, color: isDark ? "#52525B" : "#CBD5E1", "&:hover": { color: isDark ? "#D4D4D8" : "#334155" }, opacity: 0, ".group:hover &": { opacity: 1 } }}>
                          <PencilSimple size={13} weight="duotone" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteItem(item.id)}
                          sx={{ p: 0.4, color: isDark ? "#52525B" : "#CBD5E1", "&:hover": { color: "#EF4444" }, opacity: 0, ".group:hover &": { opacity: 1 } }}>
                          <Trash size={13} weight="duotone" />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {/* Component preview */}
                    <ComponentPreview item={item} isDark={isDark} />

                    {/* Reorder buttons */}
                    <div className={`flex items-center justify-center gap-1 px-5 py-3 border-t ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                      {idx > 0 && (
                        <Tooltip title="Move up">
                          <button onClick={() => moveItem(item.id, "up")}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${isDark ? "bg-[#27272A] text-[#D4D4D8] hover:bg-[#3F3F46]" : "bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DCE6FB]"}`}>
                            ↑
                          </button>
                        </Tooltip>
                      )}
                      {idx < canvasItems.length - 1 && (
                        <Tooltip title="Move down">
                          <button onClick={() => moveItem(item.id, "down")}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${isDark ? "bg-[#27272A] text-[#D4D4D8] hover:bg-[#3F3F46]" : "bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DCE6FB]"}`}>
                            ↓
                          </button>
                        </Tooltip>
                      )}
                      <div className={`text-[11px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{idx + 1} of {canvasItems.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customize dialog */}
      <Dialog open={customizeOpen} onClose={() => setCustomizeOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", bgcolor: isDark ? "#1C1C1E" : "#fff", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(12,36,114,0.10)" } }}>
        <DialogTitle sx={{ color: isDark ? "#F4F4F5" : "#0C2472", fontWeight: 700 }}>Edit Component</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField label="Component Title" fullWidth value={editTitle} onChange={e => setEditTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px", ...(isDark ? {} : { backgroundColor: "#EFF6FF" }), fontSize: "0.82rem",
                "& fieldset": { borderColor: isDark ? "#3F3F46" : "#E3ECFC", borderWidth: 1.5 },
                "&:hover fieldset": { borderColor: isDark ? "#9CA3AF" : "#E3ECFC" },
                "&.Mui-focused fieldset": { borderColor: isDark ? "#71717A" : "#E3ECFC", borderWidth: 2 },
                "&.Mui-focused": { boxShadow: isDark ? "none" : "0 0 0 2px #4A7AE8" },
                "& input": { padding: "10px 14px", color: isDark ? "#D4D4D8" : "#1F2937" },
              },
              "& .MuiInputLabel-root": { fontSize: "0.79rem", color: isDark ? "#A1A1AA" : "#6B7280" },
            }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCustomizeOpen(false)} sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditSave}
            sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600, boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
