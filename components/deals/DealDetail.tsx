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
  Note, ClipboardText, Paperclip, ClockCounterClockwise,
  ThumbsUp, ThumbsDown, Plus, Trash, Copy,
  GridFour, List, Trophy, Handshake, CurrencyCircleDollar,
  CalendarBlank, UserCircle, Buildings, Tag, CheckCircle,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type DealStage =
  | "Qualification" | "Needs Analysis" | "Value Proposition"
  | "Identify Decision Makers" | "Proposal/Price Quote"
  | "Negotiation/Review" | "Closed Won";

interface StageHistoryRow {
  stage: DealStage; amount: number; probability: number;
  expectedRevenue: number; stageDurationDays: number;
  movedFrom: string; isCurrent: number;
}
interface TaskRow { subject: string; status: string; }
interface TimelineEntry {
  date: string;   // "2026-06-11"
  time: string;   // "11:37 am"
  probability?: { from: number; to: number };
  stage?: { from: string; to: string };
  by: string;
}
interface DealRecord {
  id: number; refId: string; name: string; amount: number;
  owner: string; ownerEmail: string; account: string; stage: DealStage;
  type: string; nextStep: string; probability: number; leadSource: string;
  expectedRevenue: number; contactName: string; closingDate: string;
  startDate: string; createdBy: string; createdAt: string;
  modifiedBy: string; modifiedAt: string; recordCategory: string;
  description: string; stageHistory: StageHistoryRow[]; tasks: TaskRow[];
  timeline: TimelineEntry[];
}

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
const DEALS_DETAIL: Record<number, DealRecord> = {
  1:  { id:1,  refId:"CRM DEAL 2026 00001", name:"New",                         amount:29999,  owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"Sweany Inc",     stage:"Proposal/Price Quote",      type:"New Business",       nextStep:"Send proposal",      probability:75, leadSource:"Web",          expectedRevenue:29999,  contactName:"",                 closingDate:"2026-07-15", startDate:"2026-05-27", createdBy:"pm@socialdnalabs.com", createdAt:"Tue, May 27, 2026 03:14 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Fri, May 30, 2026 02:10 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Proposal/Price Quote",amount:29999,probability:75,expectedRevenue:22499,stageDurationDays:3,movedFrom:"Needs Analysis",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-05-30", time:"02:10 pm", probability:{from:60,to:75}, stage:{from:"Needs Analysis",to:"Proposal/Price Quote"}, by:"pm@socialdnalabs.com" },
    { date:"2026-05-29", time:"10:22 am", probability:{from:20,to:60}, stage:{from:"Qualification",to:"Needs Analysis"}, by:"pm@socialdnalabs.com" },
    { date:"2026-05-27", time:"03:14 pm", probability:{from:0,to:20},  stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  2:  { id:2,  refId:"CRM DEAL 2026 00002", name:"Deal SDL 11",                 amount:500000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"SDL LEAD1",      stage:"Identify Decision Makers",  type:"Existing Business",  nextStep:"Schedule meeting",   probability:60, leadSource:"Referral",     expectedRevenue:300000, contactName:"Lead SDL 11",      closingDate:"2026-08-31", startDate:"2026-04-15", createdBy:"pm@socialdnalabs.com", createdAt:"Wed, Apr 15, 2026 11:13 AM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Tue, May 05, 2026 04:55 PM", recordCategory:"Open", description:"Enterprise deal with SDL LEAD1.", stageHistory:[{stage:"Identify Decision Makers",amount:500000,probability:60,expectedRevenue:300000,stageDurationDays:20,movedFrom:"Value Proposition",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-06-11", time:"11:37 am", probability:{from:60,to:75}, stage:{from:"Identify Decision Makers",to:"Proposal/Price Quote"}, by:"pm@socialdnalabs.com" },
    { date:"2026-05-05", time:"04:55 pm", probability:{from:40,to:60}, stage:{from:"Value Proposition",to:"Identify Decision Makers"},    by:"pm@socialdnalabs.com" },
    { date:"2026-05-05", time:"04:55 pm", probability:{from:20,to:40}, stage:{from:"Needs Analysis",to:"Value Proposition"},             by:"pm@socialdnalabs.com" },
    { date:"2026-05-05", time:"04:55 pm", probability:{from:40,to:20}, stage:{from:"Value Proposition",to:"Needs Analysis"},             by:"pm@socialdnalabs.com" },
    { date:"2026-05-05", time:"04:50 pm", probability:{from:20,to:40}, stage:{from:"Needs Analysis",to:"Value Proposition"},             by:"pm@socialdnalabs.com" },
    { date:"2026-05-05", time:"04:50 pm", probability:{from:10,to:20}, stage:{from:"Qualification",to:"Needs Analysis"},                 by:"pm@socialdnalabs.com" },
  ]},
  3:  { id:3,  refId:"CRM DEAL 2026 00003", name:"test deal john smith",        amount:200000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"Sears Homelife",  stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Cold Call",    expectedRevenue:20000,  contactName:"John Smith",       closingDate:"2026-09-30", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 07:45 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 07:45 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:200000,probability:10,expectedRevenue:20000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"07:45 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  4:  { id:4,  refId:"CRM DEAL 2026 00004", name:"testing",                     amount:500000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"RMVT",            stage:"Needs Analysis",            type:"Existing Business",  nextStep:"",                   probability:20, leadSource:"Advertisement",expectedRevenue:100000, contactName:"Raja rajan",       closingDate:"2026-07-31", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 07:30 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 07:34 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Needs Analysis",amount:500000,probability:20,expectedRevenue:100000,stageDurationDays:0,movedFrom:"Qualification",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"07:34 pm", probability:{from:10,to:20}, stage:{from:"Qualification",to:"Needs Analysis"}, by:"pm@socialdnalabs.com" },
    { date:"2026-04-14", time:"07:30 pm", probability:{from:0,to:10},  stage:{from:"",to:"Qualification"},               by:"pm@socialdnalabs.com" },
  ]},
  5:  { id:5,  refId:"CRM DEAL 2026 00005", name:"fsm enterprise application",  amount:800000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"RMVT",            stage:"Needs Analysis",            type:"New Business",       nextStep:"Demo scheduled",     probability:20, leadSource:"Advertisement",expectedRevenue:160000, contactName:"mmmm mmmm",        closingDate:"2026-10-31", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 06:53 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 07:07 PM", recordCategory:"Open", description:"Full FSM enterprise application build.", stageHistory:[{stage:"Needs Analysis",amount:800000,probability:20,expectedRevenue:160000,stageDurationDays:0,movedFrom:"Qualification",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"07:07 pm", probability:{from:10,to:20}, stage:{from:"Qualification",to:"Needs Analysis"}, by:"pm@socialdnalabs.com" },
    { date:"2026-04-14", time:"06:53 pm", probability:{from:0,to:10},  stage:{from:"",to:"Qualification"},               by:"pm@socialdnalabs.com" },
  ]},
  6:  { id:6,  refId:"CRM DEAL 2026 00006", name:"CRM Application",             amount:200000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"SDL",             stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Web",          expectedRevenue:20000,  contactName:"SDL Test Test-SDL",closingDate:"2026-08-15", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 07:04 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 07:04 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:200000,probability:10,expectedRevenue:20000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"07:04 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  7:  { id:7,  refId:"CRM DEAL 2026 00007", name:"fsm single user application", amount:200000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"RMVT",            stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Advertisement",expectedRevenue:20000,  contactName:"Raja rajan",       closingDate:"2026-09-15", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 06:40 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 06:40 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:200000,probability:10,expectedRevenue:20000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"06:40 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  8:  { id:8,  refId:"CRM DEAL 2026 00008", name:"CRM Application",             amount:500000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"RMVT",            stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Web",          expectedRevenue:50000,  contactName:"Vishnutharan R",   closingDate:"2026-10-01", startDate:"2026-04-14", createdBy:"pm@socialdnalabs.com", createdAt:"Mon, Apr 14, 2026 06:38 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Mon, Apr 14, 2026 06:38 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:500000,probability:10,expectedRevenue:50000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-14", time:"06:38 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  9:  { id:9,  refId:"CRM DEAL 2026 00009", name:"Deal test",                   amount:150000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"test",            stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Web",          expectedRevenue:15000,  contactName:"test test",        closingDate:"2026-07-01", startDate:"2026-04-13", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 06:35 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 06:35 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:150000,probability:10,expectedRevenue:15000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-13", time:"06:35 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  10: { id:10, refId:"CRM DEAL 2026 00010", name:"test",                        amount:50000,  owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"test",            stage:"Needs Analysis",            type:"New Business",       nextStep:"",                   probability:20, leadSource:"Web",          expectedRevenue:10000,  contactName:"test test",        closingDate:"2026-08-01", startDate:"2026-04-13", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 06:17 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 06:34 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Needs Analysis",amount:50000,probability:20,expectedRevenue:10000,stageDurationDays:17,movedFrom:"Qualification",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-13", time:"06:34 pm", probability:{from:10,to:20}, stage:{from:"Qualification",to:"Needs Analysis"}, by:"pm@socialdnalabs.com" },
    { date:"2026-04-13", time:"06:17 pm", probability:{from:0,to:10},  stage:{from:"",to:"Qualification"},               by:"pm@socialdnalabs.com" },
  ]},
  11: { id:11, refId:"CRM DEAL 2026 00011", name:"Smith",                       amount:100000, owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"test",            stage:"Value Proposition",         type:"New Business",       nextStep:"Send proposal doc",  probability:40, leadSource:"Referral",     expectedRevenue:40000,  contactName:"John Smith",       closingDate:"2026-09-01", startDate:"2026-04-13", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 06:00 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 06:02 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Value Proposition",amount:100000,probability:40,expectedRevenue:40000,stageDurationDays:2,movedFrom:"Needs Analysis",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-13", time:"06:02 pm", probability:{from:20,to:40}, stage:{from:"Needs Analysis",to:"Value Proposition"}, by:"pm@socialdnalabs.com" },
    { date:"2026-04-13", time:"06:00 pm", probability:{from:10,to:20}, stage:{from:"Qualification",to:"Needs Analysis"},     by:"pm@socialdnalabs.com" },
    { date:"2026-04-13", time:"06:00 pm", probability:{from:0,to:10},  stage:{from:"",to:"Qualification"},                   by:"pm@socialdnalabs.com" },
  ]},
  12: { id:12, refId:"CRM DEAL 2026 00012", name:"Mike",                        amount:0,      owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"Speedy Motors",   stage:"Qualification",             type:"New Business",       nextStep:"",                   probability:10, leadSource:"Cold Call",    expectedRevenue:0,      contactName:"Speedy Mike",      closingDate:"2026-12-31", startDate:"2026-04-13", createdBy:"pm@socialdnalabs.com", createdAt:"Sun, Apr 13, 2026 05:56 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Sun, Apr 13, 2026 05:56 PM", recordCategory:"Open", description:"", stageHistory:[{stage:"Qualification",amount:0,probability:10,expectedRevenue:0,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-04-13", time:"05:56 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
  13: { id:13, refId:"CRM DEAL 2026 00013", name:"Test",                        amount:10000,  owner:"PM SDL", ownerEmail:"pm@socialdnalabs.com", account:"RMVT",            stage:"Qualification",             type:"Existing Business",  nextStep:"",                   probability:10, leadSource:"Advertisement",expectedRevenue:10000,  contactName:"Raja rajan",       closingDate:"2026-06-30", startDate:"2026-06-10", createdBy:"pm@socialdnalabs.com", createdAt:"Wed, Jun 10, 2026 02:12 PM", modifiedBy:"pm@socialdnalabs.com", modifiedAt:"Wed, Jun 10, 2026 02:12 PM", recordCategory:"Open", description:"test", stageHistory:[{stage:"Qualification",amount:10000,probability:10,expectedRevenue:1000,stageDurationDays:0,movedFrom:"",isCurrent:1}], tasks:[], timeline:[
    { date:"2026-06-10", time:"02:12 pm", probability:{from:0,to:10}, stage:{from:"",to:"Qualification"}, by:"pm@socialdnalabs.com" },
  ]},
};

const STAGES: DealStage[] = [
  "Qualification", "Needs Analysis", "Value Proposition",
  "Identify Decision Makers", "Proposal/Price Quote", "Negotiation/Review", "Closed Won",
];

const STAGE_CFG: Record<DealStage, { fill: string; text: string }> = {
  "Qualification":            { fill: "#D6E4F9", text: "#0C2472" },
  "Needs Analysis":           { fill: "#D0E5E0", text: "#065F46" },
  "Value Proposition":        { fill: "#FAE3D0", text: "#7C2D12" },
  "Identify Decision Makers": { fill: "#F5D9E1", text: "#831843" },
  "Proposal/Price Quote":     { fill: "#D2DFF0", text: "#1E3A5F" },
  "Negotiation/Review":       { fill: "#FEF3C7", text: "#92400E" },
  "Closed Won":               { fill: "#DCFCE7", text: "#166534" },
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
        <p className="font-heading text-[11px] font-bold text-[#1D4ED8] uppercase tracking-[0.12em] flex-1">{title}</p>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-10 gap-y-0">{children}</div>;
}

function KV({ label, value }: { label: string; value?: string | number }) {
  const display = value !== undefined && value !== "" && value !== 0
    ? String(value) : "—";
  return (
    <div className="py-2.5 border-b border-[#EFF6FF] last:border-0">
      <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-[13px] font-medium ${display === "—" ? "text-slate-300" : "text-slate-700"}`}>{display}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────
export default function DealDetail({ dealId }: { dealId: number }) {
  const router = useRouter();
  const deal = DEALS_DETAIL[dealId];

  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; at: string }[]>([]);
  const [attachView, setAttachView] = useState<"grid" | "list">("grid");
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  if (!deal) {
    return (
      <div className="flex h-screen bg-[#EFF6FF] font-sans">
        <Sidebar />
        <div className="sidebar-content flex-1 flex flex-col">
          <TopBar title="Deals" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[#0C2472] text-xl font-bold mb-2">Deal not found</p>
              <button onClick={() => router.push("/deals")} className="text-[#1D4ED8] text-sm underline">Back to Deals</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stageIdx = STAGES.indexOf(deal.stage);
  const stageCfg = STAGE_CFG[deal.stage];

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [{ text: note.trim(), at: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) }, ...prev]);
    setNote("");
  };

  const relatedItems = [
    { label: "Notes",         icon: Note,                  count: notes.length,           color: "#8B5CF6" },
    { label: "Attachments",   icon: Paperclip,             count: 0,                      color: "#F59E0B" },
    { label: "Stage History", icon: ClockCounterClockwise, count: deal.stageHistory.length, color: "#1D4ED8" },
    { label: "Tasks",         icon: ClipboardText,         count: deal.tasks.length,      color: "#10B981" },
  ];

  return (
    <div className="flex h-screen bg-[#EFF6FF] font-sans">
      <Sidebar />

      <div className="sidebar-content flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar title="Deals" />

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 px-8 py-3 bg-[#E3ECFC] border-b border-[#E3ECFC] text-[12px]">
          <Link href="/" className="text-slate-400 hover:text-[#1D4ED8] transition-colors">
            <House size={13} weight="duotone" />
          </Link>
          <CaretRight size={11} color="#E2E8F0" />
          <Link href="/deals" className="text-slate-400 hover:text-[#1D4ED8] font-medium transition-colors">Deals</Link>
          <CaretRight size={11} color="#E2E8F0" />
          <span className="text-[#0C2472] font-semibold">{deal.refId}</span>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

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
                {/* ── Stage Pipeline ── */}
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm p-4">
                  {/* Dates row */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Start</p>
                      <p className="text-[11px] font-semibold text-slate-600">
                        {new Date(deal.startDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Closing</p>
                      <p className="text-[11px] font-semibold text-slate-600">
                        {new Date(deal.closingDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Pipeline stages */}
                  <div className="flex items-center gap-0 overflow-x-auto pb-1">
                    {STAGES.map((stage, i) => {
                      const isActive = deal.stage === stage;
                      const isPast = stageIdx > i;
                      const isLast = i === STAGES.length - 1;
                      return (
                        <div key={stage} className="flex items-center flex-shrink-0">
                          <div className={`
                            relative px-3 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 transition-all
                            ${i === 0 ? "rounded-l-lg" : ""} ${isLast ? "rounded-r-lg" : ""}
                            ${isActive ? "bg-[#1D4ED8] text-white z-10 shadow-md shadow-[#1D4ED8]/20"
                              : isPast ? "bg-[#E3ECFC] text-[#1D4ED8]"
                              : "bg-[#f9fbff] text-slate-400 border border-[#E3ECFC]"}
                          `}>
                            {isLast && <Trophy size={12} weight="duotone" />}
                            <span className="whitespace-nowrap">{stage}</span>
                          </div>
                          {!isLast && (
                            <div className={`w-0 h-0 border-t-[14px] border-b-[14px] border-l-[10px] border-transparent flex-shrink-0 ${
                              isActive ? "border-l-[#1D4ED8]" : isPast ? "border-l-[#E3ECFC]" : "border-l-[#E3ECFC]"
                            }`} />
                          )}
                        </div>
                      );
                    })}

                    {/* Thumbs */}
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <Tooltip title="Won">
                        <IconButton size="small" sx={{ bgcolor:"#DCFCE7", "&:hover":{bgcolor:"#BBF7D0"}, borderRadius:"8px", p:0.8 }}>
                          <ThumbsUp size={14} color="#16A34A" weight="duotone" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Lost">
                        <IconButton size="small" sx={{ bgcolor:"#FEF2F2", "&:hover":{bgcolor:"#FECACA"}, borderRadius:"8px", p:0.8 }}>
                          <ThumbsDown size={14} color="#DC2626" weight="duotone" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* ── Quick Info ── */}
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm divide-y divide-[#EFF6FF]">
                  {[
                    { label: "Deal Name", value: deal.name, editable: false },
                    { label: "Stage",     value: deal.stage, editable: true },
                    { label: "Probability (%)", value: String(deal.probability), editable: false },
                    { label: "Closing Date", value: deal.closingDate, editable: true },
                  ].map(({ label, value, editable }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-[12.5px] text-slate-500 font-medium w-40 flex-shrink-0">{label}:</span>
                      <span className="flex-1 text-[13px] font-semibold text-slate-700">{value}</span>
                      {editable && (
                        <IconButton size="small" sx={{ p:0.5, color:"#E2E8F0", "&:hover":{color:"#1D4ED8", bgcolor:"#EFF6FF"}, borderRadius:"6px" }}>
                          <PencilSimple size={14} weight="duotone" />
                        </IconButton>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Deal Information ── */}
                <SectionCard icon={Handshake} title="Deal Information"
                  action={
                    <IconButton size="small" onClick={e => setMoreAnchor(e.currentTarget)}
                      sx={{ p:0.5, color:"#E2E8F0", "&:hover":{color:"#1D4ED8", bgcolor:"#EFF6FF"}, borderRadius:"6px" }}>
                      <DotsThreeVertical size={16} weight="bold" />
                    </IconButton>
                  }>
                  <InfoGrid>
                    <KV label="Deal Name"        value={deal.name} />
                    <KV label="Amount"            value={`₹${deal.amount.toLocaleString()}`} />
                    <KV label="Deal Owner"        value={deal.owner} />
                    <KV label="Closing Date"      value={deal.closingDate} />
                    <KV label="Account Name"      value={deal.account} />
                    <KV label="Stage"             value={deal.stage} />
                    <KV label="Type"              value={deal.type} />
                    <KV label="Next Step"         value={deal.nextStep} />
                    <KV label="Probability (%)"   value={deal.probability} />
                    <KV label="Lead Source"       value={deal.leadSource} />
                    <KV label="Expected Revenue"  value={`₹${deal.expectedRevenue.toLocaleString()}`} />
                    <KV label="Contact Name"      value={deal.contactName} />
                    <KV label="Created By"        value={`${deal.createdBy}\n${deal.createdAt}`} />
                    <KV label="Modified By"       value={`${deal.modifiedBy}\n${deal.modifiedAt}`} />
                    <KV label="Record Category"   value={deal.recordCategory} />
                  </InfoGrid>
                </SectionCard>

                {/* ── Description ── */}
                <SectionCard icon={Tag} title="Description Information">
                  <KV label="Description" value={deal.description} />
                </SectionCard>

                {/* ── Notes ── */}
                <div id="section-notes">
                  <SectionCard icon={Note} title="Notes">
                    <div className="space-y-3">
                      <div className="border border-[#E3ECFC] rounded-xl overflow-hidden focus-within:border-[#1D4ED8] focus-within:shadow-[0_0_0_2px_#4A7AE8] transition-all">
                        <InputBase
                          fullWidth multiline minRows={2}
                          placeholder="Add a note…"
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          sx={{ px:2, py:1.5, fontSize:"0.8rem", color:"#334155", "& textarea::placeholder":{color:"#E2E8F0", opacity:1} }}
                        />
                        {note.trim() && (
                          <div className="flex justify-end px-3 pb-2">
                            <Button size="small" variant="contained" onClick={addNote}
                              sx={{ bgcolor:"#1D4ED8", borderRadius:"8px", textTransform:"none", fontWeight:700, fontSize:"0.73rem", "&:hover":{bgcolor:"#60A5FA"}, "&:active":{bgcolor:"#0C2472"} }}>
                              Save Note
                            </Button>
                          </div>
                        )}
                      </div>
                      {notes.map((n, i) => (
                        <div key={i} className="bg-[#EFF6FF] rounded-xl px-4 py-3 border border-[#E3ECFC]">
                          <p className="text-[12.5px] text-slate-700">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.at}</p>
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
                          {[{ k:"grid", Icon:GridFour }, { k:"list", Icon:List }].map(({ k, Icon }) => (
                            <button key={k} onClick={() => setAttachView(k as any)}
                              className={`p-1 rounded-md transition-colors ${attachView===k ? "bg-[#f9fbff] text-[#1D4ED8]" : "text-slate-400 hover:text-[#1D4ED8]"}`}>
                              <Icon size={13} weight="duotone" />
                            </button>
                          ))}
                        </div>
                        <Button size="small" variant="outlined"
                          sx={{ borderColor:"#E3ECFC", color:"#0C2472", bgcolor:"#E3ECFC", borderRadius:"8px", textTransform:"none", fontWeight:600, fontSize:"0.73rem", "&:hover":{borderColor:"#1D4ED8", color:"#1D4ED8", bgcolor:"#f9fbff"} }}>
                          Attach
                        </Button>
                      </div>
                    }>
                    <div className="flex items-center justify-center py-6 text-slate-300 text-[12.5px]">
                      No attachments yet
                    </div>
                  </SectionCard>
                </div>

                {/* ── Stage History ── */}
                <div id="section-stage-history">
                  <SectionCard icon={ClockCounterClockwise} title="Stage History"
                    action={
                      <IconButton size="small" sx={{ p:0.5, color:"#E2E8F0", "&:hover":{color:"#1D4ED8"}, borderRadius:"6px" }}>
                        <DotsThreeVertical size={16} weight="bold" />
                      </IconButton>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px] min-w-[600px]">
                        <thead>
                          <tr className="border-b border-[#E3ECFC]">
                            {["Stage","Amount","Probability (%)","Expected Revenue","Stage Duration (Days)","Moved From","Is Current"].map(h => (
                              <th key={h} className="text-left py-2 pr-4 text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFF6FF]">
                          {deal.stageHistory.map((row, i) => (
                            <tr key={i} className="hover:bg-[rgba(29,78,216,0.03)] transition-colors">
                              <td className="py-3 pr-4 font-medium text-slate-700">{row.stage}</td>
                              <td className="py-3 pr-4 text-slate-600">₹{row.amount.toLocaleString()}</td>
                              <td className="py-3 pr-4 text-slate-600">{row.probability}</td>
                              <td className="py-3 pr-4 text-slate-600">₹{row.expectedRevenue.toLocaleString()}</td>
                              <td className="py-3 pr-4 text-slate-600">{row.stageDurationDays}</td>
                              <td className="py-3 pr-4 text-slate-600">{row.movedFrom || "—"}</td>
                              <td className="py-3 pr-4">
                                {row.isCurrent === 1 && (
                                  <span className="text-[11px] font-bold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full">1</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

                {/* ── Tasks ── */}
                <div id="section-tasks">
                  <SectionCard icon={ClipboardText} title="Tasks"
                    action={
                      <div className="flex items-center gap-2">
                        <Button size="small" variant="contained" startIcon={<Plus size={13} weight="duotone" />}
                          sx={{ bgcolor:"#1D4ED8", borderRadius:"8px", textTransform:"none", fontWeight:700, fontSize:"0.73rem", boxShadow:"0 1px 6px #1D4ED833", "&:hover":{bgcolor:"#60A5FA"}, "&:active":{bgcolor:"#0C2472"} }}>
                          New Task
                        </Button>
                        <IconButton size="small" sx={{ p:0.5, color:"#E2E8F0", "&:hover":{color:"#1D4ED8"}, borderRadius:"6px" }}>
                          <DotsThreeVertical size={16} weight="bold" />
                        </IconButton>
                      </div>
                    }>
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className="border-b border-[#E3ECFC]">
                            <th className="text-left py-2 pr-4 text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Subject</th>
                            <th className="text-left py-2 pr-4 text-[10.5px] font-bold text-[#0C2472] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deal.tasks.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="py-8 text-center text-slate-300 text-[12.5px]">No rows</td>
                            </tr>
                          ) : deal.tasks.map((t, i) => (
                            <tr key={i} className="border-b border-[#EFF6FF] hover:bg-[rgba(29,78,216,0.03)] transition-colors">
                              <td className="py-3 pr-4 font-medium text-slate-700">{t.subject}</td>
                              <td className="py-3 pr-4 text-slate-600">{t.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                </div>

              </div>{/* end col-span-2 */}

              {/* ── Right: Related List ── */}
              <div className="space-y-4">
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
                    <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {relatedItems.map(({ label, icon: Icon, count, color }) => (
                      <button key={label}
                        onClick={() => document.getElementById(`section-${label.toLowerCase().replace(/\s/g, "-")}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                          <Icon size={14} color={color} weight="duotone" />
                        </div>
                        <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8] transition-colors">{label}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>
                        )}
                        <CaretRight size={14} color="#E2E8F0" weight="duotone" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {activeTab === "timeline" && (
              <div className="grid grid-cols-3 gap-4 items-start">
              <div className="col-span-2">
              <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#EFF6FF]">
                  <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                    <ClockCounterClockwise size={13} color="#1D4ED8" weight="duotone" />
                  </div>
                  <p className="font-heading text-[11px] font-bold text-[#1D4ED8] uppercase tracking-[0.12em]">History</p>
                </div>

                {deal.timeline.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <ClockCounterClockwise size={28} color="#E2E8F0" weight="duotone" />
                    <p className="text-[12.5px] text-slate-400">No history yet</p>
                  </div>
                ) : (() => {
                  // Group entries by date
                  const grouped: Record<string, TimelineEntry[]> = {};
                  deal.timeline.forEach(e => {
                    if (!grouped[e.date]) grouped[e.date] = [];
                    grouped[e.date].push(e);
                  });
                  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

                  return (
                    <div className="px-6 py-5 space-y-6">
                      {sortedDates.map(date => (
                        <div key={date}>
                          {/* Date header */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[11px] font-semibold text-slate-400">
                              {new Date(date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
                            </span>
                            <div className="flex-1 h-px bg-[#E3ECFC]" />
                          </div>

                          {/* Entries for this date */}
                          <div className="space-y-0">
                            {grouped[date].map((entry, i) => {
                              const isLast = i === grouped[date].length - 1 && date === sortedDates[sortedDates.length - 1];
                              return (
                                <div key={i} className="flex gap-4">
                                  {/* Time */}
                                  <div className="w-16 flex-shrink-0 text-right">
                                    <span className="text-[11px] text-slate-400 font-medium">{entry.time}</span>
                                  </div>

                                  {/* Icon + line */}
                                  <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border-2 border-[#E3ECFC] flex items-center justify-center z-10 flex-shrink-0">
                                      <PencilSimple size={13} color="#1D4ED8" weight="duotone" />
                                    </div>
                                    {!isLast && <div className="w-px flex-1 bg-[#E3ECFC] my-1 min-h-[24px]" />}
                                  </div>

                                  {/* Content */}
                                  <div className="pb-5 flex-1 min-w-0 overflow-hidden">
                                    {entry.probability && (
                                      <p className="text-[12.5px] text-slate-700 leading-relaxed break-words">
                                        <span className="font-bold">Probability:</span>{" "}
                                        <span className="text-slate-500">{entry.probability.from}.0 → {entry.probability.to}.0</span>
                                      </p>
                                    )}
                                    {entry.stage && entry.stage.to && (
                                      <p className="text-[12.5px] text-slate-700 leading-relaxed break-words">
                                        <span className="font-bold">Stage:</span>{" "}
                                        {entry.stage.from
                                          ? <><span className="text-slate-500">{entry.stage.from} → {entry.stage.to}</span></>
                                          : <span className="text-slate-500">{entry.stage.to}</span>
                                        }
                                      </p>
                                    )}
                                    <p className="text-[11px] text-[#3B82F6] mt-0.5 break-all">by {entry.by}</p>
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

              {/* ── Right: Related List ── */}
              <div className="space-y-4">
                <div className="bg-[#f9fbff] rounded-2xl border border-[#E3ECFC] shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-[#EFF6FF]">
                    <p className="font-heading text-[11px] font-bold text-slate-500 uppercase tracking-wider">Related List</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {relatedItems.map(({ label, icon: Icon, count, color }) => (
                      <button key={label}
                        onClick={() => setActiveTab("overview")}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[#EFF6FF] group transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                          <Icon size={14} color={color} weight="duotone" />
                        </div>
                        <span className="flex-1 text-left text-[12.5px] font-medium text-slate-700 group-hover:text-[#1D4ED8] transition-colors">{label}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-bold bg-[#E3ECFC] text-[#1D4ED8] px-1.5 py-0.5 rounded-full">{count}</span>
                        )}
                        <CaretRight size={14} color="#E2E8F0" weight="duotone" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}
        </div>
      </div>

      {/* ── More menu ── */}
      <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}
        PaperProps={{ sx:{ borderRadius:"12px", border:"1px solid #E3ECFC", boxShadow:"0 8px 32px rgba(12,36,114,0.10)", minWidth:160 } }}>
        {[
          { label:"Edit Deal",    icon:PencilSimple, color:"#334155" },
          { label:"Copy",         icon:Copy,         color:"#334155" },
          { label:"Delete",       icon:Trash,        color:"#EF4444" },
        ].map(opt => (
          <MenuItem key={opt.label} onClick={() => setMoreAnchor(null)}
            sx={{ mx:0.5, borderRadius:"8px", py:1, "&:hover":{bgcolor:"#EFF6FF"} }}>
            <ListItemIcon sx={{ minWidth:30 }}>
              <opt.icon size={15} color={opt.color} weight="duotone" />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize:"0.8rem", fontWeight:600, color: opt.color==="#EF4444"?"#EF4444":"#334155" }}>
              {opt.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
