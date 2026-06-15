"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import {
  Gear, User, UsersThree, Buildings, ShieldCheck, Lock,
  Envelope, Cube, House, UploadSimple, DownloadSimple,
  HardDrive, CaretUp, CaretDown, Camera, PencilSimple,
  Phone, IdentificationCard, MapPin, MagnifyingGlass,
  Plus, Globe, Tree, CaretRight, CheckCircle,
  Eye, Square, Printer, Trash,
  Lightning, AddressBook, SquaresFour, UserPlus, ArrowLeft, Info,
  DotsSixVertical, TextT, TextAlignLeft, ListBullets, CalendarBlank,
  Hash, CurrencyDollar, CheckSquare, LinkSimple, ChartBar, X,
} from "@phosphor-icons/react";

// ─────────────────────────────────────────────
//  Nav structure
// ─────────────────────────────────────────────
const SECTIONS = [
  {
    key: "general", label: "General", icon: Gear,
    items: [
      { key: "personal",     label: "Personal Settings", icon: User       },
      { key: "users",        label: "Users",             icon: UsersThree },
      { key: "organization", label: "Organization",      icon: Buildings  },
    ],
  },
  {
    key: "security", label: "Security Control", icon: ShieldCheck,
    items: [
      { key: "roles",      label: "Roles",      icon: ShieldCheck },
      { key: "permission", label: "Permissions", icon: Lock        },
    ],
  },
  {
    key: "channels", label: "Channels", icon: Envelope,
    items: [{ key: "email", label: "Email", icon: Envelope }],
  },
  {
    key: "customization", label: "Customization", icon: Cube,
    items: [
      { key: "modules",  label: "Modules and Fields",  icon: Cube  },
      { key: "homepage", label: "Customize Home page", icon: House },
    ],
  },
  {
    key: "data", label: "Data Administrator", icon: HardDrive,
    items: [
      { key: "import",  label: "Import",      icon: UploadSimple   },
      { key: "export",  label: "Export",      icon: DownloadSimple },
      { key: "backup",  label: "Data Backup", icon: HardDrive      },
    ],
  },
];

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
interface UserRecord {
  id: number; name: string; role: string; email: string;
  initials: string; firstName: string; lastName: string; phone: string;
  avatarColor: string; textColor: string;
}
const USERS: UserRecord[] = [
  { id:1,  name:"PM SDL",                  role:"Super Admin",       email:"pm@socialdnalabs.com",            initials:"PM", firstName:"PM",        lastName:"SDL",         phone:"7788778855", avatarColor:"#FEF3C7", textColor:"#B45309" },
  { id:2,  name:"sdl aug0701",             role:"Administrator",     email:"sdlaug0701@mailinator.com",       initials:"SA", firstName:"sdl",       lastName:"aug0701",     phone:"",           avatarColor:"#EDE9FE", textColor:"#6D28D9" },
  { id:3,  name:"Rajarajan N",             role:"Administrator",     email:"rajarajan.n@socialdnalabs.com",   initials:"RN", firstName:"Rajarajan", lastName:"N",           phone:"",           avatarColor:"#DCFCE7", textColor:"#166534" },
  { id:4,  name:"Admin",                   role:"Administrator",     email:"admin@mailinator.com",            initials:"A",  firstName:"Admin",     lastName:"",            phone:"",           avatarColor:"#FEF3C7", textColor:"#B45309" },
  { id:5,  name:"crmuser",                 role:"Support Executive", email:"crmuser@mailinator.com",          initials:"CU", firstName:"crm",       lastName:"user",        phone:"",           avatarColor:"#EFF6FF", textColor:"#1D4ED8" },
  { id:6,  name:"Sales manager",           role:"Operations Manager",email:"sdlsalesmanager@mailinator.com",  initials:"SM", firstName:"Sales",     lastName:"manager",     phone:"",           avatarColor:"#FEF2F2", textColor:"#DC2626" },
  { id:7,  name:"manager sdl",             role:"Operations Manager",email:"sdlmanager@mailinator.com",       initials:"MS", firstName:"manager",   lastName:"sdl",         phone:"",           avatarColor:"#F0FDF4", textColor:"#16A34A" },
  { id:8,  name:"Support executive user1", role:"Support Executive", email:"seuser1@mailinator.com",          initials:"SU", firstName:"Support",   lastName:"exec user1",  phone:"",           avatarColor:"#EFF6FF", textColor:"#1D4ED8" },
  { id:9,  name:"Operation Manager user 1",role:"Operations Manager",email:"opmanageruser1@mailinator.com",   initials:"OM", firstName:"Operation", lastName:"Mgr user 1",  phone:"",           avatarColor:"#FDF4FF", textColor:"#7E22CE" },
  { id:10, name:"Support executive user 2",role:"Support Executive", email:"seuser2@mailinator.com",          initials:"SU", firstName:"Support",   lastName:"exec user 2", phone:"",           avatarColor:"#EFF6FF", textColor:"#1D4ED8" },
  { id:11, name:"VP Operation User 1",     role:"VP of Operations",  email:"vpoperationuser1@mailinator.com", initials:"VP", firstName:"VP Ops",   lastName:"User 1",      phone:"",           avatarColor:"#FEF3C7", textColor:"#B45309" },
];

const ROLE_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  "Super Admin":        { bg:"#FEF3C7", text:"#B45309", border:"#FDE68A" },
  "Administrator":      { bg:"#FEF3C7", text:"#B45309", border:"#FDE68A" },
  "Support Executive":  { bg:"#EFF6FF", text:"#1D4ED8", border:"#BFDBFE" },
  "Operations Manager": { bg:"#F0FDF4", text:"#166534", border:"#BBF7D0" },
  "VP of Operations":   { bg:"#EDE9FE", text:"#6D28D9", border:"#DDD6FE" },
  "Team Leader":        { bg:"#FEF2F2", text:"#DC2626", border:"#FECACA" },
};

interface RoleNode { id: string; name: string; description: string; children?: RoleNode[]; }
const ROLE_TREE: RoleNode[] = [{
  id:"admin", name:"Administrator", description:"Full access administrator",
  children:[
    { id:"vp", name:"VP of Operations", description:"VP-level operations access",
      children:[{ id:"ops", name:"Operations Manager", description:"Manages operations team",
        children:[{ id:"se", name:"Support Executive", description:"Customer support role", children:[] }]
      }]
    },
    { id:"tl", name:"Team Leader", description:"Team leadership role", children:[] },
    { id:"sa", name:"Super Admin", description:"Super administrator with all permissions", children:[] },
  ],
}];

// ─────────────────────────────────────────────
//  Shared UI primitives — NO <p> tags
// ─────────────────────────────────────────────
function SettingCard({ icon: Icon, title, color = "#1D4ED8", children, action }: {
  icon: React.ElementType; title: string; color?: string;
  children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#EFF6FF]">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon size={13} color={color} weight="duotone" />
        </div>
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] flex-1" style={{ color }}>{title}</span>
        {action}
      </div>
      <div className="px-5 py-2">{children}</div>
    </div>
  );
}

