"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
import {
  House, CaretRight, PencilSimple, DotsThreeVertical,
  Note, Paperclip, ClipboardText,
  GridFour, List, Tag, Trash, Copy,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface TimelineEntry {
  date: string;
  time: string;
  event: string;
  by: string;
}

interface TaskRecord {
  id: number;
  refId: string;
  type: string;
  subject: string;
  dueDate: string;
  status: string;
  priority: string;
  contact: string;
  relatedTo: string;
  reminder: string;
  taskOwner: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  description: string;
  timeline: TimelineEntry[];
}

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
const TASKS_DETAIL: Record<number, TaskRecord> = {
  1: {
    id: 1, refId: "19",
    type: "Task", subject: "New", dueDate: "", status: "", priority: "",
    contact: "", relatedTo: "", reminder: "",
    taskOwner: "PM SDL",
    createdBy: "pm@socialdnalabs.com", createdAt: "Wed, May 27, 2026 02:47 PM",
    modifiedBy: "pm@socialdnalabs.com", modifiedAt: "Wed, May 27, 2026 02:47 PM",
    description: "",
    timeline: [
      { date: "2026-05-27", time: "02:47 pm", event: "Task created", by: "pm@socialdnalabs.com" },
    ],
  },
  2: {
    id: 2, refId: "20",
    type: "Task", subject: "New", dueDate: "07/05/2026", status: "Todo", priority: "",
    contact: "", relatedTo: "", reminder: "",
    taskOwner: "PM SDL",
    createdBy: "pm@socialdnalabs.com", createdAt: "Tue, May 07, 2026 09:00 AM",
    modifiedBy: "pm@socialdnalabs.com", modifiedAt: "Tue, May 07, 2026 09:00 AM",
    description: "",
    timeline: [
      { date: "2026-05-07", time: "09:00 am", event: "Task created", by: "pm@socialdnalabs.com" },
    ],
  },
  3: {
    id: 3, refId: "21",
    type: "Task", subject: "Schedule Demo", dueDate: "17/04/2026", status: "Backlog", priority: "High",
    contact: "SDL Test Test-SDL", relatedTo: "SDL - Account", reminder: "",
    taskOwner: "PM SDL",
    createdBy: "pm@socialdnalabs.com", createdAt: "Thu, Apr 17, 2026 10:15 AM",
    modifiedBy: "pm@socialdnalabs.com", modifiedAt: "Thu, Apr 17, 2026 10:15 AM",
    description: "Schedule a product demo with SDL team.",
    timeline: [
      { date: "2026-04-17", time: "10:15 am", event: "Task created", by: "pm@socialdnalabs.com" },
    ],
  },
  4: {
    id: 4, refId: "22",
    type: "Task", subject: "Prepare quote sent to email", dueDate: "16/04/2026", status: "Backlog", priority: "Medium",
    contact: "SDL Test Test-SDL", relatedTo: "SDL - Account", reminder: "",
    taskOwner: "PM SDL",
    createdBy: "pm@socialdnalabs.com", createdAt: "Wed, Apr 16, 2026 02:30 PM",
    modifiedBy: "pm@socialdnalabs.com", modifiedAt: "Wed, Apr 16, 2026 02:30 PM",
    description: "Prepare and send the quote document via email.",
    timeline: [
      { date: "2026-04-16", time: "02:30 pm", event: "Task created", by: "pm@socialdnalabs.com" },
    ],
  },
  5: {
    id: 5, refId: "23",
    type: "Quote", subject: "Quote", dueDate: "24/03/2026", status: "In Progress", priority: "Low",
    contact: "", relatedTo: "", reminder: "",
    taskOwner: "PM SDL",
    createdBy: "pm@socialdnalabs.com", createdAt: "Mon, Mar 24, 2026 11:00 AM",
    modifiedBy: "pm@socialdnalabs.com", modifiedAt: "Mon, Mar 24, 2026 11:00 AM",
    description: "",
    timeline: [
      { date: "2026-03-24", time: "11:00 am", event: "Task created", by: "pm@socialdnalabs.com" },
    ],
  },
};

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
//  Sub-components
// ─────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children, action }: {
  icon: React.ElementType; title: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#EFF6FF]">
        <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon size={13} color="#1D4ED8" weight="duotone" />
        </div>
        <span className="font-heading text-[11px] font-bold text-[#1D4ED8] uppercase tracking-[0.12em] flex-1">{title}</span>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-10 gap-y-0">{children}</div>;
}

