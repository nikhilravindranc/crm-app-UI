// Module Relationships - Maps which modules can be related to each primary module

export type ModuleType = "Accounts" | "Contacts" | "Deals" | "Leads" | "Tasks";

interface ModuleField {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "currency";
}

interface ModuleConfig {
  name: ModuleType;
  label: string;
  icon: string;
  fields: ModuleField[];
  relatedModules: ModuleType[];
}

export const MODULE_CONFIG: Record<ModuleType, ModuleConfig> = {
  Accounts: {
    name: "Accounts",
    label: "Accounts",
    icon: "building",
    fields: [
      { name: "id", label: "Account ID", type: "text" },
      { name: "accountName", label: "Account Name", type: "text" },
      { name: "industry", label: "Industry", type: "select" },
      { name: "revenue", label: "Annual Revenue", type: "currency" },
      { name: "employees", label: "No. of Employees", type: "number" },
      { name: "website", label: "Website", type: "text" },
      { name: "createdDate", label: "Created Date", type: "date" },
      { name: "modifiedDate", label: "Modified Date", type: "date" },
    ],
    relatedModules: ["Deals", "Contacts", "Tasks", "Leads"],
  },
  Contacts: {
    name: "Contacts",
    label: "Contacts",
    icon: "users",
    fields: [
      { name: "id", label: "Contact ID", type: "text" },
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "title", label: "Job Title", type: "text" },
      { name: "account", label: "Account Name", type: "text" },
      { name: "createdDate", label: "Created Date", type: "date" },
    ],
    relatedModules: ["Accounts", "Deals", "Tasks", "Leads"],
  },
  Deals: {
    name: "Deals",
    label: "Deals",
    icon: "handshake",
    fields: [
      { name: "id", label: "Deal ID", type: "text" },
      { name: "dealName", label: "Deal Name", type: "text" },
      { name: "amount", label: "Deal Amount", type: "currency" },
      { name: "stage", label: "Stage", type: "select" },
      { name: "account", label: "Account Name", type: "text" },
      { name: "contact", label: "Contact Name", type: "text" },
      { name: "closingDate", label: "Expected Close Date", type: "date" },
      { name: "probability", label: "Probability (%)", type: "number" },
      { name: "createdDate", label: "Created Date", type: "date" },
    ],
    relatedModules: ["Accounts", "Contacts", "Tasks", "Leads"],
  },
  Leads: {
    name: "Leads",
    label: "Leads",
    icon: "star",
    fields: [
      { name: "id", label: "Lead ID", type: "text" },
      { name: "firstName", label: "First Name", type: "text" },
      { name: "lastName", label: "Last Name", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "leadSource", label: "Lead Source", type: "select" },
      { name: "status", label: "Status", type: "select" },
      { name: "createdDate", label: "Created Date", type: "date" },
    ],
    relatedModules: ["Accounts", "Contacts", "Deals", "Tasks"],
  },
  Tasks: {
    name: "Tasks",
    label: "Tasks",
    icon: "checkbox",
    fields: [
      { name: "id", label: "Task ID", type: "text" },
      { name: "title", label: "Subject", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "priority", label: "Priority", type: "select" },
      { name: "status", label: "Status", type: "select" },
      { name: "assignedTo", label: "Assigned To", type: "text" },
      { name: "createdDate", label: "Created Date", type: "date" },
    ],
    relatedModules: ["Deals", "Accounts", "Contacts", "Leads"],
  },
};

// Get related modules for a given primary module
export function getRelatedModules(primaryModule: ModuleType): ModuleConfig[] {
  const config = MODULE_CONFIG[primaryModule];
  return config.relatedModules.map(moduleName => MODULE_CONFIG[moduleName]);
}

// Get all fields for a module or combined fields from related modules
export function getModuleFields(moduleName: ModuleType): ModuleField[] {
  return MODULE_CONFIG[moduleName]?.fields || [];
}

// Get combined fields from primary and related modules
export function getCombinedFields(
  primaryModule: ModuleType,
  secondaryModules: ModuleType[]
): { module: ModuleType; fields: ModuleField[] }[] {
  const combined: { module: ModuleType; fields: ModuleField[] }[] = [];

  // Add primary module fields
  combined.push({
    module: primaryModule,
    fields: getModuleFields(primaryModule),
  });

  // Add related module fields
  secondaryModules.forEach(moduleName => {
    if (MODULE_CONFIG[moduleName]) {
      combined.push({
        module: moduleName,
        fields: getModuleFields(moduleName),
      });
    }
  });

  return combined;
}

// Get filter options for a field type
export const FILTER_OPERATORS: Record<string, string[]> = {
  text: ["equals", "contains", "starts with", "ends with", "is empty", "is not empty"],
  number: ["equals", "greater than", "less than", "between", "is empty"],
  date: ["equals", "after", "before", "between", "this month", "this quarter"],
  select: ["equals", "is any of", "is empty"],
  currency: ["equals", "greater than", "less than", "between"],
};
