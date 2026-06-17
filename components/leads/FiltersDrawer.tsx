"use client";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import Tooltip from "@mui/material/Tooltip";
import { X, Plus, Trash, SlidersHorizontal, FunnelSimple } from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

// ── Types ─────────────────────────────────────────
export type FilterOperator =
  | "contains" | "does_not_contain" | "equals" | "does_not_equal"
  | "starts_with" | "ends_with" | "is_empty" | "is_not_empty";

export type FilterLogic = "AND" | "OR";

export interface FilterRow {
  id: string;
  column: string;
  operator: FilterOperator;
  value: string;
  logic: FilterLogic;
}

export type FilterColumn = { value: string; label: string };

const DEFAULT_FILTER_COLUMNS: FilterColumn[] = [
  { value: "name",       label: "CRM Lead · Lead Name"   },
  { value: "company",    label: "CRM Lead · Company"      },
  { value: "email",      label: "CRM Lead · Email"        },
  { value: "mobile",     label: "CRM Lead · Mobile"       },
  { value: "phone",      label: "CRM Lead · Phone"        },
  { value: "leadStatus", label: "CRM Lead · Lead Status"  },
  { value: "leadSource", label: "CRM Lead · Lead Source"  },
  { value: "industry",   label: "CRM Lead · Industry"     },
  { value: "rating",     label: "CRM Lead · Rating"       },
  { value: "leadOwner",  label: "CRM Lead · Lead Owner"   },
  { value: "creation",   label: "CRM Lead · Created"      },
  { value: "modified",   label: "CRM Lead · Modified"     },
];

const OPERATORS: { value: FilterOperator; label: string; noValue?: boolean }[] = [
  { value: "contains",          label: "contains"         },
  { value: "does_not_contain",  label: "doesn't contain"  },
  { value: "equals",            label: "equals"           },
  { value: "does_not_equal",    label: "doesn't equal"    },
  { value: "starts_with",       label: "starts with"      },
  { value: "ends_with",         label: "ends with"        },
  { value: "is_empty",          label: "is empty",        noValue: true },
  { value: "is_not_empty",      label: "is not empty",    noValue: true },
];

const uid = () => Math.random().toString(36).slice(2, 8);

interface Props {
  open: boolean;
  onClose: () => void;
  filters: FilterRow[];
  onChange: (filters: FilterRow[]) => void;
  columns?: FilterColumn[];
  subtitle?: string;
}

