"use client";
import { useState, use, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useTheme } from "@/components/ThemeContext";
import WidgetCard from "@/components/shared/WidgetCard";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { CaretLeft, Plus, X, CheckCircle, PencilSimple, Trash, Info, Check } from "@phosphor-icons/react";
import { MODULE_CONFIG, ModuleType, getRelatedModules, getCombinedFields, FILTER_OPERATORS } from "@/lib/moduleRelationships";

interface Filter {
  id: string;
  fieldName: string;
  operator: string;
  value: string;
}

type StepType = "module" | "relatedModules" | "fieldsFilters" | "preview" | "save";

export default function ReportEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [reportName] = useState("Deal 30");
  const [primaryModule, setPrimaryModule] = useState<ModuleType>("Deals");
  const [selectedRelatedModules, setSelectedRelatedModules] = useState<ModuleType[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  // Stepper and modal states
  const [currentStep, setCurrentStep] = useState<StepType>("module");
  const [relatedModulesDialogOpen, setRelatedModulesDialogOpen] = useState(false);
  const [columnsFiltersDialogOpen, setColumnsFiltersDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"columns" | "filters">("columns");
  const [tempRelatedModules, setTempRelatedModules] = useState<ModuleType[]>(selectedRelatedModules);
  const [tempSelectedColumns, setTempSelectedColumns] = useState<string[]>(selectedColumns);
  const [tempFilters, setTempFilters] = useState<Filter[]>(filters);
  const [tempFilterField, setTempFilterField] = useState<string>("");
  const [tempFilterOperator, setTempFilterOperator] = useState<string>("");
  const [tempFilterValue, setTempFilterValue] = useState<string>("");

  // Initialize with default fields on mount
  useEffect(() => {
    if (selectedColumns.length === 0) {
      const combinedFieldsInit = getCombinedFields(primaryModule, selectedRelatedModules);
      const primaryFields = combinedFieldsInit.find(cf => cf.module === primaryModule)?.fields || [];
      const defaultFields = primaryFields.slice(0, 3).map(f => f.name);
      if (defaultFields.length > 0) {
        setSelectedColumns(defaultFields);
      }
    }
  }, []);

  const relatedModules = getRelatedModules(primaryModule);
  const combinedFields = getCombinedFields(primaryModule, selectedRelatedModules);

  // Stepper steps
  const steps: { id: StepType; label: string; description: string }[] = [
    { id: "module", label: "Primary Module", description: "Select main data source" },
    { id: "relatedModules", label: "Related Modules", description: "Add related data sources" },
    { id: "fieldsFilters", label: "Fields & Filters", description: "Choose columns and apply conditions" },
    { id: "preview", label: "Preview", description: "See sample results" },
    { id: "save", label: "Save", description: "Name and save your report" },
  ];

  const getStepIndex = (step: StepType) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  // Get default fields - accepts optional module to compute correctly during state updates
  const getDefaultFields = (forModule?: ModuleType): string[] => {
    const module = forModule || primaryModule;
    const primaryFields = combinedFields.find(cf => cf.module === module)?.fields || [];
    return primaryFields.slice(0, 3).map(f => f.name);
  };

  const handlePrimaryModuleChange = (module: ModuleType) => {
    setPrimaryModule(module);
    setSelectedRelatedModules([]);
    setSelectedColumns(getDefaultFields(module));
    setFilters([]);
    setCurrentStep("relatedModules");
  };

  const handleOpenRelatedModulesDialog = () => {
    setTempRelatedModules(selectedRelatedModules);
    setRelatedModulesDialogOpen(true);
  };

  const handleSaveRelatedModules = () => {
    setSelectedRelatedModules(tempRelatedModules);
    setRelatedModulesDialogOpen(false);
    setSelectedColumns(tempSelectedColumns.length > 0 ? tempSelectedColumns : getDefaultFields());
    setCurrentStep("fieldsFilters");
  };

  const handleToggleRelatedModule = (module: ModuleType) => {
    if (tempRelatedModules.includes(module)) {
      setTempRelatedModules(tempRelatedModules.filter(m => m !== module));
    } else {
      setTempRelatedModules([...tempRelatedModules, module]);
    }
  };

  const handleOpenColumnsFiltersDialog = () => {
    setTempSelectedColumns(selectedColumns);
    setTempFilters(filters);
    setActiveTab("columns");
    setColumnsFiltersDialogOpen(true);
  };

  const handleSaveColumnsFilters = () => {
    setSelectedColumns(tempSelectedColumns);
    setFilters(tempFilters);
    setColumnsFiltersDialogOpen(false);
    setCurrentStep("preview");
  };

  // Generate sample data for preview
  const getSampleData = () => {
    const sampleDeals = [
      { dealName: "Acme Corp Deal", amount: 29900, stage: "Qualified", accountName: "Acme Corp", createdDate: "2024-06-15" },
      { dealName: "Tech Solutions", amount: 18500, stage: "Contacted", accountName: "Tech Solutions Inc", createdDate: "2024-06-10" },
      { dealName: "Global Industries", amount: 125000, stage: "Won", accountName: "Global Industries", createdDate: "2024-05-20" },
      { dealName: "Future Systems", amount: 45000, stage: "Qualified", accountName: "Future Systems", createdDate: "2024-06-01" },
    ];

    const sampleAccounts = {
      "Acme Corp": { accountName: "Acme Corp", industry: "Technology", employees: 250 },
      "Tech Solutions Inc": { accountName: "Tech Solutions Inc", industry: "Software", employees: 120 },
      "Global Industries": { accountName: "Global Industries", industry: "Manufacturing", employees: 5000 },
      "Future Systems": { accountName: "Future Systems", industry: "Consulting", employees: 80 },
    };

    return { deals: sampleDeals, accounts: sampleAccounts };
  };

  const getSampleDataForColumns = () => {
    const { deals, accounts } = getSampleData();
    const result = deals.map(deal => {
      const row: Record<string, any> = {};
      selectedColumns.forEach(col => {
        if (col === "dealName") row[col] = deal.dealName;
        else if (col === "amount") row[col] = `$${deal.amount.toLocaleString()}`;
        else if (col === "stage") row[col] = deal.stage;
        else if (col === "accountName") row[col] = deal.accountName;
        else if (col === "createdDate") row[col] = deal.createdDate;
        else if (col === "accountName" && accounts[deal.accountName]) row[col] = accounts[deal.accountName].accountName;
        else if (col === "industry" && accounts[deal.accountName]) row[col] = accounts[deal.accountName].industry;
        else if (col === "employees" && accounts[deal.accountName]) row[col] = accounts[deal.accountName].employees;
      });
      return row;
    });
    return result;
  };

  const handleToggleColumn = (fieldName: string) => {
    if (tempSelectedColumns.includes(fieldName)) {
      setTempSelectedColumns(tempSelectedColumns.filter(c => c !== fieldName));
    } else {
      setTempSelectedColumns([...tempSelectedColumns, fieldName]);
    }
  };

  const handleAddFilter = () => {
    if (tempFilterField && tempFilterOperator && tempFilterValue) {
      const newFilter: Filter = {
        id: `filter-${Date.now()}`,
        fieldName: tempFilterField,
        operator: tempFilterOperator,
        value: tempFilterValue,
      };
      setTempFilters([...tempFilters, newFilter]);
      setTempFilterField("");
      setTempFilterOperator("");
      setTempFilterValue("");
    }
  };

  const handleRemoveFilter = (id: string) => {
    setTempFilters(tempFilters.filter(f => f.id !== id));
  };

  const getFieldLabel = (fieldName: string): string => {
    for (const { fields } of combinedFields) {
      const field = fields.find(f => f.name === fieldName);
      if (field) return field.label;
    }
    return fieldName;
  };

  const getAvailableFilterFields = () => {
    return combinedFields.flatMap(cf => cf.fields.map(f => ({ name: f.name, label: f.label, type: f.type })));
  };

  const getFilterOperators = (fieldName: string): string[] => {
    const field = getAvailableFilterFields().find(f => f.name === fieldName);
    if (!field) return [];
    return FILTER_OPERATORS[field.type] || [];
  };

  const isStepCompleted = (step: StepType): boolean => {
    if (step === "module") return primaryModule !== "";
    if (step === "relatedModules") return true; // Optional step
    if (step === "fieldsFilters") return selectedColumns.length > 0;
    if (step === "preview") return true;
    if (step === "save") return reportName !== "";
    return false;
  };

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

            {/* Stepper */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${isDark ? "bg-[#111111] border-[#27272A]" : "bg-white border-[#E3ECFC]"}`}>
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => isStepCompleted(steps[idx - 1]?.id as StepType) && setCurrentStep(step.id)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] transition-all ${
                        currentStep === step.id
                          ? "bg-[#1D4ED8] text-white"
                          : isStepCompleted(step.id)
                          ? `${isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`
                          : `${isDark ? "bg-[#27272A] text-[#9CA3AF]" : "bg-[#E3ECFC] text-slate-400"}`
                      }`}
                    >
                      {isStepCompleted(step.id) && step.id !== currentStep ? (
                        <Check size={16} weight="bold" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-[12px] font-bold ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>{step.label}</p>
                      <p className={`text-[10px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{step.description}</p>
                    </div>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full ${isDark ? "bg-[#27272A]" : "bg-[#E3ECFC]"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
              {/* Left Panel - Configuration */}
              <WidgetCard title="Report Builder" isDark={isDark} noPadding className="lg:col-span-1 flex flex-col">
                <div className="px-6 py-5 flex-1 overflow-auto space-y-6">
                  {/* Primary Module Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Primary Module</h3>
                      <Tooltip title="Select the main data source for your report">
                        <Info size={14} className={isDark ? "text-[#9CA3AF]" : "text-slate-400"} />
                      </Tooltip>
                    </div>
                    <select
                      value={primaryModule}
                      onChange={(e) => handlePrimaryModuleChange(e.target.value as ModuleType)}
                      className={`w-full px-3 py-2.5 border rounded-xl text-[13px] font-medium outline-none transition ${isDark ? "bg-[#0A0A0A] border-[#27272A] text-[#F4F4F5]" : "bg-[#f9fbff] border-[#E3ECFC] text-[#0C2472]"}`}>
                      {Object.values(MODULE_CONFIG).map(module => (
                        <option key={module.name} value={module.name}>{module.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Related Modules Section */}
                  {currentStep !== "module" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Related Modules</h3>
                          <Tooltip title="Join additional modules to enrich your data">
                            <Info size={14} className={isDark ? "text-[#9CA3AF]" : "text-slate-400"} />
                          </Tooltip>
                        </div>
                        <IconButton size="small" onClick={handleOpenRelatedModulesDialog}
                          sx={{ color: "#1D4ED8", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                          <Plus size={16} weight="bold" />
                        </IconButton>
                      </div>

                      {selectedRelatedModules.length === 0 ? (
                        <p className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>No related modules. Click + to add.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedRelatedModules.map(module => (
                            <div key={module} className={`px-3 py-2 rounded-xl border ${isDark ? "bg-[#111111] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                              <span className={`text-[13px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>{module}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fields & Filters Section */}
                  {(currentStep === "fieldsFilters" || currentStep === "preview" || currentStep === "save") && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Fields & Filters</h3>
                          <Tooltip title="Select columns and apply conditions to narrow results">
                            <Info size={14} className={isDark ? "text-[#9CA3AF]" : "text-slate-400"} />
                          </Tooltip>
                        </div>
                        <IconButton size="small" onClick={handleOpenColumnsFiltersDialog}
                          sx={{ color: "#1D4ED8", "&:hover": { bgcolor: isDark ? "#27272A" : "#EFF6FF" } }}>
                          <PencilSimple size={16} weight="bold" />
                        </IconButton>
                      </div>

                      {/* Selected Fields by Module */}
                      <div className="space-y-3">
                        {combinedFields.map(({ module, fields }) => {
                          const moduleFields = selectedColumns.filter(col => fields.some(f => f.name === col));
                          return moduleFields.length > 0 ? (
                            <div key={module}>
                              <p className={`text-[10.5px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{module}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {moduleFields.map(fieldName => {
                                  const field = fields.find(f => f.name === fieldName);
                                  return (
                                    <span key={fieldName} className={`text-[11px] font-medium px-2 py-1 rounded-lg ${isDark ? "bg-[#111111] text-[#60A5FA]" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>
                                      {field?.label || fieldName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>

                      {/* Applied Filters */}
                      {filters.length > 0 && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: isDark ? "#27272A" : "#E3ECFC" }}>
                          <p className={`text-[10.5px] font-bold uppercase tracking-widest mb-2 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>Filters Applied ({filters.length})</p>
                          <div className="space-y-1.5">
                            {filters.map(filter => (
                              <div key={filter.id} className={`text-[11px] px-2 py-1 rounded-lg ${isDark ? "bg-orange-900/30 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                                <span className="font-semibold">{getFieldLabel(filter.fieldName)}</span>
                                <span className="mx-1">{filter.operator}</span>
                                <span className="font-medium">"{filter.value}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </WidgetCard>

              {/* Right Panel - Results Preview or Summary */}
              {currentStep === "preview" ? (
                <WidgetCard title="Data Preview" isDark={isDark} noPadding className="lg:col-span-2 flex flex-col">
                  <div className="flex-1 overflow-auto px-6 py-5">
                    {selectedColumns.length === 0 ? (
                      <div className={`text-center py-8 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>
                        <p className="text-[14px]">No columns selected</p>
                        <p className="text-[12px]">Go back to select fields to see preview</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-[12px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Sample Records</p>
                            <p className={`text-[11px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Showing 4 sample rows from {primaryModule}</p>
                          </div>
                          {filters.length > 0 && (
                            <div className={`text-[11px] px-2.5 py-1 rounded-full ${isDark ? "bg-orange-900/30 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                              {filters.length} filter{filters.length !== 1 ? 's' : ''} applied
                            </div>
                          )}
                        </div>

                        <div className={`border rounded-lg overflow-hidden ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                          <table className="w-full text-[12px]">
                            <thead>
                              <tr className={isDark ? "bg-[#111111]" : "bg-[#f9fbff]"} style={{ borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` }}>
                                {selectedColumns.map(col => (
                                  <th key={col} className={`px-4 py-2.5 text-left font-semibold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>
                                    {getFieldLabel(col)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {getSampleDataForColumns().map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` }} className={isDark ? "hover:bg-[#111111]" : "hover:bg-[#f9fbff]"}>
                                  {selectedColumns.map(col => (
                                    <td key={`${idx}-${col}`} className={`px-4 py-2.5 ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>
                                      {row[col] || "—"}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className={`p-3 rounded-lg ${isDark ? "bg-[#111111]" : "bg-[#f9fbff]"}`}>
                          <p className={`text-[11px] font-semibold mb-2 ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>📊 Report Configuration</p>
                          <div className="space-y-1.5 text-[11px]">
                            <p><span className="font-semibold">Primary:</span> {primaryModule}</p>
                            {selectedRelatedModules.length > 0 && <p><span className="font-semibold">Joined with:</span> {selectedRelatedModules.join(", ")}</p>}
                            <p><span className="font-semibold">Columns:</span> {selectedColumns.length}</p>
                            {filters.length > 0 && <p><span className="font-semibold">Conditions:</span> {filters.length}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </WidgetCard>
              ) : (
                <WidgetCard title="Report Summary" isDark={isDark} noPadding className="lg:col-span-2 flex flex-col">
                  <div className="flex-1 overflow-auto px-6 py-5">
                    <div className="space-y-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold ${selectedColumns.length > 0 ? (isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (isDark ? "bg-amber-900/40 text-amber-400" : "bg-amber-50 text-amber-600")}`}>
                        <CheckCircle size={14} weight="fill" />
                        {selectedColumns.length > 0 ? "Report is valid" : "Select fields to create report"}
                      </div>

                      <div>
                        <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Primary Module</p>
                        <p className={`text-[16px] font-bold ${isDark ? "text-white" : "text-[#0C2472]"}`}>{primaryModule}</p>
                      </div>

                      {selectedRelatedModules.length > 0 && (
                        <div>
                          <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Related Modules · {selectedRelatedModules.length} joined</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedRelatedModules.map(module => (
                              <span key={module} className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${isDark ? "bg-[#111111] text-[#60A5FA]" : "bg-[#EFF6FF] text-[#1D4ED8]"}`}>
                                {module}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Selected Fields · {selectedColumns.length} columns</p>
                        {selectedColumns.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedColumns.map(col => (
                              <span key={col} className={`text-[12px] font-semibold px-2.5 py-1 rounded-lg ${isDark ? "bg-[#111111] text-[#D4D4D8]" : "bg-[#f9fbff] text-slate-700 border border-[#E3ECFC]"}`}>
                                {getFieldLabel(col)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {filters.length > 0 && (
                        <div>
                          <p className={`text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-2 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>Optional Filters · {filters.length} conditions</p>
                          <div className="space-y-1.5">
                            {filters.map(filter => (
                              <div key={filter.id} className={`text-[12px] px-2.5 py-1 rounded-lg ${isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                                {getFieldLabel(filter.fieldName)} <span className="font-semibold">{filter.operator}</span> "{filter.value}"
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filters.length === 0 && selectedColumns.length > 0 && (
                        <div className={`p-3 rounded-lg text-[11px] ${isDark ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
                          <p className="font-semibold mb-1">💡 Tip: Filters are optional</p>
                          <p>You can add conditions (like Date, Stage, Amount) to narrow down results, but they're not required.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </WidgetCard>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Related Modules Dialog */}
      <Dialog open={relatedModulesDialogOpen} onClose={() => setRelatedModulesDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: isDark ? "#0A0A0A" : "white", borderRadius: "12px" } }}>
        <DialogTitle sx={{ color: isDark ? "#F4F4F5" : "#0C2472", fontWeight: 700, fontSize: "16px", paddingBottom: "12px", borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` }}>
          Add Related Modules
        </DialogTitle>
        <DialogContent sx={{ paddingY: 3 }}>
          <p className={`text-[12px] mb-4 ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>Select multiple modules to join with {primaryModule}</p>
          <div className="space-y-2">
            {relatedModules.map(module => (
              <label key={module.name} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#f9fbff] dark:hover:bg-[#111111] transition">
                <input
                  type="checkbox"
                  checked={tempRelatedModules.includes(module.name as ModuleType)}
                  onChange={() => handleToggleRelatedModule(module.name as ModuleType)}
                  className="w-5 h-5 rounded accent-[#1D4ED8]"
                />
                <div>
                  <p className={`text-[14px] font-semibold ${isDark ? "text-[#F4F4F5]" : "text-[#0C2472]"}`}>{module.label}</p>
                  <p className={`text-[12px] ${isDark ? "text-[#9CA3AF]" : "text-slate-500"}`}>{module.name}</p>
                </div>
              </label>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`, padding: "12px 16px", gap: 1 }}>
          <Button onClick={() => setRelatedModulesDialogOpen(false)} sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveRelatedModules} variant="contained" sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600 }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Columns & Filters Dialog */}
      <Dialog open={columnsFiltersDialogOpen} onClose={() => setColumnsFiltersDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: isDark ? "#0A0A0A" : "white", borderRadius: "12px" } }}>
        <DialogTitle sx={{ color: isDark ? "#F4F4F5" : "#0C2472", fontWeight: 700, fontSize: "16px", paddingBottom: "0px", borderBottom: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}` }}>
          <div className="flex gap-2 border-b" style={{ borderColor: isDark ? "#27272A" : "#E3ECFC" }}>
            <button
              onClick={() => setActiveTab("columns")}
              className={`px-4 py-3 text-[13px] font-bold border-b-2 transition ${
                activeTab === "columns"
                  ? "text-[#1D4ED8] border-[#1D4ED8]"
                  : `text-slate-500 border-transparent ${isDark ? "hover:text-[#F4F4F5]" : "hover:text-slate-700"}`
              }`}
            >
              Columns
            </button>
            <button
              onClick={() => setActiveTab("filters")}
              className={`px-4 py-3 text-[13px] font-bold border-b-2 transition ${
                activeTab === "filters"
                  ? "text-[#1D4ED8] border-[#1D4ED8]"
                  : `text-slate-500 border-transparent ${isDark ? "hover:text-[#F4F4F5]" : "hover:text-slate-700"}`
              }`}
            >
              Filters {filters.length > 0 && `(${filters.length})`}
            </button>
          </div>
        </DialogTitle>

        <DialogContent sx={{ paddingY: 3, maxHeight: "600px", overflowY: "auto" }}>
          {activeTab === "columns" ? (
            <div className="space-y-5">
              {combinedFields.map(({ module, fields }) => (
                <div key={module}>
                  <p className={`text-[11.5px] font-bold uppercase tracking-[0.1em] mb-2.5 ${isDark ? "text-[#94A3B8]" : "text-[#4A5675]"}`}>{module}</p>
                  <div className="space-y-2">
                    {fields.map(field => (
                      <label key={field.name} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#f9fbff] dark:hover:bg-[#111111] transition">
                        <input
                          type="checkbox"
                          checked={tempSelectedColumns.includes(field.name)}
                          onChange={() => handleToggleColumn(field.name)}
                          className="w-5 h-5 rounded accent-[#1D4ED8]"
                        />
                        <span className={`text-[13px] font-medium ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter Explanation */}
              <div className={`p-3 rounded-lg text-[11px] ${isDark ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-700"}`}>
                <p className="font-semibold mb-2">✨ Filters are Optional</p>
                <p className="mb-2">Use filters to narrow down your report results. For example:</p>
                <ul className="list-disc list-inside space-y-1 text-[10.5px]">
                  <li>Stage = "Closed Won" (only won deals)</li>
                  <li>Amount &gt; $50,000 (only large deals)</li>
                  <li>Created Date = "Last 30 days" (recent records)</li>
                </ul>
                <p className="mt-2 text-[10.5px] opacity-90">If you don't add any filters, your report shows all records.</p>
              </div>

              {/* Filter Builder */}
              <div className="space-y-3 p-3 rounded-lg" style={{ backgroundColor: isDark ? "#111111" : "#f9fbff" }}>
                <p className={`text-[12px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Add Filter (Optional)</p>

                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilterField}
                    onChange={(e) => setTempFilterField(e.target.value)}
                    placeholder="Select field"
                  >
                    <MenuItem value="">Select field to filter</MenuItem>
                    {getAvailableFilterFields().map(field => (
                      <MenuItem key={field.name} value={field.name}>{field.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {tempFilterField && (
                  <FormControl fullWidth size="small">
                    <Select
                      value={tempFilterOperator}
                      onChange={(e) => setTempFilterOperator(e.target.value)}
                      placeholder="Select operator"
                    >
                      <MenuItem value="">Select operator</MenuItem>
                      {getFilterOperators(tempFilterField).map(op => (
                        <MenuItem key={op} value={op}>{op}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {tempFilterOperator && (
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter value"
                    value={tempFilterValue}
                    onChange={(e) => setTempFilterValue(e.target.value)}
                  />
                )}

                <Button
                  fullWidth
                  onClick={handleAddFilter}
                  variant="contained"
                  disabled={!tempFilterField || !tempFilterOperator || !tempFilterValue}
                  sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600 }}
                >
                  Add Filter
                </Button>
              </div>

              {/* Applied Filters */}
              {tempFilters.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-[12px] font-semibold ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>Applied Filters</p>
                  {tempFilters.map(filter => (
                    <div
                      key={filter.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-[#111111]" : "bg-[#f9fbff]"}`}
                    >
                      <div className={`text-[12px] ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>
                        <span className="font-semibold">{getFieldLabel(filter.fieldName)}</span>
                        <span className="mx-2">{filter.operator}</span>
                        <span className="font-medium">"{filter.value}"</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFilter(filter.id)}
                        className={`p-1 rounded-md transition ${isDark ? "hover:bg-[#27272A] text-[#71717A]" : "hover:bg-[#E3ECFC] text-slate-400"}`}
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: `1px solid ${isDark ? "#27272A" : "#E3ECFC"}`, padding: "12px 16px", gap: 1 }}>
          <Button onClick={() => setColumnsFiltersDialogOpen(false)} sx={{ color: isDark ? "#A1A1AA" : "#64748B", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveColumnsFilters} variant="contained" sx={{ bgcolor: "#1D4ED8", color: "white", textTransform: "none", fontWeight: 600 }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