function KV({ label, value, editable }: { label: string; value?: string | number; editable?: boolean }) {
  const display = value !== undefined && value !== "" ? String(value) : "—";
  return (
    <div className="py-2.5 border-b border-[#EFF6FF] last:border-0 flex items-start justify-between group">
      <div className="flex-1">
        <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className={`text-[13px] font-medium whitespace-pre-line ${display === "—" ? "text-slate-300" : "text-slate-700"}`}>{display}</div>
      </div>
      {editable && (
        <IconButton size="small"
          sx={{ p: 0.5, color: "#CBD5E1", opacity: 0, transition: "opacity 0.15s", ".group:hover &": { opacity: 1 }, "&:hover": { color: "#1D4ED8", bgcolor: "#EFF6FF" }, borderRadius: "6px" }}>
          <PencilSimple size={13} weight="duotone" />
        </IconButton>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
export default function TaskDetail({ taskId }: { taskId: number }) {
  const router = useRouter();
  const task = TASKS_DETAIL[taskId];

  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; at: string }[]>([]);
  const [attachView, setAttachView] = useState<"grid" | "list">("grid");
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  if (!task) {
    return (
      <div className="flex h-screen bg-[#EFF6FF] font-sans">
        <Sidebar />
        <div className="sidebar-content flex-1 flex flex-col">
          <TopBar title="Tasks" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#0C2472] text-xl font-bold mb-2">Task not found</div>
              <button onClick={() => router.push("/tasks")} className="text-[#1D4ED8] text-sm underline">Back to Tasks</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [{ text: note.trim(), at: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) }, ...prev]);
    setNote("");
  };

  const statusCfg = STATUS_CFG[task.status];
  const priorityCfg = PRIORITY_CFG[task.priority];

  const relatedItems = [
    { label: "Notes",       icon: Note,      count: notes.length, color: "#8B5CF6" },
    { label: "Attachments", icon: Paperclip, count: 0,            color: "#F59E0B" },
  ];

  const RelatedListPanel = ({ onItemClick }: { onItemClick: (label: string) => void }) => (
    <div className="space-y-4">
      <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
          <span className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</span>
        </div>
        <div className="p-2 space-y-0.5">
          {relatedItems.map(({ label, icon: Icon, count, color }) => (
            <button key={label} onClick={() => onItemClick(label)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                <Icon size={14} color={color} weight="duotone" />
              </div>
              <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8] transition-colors">{label}</span>
              {count > 0 && (
                <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>
              )}
              <CaretRight size={14} color="#CBD5E1" weight="duotone" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar title="Tasks" />

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 px-8 py-3 bg-[#E3ECFC] border-b border-[#E3ECFC] text-[12px]">
          <Link href="/" className="text-slate-400 hover:text-[#1D4ED8] transition-colors">
            <House size={13} weight="duotone" />
          </Link>
          <CaretRight size={11} color="#CBD5E1" />
          <Link href="/tasks" className="text-slate-400 hover:text-[#1D4ED8] font-medium transition-colors">Tasks</Link>
          <CaretRight size={11} color="#CBD5E1" />
          <span className="text-[#0C2472] font-semibold">{task.refId}</span>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Header row ── */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm flex-shrink-0">
                <ClipboardText size={18} color="#fff" weight="duotone" />
              </div>
              <div>
                <h1 className="font-heading text-[18px] font-bold text-slate-900 tracking-tight leading-tight mb-0">{task.subject}</h1>
                <span className="text-[12px] text-slate-400">{task.type} · {task.refId}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="small" variant="outlined" startIcon={<PencilSimple size={13} weight="duotone" />}
                sx={{ borderColor: "#E3ECFC", color: "#0C2472", bgcolor: "#f9fbff", borderRadius: "9px", textTransform: "none", fontWeight: 600, fontSize: "0.78rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#EFF6FF" } }}>
                Edit
              </Button>
              <Tooltip title="More actions">
                <IconButton size="small" onClick={e => setMoreAnchor(e.currentTarget)}
                  sx={{ border: "1.5px solid #E3ECFC", borderRadius: "9px", bgcolor: "#f9fbff", p: 0.8, "&:hover": { bgcolor: "#EFF6FF" } }}>
                  <DotsThreeVertical size={16} weight="bold" color="#64748B" />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 mb-5">
            {(["overview", "timeline"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[#1D4ED8] text-white shadow-sm"
                    : "bg-[#f9fbff] text-slate-500 hover:bg-[#E3ECFC] hover:text-[#1D4ED8]"
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="col-span-2 space-y-5">

                {/* ── Quick Info ── */}
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm divide-y divide-[#EFF6FF]">
                  {[
                    { label: "Type",     value: task.type },
                    { label: "Subject",  value: task.subject },
                    { label: "Due Date", value: task.dueDate },
                    { label: "Priority", value: task.priority },
                    { label: "Status",   value: task.status },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-[12.5px] text-slate-500 font-medium w-32 flex-shrink-0">{label}:</span>
                      <span className="flex-1 text-[13px] font-semibold text-slate-700">
                        {label === "Status" && value && statusCfg ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold"
                            style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}>
                            <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: statusCfg.dot }} />
                            {value}
                          </span>
                        ) : label === "Priority" && value && priorityCfg ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-bold"
                            style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.text }}>
                            {value}
                          </span>
                        ) : (
                          value || <span className="text-slate-300">—</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── Task Information ── */}
                <SectionCard icon={ClipboardText} title="Task Information"
                  action={
                    <IconButton size="small" onClick={e => setMoreAnchor(e.currentTarget)}
                      sx={{ p: 0.5, color: "#CBD5E1", "&:hover": { color: "#1D4ED8", bgcolor: "#EFF6FF" }, borderRadius: "6px" }}>
                      <DotsThreeVertical size={16} weight="bold" />
                    </IconButton>
                  }>
                  <InfoGrid>
                    <KV label="Type"        value={task.type} />
                    <KV label="Subject"     value={task.subject}   editable />
                    <KV label="Due Date"    value={task.dueDate} />
                    <KV label="Status"      value={task.status} />
                    <KV label="Priority"    value={task.priority} />
                    <KV label="Contact"     value={task.contact} />
                    <KV label="Related to"  value={task.relatedTo} />
                    <KV label="Reminder"    value={task.reminder} />
                    <KV label="Task Owner"  value={task.taskOwner} />
                    <KV label="Created By"  value={`${task.createdBy}\n${task.createdAt}`} />
                    <KV label="Modified By" value={`${task.modifiedBy}\n${task.modifiedAt}`} />
                  </InfoGrid>
                </SectionCard>

                {/* ── Description ── */}
                <SectionCard icon={Tag} title="Description Information">
                  <KV label="Description" value={task.description} editable />
                </SectionCard>

                {/* ── Notes ── */}
                <div id="section-notes">
                  <SectionCard icon={Note} title="Notes">
                    <div className="space-y-3">
                      <div className="border border-[#E3ECFC] rounded-xl overflow-hidden focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
                        <InputBase
                          fullWidth multiline minRows={2}
                          placeholder="Add a note…"
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          sx={{ px: 2, py: 1.5, fontSize: "0.8rem", color: "#334155", "& textarea::placeholder": { color: "#CBD5E1", opacity: 1 } }}
                        />
                        {note.trim() && (
                          <div className="flex justify-end px-3 pb-2">
                            <Button size="small" variant="contained" onClick={addNote}
                              sx={{ bgcolor: "#1D4ED8", borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", "&:hover": { bgcolor: "#60A5FA" }, "&:active": { bgcolor: "#0C2472" } }}>
                              Save Note
                            </Button>
                          </div>
                        )}
                      </div>
                      {notes.map((n, i) => (
                        <div key={i} className="bg-[#EFF6FF] rounded-xl px-4 py-3 border border-[#E3ECFC]">
                          <div className="text-[12.5px] text-slate-700">{n.text}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.at}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                {/* ── Attachments ── */}
                <div id="section-attachments">
                  <SectionCard icon={Paperclip} title="Attachments"
                    action={
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#EFF6FF] rounded-lg p-0.5 gap-0.5">
                          {[{ k: "grid", Icon: GridFour }, { k: "list", Icon: List }].map(({ k, Icon }) => (
                            <button key={k} onClick={() => setAttachView(k as "grid" | "list")}
                              className={`p-1 rounded-md transition-colors ${attachView === k ? "bg-[#f9fbff] text-[#1D4ED8]" : "text-slate-400 hover:text-[#1D4ED8]"}`}>
                              <Icon size={13} weight="duotone" />
                            </button>
                          ))}
                        </div>
                        <Button size="small" variant="outlined"
                          sx={{ borderColor: "#E3ECFC", color: "#0C2472", bgcolor: "#E3ECFC", borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.73rem", "&:hover": { borderColor: "#1D4ED8", color: "#1D4ED8", bgcolor: "#f9fbff" } }}>
                          Attach
                        </Button>
                      </div>
                    }>
                    <div className="flex items-center justify-center py-6 text-slate-300 text-[12.5px]">
                      No attachments yet
                    </div>
                  </SectionCard>
                </div>

              </div>{/* end col-span-2 */}

              <RelatedListPanel
                onItemClick={label =>
                  document.getElementById(`section-${label.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              />

            </div>
          )}

          {activeTab === "timeline" && (
            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="col-span-2">
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#EFF6FF]">
                    <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                      <ClipboardText size={13} color="#1D4ED8" weight="duotone" />
                    </div>
                    <span className="font-heading text-[11px] font-bold text-[#1D4ED8] uppercase tracking-[0.12em] flex-1">Activity Timeline</span>
                  </div>
                  <div className="px-5 py-4">
                    {task.timeline.length === 0 ? (
                      <div className="text-slate-300 text-[12.5px] text-center py-6">No activity yet</div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#E3ECFC]" />
                        <div className="space-y-5">
                          {task.timeline.map((entry, i) => (
                            <div key={i} className="flex items-start gap-4 pl-7 relative">
                              <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-[#EFF6FF] border-2 border-[#E3ECFC] flex items-center justify-center flex-shrink-0">
                                <ClipboardText size={10} color="#1D4ED8" weight="duotone" />
                              </div>
                              <div className="flex-1">
                                <div className="text-[12.5px] font-semibold text-slate-700">{entry.event}</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">{entry.by}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-[11px] font-medium text-slate-500">
                                  {new Date(entry.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                                </div>
                                <div className="text-[10.5px] text-slate-400">{entry.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <RelatedListPanel onItemClick={() => setActiveTab("overview")} />

            </div>
          )}

        </div>{/* end body */}
      </div>{/* end sidebar-content */}

      {/* ── More menu ── */}
      <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}
        PaperProps={{ sx: { borderRadius: "12px", border: "1px solid #E3ECFC", boxShadow: "0 8px 32px rgba(29,78,216,0.10)", minWidth: 170 } }}>
        <MenuItem onClick={() => setMoreAnchor(null)} sx={{ fontSize: "0.8rem", gap: 1.5, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 0 }}><Copy size={14} color="#64748B" weight="duotone" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.8rem" }}>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMoreAnchor(null)} sx={{ fontSize: "0.8rem", gap: 1.5, py: 1, color: "#DC2626" }}>
          <ListItemIcon sx={{ minWidth: 0 }}><Trash size={14} color="#DC2626" weight="duotone" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "0.8rem", color: "#DC2626" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

    </div>
  );
}
