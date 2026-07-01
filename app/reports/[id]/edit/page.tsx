"use client";
import { useState, use } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useTheme } from "@/components/ThemeContext";
import WidgetCard from "@/components/shared/WidgetCard";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { CaretLeft, Plus, X, CheckCircle } from "@phosphor-icons/react";
import { MODULE_CONFIG, ModuleType, getRelatedModules, getCombinedFields } from "@/lib/moduleRelationships";

export default function ReportEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reportName] = useState("Deal 30");
  const [primaryModule, setPrimaryModule] = useState<ModuleType>("Deals");
  const [selectedRelatedModules, setSelectedRelatedModules] = useState<ModuleType[]>(["Accounts", "Contacts"]);
  const [activeTab, setActiveTab] = useState<"columns" | "filters">("columns");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["dealName", "amount", "stage", "account"]);

  const relatedModules = getRelatedModules(primaryModule);
  const combinedFields = getCombinedFields(primaryModule, selectedRelatedModules);

  const handleAddRelatedModule = (module: ModuleType) => {
    if (!selectedRelatedModules.includes(module)) {
      setSelectedRelatedModules([...selectedRelatedModules, module]);
    }
  };

  const handleRemoveRelatedModule = (module: ModuleType) => {
    setSelectedRelatedModules(selectedRelatedModules.filter(m => m !== module));
  };

  const availableModulesForAdd = relatedModules.filter(m => !selectedRelatedModules.includes(m.name as ModuleType));

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-[#EFF6FF]"}`}>
      <Sidebar />
      <div className={`sidebar-content flex-1 flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
        <TopBar />

        <div className={`flex-1 overflow-auto ${isDark ? "bg-[#000000]" : "bg-transparent"}`}>
          <main className="px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className={isDark ? "text-[#9CA3AF] hover:text-white" : "text-slate-500 hover:text-slate-700"}>
                  <CaretLeft size={20} weight="duotone" />
                </button>
                <h1 className={`text-[20px] font-extrabold tracking-tight ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>{reportName}</h1>
                <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${isDark ? "bg-[#27272A] text-[#9CA3AF]" : "bg-[#E3ECFC] text-[#0C2472]"}`}>{primaryModule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="text" sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", px: 2, "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                  Cancel
                </Button>
                <Button variant="outlined" sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", color: isDark ? "#D4D4D8" : "#0C2472", borderColor: isDark ? "#27272A" : "#E3ECFC", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                  Run
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 700, fontSize: "13px", borderRadius: "9px", boxShadow: "0 1px 8px #1D4ED833", "&:hover": { bgcolor: "#2563EB" } }}>
                  Save
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
              {/* Left Panel - Configuration */}
              <WidgetCard title="1. Primary Module" isDark={isDark} noPadding className="lg:col-span-1 flex flex-col">
                <div className="px-6 py-5 flex-1 overflow-auto space-y-6">
                  <div>
                    <label className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Select Module</label>
                    <select
                      value={primaryModule}
                      onChange={(e) => setPrimaryModule(e.target.value as ModuleType)}
                      className={`w-full mt-2 px-3 py-2.5 border rounded-xl text-[13px] font-medium outline-none transition ${isDark ? "bg-[#0A0A0A] border-[#27272A] text-[#F4F4F5]" : "bg-[#f9fbff] border-[#E3ECFC] text-[#0C2472]"}`}>
                      {Object.values(MODULE_CONFIG).map(module => (
                        <option key={module.name} value={module.name}>{module.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Related Modules */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>2. Related Modules</label>
                      <Tooltip title="Add related module">
                        <IconButton size="small" disabled={availableModulesForAdd.length === 0}
                          sx={{ color: availableModulesForAdd.length === 0 ? (isDark ? "#52525B" : "#D1D5DB") : "#1D4ED8", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                          <Plus size={16} weight="bold" />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {selectedRelatedModules.length === 0 ? (
                      <p className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>No related modules set. Use + to add related modules such as Contact or Address.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedRelatedModules.map(module => (
                          <div key={module} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${isDark ? "bg-[#111111] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                            <span className={`text-[13px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>{module}</span>
                            <button onClick={() => handleRemoveRelatedModule(module)}
                              className={`p-1 rounded-md transition ${isDark ? "hover:bg-[#27272A] text-[#71717A]" : "hover:bg-[#E3ECFC] text-slate-400"}`}>
                              <X size={14} weight="bold" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {availableModulesForAdd.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {availableModulesForAdd.map(module => (
                          <button key={module.name} onClick={() => handleAddRelatedModule(module.name as ModuleType)}
                            className={`w-full px-3 py-2 text-left rounded-xl text-[13px] font-semibold transition ${isDark ? "bg-[#111111] text-[#60A5FA] hover:bg-[#27272A]" : "bg-[#f9fbff] text-[#1D4ED8] hover:bg-[#EFF6FF]"}`}>
                            + {module.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fields & Filters */}
                  <div>
                    <h3 className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-3 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>3. Fields & Filters</h3>
                    <div className={`flex gap-2 border-b mb-3 ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                      <button onClick={() => setActiveTab("columns")}
                        className={`px-3 py-2 text-[13px] font-bold border-b-2 transition ${activeTab === "columns" ? "text-[#1D4ED8] border-[#1D4ED8]" : (isDark ? "text-[#9CA3AF] border-transparent" : "text-slate-500 border-transparent")}`}>
                        Columns
                      </button>
                      <button onClick={() => setActiveTab("filters")}
                        className={`px-3 py-2 text-[13px] font-bold border-b-2 transition ${activeTab === "filters" ? "text-[#1D4ED8] border-[#1D4ED8]" : (isDark ? "text-[#9CA3AF] border-transparent" : "text-slate-500 border-transparent")}`}>
                        Filters
                      </button>
                    </div>

                    {activeTab === "columns" && (
                      <div className="space-y-4">
                        {combinedFields.map(({ module, fields }) => (
                          <div key={module}>
                            <p className={`text-[10.5px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{module}</p>
                            <div className="space-y-1.5 pl-1">
                              {fields.slice(0, 5).map(field => (
                                <label key={field.name} className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={selectedColumns.includes(field.name)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedColumns([...selectedColumns, field.name]);
                                      else setSelectedColumns(selectedColumns.filter(c => c !== field.name));
                                    }}
                                    className="w-4 h-4 rounded accent-[#1D4ED8]" />
                                  <span className={`text-[13px] font-medium ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{field.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "filters" && (
                      <div className={`text-center py-8 text-[13px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                        Click on a column to add filters
                      </div>
                    )}
                  </div>
                </div>
              </WidgetCard>

              {/* Right Panel - Results */}
              <WidgetCard title="Results" subtitle="Saving runs the query automatically. Use Run to refresh after you change the report." isDark={isDark} noPadding className="lg:col-span-2 flex flex-col">
                <div className="flex-1 overflow-auto px-6 py-5">
                  <div className="space-y-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold ${isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                      <CheckCircle size={14} weight="fill" />
                      Report is valid
                    </div>

                    <div>
                      <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Primary Module</p>
                      <p className={`text-[16px] font-bold ${isDark ? "text-white" : "text-[#0C2472]"}`}>{primaryModule}</p>
                    </div>

                    <div>
                      <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Related Modules · {selectedRelatedModules.length} selected</p>
                      {selectedRelatedModules.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedRelatedModules.map(module => (
                            <span key={module} className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${isDark ? "bg-[#111111] text-[#60A5FA]" : "bg-[#EFF6FF] text-[#1D4ED8]"}`}>
                              {module}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Selected Fields · {selectedColumns.length} columns</p>
                      {selectedColumns.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedColumns.map(col => (
                            <span key={col} className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg ${isDark ? "bg-[#111111] text-[#D4D4D8]" : "bg-[#f9fbff] text-slate-700 border border-[#E3ECFC]"}`}>
                              {col}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </WidgetCard>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
