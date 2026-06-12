"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Checkbox from "@mui/material/Checkbox";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  House, CaretRight, Plus, MagnifyingGlass, FunnelSimple,
  ArrowsDownUp, DotsThreeVertical, Trash, CaretDown, List,
  ClipboardText, CheckCircle, PencilSimple, Copy,
} from "@phosphor-icons/react";
import NewTaskDrawer from "@/components/tasks/NewTaskDrawer";
import FiltersDrawer, { type FilterRow } from "@/components/leads/FiltersDrawer";

// ─────────────────────────────────────────────
//  Types & Data
// ─────────────────────────────────────────────
type TaskStatus   = "Todo" | "In Progress" | "Backlog" | "Completed" | "";
type TaskPriority = "High" | "Medium" | "Low" | "";
type TaskType     = "Task" | "Quote" | "Call" | "Email" | "";

interface TaskRecord {
  id: number;
  type: TaskType;
  subject: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  contact: string;
  relatedTo: string;
  taskOwner: string;
}

const ALL_TASKS: TaskRecord[] = [
  { id: 1, type: "Task",  subject: "New",                        dueDate: "",           status: "",           priority: "",       contact: "",                   relatedTo: "",            taskOwner: "pm@socialdnalabs.com" },
  { id: 2, type: "Task",  subject: "New",                        dueDate: "07/05/2026", status: "Todo",       priority: "",       contact: "",                   relatedTo: "",            taskOwner: "pm@socialdnalabs.com" },
  { id: 3, type: "Task",  subject: "Schedule Demo",              dueDate: "17/04/2026", status: "Backlog",    priority: "High",   contact: "SDL Test Test-SDL",  relatedTo: "SDL - Account", taskOwner: "pm@socialdnalabs.com" },
  { id: 4, type: "Task",  subject: "Prepare quote sent to email",dueDate: "16/04/2026", status: "Backlog",    priority: "Medium", contact: "SDL Test Test-SDL",  relatedTo: "SDL - Account", taskOwner: "pm@socialdnalabs.com" },
  { id: 5, type: "Quote", subject: "Quote",                      dueDate: "24/03/2026", status: "In Progress",priority: "Low",    contact: "",                   relatedTo: "",            taskOwner: "pm@socialdnalabs.com" },
];

// ─────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────
const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  "Todo":        { bg: "#EFF6FF",  text: "#1D4ED8", dot: "#3B82F6" },
  "In Progress": { bg: "#FEF3C7",  text: "#92400E", dot: "#F59E0B" },
  "Backlog":     { bg: "#F1F5F9",  text: "#475569", dot: "#94A3B8" },
  "Completed":   { bg: "#DCFCE7",  text: "#166534", dot: "#10B981" },
};

