"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import InputBase from "@mui/material/InputBase";
import {
  Plus, PencilSimple, CaretDown, Play, FloppyDisk, X,
  ChartBar, Info, Check, MagnifyingGlass, FunnelSimple,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

const MODULE_FIELDS: Record<string, string[]> = {
  Deals:    ["Deal Name","Amount","Stage","Probability (%)","Account Name","Contact Name","Owner","Closing Date","Lead Source","Created","Modified"],
  Leads:    ["Lead Name","Company","Email","Mobile","Status","Lead Source","Rating","Owner","Created","Modified"],
  Contacts: ["First Name","Last Name","Email","Phone","Mobile","Account Name","Owner","Created","Modified"],
  Accounts: ["Account Name","Phone","Account Type","Industry","Annual Revenue","Owner","Created","Modified"],
};

type FilterTabType = "Columns" | "Filters";

function SectionRow({ title, subtitle, onEdit, children, isDark }: {
  title: string; subtitle?: string; onEdit?: () => void;
  children?: React.ReactNode; isDark: boolean;
}) {
  return (
    <div className={`border-b last:border-0 ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}>
      <div className="flex items-start justify-between py-3 px-1">
        <div className="flex-1 min-w-0">
          <p className={`font-heading text-[12.5px] font-bold ${isDark ? "text-[#D4D4D8]" : "text-slate-800"}`}>{title}</p>
          {subtitle && <p className={`text-[11px] mt-0.5 leading-snug ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{subtitle}</p>}
          {children}
        </div>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}
            sx={{ flexShrink:0, ml:1, borderRadius:"6px", p:0.5, color: isDark ? "#3F3F46" : "#94A3B8", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF", color: isDark ? "#A1A1AA" : "#E3ECFC" } }}>
            <PencilSimple size={14} weight="duotone" />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default function CreateReportPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reportName, setReportName]         = useState("Untitled Report");
  const [editingName, setEditingName]       = useState(false);
  const [primaryModule, setPrimaryModule]   = useState("");
  const [filterTab, setFilterTab]           = useState<FilterTabType>("Columns");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [hasResults, setHasResults]         = useState(false);
  const [showColPicker, setShowColPicker]   = useState(false);
  const [colSearch, setColSearch]           = useState("");
  const [isRunning, setIsRunning]           = useState(false);

  const handleModuleChange = (mod: string) => {
    setPrimaryModule(mod);
    setSelectedColumns([]);
    setHasResults(false);
    setShowColPicker(false);
  };

  const toggleColumn = (field: string) =>
    setSelectedColumns(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);

  const handleRun = () => {
    if (!primaryModule || selectedColumns.length === 0) return;
    setIsRunning(true);
    setTimeout(() => { setIsRunning(false); setHasResults(true); }, 800);
  };

  const sampleRows = primaryModule === "Deals"
    ? [["New","Proposal/Price Quote","₹29,999"],["testing","Needs Analysis","₹500,000"],["Smith","Value Proposition","₹100,000"]]
    : primaryModule === "Leads"
    ? [["Mrs. Shobha R","Shobha Realty","New"],["Priya Nair","Nair & Co","Contacted"]]
    : [["—"]];

  const visibleCols     = selectedColumns.slice(0, 5);
  const filteredFields  = (MODULE_FIELDS[primaryModule] || []).filter(f => f.toLowerCase().includes(colSearch.toLowerCase()));

  const panel = isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]";
  const card  = isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]";

  return (
    <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-transparent"}`}>
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* ── Builder header ── */}
        <div className={`flex items-start justify-between px-6 py-4 border-b flex-shrink-0 ${panel}`}>
          <div>
            <h2 className={`font-heading text-[18px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-slate-900"}`}>Create Report</h2>
            {editingName ? (
              <div className="flex items-center gap-2 mt-0.5">
                <InputBase value={reportName} onChange={e => setReportName(e.target.value)}
                  autoFocus onBlur={() => setEditingName(false)}
                  sx={{ fontSize:"0.78rem", color: isDark ? "#A1A1AA" : "#E3ECFC", fontWeight:600, borderBottom:`1.5px solid ${isDark ? "#52525B" : "#1D4ED8"}`, px:0.5 }}
                />
                <IconButton size="small" onClick={() => setEditingName(false)} sx={{ p:0.25 }}>
                  <Check size={12} color={isDark ? "#71717A" : "#E3ECFC"} weight="duotone" />
                </IconButton>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)}
                className={`text-[12px] font-medium hover:underline mt-0.5 block text-left ${isDark ? "text-[#71717A]" : "text-[#1D4ED8]"}`}>
                {reportName}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Button variant="outlined" size="small" onClick={() => router.push("/reports")}
              sx={{ borderColor: isDark ? "#3F3F46" : "#E3ECFC", color: isDark ? "#A1A1AA" : "#475569", bgcolor: isDark ? "#1C1C1E" : "transparent", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor: isDark ? "#52525B" : "#E3ECFC", bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
              Cancel
            </Button>
            <Button variant="outlined" size="small"
              startIcon={isRunning ? undefined : <Play size={13} weight="duotone" />}
              onClick={handleRun}
              disabled={!primaryModule || selectedColumns.length === 0}
              sx={{ borderColor: isDark ? "#3F3F46" : "#E3ECFC", color: isDark ? "#A1A1AA" : "#475569", bgcolor: isDark ? "#1C1C1E" : "transparent", borderRadius:"9px", textTransform:"none", fontWeight:600, fontSize:"0.78rem", px:2, "&:hover":{ borderColor: isDark ? "#52525B" : "#E3ECFC", bgcolor: isDark ? "#27272A" : "#EFF6FF" }, "&.Mui-disabled":{ borderColor: isDark ? "#27272A" : "#E3ECFC", color: isDark ? "#3F3F46" : "#9CA3AF" } }}>
              {isRunning ? "Running…" : "Run"}
            </Button>
            <Button variant="contained" size="small"
              startIcon={<FloppyDisk size={13} weight="duotone" />}
              onClick={() => { if (primaryModule) router.push("/reports"); }}
              disabled={!primaryModule}
              sx={{ bgcolor: isDark ? "#27272A" : "#E3ECFC", color: isDark ? "#F4F4F5" : undefined, borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:2, boxShadow: isDark ? "none" : "0 1px 8px #1D4ED833", "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#E3ECFC" }, "&.Mui-disabled":{ bgcolor: isDark ? "#1C1C1E" : "#E3ECFC", color: isDark ? "#3F3F46" : "#9CA3AF" } }}>
              Save
            </Button>
          </div>
        </div>

        {/* ── Two-panel layout ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: Builder panel */}
          <div className={`w-[420px] flex-shrink-0 border-r overflow-y-auto p-5 space-y-5 ${panel}`}>

            {/* Step 1 */}
            <div>
              <p className={`font-heading text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-[#52525B]" : "text-[#0C2472]"}`}>1. Primary Module</p>
              <FormControl size="small" fullWidth>
                <Select value={primaryModule} onChange={e => handleModuleChange(e.target.value)} displayEmpty
                  sx={{ borderRadius:"10px", bgcolor: isDark ? "#1C1C1E" : "#EFF6FF", fontSize:"0.82rem", color: isDark ? "#D4D4D8" : undefined, "& .MuiOutlinedInput-notchedOutline":{ borderColor: isDark ? "#3F3F46" : "#E3ECFC", borderWidth:1.5 }, "&:hover .MuiOutlinedInput-notchedOutline":{ borderColor: isDark ? "#52525B" : "#E3ECFC" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline":{ borderColor: isDark ? "#71717A" : "#E3ECFC", borderWidth:2 }, "& .MuiSelect-select":{ py:"9px", px:"12px", color: primaryModule ? (isDark ? "#D4D4D8" : "#E3ECFC") : (isDark ? "#3F3F46" : "#9CA3AF") }, "& .MuiSvgIcon-root":{ color: isDark ? "#52525B" : undefined } }}
                  renderValue={v => v || "Select primary module"}>
                  {Object.keys(MODULE_FIELDS).map(m => (
                    <MenuItem key={m} value={m} sx={{ fontSize:"0.82rem" }}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <p className={`font-heading text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-[#52525B]" : "text-[#0C2472]"}`}>2. Related Modules</p>
                  <Tooltip title="Add related modules to include data from connected CRM objects">
                    <Info size={13} color={isDark ? "#3F3F46" : "#94A3B8"} weight="duotone" className="cursor-pointer" />
                  </Tooltip>
                </div>
                <Tooltip title={primaryModule ? "Add related module" : "Select a primary module first"}>
                  <span>
                    <IconButton size="small" disabled={!primaryModule}
                      sx={{ border:`1.5px solid ${isDark ? "#3F3F46" : "#E3ECFC"}`, borderRadius:"7px", p:0.4, color: isDark ? "#52525B" : "#E3ECFC", bgcolor: isDark ? "#1C1C1E" : "transparent", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF" }, "&.Mui-disabled":{ color: isDark ? "#27272A" : "#E2E8F0", borderColor: isDark ? "#27272A" : "#E3ECFC" } }}>
                      <Plus size={13} weight="bold" />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
              {!primaryModule && (
                <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>Select a primary module above, then use + to add related modules.</p>
              )}
              {primaryModule && (
                <p className={`text-[11px] ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>No related modules added yet.</p>
              )}
            </div>

            {/* Step 3 */}
            <div>
              <p className={`font-heading text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? "text-[#52525B]" : "text-[#0C2472]"}`}>3. Fields & Filters</p>
              <div className={`flex border-b mb-4 ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                {(["Columns", "Filters"] as FilterTabType[]).map(tab => (
                  <button key={tab} onClick={() => setFilterTab(tab)}
                    className={`px-4 py-2 text-[12px] font-semibold transition-all border-b-2 -mb-px ${
                      filterTab === tab
                        ? isDark ? "text-[#D4D4D8] border-[#52525B]" : "text-[#1D4ED8] border-[#1D4ED8]"
                        : isDark ? "text-[#3F3F46] border-transparent hover:text-[#71717A]" : "text-slate-400 border-transparent hover:text-slate-600"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {filterTab === "Columns" && (
                <div className="space-y-1">
                  <SectionRow isDark={isDark} title="Columns"
                    subtitle={primaryModule ? (selectedColumns.length > 0 ? `${selectedColumns.length} column${selectedColumns.length > 1 ? "s" : ""} selected` : "Click edit to select columns") : "Select a primary module to load columns."}
                    onEdit={primaryModule ? () => setShowColPicker(v => !v) : undefined}>
                    {showColPicker && primaryModule && (
                      <div className={`mt-2 rounded-xl border p-3 space-y-2 ${card}`}>
                        <div className={`flex items-center gap-2 border rounded-lg px-2 py-1 ${isDark ? "bg-[#111113] border-[#3F3F46] focus-within:border-[#52525B]" : "bg-[#f9fbff] border-[#E3ECFC] focus-within:border-[#1D4ED8]"}`}>
                          <MagnifyingGlass size={12} color="#94A3B8" weight="duotone" />
                          <InputBase placeholder="Search fields…" value={colSearch} onChange={e => setColSearch(e.target.value)}
                            sx={{ flex:1, fontSize:"0.75rem", color: isDark ? "#A1A1AA" : "inherit", "& input::placeholder":{ color:"#94A3B8", opacity:1 } }} />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filteredFields.map(field => (
                            <label key={field} className={`flex items-center gap-2 px-1 py-1 rounded-lg cursor-pointer transition-colors ${isDark ? "hover:bg-[#27272A]" : "hover:bg-[#f9fbff]"}`}>
                              <Checkbox size="small" checked={selectedColumns.includes(field)} onChange={() => toggleColumn(field)}
                                sx={{ p:0.25, color: isDark ? "#3F3F46" : "#E2E8F0", "&.Mui-checked":{ color: isDark ? "#52525B" : "#E3ECFC" } }} />
                              <span className={`text-[12px] ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>{field}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button size="small" onClick={() => setShowColPicker(false)}
                            sx={{ textTransform:"none", fontSize:"0.73rem", color: isDark ? "#A1A1AA" : "#E3ECFC", fontWeight:600, "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedColumns.length > 0 && !showColPicker && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedColumns.map(col => (
                          <span key={col} className={`flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>
                            {col}
                            <button onClick={() => toggleColumn(col)} className={isDark ? "hover:text-[#D4D4D8]" : "hover:text-[#0C2472]"}>
                              <X size={10} weight="bold" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </SectionRow>
                  <SectionRow isDark={isDark} title="Row Groups" subtitle={selectedColumns.length === 0 ? "Add columns first to configure row groups" : "Click to configure row grouping"} onEdit={selectedColumns.length > 0 ? () => {} : undefined} />
                  <SectionRow isDark={isDark} title="Column Groups" subtitle={selectedColumns.length === 0 ? "Add columns first to configure column groups" : "Click to configure column grouping"} onEdit={selectedColumns.length > 0 ? () => {} : undefined} />
                  <SectionRow isDark={isDark} title="Aggregate Columns" subtitle="No aggregate column added" onEdit={selectedColumns.length > 0 ? () => {} : undefined} />
                </div>
              )}

              {filterTab === "Filters" && (
                <div className="py-4 text-center">
                  <FunnelSimple size={24} color={isDark ? "#3F3F46" : "#E3ECFC"} weight="duotone" className="mx-auto mb-2" />
                  <p className={`text-[12px] font-medium ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>No filters added</p>
                  <p className={`text-[11px] mt-0.5 ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>Click + to add filter conditions</p>
                  <Button size="small" startIcon={<Plus size={12} weight="bold" />} disabled={!primaryModule}
                    sx={{ mt:2, textTransform:"none", fontSize:"0.75rem", color: isDark ? "#71717A" : "#E3ECFC", fontWeight:600, borderRadius:"8px", "&:hover":{ bgcolor: isDark ? "#27272A" : "#EFF6FF" }, "&.Mui-disabled":{ color: isDark ? "#27272A" : "#E2E8F0" } }}>
                    Add Filter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Results preview */}
          <div className={`flex-1 overflow-auto flex flex-col ${isDark ? "bg-[#0A0A0A]" : "bg-[#F8FAFF]"}`}>
            <div className={`flex items-center justify-between px-6 py-3 border-b ${panel}`}>
              <p className={`font-heading text-[13px] font-bold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Results</p>
              <div className="flex items-center gap-2">
                {!hasResults && (
                  <p className={`text-[11.5px] max-w-xs ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                    Saving runs the query automatically. Use Run to refresh after you change the report.
                  </p>
                )}
                <button className={`flex items-center gap-1 text-[11.5px] font-semibold transition-colors ml-4 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                  Show Details <CaretDown size={11} weight="duotone" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              {!primaryModule && (
                <div className="text-center max-w-xs">
                  <ChartBar size={40} color={isDark ? "#27272A" : "#E3ECFC"} weight="duotone" className="mx-auto mb-4" />
                  <p className={`font-heading text-[14px] font-semibold mb-1 ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>No module selected</p>
                  <p className={`text-[12px] ${isDark ? "text-[#3F3F46]" : "text-slate-400"}`}>Select a primary module on the left to start building your report.</p>
                </div>
              )}

              {primaryModule && selectedColumns.length === 0 && !hasResults && (
                <div className="text-center max-w-sm">
                  <ChartBar size={40} color={isDark ? "#27272A" : "#E3ECFC"} weight="duotone" className="mx-auto mb-4" />
                  <p className={`font-heading text-[14px] font-semibold mb-1 ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>Add columns, then save the report to see query results here.</p>
                  <p className={`text-[12px] mt-1 ${isDark ? "text-[#3F3F46]" : "text-slate-400"}`}>
                    You&apos;ve selected <span className={`font-semibold ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{primaryModule}</span> as your primary module. Now select columns to include.
                  </p>
                </div>
              )}

              {primaryModule && selectedColumns.length > 0 && !hasResults && !isRunning && (
                <div className="text-center max-w-sm">
                  <Play size={40} color={isDark ? "#27272A" : "#E3ECFC"} weight="duotone" className="mx-auto mb-4" />
                  <p className={`font-heading text-[14px] font-semibold mb-2 ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>Ready to run</p>
                  <p className={`text-[12px] mb-4 ${isDark ? "text-[#3F3F46]" : "text-slate-400"}`}>
                    {selectedColumns.length} column{selectedColumns.length > 1 ? "s" : ""} selected from <span className={`font-semibold ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{primaryModule}</span>
                  </p>
                  <Button variant="contained" size="small" onClick={handleRun} startIcon={<Play size={14} weight="duotone" />}
                    sx={{ bgcolor: isDark ? "#27272A" : "#E3ECFC", color: isDark ? "#F4F4F5" : undefined, borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.78rem", px:3, "&:hover":{ bgcolor: isDark ? "#3F3F46" : "#E3ECFC" } }}>
                    Run Report
                  </Button>
                </div>
              )}

              {isRunning && (
                <div className="text-center">
                  <div className={`w-10 h-10 rounded-full animate-spin mx-auto mb-3 ${isDark ? "border-[#27272A] border-t-[#71717A]" : "border-[#E3ECFC] border-t-[#1D4ED8]"}`} style={{ borderWidth:3 }} />
                  <p className={`text-[12px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>Running query…</p>
                </div>
              )}

              {hasResults && !isRunning && (
                <div className="w-full max-w-2xl">
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#E3ECFC] border-[#E3ECFC]"}`}>
                      <span className={`font-heading text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>
                        {primaryModule} · {selectedColumns.length} columns
                      </span>
                      <span className={`text-[11px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>{sampleRows.length} records</span>
                    </div>
                    <div className={`grid px-4 py-2 border-b ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}
                      style={{ gridTemplateColumns:`repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                      {visibleCols.map(col => (
                        <p key={col} className={`font-heading text-[10.5px] font-bold uppercase tracking-wider truncate pr-2 ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{col}</p>
                      ))}
                    </div>
                    {sampleRows.map((row, i) => (
                      <div key={i} className={`grid px-4 py-2.5 border-b last:border-0 transition-colors ${isDark ? "border-[#27272A] hover:bg-[#27272A]" : "border-[#EFF6FF] hover:bg-[#60A5FA]/[0.04]"}`}
                        style={{ gridTemplateColumns:`repeat(${Math.min(visibleCols.length, 5)}, 1fr)` }}>
                        {row.slice(0, Math.min(visibleCols.length, 5)).map((cell, j) => (
                          <p key={j} className={`text-[12px] truncate pr-2 ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>{cell}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className={`text-center text-[11px] mt-3 ${isDark ? "text-[#3F3F46]" : "text-slate-400"}`}>
                    Preview · Save the report to see full results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
