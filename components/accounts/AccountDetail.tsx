"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import {
  House, CaretRight, PencilSimple, DotsThreeVertical,
  Note, ClipboardText, Paperclip, ClockCounterClockwise,
  Plus, GridFour, List, Buildings, MapPin, Tag,
  Handshake, UserCircle,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeContext";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface TimelineEntry {
  date: string; time: string;
  field?: string; from?: string; to?: string;
  by: string;
}
interface RelatedDeal {
  name: string; amount: number; stage: string;
  probability: number; closingDate: string;
  type: string; dealOwner: string;
}
interface RelatedContact {
  firstName: string; lastName: string;
  email: string; mobile: string; phone: string;
  fax: string; contactOwner: string;
}
interface MemberAccount {
  name: string; phone: string; website: string;
  accountType: string; industry: string; accountOwner: string;
}
interface AccountRecord {
  id: number; name: string;
  accountOwner: string; accountOwnerEmail: string;
  phone: string; accountType: string;
  rating: string; accountSite: string; fax: string;
  parentAccount: string; website: string;
  tickerSymbol: string; ownership: string; industry: string;
  employees: string; sicCode: string;
  billingAddress: string; shippingAddress: string;
  description: string;
  createdBy: string; createdAt: string;
  modifiedBy: string; modifiedAt: string;
  relatedDeals: RelatedDeal[];
  relatedContacts: RelatedContact[];
  memberAccounts: MemberAccount[];
  timeline: TimelineEntry[];
}

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
const ACCOUNTS_DETAIL: Record<number, AccountRecord> = {
  1: { id:1, name:"XYZ", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"01111111111", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"Sweany Inc", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Wed, May 27, 2026 03:14 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Wed, May 27, 2026 03:14 PM", relatedDeals:[], relatedContacts:[], memberAccounts:[], timeline:[{ date:"2026-05-27", time:"03:14 pm", field:"Created", to:"XYZ", by:"pm@socialdnalabs.com" }] },
  2: { id:2, name:"Sweany Inc", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"6663636", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Wed, May 27, 2026 02:38 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Wed, May 27, 2026 02:45 PM", relatedDeals:[{ name:"New", amount:29999, stage:"Proposal/Price Quote", probability:75, closingDate:"2026-07-15", type:"New Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"Cop", lastName:"Mar", email:"", mobile:"", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[{ name:"XYZ", phone:"01111111111", website:"", accountType:"", industry:"", accountOwner:"PM SDL" }], timeline:[{ date:"2026-05-27", time:"02:45 pm", field:"Account Type", from:"", to:"Individual", by:"pm@socialdnalabs.com" },{ date:"2026-05-27", time:"02:38 pm", field:"Created", to:"Sweany Inc", by:"pm@socialdnalabs.com" }] },
  3: { id:3, name:"Lee Industries", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Thu, May 15, 2026 09:31 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Thu, May 15, 2026 09:31 AM", relatedDeals:[], relatedContacts:[{ firstName:"Michael", lastName:"Lee", email:"michael.lee@demo.com", mobile:"9123456780", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-05-15", time:"09:31 am", field:"Created", to:"Lee Industries", by:"pm@socialdnalabs.com" }] },
  4: { id:4, name:"SDL LEAD1", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Wed, Apr 15, 2026 11:13 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Wed, Apr 15, 2026 11:13 AM", relatedDeals:[{ name:"Deal SDL 11", amount:500000, stage:"Identify Decision Makers", probability:60, closingDate:"2026-08-31", type:"Existing Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"Lead SDL", lastName:"11", email:"leadsdl1@mailinator.com", mobile:"9999992222", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-04-15", time:"11:13 am", field:"Created", to:"SDL LEAD1", by:"pm@socialdnalabs.com" }] },
  5: { id:5, name:"RMVT", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 06:38 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 06:43 PM", relatedDeals:[{ name:"testing", amount:500000, stage:"Needs Analysis", probability:20, closingDate:"2026-07-31", type:"Existing Business", dealOwner:"PM SDL" },{ name:"fsm enterprise application", amount:800000, stage:"Needs Analysis", probability:20, closingDate:"2026-10-31", type:"New Business", dealOwner:"PM SDL" },{ name:"fsm single user application", amount:200000, stage:"Qualification", probability:10, closingDate:"2026-09-15", type:"New Business", dealOwner:"PM SDL" },{ name:"CRM Application", amount:500000, stage:"Qualification", probability:10, closingDate:"2026-10-01", type:"New Business", dealOwner:"PM SDL" },{ name:"Test", amount:10000, stage:"Qualification", probability:10, closingDate:"2026-06-30", type:"Existing Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"Raja", lastName:"rajan", email:"rajarajan@rmvt.com", mobile:"", phone:"", fax:"", contactOwner:"PM SDL" },{ firstName:"mmmm", lastName:"mmmm", email:"mmmm@rmvt.com", mobile:"", phone:"", fax:"", contactOwner:"PM SDL" },{ firstName:"Vishnutharan", lastName:"R", email:"vishnu@rmvt.com", mobile:"", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-04-14", time:"06:43 pm", field:"Account Type", from:"", to:"Individual", by:"pm@socialdnalabs.com" },{ date:"2026-04-14", time:"06:38 pm", field:"Created", to:"RMVT", by:"pm@socialdnalabs.com" }] },
  6: { id:6, name:"test", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"9977887788", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 06:00 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 06:17 PM", relatedDeals:[{ name:"Deal test", amount:150000, stage:"Qualification", probability:10, closingDate:"2026-07-01", type:"New Business", dealOwner:"PM SDL" },{ name:"test", amount:50000, stage:"Needs Analysis", probability:20, closingDate:"2026-08-01", type:"New Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"test", lastName:"test", email:"test@mailinator.com", mobile:"", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-04-13", time:"06:17 pm", field:"Phone", from:"", to:"9977887788", by:"pm@socialdnalabs.com" },{ date:"2026-04-13", time:"06:00 pm", field:"Created", to:"test", by:"pm@socialdnalabs.com" }] },
  7: { id:7, name:"Speedy Motors", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 05:56 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 05:56 PM", relatedDeals:[{ name:"Mike", amount:0, stage:"Qualification", probability:10, closingDate:"2026-12-31", type:"New Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"Speedy", lastName:"Mike", email:"", mobile:"0111111111", phone:"", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-04-13", time:"05:56 pm", field:"Created", to:"Speedy Motors", by:"pm@socialdnalabs.com" }] },
  8: { id:8, name:"SDL Test", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Mar 16, 2026 07:25 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Wed, Apr 08, 2026 04:47 PM", relatedDeals:[{ name:"CRM Application", amount:200000, stage:"Qualification", probability:10, closingDate:"2026-08-15", type:"New Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"SDL Test", lastName:"Test", email:"sdltest@mailinator.com", mobile:"", phone:"9988776655", fax:"", contactOwner:"PM SDL" },{ firstName:"SDL Mar 17", lastName:"SDL", email:"", mobile:"", phone:"77881122", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-04-08", time:"04:47 pm", field:"Account Type", from:"", to:"Individual", by:"pm@socialdnalabs.com" },{ date:"2026-03-16", time:"07:25 pm", field:"Created", to:"SDL Test", by:"pm@socialdnalabs.com" }] },
  9: { id:9, name:"Test 1233333", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"Individual", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Mar 23, 2026 05:16 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 23, 2026 05:16 PM", relatedDeals:[], relatedContacts:[], memberAccounts:[], timeline:[{ date:"2026-03-23", time:"05:16 pm", field:"Created", to:"Test 1233333", by:"pm@socialdnalabs.com" }] },
  10: { id:10, name:"SDL", accountOwner:"PM SDL", accountOwnerEmail:"pm@socialdnalabs.com", phone:"", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"pm@socialdnalabs.com", createdAt:"Thu, Jun 26, 2025 04:11 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 16, 2026 07:45 PM", relatedDeals:[], relatedContacts:[{ firstName:"SDL Test", lastName:"Test-SDL", email:"sdltest@mailinator.com", mobile:"", phone:"9988776655", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-03-16", time:"07:45 pm", field:"Modified", from:"", to:"SDL", by:"pm@socialdnalabs.com" },{ date:"2025-06-26", time:"04:11 pm", field:"Created", to:"SDL", by:"pm@socialdnalabs.com" }] },
  11: { id:11, name:"Sears Homelife", accountOwner:"Admin", accountOwnerEmail:"admin@mailinator.com", phone:"", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"admin@mailinator.com", createdAt:"Tue, Jul 08, 2025 11:15 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 16, 2026 07:45 PM", relatedDeals:[{ name:"test deal john smith", amount:200000, stage:"Qualification", probability:10, closingDate:"2026-09-30", type:"New Business", dealOwner:"PM SDL" }], relatedContacts:[{ firstName:"John", lastName:"Smith", email:"johnsmith@mailinator.com", mobile:"", phone:"9898989898", fax:"", contactOwner:"PM SDL" }], memberAccounts:[], timeline:[{ date:"2026-03-16", time:"07:45 pm", field:"Modified By", from:"admin@mailinator.com", to:"pm@socialdnalabs.com", by:"pm@socialdnalabs.com" },{ date:"2025-07-08", time:"11:15 am", field:"Created", to:"Sears Homelife", by:"admin@mailinator.com" }] },
  12: { id:12, name:"dfgdfg", accountOwner:"Admin", accountOwnerEmail:"admin@mailinator.com", phone:"", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"admin@mailinator.com", createdAt:"Fri, Jul 25, 2025 05:16 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 16, 2026 07:45 PM", relatedDeals:[], relatedContacts:[], memberAccounts:[], timeline:[{ date:"2025-07-25", time:"05:16 pm", field:"Created", to:"dfgdfg", by:"admin@mailinator.com" }] },
  13: { id:13, name:"I&T", accountOwner:"Admin", accountOwnerEmail:"admin@mailinator.com", phone:"", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"admin@mailinator.com", createdAt:"Mon, Jul 28, 2025 10:13 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 16, 2026 07:45 PM", relatedDeals:[], relatedContacts:[], memberAccounts:[], timeline:[{ date:"2025-07-28", time:"10:13 am", field:"Created", to:"I&T", by:"admin@mailinator.com" }] },
  14: { id:14, name:"dd", accountOwner:"Admin", accountOwnerEmail:"admin@mailinator.com", phone:"", accountType:"", rating:"", accountSite:"", fax:"", parentAccount:"", website:"", tickerSymbol:"", ownership:"", industry:"", employees:"", sicCode:"", billingAddress:"", shippingAddress:"", description:"", createdBy:"admin@mailinator.com", createdAt:"Mon, Jul 28, 2025 10:14 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Mar 16, 2026 07:45 PM", relatedDeals:[], relatedContacts:[], memberAccounts:[], timeline:[{ date:"2025-07-28", time:"10:14 am", field:"Created", to:"dd", by:"admin@mailinator.com" }] },
};

// ─────────────────────────────────────────────
//  Sub-components (theme-aware)
// ─────────────────────────────────────────────
function SectionCard({ icon: Icon, title, children, action, id }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
  action?: React.ReactNode; id?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div id={id} className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}>
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
          <Icon size={13} color={isDark ? "#52525B" : "#E3ECFC"} weight="duotone" />
        </div>
        <p className={`font-heading text-[11px] font-bold uppercase tracking-[0.12em] flex-1 ${isDark ? "text-[#71717A]" : "text-[#1D4ED8]"}`}>{title}</p>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function KV({ label, value, fullWidth }: { label: string; value?: string; fullWidth?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const display = value !== undefined && value !== "" ? value : "—";
  return (
    <div className={`py-2.5 border-b last:border-0 ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"} ${fullWidth ? "col-span-2" : ""}`}>
      <p className={`text-[10.5px] font-semibold uppercase tracking-wider mb-0.5 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{label}</p>
      <p className={`text-[13px] font-medium ${display === "—" ? (isDark ? "text-[#3F3F46]" : "text-slate-300") : (isDark ? "text-[#D4D4D8]" : "text-slate-700")}`}>{display}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
export default function AccountDetail({ accountId }: { accountId: number }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const account = ACCOUNTS_DETAIL[accountId];

  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; at: string }[]>([]);
  const [attachView, setAttachView] = useState<"grid" | "list">("grid");

  if (!account) {
    return (
      <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-[#EFF6FF]"}`}>
        <Sidebar />
        <div className="sidebar-content flex-1 flex flex-col">
          <TopBar title="Accounts" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className={`text-xl font-bold mb-2 ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>Account not found</p>
              <button onClick={() => router.push("/accounts")} className={`text-sm underline ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>
                Back to Accounts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [{
      text: note.trim(),
      at: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
    }, ...prev]);
    setNote("");
  };

  const relatedItems = [
    { label: "Tasks",           icon: ClipboardText, count: 0,                              color: "#10B981" },
    { label: "Notes",           icon: Note,          count: notes.length,                   color: "#8B5CF6" },
    { label: "Attachments",     icon: Paperclip,     count: 0,                              color: "#F59E0B" },
    { label: "Deals",           icon: Handshake,     count: account.relatedDeals.length,    color: "#64748B" },
    { label: "Contacts",        icon: UserCircle,    count: account.relatedContacts.length, color: "#F43F5E" },
    { label: "Member Accounts", icon: Buildings,     count: account.memberAccounts.length,  color: "#64748B" },
  ];

  const RelatedListPanel = ({ onClickItem }: { onClickItem: (label: string) => void }) => (
    <div className="space-y-4">
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
        <div className={`px-4 py-3.5 border-b ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}>
          <p className={`font-heading text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-[#52525B]" : "text-slate-500"}`}>Related List</p>
        </div>
        <div className="p-2 space-y-0.5">
          {relatedItems.map(({ label, icon: Icon, count, color }) => (
            <button key={label} onClick={() => onClickItem(label)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors ${isDark ? "hover:bg-[#27272A]" : "hover:bg-[#EFF6FF]"}`}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                <Icon size={14} color={color} weight="duotone" />
              </div>
              <span className={`flex-1 text-left text-[12.5px] font-medium ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>{label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#E3ECFC] text-[#1D4ED8]"}`}>{count}</span>
              )}
              <CaretRight size={14} color={isDark ? "#3F3F46" : "#E2E8F0"} weight="duotone" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const thBtn = `bgcolor: isDark ? "#27272A" : "inherit"`;

  return (
    <div className={`flex h-screen font-sans ${isDark ? "bg-[#0A0A0A]" : "bg-[#EFF6FF]"}`}>
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar title="Accounts" />

        {/* ── Breadcrumb ── */}
        <div className={`flex items-center gap-1.5 px-8 py-3 border-b text-[12px] ${isDark ? "bg-[#111113] border-[#27272A]" : "bg-[#E3ECFC] border-[#E3ECFC]"}`}>
          <Link href="/" className={`transition-colors ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
            <House size={13} weight="duotone" />
          </Link>
          <CaretRight size={11} color={isDark ? "#3F3F46" : "#E2E8F0"} />
          <Link href="/accounts" className={`font-medium transition-colors ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
            Accounts
          </Link>
          <CaretRight size={11} color={isDark ? "#3F3F46" : "#E2E8F0"} />
          <span className={`font-semibold ${isDark ? "text-[#D4D4D8]" : "text-[#0C2472]"}`}>{account.name}</span>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 mb-5">
            {(["overview", "timeline"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? isDark ? "bg-[#3F3F46] text-[#F4F4F5] shadow-sm" : "bg-[#1D4ED8] text-white shadow-sm"
                    : isDark ? "bg-[#1C1C1E] text-[#71717A] hover:bg-[#27272A]" : "bg-[#f9fbff] text-slate-500 hover:bg-[#E3ECFC]"
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ══════════════ OVERVIEW TAB ══════════════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-4 items-start">
            <div className="col-span-2 space-y-5">
                {/* ── Quick info card ── */}
                <div className={`rounded-2xl border shadow-sm divide-y ${isDark ? "bg-[#1C1C1E] border-[#27272A] divide-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC] divide-[#EFF6FF]"}`}>
                  {[
                    { label: "Account Name",  value: account.name },
                    { label: "Account Owner", value: account.accountOwner },
                    { label: "Phone",         value: account.phone },
                    { label: "Account Type",  value: account.accountType },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center px-5 py-3">
                      <span className={`text-[12.5px] font-medium w-40 flex-shrink-0 ${isDark ? "text-[#71717A]" : "text-slate-500"}`}>{label}:</span>
                      <span className={`flex-1 text-[13px] font-semibold ${value ? (isDark ? "text-[#D4D4D8]" : "text-slate-700") : (isDark ? "text-[#3F3F46]" : "text-slate-300")}`}>
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── Account Information ── */}
                <SectionCard icon={Buildings} title="Account Information"
                  action={
                    <IconButton size="small"
                      sx={{ p: 0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&:hover": { color: "inherit", bgcolor: isDark ? "#27272A" : "#EFF6FF" }, borderRadius: "6px" }}>
                      <DotsThreeVertical size={16} weight="bold" />
                    </IconButton>
                  }>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-0">
                    <KV label="Account Name"   value={account.name} />
                    <KV label="Account Owner"  value={account.accountOwner} />
                    <KV label="Rating"         value={account.rating} />
                    <KV label="Phone"          value={account.phone} />
                    <KV label="Account Site"   value={account.accountSite} />
                    <KV label="Fax"            value={account.fax} />
                    <KV label="Parent Account" value={account.parentAccount} />
                    <KV label="Website"        value={account.website} />
                    <KV label="Ticker Symbol"  value={account.tickerSymbol} />
                    <KV label="Account Type"   value={account.accountType} />
                    <KV label="Ownership"      value={account.ownership} />
                    <KV label="Industry"       value={account.industry} />
                    <KV label="Employees"      value={account.employees} />
                    <KV label="SIC Code"       value={account.sicCode} />
                    <KV label="Created by"     value={`${account.createdBy}\n${account.createdAt}`} />
                    <KV label="Modified by"    value={`${account.modifiedBy}\n${account.modifiedAt}`} />
                  </div>
                </SectionCard>

                {/* ── Address Information ── */}
                <SectionCard icon={MapPin} title="Address Information">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-0">
                    <KV label="Billing Address"  value={account.billingAddress} />
                    <KV label="Shipping Address" value={account.shippingAddress} />
                  </div>
                </SectionCard>

                {/* ── Description ── */}
                <SectionCard icon={Tag} title="Description">
                  <KV label="Description" value={account.description} />
                </SectionCard>

                {/* ── Tasks ── */}
                <div id="section-tasks">
                  <SectionCard icon={ClipboardText} title="Tasks"
                    action={
                      <div className="flex items-center gap-2">
                        <Button size="small" variant="contained"
                          startIcon={<Plus size={13} weight="bold" />}
                          sx={{ bgcolor: isDark ? "#27272A" : "inherit", color: isDark ? "#F4F4F5" : undefined, borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", boxShadow: isDark ? "none" : "0 1px 6px #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit" } }}>
                          New Task
                        </Button>
                        <IconButton size="small"
                          sx={{ p: 0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&:hover": { color: "inherit" }, borderRadius: "6px" }}>
                          <DotsThreeVertical size={16} weight="bold" />
                        </IconButton>
                      </div>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className={`border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                            <th className={`text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>Subject</th>
                            <th className={`text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={2} className={`py-8 text-center text-[12.5px] ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>No rows</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

                {/* ── Notes ── */}
                <div id="section-notes">
                  <SectionCard icon={Note} title="Notes">
                    <div className="space-y-3">
                      <div className={`border rounded-xl overflow-hidden transition-all ${isDark ? "border-[#3F3F46] focus-within:border-[#52525B]" : "border-[#E3ECFC] focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#4A7AE8]"}`}>
                        <InputBase
                          fullWidth multiline minRows={2}
                          placeholder="Add a note…"
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          sx={{ px: 2, py: 1.5, fontSize: "0.8rem", color: isDark ? "#D4D4D8" : "#334155", "& textarea::placeholder": { color: isDark ? "#3F3F46" : "#E2E8F0", opacity: 1 } }}
                        />
                        {note.trim() && (
                          <div className="flex justify-end px-3 pb-2">
                            <Button size="small" variant="contained" onClick={addNote}
                              sx={{ bgcolor: isDark ? "#27272A" : "inherit", color: isDark ? "#F4F4F5" : undefined, borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit" } }}>
                              Save Note
                            </Button>
                          </div>
                        )}
                      </div>
                      {notes.map((n, i) => (
                        <div key={i} className={`rounded-xl px-4 py-3 border ${isDark ? "bg-[#27272A] border-[#3F3F46]" : "bg-[#EFF6FF] border-[#E3ECFC]"}`}>
                          <p className={`text-[12.5px] ${isDark ? "text-[#D4D4D8]" : "text-slate-700"}`}>{n.text}</p>
                          <p className={`text-[10px] mt-1 ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{n.at}</p>
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
                        <div className={`flex items-center rounded-lg p-0.5 gap-0.5 ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
                          {[{ k: "grid", Icon: GridFour }, { k: "list", Icon: List }].map(({ k, Icon }) => (
                            <button key={k} onClick={() => setAttachView(k as "grid" | "list")}
                              className={`p-1 rounded-md transition-colors ${attachView === k ? (isDark ? "bg-[#3F3F46] text-[#D4D4D8]" : "bg-[#f9fbff] text-[#1D4ED8]") : (isDark ? "text-[#52525B]" : "text-slate-400")}`}>
                              <Icon size={13} weight="duotone" />
                            </button>
                          ))}
                        </div>
                        <Button size="small" variant="outlined"
                          sx={{ borderColor: isDark ? "#3F3F46" : "#E3ECFC", color: isDark ? "#A1A1AA" : "#0C2472", bgcolor: isDark ? "#27272A" : "#E3ECFC", borderRadius: "8px", textTransform: "none", fontWeight: 600, fontSize: "0.73rem", "&:hover": { borderColor: isDark ? "#52525B" : "#E3ECFC", bgcolor: isDark ? "#3F3F46" : "#f9fbff" } }}>
                          Attach
                        </Button>
                      </div>
                    }>
                    <div className={`flex items-center justify-center py-6 text-[12.5px] ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>
                      No attachments yet
                    </div>
                  </SectionCard>
                </div>

                {/* ── Deals ── */}
                <div id="section-deals">
                  <SectionCard icon={Handshake} title="Deals"
                    action={
                      <div className="flex items-center gap-2">
                        <Button size="small" variant="contained"
                          startIcon={<Plus size={13} weight="bold" />}
                          sx={{ bgcolor: isDark ? "#27272A" : "inherit", color: isDark ? "#F4F4F5" : undefined, borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", boxShadow: isDark ? "none" : "0 1px 6px #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit" } }}>
                          New Deal
                        </Button>
                        <IconButton size="small"
                          sx={{ p: 0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&:hover": { color: "inherit" }, borderRadius: "6px" }}>
                          <DotsThreeVertical size={16} weight="bold" />
                        </IconButton>
                      </div>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px] min-w-[640px]">
                        <thead>
                          <tr className={`border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                            {["Deal Name", "Amount", "Stage", "Probability (%)", "Closing Date", "Type", "Deal Owner"].map(h => (
                              <th key={h} className={`text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {account.relatedDeals.length === 0 ? (
                            <tr><td colSpan={7} className={`py-8 text-center text-[12.5px] ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>No rows</td></tr>
                          ) : account.relatedDeals.map((d, i) => (
                            <tr key={i} className={`border-b transition-colors ${isDark ? "border-[#27272A] hover:bg-[#27272A]" : "border-[#EFF6FF] hover:bg-[rgba(29,78,216,0.03)]"}`}>
                              <td className={`py-3 pr-4 font-medium cursor-pointer hover:underline ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{d.name}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>₹{d.amount.toLocaleString()}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{d.stage}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{d.probability}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{d.closingDate}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{d.type}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{d.dealOwner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

                {/* ── Contacts ── */}
                <div id="section-contacts">
                  <SectionCard icon={UserCircle} title="Contacts"
                    action={
                      <div className="flex items-center gap-2">
                        <Button size="small" variant="contained"
                          startIcon={<Plus size={13} weight="bold" />}
                          sx={{ bgcolor: isDark ? "#27272A" : "inherit", color: isDark ? "#F4F4F5" : undefined, borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", boxShadow: isDark ? "none" : "0 1px 6px #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit" } }}>
                          New Contact
                        </Button>
                        <IconButton size="small"
                          sx={{ p: 0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&:hover": { color: "inherit" }, borderRadius: "6px" }}>
                          <DotsThreeVertical size={16} weight="bold" />
                        </IconButton>
                      </div>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px] min-w-[580px]">
                        <thead>
                          <tr className={`border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                            {["First Name", "Last Name", "Email", "Mobile", "Phone", "Fax", "Contact Owner"].map(h => (
                              <th key={h} className={`text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {account.relatedContacts.length === 0 ? (
                            <tr><td colSpan={7} className={`py-8 text-center text-[12.5px] ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>No rows</td></tr>
                          ) : account.relatedContacts.map((c, i) => (
                            <tr key={i} className={`border-b transition-colors ${isDark ? "border-[#27272A] hover:bg-[#27272A]" : "border-[#EFF6FF] hover:bg-[rgba(29,78,216,0.03)]"}`}>
                              <td className={`py-3 pr-4 font-medium cursor-pointer hover:underline ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{c.firstName}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.lastName || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.email || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.mobile || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.phone || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.fax || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{c.contactOwner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

                {/* ── Member Accounts ── */}
                <div id="section-member-accounts">
                  <SectionCard icon={Buildings} title="Member Accounts"
                    action={
                      <div className="flex items-center gap-2">
                        <Button size="small" variant="contained"
                          startIcon={<Plus size={13} weight="bold" />}
                          sx={{ bgcolor: isDark ? "#27272A" : "inherit", color: isDark ? "#F4F4F5" : undefined, borderRadius: "8px", textTransform: "none", fontWeight: 700, fontSize: "0.73rem", boxShadow: isDark ? "none" : "0 1px 6px #1D4ED833", "&:hover": { bgcolor: isDark ? "#3F3F46" : "inherit" } }}>
                          New Account
                        </Button>
                        <IconButton size="small"
                          sx={{ p: 0.5, color: isDark ? "#3F3F46" : "#E2E8F0", "&:hover": { color: "inherit" }, borderRadius: "6px" }}>
                          <DotsThreeVertical size={16} weight="bold" />
                        </IconButton>
                      </div>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px] min-w-[540px]">
                        <thead>
                          <tr className={`border-b ${isDark ? "border-[#27272A]" : "border-[#E3ECFC]"}`}>
                            {["Account Name", "Phone", "Website", "Account Type", "Industry", "Account Owner"].map(h => (
                              <th key={h} className={`text-left py-2 pr-4 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? "text-[#71717A]" : "text-[#0C2472]"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {account.memberAccounts.length === 0 ? (
                            <tr><td colSpan={6} className={`py-8 text-center text-[12.5px] ${isDark ? "text-[#3F3F46]" : "text-slate-300"}`}>No rows</td></tr>
                          ) : account.memberAccounts.map((m, i) => (
                            <tr key={i} className={`border-b transition-colors ${isDark ? "border-[#27272A] hover:bg-[#27272A]" : "border-[#EFF6FF] hover:bg-[rgba(29,78,216,0.03)]"}`}>
                              <td className={`py-3 pr-4 font-medium cursor-pointer hover:underline ${isDark ? "text-[#A1A1AA]" : "text-[#1D4ED8]"}`}>{m.name}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{m.phone || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{m.website || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{m.accountType || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{m.industry || "—"}</td>
                              <td className={`py-3 pr-4 ${isDark ? "text-[#A1A1AA]" : "text-slate-600"}`}>{m.accountOwner}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

            </div>{/* end col-span-2 */}

            <RelatedListPanel onClickItem={label =>
              document.getElementById(`section-${label.toLowerCase().replace(/\s+/g, "-")}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            } />
          </div>
          )}

          {/* ══════════════ TIMELINE TAB ══════════════ */}
          {activeTab === "timeline" && (
            <div className="grid grid-cols-3 gap-4 items-start">
            <div className="col-span-2">
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-[#1C1C1E] border-[#27272A]" : "bg-[#f9fbff] border-[#E3ECFC]"}`}>
                <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${isDark ? "border-[#27272A]" : "border-[#EFF6FF]"}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? "bg-[#27272A]" : "bg-[#EFF6FF]"}`}>
                    <ClockCounterClockwise size={13} color={isDark ? "#52525B" : "#E3ECFC"} weight="duotone" />
                  </div>
                  <p className={`font-heading text-[11px] font-bold uppercase tracking-[0.12em] ${isDark ? "text-[#71717A]" : "text-[#1D4ED8]"}`}>History</p>
                </div>

                {account.timeline.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <ClockCounterClockwise size={28} color={isDark ? "#27272A" : "#E2E8F0"} weight="duotone" />
                    <p className={`text-[12.5px] ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>No history yet</p>
                  </div>
                ) : (() => {
                  const grouped: Record<string, TimelineEntry[]> = {};
                  account.timeline.forEach(e => {
                    if (!grouped[e.date]) grouped[e.date] = [];
                    grouped[e.date].push(e);
                  });
                  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

                  return (
                    <div className="px-6 py-5 space-y-6">
                      {sortedDates.map(date => (
                        <div key={date}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`text-[11px] font-semibold whitespace-nowrap ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>
                              {new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <div className={`flex-1 h-px ${isDark ? "bg-[#27272A]" : "bg-[#E3ECFC]"}`} />
                          </div>
                          <div className="space-y-0">
                            {grouped[date].map((entry, i) => {
                              const isLast = i === grouped[date].length - 1 && date === sortedDates[sortedDates.length - 1];
                              return (
                                <div key={i} className="flex gap-4">
                                  <div className="w-16 flex-shrink-0 text-right">
                                    <span className={`text-[11px] font-medium ${isDark ? "text-[#52525B]" : "text-slate-400"}`}>{entry.time}</span>
                                  </div>
                                  <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0 ${isDark ? "bg-[#27272A] border-[#3F3F46]" : "bg-[#EFF6FF] border-[#E3ECFC]"}`}>
                                      <PencilSimple size={13} color={isDark ? "#52525B" : "#E3ECFC"} weight="duotone" />
                                    </div>
                                    {!isLast && <div className={`w-px flex-1 my-1 min-h-[24px] ${isDark ? "bg-[#27272A]" : "bg-[#E3ECFC]"}`} />}
                                  </div>
                                  <div className="pb-5 flex-1 min-w-0 overflow-hidden">
                                    {entry.field && (
                                      <p className={`text-[12.5px] leading-relaxed break-words ${isDark ? "text-[#A1A1AA]" : "text-slate-700"}`}>
                                        <span className="font-bold">{entry.field}:</span>{" "}
                                        {entry.from
                                          ? <span className={isDark ? "text-[#71717A]" : "text-slate-500"}>{entry.from} → {entry.to}</span>
                                          : <span className={isDark ? "text-[#71717A]" : "text-slate-500"}>{entry.to}</span>
                                        }
                                      </p>
                                    )}
                                    <p className={`text-[11px] mt-0.5 break-all ${isDark ? "text-[#52525B]" : "text-inherit"}`}>by {entry.by}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>{/* end col-span-2 */}

            <RelatedListPanel onClickItem={() => setActiveTab("overview")} />
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