const PRIORITY_CFG: Record<string, { bg: string; text: string }> = {
  "High":   { bg: "#FEF2F2", text: "#DC2626" },
  "Medium": { bg: "#FEF3C7", text: "#D97706" },
  "Low":    { bg: "#F0FDF4", text: "#16A34A" },
};

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function ColHeader({ label }: { label: string }) {
  return (
    <div className="font-heading flex items-center gap-0.5 text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider cursor-pointer hover:text-[#1D4ED8] transition-colors group select-none">
      {label}
      <ArrowsDownUp size={12} weight="duotone" className="opacity-30 group-hover:opacity-100 text-[#60A5FA] transition-opacity" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function TasksPage() {
  const [selected, setSelected]         = useState<number[]>([]);
  const [search, setSearch]             = useState("");
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [filtersOpen, setFiltersOpen]   = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterRow[]>([]);
  const [moreAnchor, setMoreAnchor]     = useState<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | "All">("All");

  const TASK_FILTER_COLUMNS = [
    { value: "subject",   label: "Task · Subject"    },
    { value: "type",      label: "Task · Type"       },
    { value: "status",    label: "Task · Status"     },
    { value: "priority",  label: "Task · Priority"   },
    { value: "dueDate",   label: "Task · Due Date"   },
    { value: "contact",   label: "Task · Contact"    },
    { value: "relatedTo", label: "Task · Related To" },
    { value: "taskOwner", label: "Task · Task Owner" },
  ];

  const STATUS_TABS: (TaskStatus | "All")[] = ["All", "Todo", "In Progress", "Backlog", "Completed"];

  const filtered = ALL_TASKS.filter(t => {
    const matchStatus = activeFilter === "All" || t.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || t.subject.toLowerCase().includes(q) || t.contact.toLowerCase().includes(q) || t.relatedTo.toLowerCase().includes(q);

    const matchFilters = activeFilters.every(f => {
      const raw = (t as Record<string, string>)[f.column] ?? "";
      const val = raw.toLowerCase();
      const fv  = f.value.toLowerCase();
      switch (f.operator) {
        case "contains":         return val.includes(fv);
        case "does_not_contain": return !val.includes(fv);
        case "equals":           return val === fv;
        case "does_not_equal":   return val !== fv;
        case "starts_with":      return val.startsWith(fv);
        case "ends_with":        return val.endsWith(fv);
        case "is_empty":         return val === "";
        case "is_not_empty":     return val !== "";
        default:                 return true;
      }
    });

    return matchStatus && matchSearch && matchFilters;
  });

  const statusCounts: Record<string, number> = { All: ALL_TASKS.length };
  ALL_TASKS.forEach(t => { if (t.status) statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1; });

  const allChecked  = selected.length === filtered.length && filtered.length > 0;
  const someChecked = selected.length > 0 && !allChecked;
  const toggleAll   = () => setSelected(allChecked ? [] : filtered.map(t => t.id));
  const toggleOne   = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const gridTemplate = "36px 90px 220px 110px 130px 100px 170px 190px 220px 40px";
  const minTableWidth = "1340px";

  return (
    <div className="flex h-screen bg-transparent font-sans">
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-auto">
        <TopBar />

        <main className="flex-1 px-8 py-6 space-y-5 animate-fade-in">

          {/* ══ Breadcrumb + Header ══ */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
                <House size={12} weight="duotone" />
                <CaretRight size={11} weight="duotone" />
                <Link href="/tasks" className="hover:text-[#1D4ED8] transition-colors font-medium">Tasks</Link>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-[20px] font-extrabold text-slate-900 tracking-tight">Tasks</h1>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <List size={13} weight="duotone" />
                </span>
                <span className="text-[11px] font-bold text-slate-400 bg-[#f9fbff] border border-[#E3ECFC] px-2 py-0.5 rounded-full shadow-sm">
                  Total Records: {ALL_TASKS.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Button variant="contained"
                startIcon={<Plus size={16} weight="duotone" />}
                onClick={() => setDrawerOpen(true)}
                sx={{ bgcolor: "#1D4ED8", borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.78rem", px: 2, py: 0.85, boxShadow: "0 1px 8px 0 #1D4ED833", "&:hover": { bgcolor: "#60A5FA", boxShadow: "0 2px 14px #60A5FA55" }, "&:active": { bgcolor: "#0C2472" } }}>
                New Task
              </Button>
              <Tooltip title="More options">
                <IconButton size="small" onClick={e => setMoreAnchor(e.currentTarget)}
                  sx={{ borderRadius: "8px", p: 0.8, bgcolor: "#f9fbff", border: "1px solid #E3ECFC", "&:hover": { bgcolor: "#E3ECFC" } }}>
                  <DotsThreeVertical size={16} color="#334155" weight="bold" />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* ══ Status filter tabs ══ */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STATUS_TABS.map(tab => {
              const cnt    = statusCounts[tab] ?? 0;
              const active = activeFilter === tab;
              if (tab !== "All" && cnt === 0) return null;
              return (
                <button key={tab} onClick={() => setActiveFilter(tab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border ${
                    active ? "bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-sm shadow-[#1D4ED8]/20"
                           : "bg-[#f9fbff] text-slate-600 border-[#E3ECFC] hover:bg-[#E3ECFC] hover:text-[#1D4ED8]"
                  }`}>
                  {tab}
                  {tab !== "All" && cnt > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>{cnt}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ══ Toolbar ══ */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#f9fbff] border border-[#E3ECFC] rounded-xl px-3 py-2 w-72 focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
              <MagnifyingGlass size={15} color="#94A3B8" weight="duotone" />
              <InputBase placeholder="Search tasks…" value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: 1, fontSize: "0.76rem", color: "#334155", "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
              />
              {search && <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 text-sm">✕</button>}
            </div>

            <Button variant="outlined" size="small"
              startIcon={activeFilters.length > 0
                ? <span className="relative"><FunnelSimple size={14} weight="duotone" /></span>
                : <FunnelSimple size={14} weight="duotone" />
              }
              onClick={() => setFiltersOpen(true)}
              sx={{ borderColor: activeFilters.length > 0 ? "#1D4ED8" : "#E3ECFC", color: activeFilters.length > 0 ? "#1D4ED8" : "#0C2472", bgcolor: activeFilters.length > 0 ? "#f9fbff" : "#E3ECFC", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.74rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#f9fbff" } }}>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
            </Button>

            <span className="ml-auto text-[11px] text-slate-400 font-medium bg-[#f9fbff] px-3 py-1.5 rounded-lg">
              {filtered.length} of {ALL_TASKS.length} records
            </span>
          </div>

          {/* ══ Bulk action bar ══ */}
          {selected.length > 0 && (
            <div className="flex items-center gap-3 bg-[#0C2472] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#0C2472]/20">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#1D4ED8] flex items-center justify-center text-[10px] font-extrabold">{selected.length}</span>
                <span className="text-[12px] font-semibold">selected</span>
              </div>
              <div className="w-px h-4 bg-white/15" />
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Update Status</button>
              <button className="text-[11.5px] font-semibold text-[#93C5FD] hover:text-white transition-colors">Assign Owner</button>
              <button onClick={() => setSelected([])} className="ml-auto text-[11.5px] font-semibold text-white/50 hover:text-white transition-colors">Clear</button>
              <button className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-300 hover:text-red-200 transition-colors">
                <Trash size={14} weight="duotone" /> Delete
              </button>
            </div>
          )}

          {/* ══ Table ══ */}
          <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
            <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>

              {/* Header */}
              <div className="grid items-center px-4 py-2.5 bg-[#E3ECFC] border-b border-[#E3ECFC]"
                style={{ gridTemplateColumns: gridTemplate, minWidth: minTableWidth }}>
                <Checkbox size="small" checked={allChecked} indeterminate={someChecked} onChange={toggleAll}
                  sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#1D4ED8" } }} />
                <ColHeader label="Type" />
                <ColHeader label="Subject" />
                <ColHeader label="Due Date" />
                <ColHeader label="Status" />
                <ColHeader label="Priority" />
                <ColHeader label="Contact" />
                <ColHeader label="Related To" />
                <ColHeader label="Task Owner" />
                <div />
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#EFF6FF]">
                {filtered.map(task => {
                  const isSel     = selected.includes(task.id);
                  const statusCfg = task.status ? STATUS_CFG[task.status] : null;
                  const priCfg    = task.priority ? PRIORITY_CFG[task.priority] : null;

                  return (
                    <div key={task.id}
                      className={`grid items-center px-4 py-3 transition-all duration-100 cursor-pointer group ${
                        isSel ? "bg-[#EFF6FF]" : "hover:bg-[#60A5FA]/[0.04]"
                      }`}
                      style={{ gridTemplateColumns: gridTemplate, minWidth: minTableWidth }}>

                      <Checkbox size="small" checked={isSel} onChange={() => toggleOne(task.id)} onClick={e => e.stopPropagation()}
                        sx={{ p: 0.5, color: "#CBD5E1", "&.Mui-checked": { color: "#1D4ED8" } }} />

                      {/* Type */}
                      <p className="text-[12px] font-semibold text-slate-600 truncate pr-2 mb-0">
                        {task.type || <span className="text-slate-200">—</span>}
                      </p>

                      {/* Subject */}
                      <Link href={`/tasks/${task.id}`} className="font-heading text-[12.5px] font-semibold text-[#1D4ED8] truncate pr-2 hover:underline" onClick={e => e.stopPropagation()}>
                        {task.subject}
                      </Link>

                      {/* Due Date */}
                      <p className="text-[12px] text-slate-500 truncate pr-2 mb-0">
                        {task.dueDate || <span className="text-slate-200">—</span>}
                      </p>

                      {/* Status */}
                      <div className="pr-2">
                        {statusCfg ? (
                          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                            style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}>
                            <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: statusCfg.dot }} />
                            {task.status}
                          </span>
                        ) : <span className="text-slate-200 text-[12px]">—</span>}
                      </div>

                      {/* Priority */}
                      <div className="pr-2">
                        {priCfg ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-[3px] rounded-full"
                            style={{ backgroundColor: priCfg.bg, color: priCfg.text }}>
                            {task.priority}
                          </span>
                        ) : <span className="text-slate-200 text-[12px]">—</span>}
                      </div>

                      {/* Contact */}
                      <p className="text-[12px] text-slate-500 truncate pr-2 mb-0">
                        {task.contact || <span className="text-slate-200">—</span>}
                      </p>

                      {/* Related To */}
                      <p className="text-[12px] text-slate-500 truncate pr-2 mb-0">
                        {task.relatedTo || <span className="text-slate-200">—</span>}
                      </p>

                      {/* Task Owner */}
                      <p className="text-[11px] text-[#3B82F6] truncate pr-2 mb-0">{task.taskOwner}</p>

                      {/* Row action */}
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip title="Actions">
                          <IconButton size="small" onClick={e => e.stopPropagation()}
                            sx={{ borderRadius: "6px", p: 0.5, "&:hover": { bgcolor: "#E3ECFC" } }}>
                            <DotsThreeVertical size={15} color="#94A3B8" weight="duotone" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty */}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f9fbff] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={22} color="#93C5FD" weight="duotone" />
                  </div>
                  <p className="font-heading text-slate-500 text-sm font-semibold">No tasks found</p>
                  <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filter</p>
                </div>
              )}

            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#EFF6FF]">
              <p className="text-[11px] text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-bold">1–{filtered.length}</span> of{" "}
                <span className="text-slate-700 font-bold">{ALL_TASKS.length}</span> records
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Rows per page:</span>
                  <button className="flex items-center gap-0.5 bg-[#f9fbff] text-[#1D4ED8] font-bold px-2 py-1 rounded-lg hover:bg-[#E3ECFC] transition-colors text-[11px]">
                    20 <CaretDown size={12} weight="duotone" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#f9fbff] text-slate-300 font-bold text-sm" disabled>‹</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1D4ED8] text-white text-[11px] font-bold shadow-sm">1</button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#f9fbff] text-slate-300 font-bold text-sm" disabled>›</button>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      <NewTaskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <FiltersDrawer
        open={filtersOpen} onClose={() => setFiltersOpen(false)}
        filters={activeFilters} onChange={setActiveFilters}
        columns={TASK_FILTER_COLUMNS}
        subtitle="Narrow down tasks by conditions"
      />

      {/* ══ More menu ══ */}
      <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}
        PaperProps={{ sx: { borderRadius: "12px", border: "1px solid #E3ECFC", boxShadow: "0 8px 32px rgba(12,36,114,0.10)", minWidth: 160 } }}>
        {[
          { label: "Export",     icon: Copy,          color: "#334155" },
          { label: "Import",     icon: PencilSimple,  color: "#334155" },
          { label: "Delete All", icon: Trash,         color: "#EF4444" },
        ].map(opt => (
          <MenuItem key={opt.label} onClick={() => setMoreAnchor(null)}
            sx={{ mx: 0.5, borderRadius: "8px", py: 1, "&:hover": { bgcolor: "#EFF6FF" } }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <opt.icon size={15} color={opt.color} weight="duotone" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 600, color: opt.color === "#EF4444" ? "#EF4444" : "#334155" }}>
              {opt.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