export default function FiltersDrawer({ open, onClose, filters, onChange, columns, subtitle }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const SELECT_SX = {
    fontSize: "0.78rem",
    ...(isDark ? {} : { bgcolor: "#EFF6FF" }),
    borderRadius: "8px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#3F3F46" : "#E3ECFC", borderWidth: 1.5 },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#52525B" : "#E3ECFC" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#71717A" : "#E3ECFC", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "none" },
    "& .MuiSelect-select": { py: "7px", px: "10px" },
  };

  const FILTER_COLUMNS = columns ?? DEFAULT_FILTER_COLUMNS;
  const firstCol = FILTER_COLUMNS[0]?.value ?? "name";
  const defaultRow: Omit<FilterRow, "id"> = { column: firstCol, operator: "contains", value: "", logic: "AND" };

  const [local, setLocal] = useState<FilterRow[]>(
    filters.length ? filters : [{ id: uid(), ...defaultRow }]
  );

  const update = (id: string, patch: Partial<FilterRow>) =>
    setLocal(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));

  const addRow = () =>
    setLocal(prev => [...prev, { id: uid(), ...defaultRow, logic: "AND" }]);

  const removeRow = (id: string) =>
    setLocal(prev => prev.length === 1 ? prev : prev.filter(r => r.id !== id));

  const handleApply = () => { onChange(local.filter(r => r.value || OPERATORS.find(o => o.value === r.operator)?.noValue)); onClose(); };
  const handleClear = () => { setLocal([{ id: uid(), ...defaultRow }]); onChange([]); };

  const activeCount = filters.filter(r => r.value || OPERATORS.find(o => o.value === r.operator)?.noValue).length;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: 560, display: "flex", flexDirection: "column", bgcolor: isDark ? "#18181B" : "#F8FAFF", boxShadow: isDark ? "-12px 0 48px rgba(0,0,0,0.5)" : "-12px 0 48px rgba(12,36,114,0.12)" } }}>

      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
            <FunnelSimple size={18} color={isDark ? "#71717A" : "#E3ECFC"} weight="duotone" />
          </div>
          <div>
            <h2 className={`font-heading text-[15px] font-bold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Filters</h2>
            <p className={`text-[11px] ${isDark ? "text-[#71717A]" : "text-slate-400"}`}>{subtitle ?? "Narrow down leads by conditions"}</p>
          </div>
        </div>
        <Tooltip title="Close">
          <IconButton size="small" onClick={onClose}
            sx={{ borderRadius: "9px", border: `1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
            <X size={17} color={isDark ? "#71717A" : "#64748B"} weight="duotone" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {local.map((row, idx) => {
          const noValue = OPERATORS.find(o => o.value === row.operator)?.noValue;
          return (
            <div key={row.id}>
              {/* AND/OR logic badge between rows */}
              {idx > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  {(["AND", "OR"] as FilterLogic[]).map(l => (
                    <button key={l} onClick={() => update(row.id, { logic: l })}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                        row.logic === l
                          ? isDark
                            ? "bg-[#3F3F46] text-[#F4F4F5] border-[#52525B]"
                            : "bg-[#1D4ED8] text-white border-[#1D4ED8]"
                          : isDark
                            ? "bg-[#27272A] text-[#71717A] border-[#3F3F46] hover:bg-[#3F3F46] hover:text-[#A1A1AA]"
                            : "bg-[#E3ECFC] text-[#0C2472] border-[#E3ECFC] hover:bg-[#1D4ED8]/10"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              )}

              {/* Filter row */}
              <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                {idx === 0 && (
                  <p className={`font-heading text-[10px] font-bold uppercase tracking-wider mb-3 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>Where</p>
                )}

                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {/* Column */}
                    <FormControl size="small" fullWidth>
                      <Select value={row.column} onChange={e => update(row.id, { column: e.target.value })} sx={SELECT_SX}>
                        {FILTER_COLUMNS.map(c => (
                          <MenuItem key={c.value} value={c.value} sx={{ fontSize: "0.78rem" }}>{c.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Operator */}
                    <FormControl size="small" fullWidth>
                      <Select value={row.operator} onChange={e => update(row.id, { operator: e.target.value as FilterOperator })} sx={SELECT_SX}>
                        {OPERATORS.map(o => (
                          <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.78rem" }}>{o.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Value */}
                    {!noValue && (
                      <div className={`col-span-2 flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-all ${
                        isDark
                          ? "bg-[#111113] border-[#3F3F46] focus-within:border-[#52525B]"
                          : "bg-[#EFF6FF] border-[#E3ECFC] focus-within:border-[#1D4ED8] focus-within:border-2"
                      }`}>
                        <InputBase
                          fullWidth
                          placeholder="Enter value…"
                          value={row.value}
                          onChange={e => update(row.id, { value: e.target.value })}
                          sx={{ fontSize: "0.78rem", color: isDark ? "#D4D4D8" : "#334155", "& input::placeholder": { color: isDark ? "#52525B" : "#94A3B8", opacity: 1 } }}
                        />
                      </div>
                    )}
                    {noValue && (
                      <div className={`col-span-2 flex items-center justify-center py-2 rounded-xl border ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#EFF6FF] border-[#E3ECFC]"}`}>
                        <p className={`text-[11.5px] italic ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>No value needed for this condition</p>
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <Tooltip title="Remove filter">
                    <IconButton size="small" onClick={() => removeRow(row.id)}
                      sx={{ borderRadius: "8px", mt: 0.5, flexShrink: 0, "&:hover": { bgcolor: isDark ? "#27272A" : "#FEF2F2" } }}>
                      <Trash size={15} color="#EF4444" weight="duotone" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add row */}
        <button onClick={addRow}
          className={`flex items-center gap-2 text-[12.5px] font-semibold py-2 px-3 rounded-xl transition-all w-full ${
            isDark
              ? "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#27272A]"
              : "text-[#1D4ED8] hover:text-[#0C2472] hover:bg-[#EFF6FF]"
          }`}>
          <Plus size={14} weight="bold" />
          Add filter row
        </button>

        {/* Tips card */}
        <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
          <div className="flex items-start gap-2.5">
            <SlidersHorizontal size={16} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className={`text-[12px] font-semibold mb-0.5 ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>How filters work</p>
              <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#71717A]" : "text-slate-400"}`}>
                Rows joined by <span className={`font-bold ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>AND</span> must all match.
                Rows joined by <span className={`font-bold ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>OR</span> match if any condition is true.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between px-6 py-4 border-t flex-shrink-0 ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
        <button onClick={handleClear}
          className={`text-[13px] font-semibold px-3 py-2 rounded-xl transition-colors ${isDark ? "text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#27272A]" : "text-slate-400 hover:text-slate-600 hover:bg-[#EFF6FF]"}`}>
          Clear All
        </button>
        <Button variant="contained" size="small" startIcon={<FunnelSimple size={14} weight="duotone" />}
          onClick={handleApply}
          sx={{
            bgcolor: isDark ? "#27272A" : "inherit",
            color: isDark ? "#F4F4F5" : undefined,
            borderRadius: "9px", textTransform: "none", fontWeight: 700, fontSize: "0.78rem", px: 2.5, py: 0.9,
            boxShadow: isDark ? "none" : "0 2px 12px #1D4ED833",
            "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit", boxShadow: isDark ? "none" : "0 2px 14px #60A5FA55" },
            "&:active": { bgcolor: isDark ? "#18181B" : "#0C2472" },
          }}>
          Apply{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>
    </Drawer>
  );
}