function KV({ label, value, link, editable, onSave }: {
  label: string; value: string; link?: boolean; editable?: boolean; onSave?: (newValue: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const empty = !value || value === "—" || value === "-";

  const handleSave = () => {
    if (editValue.trim()) {
      onSave?.(editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="py-2.5 border-b border-[#EFF6FF] last:border-0 flex items-start justify-between group">
      <div className="flex-1 min-w-0">
        <div className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
        {isEditing ? (
          <div className="flex items-center gap-1.5 -mx-2">
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
              className="flex-1 px-2 py-1 text-[13px] font-medium border border-[#93C5FD] rounded-lg bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#93C5FD] text-slate-700"
            />
            <button onClick={handleSave} className="px-2 py-1 text-[11px] font-bold text-white bg-[#1D4ED8] rounded hover:bg-[#60A5FA] transition-colors whitespace-nowrap">
              Save
            </button>
            <button onClick={handleCancel} className="px-2 py-1 text-[11px] font-semibold text-slate-500 border border-[#E3ECFC] rounded hover:bg-slate-50 transition-colors whitespace-nowrap">
              Cancel
            </button>
          </div>
        ) : (
          <div className={`text-[13px] font-medium leading-snug ${link?"text-[#1D4ED8]":empty?"text-slate-300":"text-slate-700"}`}>
            {empty ? "—" : editValue}
          </div>
        )}
      </div>
      {editable && !isEditing && (
        <Tooltip title="Edit">
          <IconButton
            onClick={() => setIsEditing(true)}
            size="small"
            sx={{ p:0.4, mt:0.5, color:"#CBD5E1", opacity:0, transition:"opacity 0.15s", ".group:hover &":{opacity:1}, "&:hover":{color:"#1D4ED8",bgcolor:"#EFF6FF"}, borderRadius:"6px", cursor:"pointer" }}>
            <PencilSimple size={13} weight="duotone" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

function KVGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6">{children}</div>;
}

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_BADGE[role] ?? { bg:"#F1F5F9", text:"#475569", border:"#CBD5E1" };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor:cfg.bg, color:cfg.text, borderColor:cfg.border }}>
      {role}
    </span>
  );
}

function ProfileHero({ initials, name, role, subtitle, contacts, avatarBg, avatarText }: {
  initials: string; name: string; role: string; subtitle?: string;
  contacts: { icon: React.ElementType; value: string; link?: boolean }[];
  avatarBg: string; avatarText: string;
}) {
  return (
    <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden mb-4">
      <div className="relative h-[64px] bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6]">
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)" }} />
      </div>
      <div className="relative px-6 pb-5">
        <div className="absolute -top-8 left-6">
          <div className="relative">
            <div className="w-[64px] h-[64px] rounded-full border-[3px] border-[#f9fbff] shadow-md flex items-center justify-center" style={{ backgroundColor:avatarBg }}>
              <span className="text-[20px] font-extrabold leading-none select-none" style={{ color:avatarText }}>{initials}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white border border-[#E3ECFC] shadow-sm flex items-center justify-center hover:bg-[#EFF6FF] transition-colors">
              <Camera size={10} color="#64748B" weight="duotone" />
            </button>
          </div>
        </div>
        <div className="pt-3 pl-[80px]">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-tight">{name}</span>
            <RoleBadge role={role} />
          </div>
          {subtitle && <div className="text-[11.5px] text-slate-400 mb-1.5">{subtitle}</div>}
          <div className="flex items-center gap-3 flex-wrap">
            {contacts.map(({ icon: Icon, value, link }, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-[11.5px] ${link?"text-[#1D4ED8]":"text-slate-500"}`}>
                <Icon size={11} weight="duotone" />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Personal Settings panel
// ─────────────────────────────────────────────
function PersonalSettingsPanel() {
  const [data, setData] = useState({
    firstName: "PM",
    lastName: "SDL",
    email: "pm@socialdnalabs.com",
    mobileNo: "7788778855",
    gender: "Prefer not to say",
    dateOfBirth: "—",
    dateOfJoining: "11/01/2025",
    address: "—",
  });

  const updateField = (field: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#EFF6FF] px-6 py-6 space-y-4">
      <ProfileHero
        initials="PM" name="PM SDL" role="Super Admin"
        avatarBg="#FEF3C7" avatarText="#B45309"
        contacts={[
          { icon:Envelope, value:data.email, link:true },
          { icon:Phone,    value:data.mobileNo },
        ]}
      />
      <SettingCard icon={User} title="User Information">
        <KVGrid>
          <KV label="First Name" value={data.firstName} editable onSave={v => updateField("firstName", v)} />
          <KV label="Last Name"  value={data.lastName} editable onSave={v => updateField("lastName", v)} />
          <KV label="Email"      value={data.email} link editable onSave={v => updateField("email", v)} />
          <KV label="Mobile No"  value={data.mobileNo} editable onSave={v => updateField("mobileNo", v)} />
        </KVGrid>
      </SettingCard>
      <SettingCard icon={ShieldCheck} title="Role Information" color="#8B5CF6">
        <KV label="Role" value="Super Admin" />
      </SettingCard>
      <SettingCard icon={IdentificationCard} title="More Information" color="#F59E0B">
        <KVGrid>
          <KV label="Gender"          value={data.gender} editable onSave={v => updateField("gender", v)} />
          <KV label="Date Of Birth"   value={data.dateOfBirth} editable onSave={v => updateField("dateOfBirth", v)} />
          <KV label="Date Of Joining" value={data.dateOfJoining} editable onSave={v => updateField("dateOfJoining", v)} />
        </KVGrid>
      </SettingCard>
      <SettingCard icon={MapPin} title="Address" color="#10B981">
        <KV label="Address" value={data.address} editable onSave={v => updateField("address", v)} />
      </SettingCard>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Users panel
// ─────────────────────────────────────────────
function UserDetailPanel({ user }: { user: UserRecord }) {
  return (
    <div className="overflow-y-auto bg-[#EFF6FF] px-5 py-5 space-y-4 h-full">
      <ProfileHero
        initials={user.initials} name={user.name} role={user.role}
        avatarBg={user.avatarColor} avatarText={user.textColor}
        contacts={[
          { icon:Envelope, value:user.email, link:true },
          ...(user.phone ? [{ icon:Phone, value:user.phone }] : []),
        ]}
      />
      <SettingCard icon={User} title="User Information">
        <KVGrid>
          <KV label="First Name" value={user.firstName} />
          <KV label="Last Name"  value={user.lastName}  />
          <KV label="Email"      value={user.email} link />
          <KV label="Mobile No"  value={user.phone || "—"} />
        </KVGrid>
      </SettingCard>
      <SettingCard icon={ShieldCheck} title="Role Information" color="#8B5CF6">
        <KV label="Role" value={user.role} />
      </SettingCard>
    </div>
  );
}

function UsersPanel() {
  const [selected, setSelected]   = useState<UserRecord>(USERS[0]);
  const [search, setSearch]       = useState("");
  const [checked, setChecked]     = useState<number[]>([]);

  const filtered = USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCheck = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* User list */}
      <div className="w-[340px] flex-shrink-0 flex flex-col border-r border-[#E3ECFC] bg-[#f9fbff]">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#E3ECFC] flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1.5 bg-white border border-[#E3ECFC] rounded-xl px-3 py-1.5 focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
            <MagnifyingGlass size={13} color="#94A3B8" weight="duotone" />
            <InputBase placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
              sx={{ flex:1, fontSize:"0.75rem", color:"#334155", "& input::placeholder":{color:"#94A3B8",opacity:1} }} />
          </div>
          <Button variant="contained" size="small" startIcon={<Plus size={12} weight="duotone" />}
            sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.73rem", px:1.5, py:0.7, whiteSpace:"nowrap", boxShadow:"0 1px 6px #1D4ED833", "&:hover":{bgcolor:"#60A5FA"} }}>
            New User
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(user => {
            const isActive = selected.id === user.id;
            const isChecked = checked.includes(user.id);
            return (
              <div key={user.id} onClick={() => setSelected(user)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#EFF6FF] transition-colors group ${
                  isActive ? "bg-[#EFF6FF]" : "hover:bg-[#f9fbff]"
                }`}>
                <div onClick={e => toggleCheck(user.id, e)}>
                  <Checkbox size="small" checked={isChecked}
                    sx={{ p:0.3, color:"#CBD5E1", "&.Mui-checked":{color:"#1D4ED8"} }} />
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                  style={{ backgroundColor: user.avatarColor, color: user.textColor }}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[13px] font-semibold truncate ${isActive?"text-[#1D4ED8]":"text-slate-800"}`}>{user.name}</span>
                    <div className="flex-shrink-0">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                </div>
                {/* Online dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${user.id <= 2 ? "bg-[#10B981]" : "bg-slate-200"}`} />
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-4 py-2.5 border-t border-[#E3ECFC] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Rows per page: <span className="font-semibold text-slate-600">25</span></span>
          <span className="text-[11px] text-slate-500 font-medium">1–{filtered.length} of {filtered.length}</span>
        </div>
      </div>

      {/* Detail */}
      <UserDetailPanel user={selected} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Organization panel
// ─────────────────────────────────────────────
function OrganizationPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#EFF6FF] px-6 py-6 space-y-4">
      <ProfileHero
        initials="S" name="Social DNA Labs" role="Super Admin"
        subtitle="India · INR"
        avatarBg="#F1F5F9" avatarText="#475569"
        contacts={[
          { icon:Envelope, value:"pm@socialdnalabs.com", link:true },
          { icon:Phone,    value:"9988775566" },
          { icon:Globe,    value:"www.socialdnalabs.com", link:true },
        ]}
      />
      <SettingCard icon={Buildings} title="General Information">
        <KVGrid>
          <KV label="Company Name"            value="Social DNA Labs"  />
          <KV label="Abbreviation"            value="SDL"              />
          <KV label="Default Currency"        value="INR"              />
          <KV label="Country"                 value="India"            />
          <KV label="Tax ID"                  value="—"                />
          <KV label="Domain"                  value="—"                />
          <KV label="Date Of Establishment"   value="—"                />
          <KV label="Date Of Incorporation"   value="—"                />
          <KV label="Date Of Commencement"    value="—"                />
          <KV label="Time Zone"               value="Asia/Calcutta"    />
        </KVGrid>
      </SettingCard>
      <SettingCard icon={Phone} title="Contact Information" color="#10B981">
        <KVGrid>
          <KV label="Phone No" value="9988775566"             />
          <KV label="Email"    value="pm@socialdnalabs.com" link />
          <KV label="Fax"      value="—"                       />
          <KV label="Website"  value="www.socialdnalabs.com" link />
        </KVGrid>
      </SettingCard>
      <SettingCard icon={IdentificationCard} title="Other Information" color="#F59E0B">
        <KV label="Company Description" value="—" />
        <KV label="Registration Details" value="—" />
      </SettingCard>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Roles panel
// ─────────────────────────────────────────────
function RoleTreeNode({ node, depth, selectedId, expandedIds, onSelect, onToggle }: {
  node: RoleNode; depth: number; selectedId: string;
  expandedIds: Set<string>; onSelect: (n: RoleNode) => void; onToggle: (id: string) => void;
}) {
  const isSelected = selectedId === node.id;
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div>
      <div onClick={() => onSelect(node)}
        className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer border-b border-[#EFF6FF] transition-colors group ${
          isSelected ? "bg-[#EFF6FF]" : "hover:bg-[#f9fbff]"
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}>
        {/* Expand toggle */}
        <button onClick={e => { e.stopPropagation(); if (hasChildren) onToggle(node.id); }}
          className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-[#E3ECFC] transition-colors">
          {hasChildren
            ? isExpanded
              ? <CaretDown size={10} color="#64748B" weight="bold" />
              : <CaretRight size={10} color="#64748B" weight="bold" />
            : <span className="w-1.5 h-1.5 rounded-full bg-slate-200 inline-block" />
          }
        </button>
        <div className={`text-[13px] font-medium flex-1 ${isSelected?"text-[#1D4ED8] font-semibold":"text-slate-700"}`}>
          {node.name}
        </div>
        {isSelected && <CheckCircle size={14} color="#1D4ED8" weight="duotone" />}
      </div>

      {hasChildren && isExpanded && node.children!.map(child => (
        <RoleTreeNode key={child.id} node={child} depth={depth + 1}
          selectedId={selectedId} expandedIds={expandedIds}
          onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

function RolesPanel() {
  const [selectedRole, setSelectedRole] = useState<RoleNode>(ROLE_TREE[0]);
  const [activeTab, setActiveTab]       = useState<"overview"|"timeline">("overview");
  const [expandedIds, setExpandedIds]   = useState<Set<string>>(
    new Set(["admin", "vp", "ops"])
  );

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Role tree */}
      <div className="w-[340px] flex-shrink-0 flex flex-col border-r border-[#E3ECFC] bg-[#f9fbff]">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#E3ECFC] flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-white border border-[#E3ECFC] rounded-xl px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
            <Tree size={13} weight="duotone" />
            Tree
            <CaretDown size={10} weight="bold" />
          </button>
          <div className="flex-1" />
          <Button variant="contained" size="small"
            sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.73rem", px:1.5, py:0.7, boxShadow:"0 1px 6px #1D4ED833", "&:hover":{bgcolor:"#60A5FA"} }}>
            New Role
          </Button>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto">
          {ROLE_TREE.map(node => (
            <RoleTreeNode key={node.id} node={node} depth={0}
              selectedId={selectedRole.id} expandedIds={expandedIds}
              onSelect={setSelectedRole} onToggle={toggleExpand} />
          ))}
        </div>
      </div>

      {/* Role detail */}
      <div className="flex-1 overflow-y-auto bg-[#EFF6FF] px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {(["overview","timeline"] as const).map(tab => (
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
          <SettingCard icon={ShieldCheck} title="Role Information" color="#8B5CF6">
            <KV label="Role Name"        value={selectedRole.name}        />
            <KV label="Role Description" value={selectedRole.description} />
          </SettingCard>
        )}

        {activeTab === "timeline" && (
          <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm px-5 py-8 text-center text-slate-300 text-[12.5px]">
            No activity recorded for this role.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Permissions panel
// ─────────────────────────────────────────────
type PermKey = "fullAccess"|"create"|"read"|"update"|"delete"|"print"|"import"|"export"|"email"|"dataSharingPublic";
type PermState = Record<string, Record<string, Record<PermKey, boolean>>>;

const PERM_PAIRS: [PermKey, PermKey][] = [
  ["fullAccess","create"],
  ["read","update"],
  ["delete","print"],
  ["import","export"],
  ["email","dataSharingPublic"],
];

const PERM_META: Record<PermKey, { label: string; icon: React.ElementType; color: string }> = {
  fullAccess:        { label:"Full Access",           icon:Square,         color:"#10B981" },
  create:            { label:"Create",                icon:Plus,           color:"#1D4ED8" },
  read:              { label:"Read",                  icon:Eye,            color:"#06B6D4" },
  update:            { label:"Update",                icon:PencilSimple,   color:"#F59E0B" },
  delete:            { label:"Delete",                icon:Trash,          color:"#EF4444" },
  print:             { label:"Print",                 icon:Printer,        color:"#64748B" },
  import:            { label:"Import",                icon:UploadSimple,   color:"#8B5CF6" },
  export:            { label:"Export",                icon:DownloadSimple, color:"#8B5CF6" },
  email:             { label:"Email",                 icon:Envelope,       color:"#64748B" },
  dataSharingPublic: { label:"Data Sharing (Public)", icon:Globe,          color:"#10B981" },
};

const PERM_MODULES = [
  "Leads","Deals","Contacts","Accounts","Tasks",
  "Users","Organizations","Roles","Permissions",
  "Modules and Fields","Import","Export","Data Backup",
  "Reports","Customize Home page",
];

const PERM_ROLES = [
  { key:"administrator",  label:"Administrator",      color:"#1D4ED8" },
  { key:"vpOperations",   label:"VP of Operations",   color:"#8B5CF6" },
  { key:"opsManager",     label:"Operations Manager", color:"#10B981" },
  { key:"supportExec",    label:"Support Executive",  color:"#06B6D4" },
  { key:"teamLeader",     label:"Team Leader",        color:"#F59E0B" },
];

function buildDefaultPerms(): PermState {
  const s: PermState = {};
  PERM_MODULES.forEach(mod => {
    s[mod] = {};
    PERM_ROLES.forEach(role => {
      s[mod][role.key] = {
        fullAccess:true, create:true, read:true, update:true,
        delete:true, print:true, import:true, export:true,
        email:true, dataSharingPublic:true,
      };
    });
  });
  return s;
}

function MiniToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative inline-flex w-[28px] h-[15px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${checked ? "bg-[#1D4ED8]" : "bg-slate-200"}`}>
      <span className={`inline-block w-[11px] h-[11px] rounded-full bg-white shadow-sm transform transition-transform duration-200 absolute top-[2px] ${checked ? "translate-x-[15px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

function PermCell({ module, role, state, onToggle }: {
  module: string; role: string;
  state: Record<PermKey, boolean>;
  onToggle: (mod: string, role: string, perm: PermKey) => void;
}) {
  return (
    <div className="px-3 py-2 space-y-1.5 min-w-[120px]">
      {PERM_PAIRS.map(([p1, p2]) => {
        const M1 = PERM_META[p1], M2 = PERM_META[p2];
        return (
          <div key={p1} className="flex items-center gap-2.5">
            <Tooltip title={M1.label}>
              <div className="flex items-center gap-0.5">
                <MiniToggle checked={state[p1]} onChange={() => onToggle(module, role, p1)} />
                <M1.icon size={10} color={state[p1] ? M1.color : "#CBD5E1"} weight={p1==="fullAccess"||p1==="delete"?"fill":"duotone"} />
              </div>
            </Tooltip>
            <Tooltip title={M2.label}>
              <div className="flex items-center gap-0.5">
                <MiniToggle checked={state[p2]} onChange={() => onToggle(module, role, p2)} />
                <M2.icon size={10} color={state[p2] ? M2.color : "#CBD5E1"} weight={p2==="fullAccess"||p2==="delete"?"fill":"duotone"} />
              </div>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

function PermissionPanel() {
  const [tab, setTab]         = useState<"matrix"|"summary">("matrix");
  const [perms, setPerms]     = useState<PermState>(buildDefaultPerms);
  const [saved, setSaved]     = useState(false);

  const toggle = (mod: string, role: string, perm: PermKey) => {
    setPerms(prev => ({
      ...prev,
      [mod]: { ...prev[mod], [role]: { ...prev[mod][role], [perm]: !prev[mod][role][perm] } },
    }));
    setSaved(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#EFF6FF]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f9fbff] border-b border-[#E3ECFC]">
        <div className="text-[18px] font-extrabold text-[#0C2472] tracking-tight">Permissions</div>
        <Button variant="contained" size="small"
          onClick={() => setSaved(true)}
          sx={{ bgcolor: saved ? "#10B981" : "#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.75rem", px:2, py:0.8, boxShadow:"0 1px 6px #1D4ED833", "&:hover":{ bgcolor: saved ? "#059669" : "#60A5FA" } }}>
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-0">
        {(["matrix","summary"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-t-xl text-[12.5px] font-semibold transition-all border border-b-0 ${
              tab === t
                ? "bg-white border-[#E3ECFC] text-[#1D4ED8]"
                : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
            }`}>
            {t === "matrix" ? "Permission Matrix" : "Summary View"}
          </button>
        ))}
      </div>

      {/* Matrix */}
      {tab === "matrix" && (
        <div className="flex-1 overflow-auto mx-6 mb-4 bg-white rounded-b-2xl rounded-tr-2xl border border-[#E3ECFC] shadow-sm">
          <table className="w-full border-collapse text-left" style={{ minWidth: 900 }}>
            <thead>
              <tr className="bg-[#f9fbff] border-b border-[#E3ECFC]">
                <th className="sticky left-0 z-10 bg-[#f9fbff] px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[160px] border-r border-[#E3ECFC]">
                  Module
                </th>
                {PERM_ROLES.map(role => (
                  <th key={role.key} className="px-3 py-3 text-center min-w-[140px]">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: role.color }}>
                      {role.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERM_MODULES.map((mod, i) => (
                <tr key={mod} className={`border-b border-[#EFF6FF] ${i % 2 === 0 ? "bg-white" : "bg-[#fafcff]"}`}>
                  <td className="sticky left-0 z-10 px-5 py-2 border-r border-[#E3ECFC] font-semibold text-[13px] text-slate-700 bg-inherit align-middle whitespace-nowrap">
                    {mod}
                  </td>
                  {PERM_ROLES.map(role => (
                    <td key={role.key} className="border-r border-[#EFF6FF] last:border-r-0 align-top">
                      <PermCell module={mod} role={role.key} state={perms[mod][role.key]} onToggle={toggle} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "summary" && (
        <div className="flex-1 flex items-center justify-center text-slate-300 text-[13px]">
          Summary view coming soon.
        </div>
      )}

      {/* Legend */}
      {tab === "matrix" && (
        <div className="mx-6 mb-5 bg-white rounded-2xl border border-[#E3ECFC] px-5 py-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Permission Legend</div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-1.5">
            {(Object.entries(PERM_META) as [PermKey, typeof PERM_META[PermKey]][]).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <Icon size={12} color={meta.color} weight={key==="fullAccess"||key==="delete"?"fill":"duotone"} />
                  <span className="text-[11.5px] text-slate-600">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Modules and Fields panel
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  Layout Editor (full-screen overlay)
// ─────────────────────────────────────────────
const NEW_FIELD_TYPES = [
  { label:"Single Line",  icon:TextT           },
  { label:"Multi-Line",   icon:TextAlignLeft   },
  { label:"Email",        icon:Envelope        },
  { label:"Phone",        icon:Phone           },
  { label:"Pick List",    icon:ListBullets     },
  { label:"Date",         icon:CalendarBlank   },
  { label:"Number",       icon:Hash            },
  { label:"Currency",     icon:CurrencyDollar  },
  { label:"Long Integer", icon:Hash            },
  { label:"Checkbox",     icon:CheckSquare     },
  { label:"URL",          icon:LinkSimple      },
  { label:"Address",      icon:MapPin          },
  { label:"Lookup",       icon:MagnifyingGlass },
  { label:"Stage",        icon:ChartBar        },
];

interface LField { label:string; type:string; required?:boolean; prefix?:string; fullWidth?:boolean; }
interface LSection { title:string; fields:LField[]; addressLayout?:boolean; }

const LEADS_CREATE_SECTIONS: LSection[] = [
  { title:"Lead Information", fields:[
    { label:"Company",         type:"Single Text",  required:true },
    { label:"First Name",      type:"Single Line",  prefix:"Mr."  },
    { label:"Last Name",       type:"Single Text",  required:true },
    { label:"Title",           type:"Single Text"                 },
    { label:"Email",           type:"Email"                       },
    { label:"Phone",           type:"Phone"                       },
    { label:"Fax",             type:"Phone"                       },
    { label:"Mobile",          type:"Phone"                       },
    { label:"Website",         type:"link"                        },
    { label:"Lead Source",     type:"Option 1 ▾"                  },
    { label:"Lead Status",     type:"Option 1 ▾"                  },
    { label:"Industry",        type:"Option 1 ▾"                  },
    { label:"No of Employees", type:"Option 1 ▾"                  },
    { label:"Annual Revenue",  type:"currency"                    },
    { label:"Rating",          type:"Option 1 ▾"                  },
    { label:"Email Opt out",   type:"Checkbox"                    },
    { label:"Lead Owner",      type:"Lookup"                      },
    { label:"Created By",      type:"Single Text"                 },
    { label:"Modified By",     type:"Single Text"                 },
    { label:"Skype ID",        type:"Single Text"                 },
    { label:"Secondary Email", type:"Email"                       },
    { label:"Twitter",         type:"Single Text"                 },
  ]},
  { title:"Address Information", addressLayout:true, fields:[
    { label:"Address",                                       type:"Address" },
    { label:"Country / Region",                              type:""        },
    { label:"Flat / House No. / Building / Apartment Name",  type:""        },
    { label:"Street Address",                                type:""        },
    { label:"City",                                          type:""        },
    { label:"State / Province",                              type:""        },
    { label:"Zip / Postal Code",                             type:""        },
    { label:"Latitude",  type:"" },
    { label:"Longitude", type:"" },
  ]},
  { title:"Description Information", fields:[
    { label:"Description", type:"Multi-Line", fullWidth:true },
  ]},
];

const QC_ACTIVE: { label:string; type:string; removable?:boolean }[] = [
  { label:"Company",    type:"text"      },
  { label:"First Name", type:"firstname", removable:true },
  { label:"Last Name",  type:"text"      },
  { label:"Email",      type:"email",    removable:true },
  { label:"Phone",      type:"phone",    removable:true },
];

const QC_AVAILABLE: Record<string,string[]> = {
  "Lead Information":      ["Title","Fax","Mobile","Website","Lead Source","Lead Status","Industry","No of Employees","Annual Revenue","Rating","Email Opt out","Lead Owner","Skype ID","Secondary Email","Twitter"],
  "Address Information":   ["Address"],
  "Description Information":["Description"],
};

const DV_BC_FIELDS = [
  { label:"First Name", type:"firstname" },
  { label:"Last Name",  type:"text"      },
  { label:"Email",      type:"email"     },
  { label:"Phone",      type:"phone"     },
  { label:"Lead Owner", type:"lookup"    },
];

function FieldCell({ field }: { field: LField }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border border-[#E3ECFC] rounded-lg bg-white hover:border-[#93C5FD] transition-colors cursor-pointer group">
      <div className="flex items-center gap-0.5 min-w-0">
        <span className="text-[12px] font-medium text-slate-700 truncate">{field.label}</span>
        {field.required && <span className="text-red-500 text-[10px] ml-0.5">*</span>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        {field.prefix && <span className="text-[11px] text-slate-400">{field.prefix} ·</span>}
        {field.type && <span className="text-[11px] text-[#93C5FD]">{field.type}</span>}
        <span className="text-slate-300 group-hover:text-slate-500 text-[11px] font-bold">···</span>
      </div>
    </div>
  );
}

function LayoutEditor({ module, layoutName, onClose }: {
  module:string; layoutName:string; onClose:()=>void;
}) {
  const [tab, setTab]           = useState<"create"|"quickCreate"|"detailView">("create");
  const [bcEnabled, setBcEnabled] = useState(true);
  const [nfOpen, setNfOpen]     = useState(true);
  const [unusedOpen, setUnusedOpen] = useState(true);
  const modDef = MODULE_DEFS.find(m => m.key === module);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E3ECFC] flex-shrink-0">
        <button onClick={onClose} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600 hover:text-[#1D4ED8] transition-colors">
          <ArrowLeft size={14} weight="bold" />
          {modDef?.label ?? module}
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1 border border-[#E3ECFC] rounded-lg text-[12.5px] font-semibold text-slate-700 hover:border-[#1D4ED8] bg-white transition-colors">
          {layoutName} <CaretDown size={11} weight="bold" />
        </button>
        <IconButton size="small" sx={{ p:0.5, color:"#94A3B8", "&:hover":{color:"#1D4ED8"}, borderRadius:"6px" }}>
          <Gear size={14} weight="duotone" />
        </IconButton>
        <div className="flex-1" />
        <button onClick={onClose} className="px-3 py-1.5 text-[12.5px] font-semibold text-slate-500 border border-[#E3ECFC] rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
        <button className="px-3 py-1.5 text-[12.5px] font-semibold text-slate-500 border border-[#E3ECFC] rounded-lg hover:bg-slate-50 transition-colors">Save and Close</button>
        <button className="px-4 py-1.5 text-[12.5px] font-bold text-white bg-[#1D4ED8] rounded-lg hover:bg-[#60A5FA] transition-colors">Save</button>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[260px] flex-shrink-0 border-r border-[#E3ECFC] bg-[#f9fbff] overflow-y-auto">
          {tab === "create" && (<>
            <button onClick={() => setNfOpen(p=>!p)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider hover:bg-[#EFF6FF]">
              <span>New Fields</span>
              {nfOpen ? <CaretUp size={9} weight="bold"/> : <CaretDown size={9} weight="bold"/>}
            </button>
            {nfOpen && (
              <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
                {NEW_FIELD_TYPES.map(ft => {
                  const Icon = ft.icon;
                  return (
                    <div key={ft.label}
                      className="flex items-center gap-1.5 px-2 py-1.5 border border-[#E3ECFC] rounded-lg bg-white hover:border-[#1D4ED8] hover:bg-[#EFF6FF] cursor-grab transition-colors text-[11px] font-medium text-slate-600">
                      <Icon size={11} color="#1D4ED8" weight="duotone" />
                      {ft.label}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="px-3 pb-3">
              <button className="flex items-center gap-1.5 w-full px-3 py-2 border border-dashed border-[#93C5FD] rounded-lg text-[11.5px] font-bold text-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors justify-center">
                <Plus size={11} weight="bold"/> NEW SECTION
              </button>
            </div>
            <button onClick={() => setUnusedOpen(p=>!p)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider hover:bg-[#EFF6FF]">
              <span>Unused Items</span>
              {unusedOpen ? <CaretUp size={9} weight="bold"/> : <CaretDown size={9} weight="bold"/>}
            </button>
            {unusedOpen && <div className="px-4 pb-2 text-[12px] text-slate-300">No unused items.</div>}
          </>)}

          {tab === "quickCreate" && (
            <div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3ECFC]">
                <span className="text-[13px] font-bold text-slate-700">Available Fields</span>
                <IconButton size="small" sx={{ p:0.4, color:"#94A3B8", "&:hover":{color:"#1D4ED8"}, borderRadius:"6px" }}>
                  <MagnifyingGlass size={13} weight="duotone"/>
                </IconButton>
              </div>
              {Object.entries(QC_AVAILABLE).map(([sec, flds]) => (
                <div key={sec} className="px-3 pt-3">
                  <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">{sec}</div>
                  {flds.map(f => (
                    <div key={f} className="flex items-center gap-2 px-2 py-1.5 mb-0.5 border border-[#E3ECFC] rounded-lg bg-white text-[12px] text-slate-600 cursor-grab hover:border-[#1D4ED8] hover:bg-[#EFF6FF] transition-colors">
                      <DotsSixVertical size={11} color="#CBD5E1"/>
                      {f}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === "detailView" && (
            <div>
              <button onClick={() => setUnusedOpen(p=>!p)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider hover:bg-[#EFF6FF] border-b border-[#E3ECFC]">
                <span>Unused Related List</span>
                {unusedOpen ? <CaretUp size={9} weight="bold"/> : <CaretDown size={9} weight="bold"/>}
              </button>
              {unusedOpen && <div className="px-4 py-3 text-[12px] text-slate-400">No more related lists available.</div>}
            </div>
          )}
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-6 pt-4 border-b border-[#E3ECFC] bg-white mb-0">
            <div className="flex items-center">
              {(["create","quickCreate","detailView"] as const).map(t => {
                const labels = { create:"Create", quickCreate:"Quick Create", detailView:"Detail View" };
                return (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-2.5 text-[13px] font-semibold transition-all border-b-2 -mb-px ${
                      tab===t ? "border-[#1D4ED8] text-[#1D4ED8]" : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}>
                    {labels[t]}
                  </button>
                );
              })}
            </div>
            <button className="text-[12.5px] font-semibold text-[#1D4ED8] hover:underline pb-2.5">Preview</button>
          </div>

          {/* CREATE */}
          {tab === "create" && (
            <div className="px-6 py-5 space-y-4">
              {LEADS_CREATE_SECTIONS.map(section => (
                <div key={section.title} className="bg-white rounded-xl border border-[#E3ECFC] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#E3ECFC] bg-[#fafcff]">
                    <DotsSixVertical size={14} color="#CBD5E1"/>
                    <span className="text-[13px] font-bold text-slate-700 flex-1">{section.title}</span>
                    <IconButton size="small" sx={{ p:0.3, color:"#94A3B8", "&:hover":{color:"#1D4ED8"}, borderRadius:"6px" }}>
                      <Gear size={13} weight="duotone"/>
                    </IconButton>
                  </div>
                  {section.addressLayout ? (
                    <div className="p-3 space-y-1.5">
                      {section.fields.slice(0,-2).map((f,i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 border border-[#E3ECFC] rounded-lg bg-[#fafcff] hover:border-[#93C5FD] transition-colors cursor-pointer group">
                          <span className="text-[12px] font-medium text-slate-700">{f.label}</span>
                          <div className="flex items-center gap-1.5">
                            {f.type && <span className="text-[11px] text-[#93C5FD]">{f.type}</span>}
                            <span className="text-slate-300 group-hover:text-slate-500 text-[11px] font-bold">···</span>
                          </div>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-1.5">
                        {section.fields.slice(-2).map((f,i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 border border-[#E3ECFC] rounded-lg bg-[#fafcff] hover:border-[#93C5FD] transition-colors cursor-pointer group">
                            <span className="text-[12px] font-medium text-slate-700">{f.label}</span>
                            <span className="text-slate-300 group-hover:text-slate-500 text-[11px] font-bold">···</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 grid grid-cols-2 gap-1.5">
                      {section.fields.map((f,i) => (
                        f.fullWidth
                          ? <div key={i} className="col-span-2"><FieldCell field={f}/></div>
                          : <FieldCell key={i} field={f}/>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* QUICK CREATE */}
          {tab === "quickCreate" && (
            <div className="px-6 py-5 flex justify-center">
              <div className="w-[500px] bg-white rounded-xl border border-[#E3ECFC] overflow-hidden shadow-sm">
                {QC_ACTIVE.map((f,i) => (
                  <div key={i} className="flex items-center px-4 py-2.5 border-b border-[#EFF6FF] last:border-0 group">
                    <span className="text-[13px] text-slate-700 w-36 flex-shrink-0">{f.label}</span>
                    <span className="flex-1 text-[13px] text-[#93C5FD]">{f.type}</span>
                    {f.removable && (
                      <button className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors opacity-60 hover:opacity-100">
                        <X size={11} color="#94A3B8" weight="bold"/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAIL VIEW */}
          {tab === "detailView" && (
            <div className="px-6 py-5 space-y-4">
              {/* Business Card */}
              <div className="bg-white rounded-xl border border-[#E3ECFC] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3ECFC]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Business Card</span>
                  <div className="flex items-center gap-3">
                    <GreenSwitch checked={bcEnabled} onChange={() => setBcEnabled(p=>!p)}/>
                    <button className="text-[12.5px] font-semibold text-[#1D4ED8] hover:underline">Customize</button>
                  </div>
                </div>
                <div className="divide-y divide-[#EFF6FF]">
                  {DV_BC_FIELDS.map((f,i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <DotsSixVertical size={13} color="#CBD5E1"/>
                      <span className="text-[13px] text-slate-700 flex-1">{f.label}</span>
                      <span className="text-[12px] text-[#93C5FD]">{f.type}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-[#EFF6FF]">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                    <Info size={11} weight="duotone"/>
                    You can add up to <span className="font-bold text-slate-600 mx-0.5">5 fields</span> to your Business Card.
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="bg-white rounded-xl border border-[#E3ECFC]">
                <div className="px-4 py-2.5 border-b border-[#E3ECFC]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Details</span>
                </div>
                <div className="mx-3 my-3 px-4 py-3 text-[12.5px] text-slate-400 bg-[#fafcff] rounded-lg border border-[#E3ECFC]">
                  Fields customized in the Create page will appear here.
                </div>
              </div>
              {/* Related List */}
              <div className="bg-white rounded-xl border border-[#E3ECFC] overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#E3ECFC]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</span>
                </div>
                {[
                  { name:"Notes",       standard:true,  customize:false },
                  { name:"Attachments", standard:true,  customize:false },
                  { name:"Tasks",       standard:false, customize:true  },
                ].map(item => (
                  <div key={item.name} className="px-4 py-3 border-b border-[#EFF6FF] last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-1">
                        {item.customize && <button className="text-[12.5px] font-semibold text-[#1D4ED8] hover:underline">Customize</button>}
                        <IconButton size="small" sx={{ p:0.3, color:"#94A3B8", "&:hover":{color:"#EF4444"}, borderRadius:"6px" }}>
                          <Trash size={13} weight="duotone"/>
                        </IconButton>
                      </div>
                    </div>
                    {item.standard ? (
                      <div className="text-center py-2 text-[12px] text-slate-400 bg-[#fafcff] rounded-lg border border-[#E3ECFC]">
                        This is a standard {item.name} section.
                      </div>
                    ) : (
                      <div className="border border-[#E3ECFC] rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 bg-[#fafcff] border-b border-[#E3ECFC]">
                          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</div>
                          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-l border-[#E3ECFC]">Status</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MODULE_DEFS = [
  { key:"leads",    label:"Leads",    icon:UserPlus,    color:"#1D4ED8", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026" },
  { key:"deals",    label:"Deals",    icon:Lightning,   color:"#F59E0B", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026" },
  { key:"contacts", label:"Contacts", icon:AddressBook, color:"#10B981", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026" },
  { key:"accounts", label:"Accounts", icon:SquaresFour, color:"#8B5CF6", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026" },
  { key:"tasks",    label:"Tasks",    icon:CheckCircle, color:"#06B6D4", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026" },
];

const MODULE_LAYOUTS: Record<string, { name: string; sharedTo: string; lastMod: string; active: boolean }[]> = {
  leads:    [{ name:"Base Layout", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Apr 10, 2026", active:true }],
  deals:    [{ name:"Base Layout", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026", active:true }],
  contacts: [{ name:"Base Layout", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026", active:true }],
  accounts: [{ name:"Base Layout", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026", active:true }],
  tasks:    [{ name:"Base Layout", sharedTo:"Administrator, Operations Manager, Support Executive, VP of Operations", lastMod:"Feb 27, 2026", active:true }],
  new:      [],
};

function GreenSwitch({ checked, onChange }: { checked: boolean; onChange?: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${checked ? "bg-[#10B981]" : "bg-slate-200"}`}>
      <span className={`inline-block w-[14px] h-[14px] rounded-full bg-white shadow transform transition-transform duration-200 absolute top-[3px] ${checked ? "translate-x-[19px]" : "translate-x-[3px]"}`} />
    </button>
  );
}

function ModuleDetail({ modKey, onBack, onSelect, onOpenLayout }: {
  modKey: string; onBack: () => void; onSelect: (k: string) => void;
  onOpenLayout: (name: string) => void;
}) {
  const [tab, setTab]     = useState<"layouts"|"fields">("layouts");
  const [search, setSearch] = useState("");
  const mod     = MODULE_DEFS.find(m => m.key === modKey);
  const layouts = MODULE_LAYOUTS[modKey] ?? [];
  const title   = modKey === "new" ? "add" : (mod?.label ?? modKey);

  const filteredMods = MODULE_DEFS.filter(m => !search || m.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Sub-sidebar */}
      <div className="w-[200px] flex-shrink-0 border-r border-[#E3ECFC] bg-[#f9fbff] flex flex-col">
        <div className="flex items-center justify-between px-3 py-3 border-b border-[#E3ECFC]">
          <button onClick={onBack} className="flex items-center gap-1 text-[12px] font-semibold text-slate-600 hover:text-[#1D4ED8] transition-colors">
            <ArrowLeft size={13} weight="bold" />
            Modules
          </button>
          <IconButton size="small" sx={{ p:0.4, color:"#94A3B8", "&:hover":{color:"#1D4ED8",bgcolor:"#EFF6FF"}, borderRadius:"6px" }}>
            <MagnifyingGlass size={13} weight="duotone" />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {filteredMods.map(m => {
            const Icon = m.icon;
            const isActive = modKey === m.key;
            return (
              <button key={m.key} onClick={() => onSelect(m.key)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-[12.5px] font-medium transition-colors ${
                  isActive ? "bg-[#1D4ED8] text-white" : "text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
                }`}>
                <Icon size={13} color={isActive ? "#fff" : m.color} weight="duotone" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Breadcrumb */}
        <div className="px-6 pt-5 pb-1 flex items-center gap-1.5 text-[11.5px] text-slate-400">
          <House size={11} weight="duotone" />
          {["Setup","Customization","Modules"].map(crumb => (
            <span key={crumb} className="flex items-center gap-1.5">
              <CaretRight size={9} weight="bold" />
              <span className="hover:text-[#1D4ED8] cursor-pointer transition-colors">{crumb}</span>
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <CaretRight size={9} weight="bold" />
            <span className="text-slate-600 font-semibold capitalize">{title}</span>
          </span>
        </div>

        {/* Title */}
        <div className="px-6 pt-2 pb-3">
          <div className="text-[22px] font-extrabold text-slate-900 capitalize">{title}</div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-[#E3ECFC] flex items-center gap-1">
          {(["layouts","fields"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-[13px] font-semibold capitalize transition-all border-b-2 -mb-px ${
                tab === t ? "border-[#1D4ED8] text-[#1D4ED8]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-5">
          {tab === "layouts" && (
            <>
              <div className="text-[12.5px] text-[#1D4ED8] mb-4 leading-relaxed">
                Design your own layouts to fit your business processes, then assign them to your user accounts based on permission profiles.
              </div>
              <div className="flex justify-end mb-4">
                <Button variant="contained" size="small"
                  sx={{ bgcolor:"#1D4ED8", borderRadius:"8px", textTransform:"none", fontWeight:700, fontSize:"0.75rem", px:2, py:0.8, boxShadow:"0 1px 6px #1D4ED833", "&:hover":{bgcolor:"#60A5FA"} }}>
                  Create New Layout
                </Button>
              </div>
              <div className="border border-[#E3ECFC] rounded-xl overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#f9fbff] border-b border-[#E3ECFC]">
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shared To</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Modified</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {layouts.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-[12.5px] text-slate-300">No records found.</td></tr>
                    ) : layouts.map((l, i) => (
                      <tr key={i} className="border-b border-[#EFF6FF] last:border-0 hover:bg-[#fafcff] transition-colors">
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#1D4ED8] cursor-pointer hover:underline" onClick={() => onOpenLayout(l.name)}>{l.name}</td>
                        <td className="px-4 py-3 text-[12.5px] text-slate-500">{l.sharedTo}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                            <User size={12} weight="duotone" />
                            {l.lastMod}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <GreenSwitch checked={l.active} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {tab === "fields" && (
            <div className="text-center py-12 text-slate-300 text-[12.5px]">No fields configured yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModulesAndFieldsPanel() {
  const [view, setView]             = useState<"list"|"detail">("list");
  const [selectedMod, setSelectedMod] = useState("leads");
  const [openLayout, setOpenLayout] = useState<string|null>(null);
  const [modStatuses, setModStatuses] = useState<Record<string,boolean>>(
    Object.fromEntries(MODULE_DEFS.map(m => [m.key, true]))
  );
  const [search, setSearch] = useState("");

  const filtered = MODULE_DEFS.filter(m => !search || m.label.toLowerCase().includes(search.toLowerCase()));

  if (openLayout !== null) {
    return <LayoutEditor module={selectedMod} layoutName={openLayout} onClose={() => setOpenLayout(null)} />;
  }

  if (view === "detail") {
    return (
      <ModuleDetail
        modKey={selectedMod}
        onBack={() => setView("list")}
        onSelect={k => setSelectedMod(k)}
        onOpenLayout={name => setOpenLayout(name)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E3ECFC]">
        <div className="flex items-center gap-1.5 bg-[#f9fbff] border border-[#E3ECFC] rounded-xl px-3 py-1.5 w-56 focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#93C5FD] transition-all">
          <MagnifyingGlass size={13} color="#94A3B8" weight="duotone" />
          <InputBase placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
            sx={{ flex:1, fontSize:"0.75rem", color:"#334155", "& input::placeholder":{color:"#94A3B8",opacity:1} }} />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-slate-600 bg-[#f9fbff] border border-[#E3ECFC] rounded-xl hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
          <Gear size={13} weight="duotone" />
          Custom Module
        </button>
        <div className="flex-1" />
        <Button variant="contained" size="small"
          onClick={() => { setSelectedMod("new"); setView("detail"); }}
          sx={{ bgcolor:"#1D4ED8", borderRadius:"9px", textTransform:"none", fontWeight:700, fontSize:"0.75rem", px:2, py:0.8, boxShadow:"0 1px 6px #1D4ED833", whiteSpace:"nowrap", "&:hover":{bgcolor:"#60A5FA"} }}>
          Create New Module
        </Button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#f9fbff] border-b border-[#E3ECFC]">
            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Displayed In Tabs As</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Module Name</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shared To</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Modified</th>
            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(mod => {
            const Icon = mod.icon;
            const isOn = modStatuses[mod.key];
            return (
              <tr key={mod.key} className="border-b border-[#EFF6FF] hover:bg-[#fafcff] transition-colors">
                <td className="px-6 py-4">
                  <button onClick={() => { setSelectedMod(mod.key); setView("detail"); }}
                    className="flex items-center gap-2 text-[13px] font-semibold text-[#1D4ED8] hover:underline">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: mod.color + "18" }}>
                      <Icon size={12} color={mod.color} weight="duotone" />
                    </div>
                    {mod.label}
                  </button>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-600">{mod.label}</td>
                <td className="px-6 py-4 text-[12.5px] text-slate-500">{mod.sharedTo}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                    <User size={12} weight="duotone" />
                    {mod.lastMod}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <GreenSwitch checked={isOn} onChange={() => setModStatuses(p => ({ ...p, [mod.key]: !p[mod.key] }))} />
                    <Tooltip title="Module info">
                      <IconButton size="small" sx={{ p:0.3, color:"#CBD5E1", "&:hover":{color:"#1D4ED8",bgcolor:"#EFF6FF"}, borderRadius:"6px" }}>
                        <Info size={13} weight="duotone" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Placeholder
// ─────────────────────────────────────────────
function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#EFF6FF]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3">
          <Gear size={22} color="#1D4ED8" weight="duotone" />
        </div>
        <div className="text-[15px] font-bold text-slate-700">{label}</div>
        <div className="text-[12.5px] text-slate-400 mt-1">This section is coming soon.</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Settings sub-sidebar
// ─────────────────────────────────────────────
function SettingsSidebar({ activeItem, setActiveItem }: {
  activeItem: string; setActiveItem: (k: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="w-[220px] flex-shrink-0 bg-[#f9fbff] border-r border-[#E3ECFC] flex flex-col overflow-y-auto">
      <div className="px-4 pt-5 pb-4 border-b border-[#E3ECFC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm flex-shrink-0">
            <Gear size={15} color="#fff" weight="duotone" />
          </div>
          <div>
            <div className="font-heading text-[14px] font-bold text-slate-900 leading-tight">Settings</div>
            <div className="text-[10.5px] text-slate-400 leading-tight">Manage workspace</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {SECTIONS.map(section => {
          const isOpen = !collapsed[section.key];
          return (
            <div key={section.key}>
              <button onClick={() => toggle(section.key)}
                className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-[#EFF6FF] transition-colors group">
                <span className="font-heading text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                  {section.label}
                </span>
                {isOpen ? <CaretUp size={10} color="#CBD5E1" weight="bold" /> : <CaretDown size={10} color="#CBD5E1" weight="bold" />}
              </button>

              {isOpen && (
                <div className="space-y-0.5 mb-1.5">
                  {section.items.map(item => {
                    const IIcon = item.icon;
                    const isActive = activeItem === item.key;
                    return (
                      <button key={item.key} onClick={() => setActiveItem(item.key)}
                        className={`relative flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
                          isActive ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold" : "text-slate-500 hover:bg-[#EFF6FF]/60 hover:text-slate-700"
                        }`}>
                        {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#1D4ED8]" />}
                        <IIcon size={13} color={isActive ? "#1D4ED8" : "#94A3B8"} weight="duotone" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function SettingsPage() {
  const [activeItem, setActiveItem] = useState("personal");
  const activeLabel = SECTIONS.flatMap(s => s.items).find(i => i.key === activeItem)?.label ?? "";

  const content = () => {
    switch (activeItem) {
      case "personal":     return <PersonalSettingsPanel />;
      case "users":        return <UsersPanel />;
      case "organization": return <OrganizationPanel />;
      case "roles":        return <RolesPanel />;
      case "permission":   return <PermissionPanel />;
      case "modules":      return <ModulesAndFieldsPanel />;
      default:             return <PlaceholderPanel label={activeLabel} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />
      <div className="sidebar-content flex-1 flex overflow-hidden">
        <SettingsSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        {content()}
      </div>
    </div>
  );
}
