"use client";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import { X, ClipboardText } from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Data lists
// ─────────────────────────────────────────────
const TASK_TYPES    = ["Task", "Call", "Email", "Quote", "Meeting"];
const STATUSES      = ["Todo", "In Progress", "Backlog", "Completed"];
const PRIORITIES    = ["High", "Medium", "Low"];
const CONTACT_TYPES = ["Contact", "Lead"];
const RELATE_TYPES  = ["Account", "Deal", "Contact", "Lead"];
const CONTACTS      = ["SDL Test Test-SDL", "John Smith", "Raja rajan", "Vishnutharan R", "Speedy Mike", "test test"];
const RELATED_TO    = ["SDL - Account", "RMVT - Account", "Sweany Inc - Account", "SDL LEAD1 - Account", "New - Deal", "CRM Application - Deal"];
const TASK_OWNERS   = ["PM SDL", "SE User 1", "Admin"];

// ─────────────────────────────────────────────
//  Shared MUI input styling
// ─────────────────────────────────────────────
const FX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#EFF6FF",
    fontSize: "0.82rem",
    "& fieldset":             { borderColor: "#E3ECFC", borderWidth: 1.5 },
    "&:hover fieldset":       { borderColor: "#60A5FA" },
    "&.Mui-focused fieldset": { borderColor: "#1D4ED8", borderWidth: 2 },
    "&.Mui-focused":          { boxShadow: "0 0 0 2px #93C5FD" },
    "& input":                { padding: "10px 14px" },
  },
  "& .MuiInputLabel-root":             { fontSize: "0.79rem", color: "#6B7280" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1D4ED8" },
  "& .MuiSelect-select":               { fontSize: "0.82rem", padding: "10px 14px", backgroundColor: "#EFF6FF" },
};

const TEXTAREA_FX = {
  ...FX,
  "& .MuiOutlinedInput-root": {
    ...FX["& .MuiOutlinedInput-root"],
    "& textarea": { padding: "10px 14px" },
    "& input":    undefined,
  },
};

// ─────────────────────────────────────────────
//  Default state
// ─────────────────────────────────────────────
const DEFAULT = {
  type:         "",
  subject:      "",
  dueDate:      "",
  status:       "",
  priority:     "",
  contactType:  "Contact",
  contactName:  "",
  relateType:   "Account",
  relatedTo:    "",
  reminder:     false,
  taskOwner:    "PM SDL",
  description:  "",
};

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
interface Props {
  open:    boolean;
  onClose: () => void;
}

