"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  SquaresFour, Lightning, Handshake, AddressBook,
  Buildings, CheckCircle, ChatTeardropText, ChartBar, Gear, List,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

const navItems = [
  { label: "Dashboard",      Icon: SquaresFour,      href: "/"         },
  { label: "Leads",          Icon: Lightning,        href: "/leads",   badge: 14 },
  { label: "Deals",          Icon: Handshake,        href: "/deals"    },
  { label: "Contacts",       Icon: AddressBook,      href: "/contacts" },
  { label: "Accounts",       Icon: Buildings,        href: "/accounts" },
  { label: "Tasks",          Icon: CheckCircle,      href: "/tasks",   badge: 7  },
  { label: "Customer Comms", Icon: ChatTeardropText, href: "/comms"    },
  { label: "Reports",        Icon: ChartBar,         href: "/reports"  },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Restore persisted state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    const isCollapsed = stored === "true";
    setCollapsed(isCollapsed);
    document.documentElement.style.setProperty("--sidebar-w", isCollapsed ? "80px" : "260px");
  }, []);

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      document.documentElement.style.setProperty("--sidebar-w", next ? "80px" : "260px");
      return next;
    });
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50 select-none border-r border-[#E3ECFC] overflow-hidden"
      style={{
        backgroundColor: "#E3ECFC",
        width: collapsed ? "80px" : "260px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* ── Header: hamburger + logo ── */}
      <div className="flex items-center h-[72px] px-3 gap-3 border-b border-[#E3ECFC] flex-shrink-0">
        <button
          onClick={toggle}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#1D4ED8] hover:bg-[#EFF6FF] transition-all duration-150"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <List size={18} weight="bold" />
        </button>
        {!collapsed && (
          <img
            src="/logo.png"
            alt="Social DNA Labs"
            style={{ height: "22px", width: "auto", display: "block", flexShrink: 0 }}
          />
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ label, Icon, href, badge }) => {
          const active = pathname === href;

          const itemContent = (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center rounded-lg text-[13px] font-medium
                transition-all duration-150 group relative
                ${collapsed ? "justify-center w-12 h-12 mx-auto" : "gap-3 px-3 py-2.5 w-full"}
                ${active
                  ? "bg-[#EFF6FF] text-[#1D4ED8]"
                  : "text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
                }
              `}
            >
              <Icon
                size={18}
                weight="duotone"
                className={`flex-shrink-0 transition-colors ${active ? "text-[#1D4ED8]" : "text-slate-400 group-hover:text-[#1D4ED8]"}`}
              />

              {/* Label — hidden when collapsed */}
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge && !active && (
                    <span className="text-[10px] font-bold bg-[#1D4ED8]/10 text-[#1D4ED8] px-1.5 py-0.5 rounded-full leading-none">
                      {badge}
                    </span>
                  )}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] flex-shrink-0" />
                  )}
                </>
              )}

              {/* Badge dot on icon when collapsed */}
              {collapsed && badge && !active && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1D4ED8] border-2 border-white" />
              )}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={href} title={label} placement="right" arrow>
              <span className="flex justify-center">{itemContent}</span>
            </Tooltip>
          ) : (
            <span key={href}>{itemContent}</span>
          );
        })}
      </nav>

      {/* ── Bottom: Settings + Profile ── */}
      <div className="px-2 pb-3 border-t border-[#E3ECFC] pt-2 space-y-0.5 flex-shrink-0">

        {/* Settings */}
        {collapsed ? (
          <Tooltip title="Settings" placement="right" arrow>
            <span className="flex justify-center">
              <Link
                href="/settings"
                className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#EFF6FF] transition-all duration-150"
              >
                <Gear size={18} weight="duotone" />
              </Link>
            </span>
          </Tooltip>
        ) : (
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-all duration-150"
          >
            <Gear size={18} weight="duotone" className="text-slate-400 flex-shrink-0" />
            Settings
          </Link>
        )}

        {/* Profile */}
        {collapsed ? (
          <Tooltip title="PM SDL — Admin" placement="right" arrow>
            <span className="flex justify-center py-1">
              <div className="relative">
                <Avatar
                  src={OWNER_AVATARS["PM SDL"]}
                  sx={{ width: 34, height: 34, bgcolor: "#1D4ED8", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
                >PM</Avatar>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
            </span>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2.5 mt-1 px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#E3ECFC]">
            <div className="relative flex-shrink-0">
              <Avatar
                src={OWNER_AVATARS["PM SDL"]}
                sx={{ width: 30, height: 30, bgcolor: "#1D4ED8", fontSize: "0.6rem", fontWeight: 800 }}
              >PM</Avatar>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#0C2472] truncate">PM SDL</p>
              <p className="text-[10px] text-slate-400 truncate">Admin · dmops@socialdnalabs.com</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
