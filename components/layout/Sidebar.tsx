"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  SquaresFourIcon, LightningIcon, HandshakeIcon, AddressBookIcon,
  BuildingsIcon, CheckCircleIcon, ChatTeardropTextIcon, ChartBarIcon,
  GearSixIcon, XIcon,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

const MOBILE_BP = 1024;

const navItems = [
  { label: "Dashboard",      Icon: SquaresFourIcon,      href: "/"         },
  { label: "Leads",          Icon: LightningIcon,        href: "/leads",   badge: 14 },
  { label: "Deals",          Icon: HandshakeIcon,        href: "/deals"    },
  { label: "Contacts",       Icon: AddressBookIcon,      href: "/contacts" },
  { label: "Accounts",       Icon: BuildingsIcon,        href: "/accounts" },
  { label: "Tasks",          Icon: CheckCircleIcon,      href: "/tasks",   badge: 7  },
  { label: "Customer Comms", Icon: ChatTeardropTextIcon, href: "/comms"    },
  { label: "Reports",        Icon: ChartBarIcon,         href: "/reports"  },
];

export default function Sidebar() {
  const pathname    = usePathname();
  const [isMobile,    setIsMobile]    = useState(false);
  const [collapsed,   setCollapsed]   = useState(false); // desktop
  const [drawerOpen,  setDrawerOpen]  = useState(false); // mobile
  const drawerRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    setCollapsed(stored === "true");

    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);

    const onMqChange = () => {
      setIsMobile(mq.matches);
      if (mq.matches) setDrawerOpen(false); // close when resizing to mobile
    };
    onMqChange();
    mq.addEventListener("change", onMqChange);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.action === "drawer") {
        // Mobile toggle
        const next = !drawerRef.current;
        drawerRef.current = next;
        setDrawerOpen(next);
      } else if (typeof detail.collapsed === "boolean") {
        // Desktop collapse
        setCollapsed(detail.collapsed);
      }
    };
    window.addEventListener("sidebar-toggle", handler);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("sidebar-toggle", handler);
    };
  }, []);

  const closeDrawer = () => {
    drawerRef.current = false;
    setDrawerOpen(false);
  };

  /* ═══════════════════════════════════════════
     MOBILE — overlay drawer
  ═══════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={closeDrawer}
          style={{
            position: "fixed", inset: 0, zIndex: 90,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(2px)",
            opacity: drawerOpen ? 1 : 0,
            pointerEvents: drawerOpen ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
        />

        {/* Drawer */}
        <aside
          style={{
            position: "fixed", top: 0, left: 0,
            width: "280px", height: "100vh",
            zIndex: 100,
            backgroundColor: "#EFF6FF",
            boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
            display: "flex", flexDirection: "column",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Header: close + brand */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E3ECFC]">
            <button
              onClick={closeDrawer}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#E3ECFC] transition-all duration-150 flex-shrink-0"
              aria-label="Close menu"
            >
              <XIcon size={18} weight="bold" />
            </button>

            <div className="flex items-center gap-2.5">
              {/* <div className="w-8 h-8 rounded-xl bg-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[11px] font-black tracking-tight">EQ</span>
              </div> */}
              <img
                src="/logo.png"
                alt="EVOQ CRM"
                style={{ height: "30px", width: "auto" }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {navItems.map(({ label, Icon, href, badge }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeDrawer}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium
                    transition-all duration-150 group
                    ${active
                      ? "bg-white text-[#1D4ED8]"
                      : "text-slate-600 hover:bg-white hover:text-[#1D4ED8]"
                    }
                  `}
                >
                  <Icon
                    size={19}
                    weight="duotone"
                    className={`flex-shrink-0 transition-colors ${active ? "text-[#1D4ED8]" : "text-slate-400 group-hover:text-[#1D4ED8]"}`}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {badge && !active && (
                    <span className="text-[10px] font-bold bg-[#1D4ED8]/10 text-[#1D4ED8] px-1.5 py-0.5 rounded-full leading-none">
                      {badge}
                    </span>
                  )}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: settings + profile */}
          <div className="px-3 pb-4 border-t border-[#E3ECFC] pt-3 space-y-0.5">
            <Link
              href="/settings"
              onClick={closeDrawer}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-600 hover:bg-white hover:text-[#1D4ED8] transition-all duration-150 group"
            >
              <GearSixIcon size={19} weight="duotone" className="text-slate-400 flex-shrink-0 group-hover:text-[#1D4ED8]" />
              Settings
            </Link>
            <div className="flex items-center gap-2.5 mt-1 px-3 py-2 rounded-xl bg-white border border-[#E3ECFC]">
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
          </div>
        </aside>
      </>
    );
  }

  /* ═══════════════════════════════════════════
     DESKTOP — persistent collapsible sidebar
  ═══════════════════════════════════════════ */
  return (
    <aside
      className="fixed left-0 flex flex-col z-50 select-none border-r border-[#E3ECFC] overflow-hidden"
      style={{
        top: "72px",
        height: "calc(100vh - 72px)",
        backgroundColor: "#E3ECFC",
        width: collapsed ? "68px" : "260px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Navigation */}
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
                ${collapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5 w-full"
                }
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
              {collapsed && badge && !active && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#1D4ED8] border-2 border-white" />
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

      {/* Bottom: Settings + Profile */}
      <div className="px-2 pb-3 border-t border-[#E3ECFC] pt-2 space-y-0.5 flex-shrink-0">
        {collapsed ? (
          <Tooltip title="Settings" placement="right" arrow>
            <span className="flex justify-center">
              <Link
                href="/settings"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-[#1D4ED8] hover:bg-[#EFF6FF] transition-all duration-150"
              >
                <GearSixIcon size={18} weight="duotone" />
              </Link>
            </span>
          </Tooltip>
        ) : (
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-all duration-150"
          >
            <GearSixIcon size={18} weight="duotone" className="text-slate-400 flex-shrink-0" />
            Settings
          </Link>
        )}

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