export default function NewTaskDrawer({ open, onClose }: Props) {
  const [form, setForm] = useState({ ...DEFAULT });
  const set  = (k: string, v: string)  => setForm(p => ({ ...p, [k]: v }));
  const setB = (k: string, v: boolean) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    console.log("New task:", form);
    onClose();
    setForm({ ...DEFAULT });
  };

  const handleClose = () => {
    onClose();
    setForm({ ...DEFAULT });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 580 },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#F8FAFF",
          boxShadow: "-12px 0 48px rgba(12,36,114,0.12)",
        },
      }}
    >
      {/* ══ Header ══ */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f9fbff] border-b border-[#E3ECFC] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm">
            <ClipboardText size={18} color="#fff" weight="duotone" />
          </div>
          <h2 className="font-heading text-[16px] font-bold text-slate-900 tracking-tight">New Task</h2>
        </div>
        <Tooltip title="Close">
          <IconButton size="small" onClick={handleClose}
            sx={{ borderRadius: "9px", border: "1.5px solid #E3ECFC", "&:hover": { bgcolor: "#EFF6FF" } }}>
            <X size={17} color="#64748B" weight="duotone" />
          </IconButton>
        </Tooltip>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* ── Task Information ── */}
        <div>
          <h3 className="font-heading text-[13px] font-bold text-slate-800 mb-4 tracking-tight">Task Information</h3>

          <div className="space-y-3">
            {/* Type */}
            <FormControl size="small" fullWidth sx={FX}>
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={form.type} onChange={e => set("type", e.target.value)}>
                {TASK_TYPES.map(t => (
                  <MenuItem key={t} value={t} sx={{ fontSize: "0.82rem" }}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subject */}
            <TextField
              label="Subject"
              value={form.subject}
              onChange={e => set("subject", e.target.value)}
              size="small" fullWidth sx={FX}
            />

            {/* Due Date */}
            <TextField
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={e => set("dueDate", e.target.value)}
              size="small" fullWidth
              InputLabelProps={{ shrink: true }}
              sx={FX}
            />

            {/* Status */}
            <FormControl size="small" fullWidth sx={FX}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => (
                  <MenuItem key={s} value={s} sx={{ fontSize: "0.82rem" }}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Priority */}
            <FormControl size="small" fullWidth sx={FX}>
              <InputLabel>Priority</InputLabel>
              <Select label="Priority" value={form.priority} onChange={e => set("priority", e.target.value)}>
                {PRIORITIES.map(p => (
                  <MenuItem key={p} value={p} sx={{ fontSize: "0.82rem" }}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Contact — type + name */}
            <div className="grid grid-cols-[160px_1fr] gap-2">
              <FormControl size="small" fullWidth sx={FX}>
                <InputLabel>Contact</InputLabel>
                <Select label="Contact" value={form.contactType} onChange={e => set("contactType", e.target.value)}>
                  {CONTACT_TYPES.map(t => (
                    <MenuItem key={t} value={t} sx={{ fontSize: "0.82rem" }}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth sx={FX}>
                <InputLabel>Name</InputLabel>
                <Select label="Name" value={form.contactName} onChange={e => set("contactName", e.target.value)}
                  displayEmpty renderValue={v => v || ""}>
                  <MenuItem value="" sx={{ fontSize: "0.82rem", color: "#94A3B8" }}><em>None</em></MenuItem>
                  {CONTACTS.map(c => (
                    <MenuItem key={c} value={c} sx={{ fontSize: "0.82rem" }}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Related to — type + record */}
            <div className="grid grid-cols-[160px_1fr] gap-2">
              <FormControl size="small" fullWidth sx={FX}>
                <InputLabel>Relate to</InputLabel>
                <Select label="Relate to" value={form.relateType} onChange={e => set("relateType", e.target.value)}>
                  {RELATE_TYPES.map(t => (
                    <MenuItem key={t} value={t} sx={{ fontSize: "0.82rem" }}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth sx={FX}>
                <InputLabel>Related to</InputLabel>
                <Select label="Related to" value={form.relatedTo} onChange={e => set("relatedTo", e.target.value)}
                  displayEmpty renderValue={v => v || ""}>
                  <MenuItem value="" sx={{ fontSize: "0.82rem", color: "#94A3B8" }}><em>None</em></MenuItem>
                  {RELATED_TO.map(r => (
                    <MenuItem key={r} value={r} sx={{ fontSize: "0.82rem" }}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Reminder toggle */}
            <div className="flex items-center gap-3 py-1">
              <span className="text-[13px] text-slate-600 font-medium">Reminder</span>
              <Switch
                checked={form.reminder}
                onChange={e => setB("reminder", e.target.checked)}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked":             { color: "#1D4ED8" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#93C5FD" },
                }}
              />
            </div>

            {/* Task Owner — fieldset-style */}
            <fieldset className="rounded-[10px] border border-[#E3ECFC] px-3 pb-3 pt-1 bg-[#EFF6FF]">
              <legend className="text-[11px] font-semibold text-slate-500 px-1">Task Owner</legend>
              <FormControl size="small" fullWidth sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px", fontSize: "0.82rem",
                  "& fieldset":             { borderColor: "#E3ECFC" },
                  "&:hover fieldset":       { borderColor: "#60A5FA" },
                  "&.Mui-focused fieldset": { borderColor: "#1D4ED8" },
                  "& .MuiSelect-select":    { padding: "8px 14px", backgroundColor: "#fff" },
                },
              }}>
                <Select value={form.taskOwner} onChange={e => set("taskOwner", e.target.value)}>
                  {TASK_OWNERS.map(o => (
                    <MenuItem key={o} value={o} sx={{ fontSize: "0.82rem" }}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </fieldset>
          </div>
        </div>

        {/* ── Description Information ── */}
        <div>
          <h3 className="font-heading text-[13px] font-bold text-slate-800 mb-4 tracking-tight">Description Information</h3>
          <TextField
            label="Description"
            value={form.description}
            onChange={e => set("description", e.target.value)}
            multiline minRows={4} fullWidth
            sx={TEXTAREA_FX}
          />
        </div>

      </div>

      {/* ══ Footer ══ */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#f9fbff] border-t border-[#E3ECFC] flex-shrink-0">
        <Button variant="text" onClick={handleClose}
          sx={{ color: "#64748B", textTransform: "none", fontWeight: 600, fontSize: "0.82rem", borderRadius: "9px", px: 2.5, "&:hover": { bgcolor: "#EFF6FF" } }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}
          sx={{ bgcolor: "#1D4ED8", borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.82rem", px: 3, boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#60A5FA" }, "&:active": { bgcolor: "#0C2472" } }}>
          Submit
        </Button>
      </div>
    </Drawer>
  );
}
