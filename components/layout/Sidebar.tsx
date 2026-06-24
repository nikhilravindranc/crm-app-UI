"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import {
  SquaresFour, Lightning, Handshake, AddressBook,
  Buildings, CheckCircle, ChatTeardropText, ChartBar, Gear, List, X,
} from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";
import { useTheme } from "@/components/ThemeContext";
import { useSidebar } from "@/components/SidebarContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { mobileOpen, closeMobile } = useSidebar();

  // Restore persisted collapse state (desktop only)
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    const isCollapsed = stored === "true";
    setCollapsed(isCollapsed);
    document.documentElement.style.setProperty("--sidebar-w", isCollapsed ? "80px" : "260px");
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { closeMobile(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      document.documentElement.style.setProperty("--sidebar-w", next ? "80px" : "260px");
      return next;
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      <aside
        className="crm-sidebar fixed left-0 top-0 h-screen flex flex-col z-50 select-none border-r overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: isDark ? "#000000" : "#E3ECFC",
          borderColor: isDark ? "#27272A" : "#E3ECFC",
          width: collapsed ? "80px" : "260px",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease",
        }}
        data-mobile-open={mobileOpen}
      >
        {/* ── Header: hamburger + logo ── */}
        <div className="flex items-center h-[72px] px-3 gap-3 flex-shrink-0" style={{ borderBottom: `1px solid ${isDark ? "#27272A" : "#D0DEFA"}` }}>
          {/* Desktop collapse toggle */}
          <button
            onClick={toggle}
            className={`hidden lg:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-lg transition-all duration-150 ${isDark ? "text-[#9CA3AF] hover:text-[#FAFAFA] hover:bg-[#262626]" : "text-slate-500 hover:bg-[#EFF6FF]"}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <List size={18} weight="bold" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={closeMobile}
            className={`flex lg:hidden flex-shrink-0 w-8 h-8 items-center justify-center rounded-lg transition-all duration-150 ${isDark ? "text-[#9CA3AF] hover:text-[#FAFAFA] hover:bg-[#262626]" : "text-slate-500 hover:bg-[#EFF6FF]"}`}
          >
            <X size={18} weight="bold" />
          </button>

          {!collapsed && (
            <img
              src="/logo.png"
              alt="Social DNA Labs"
              style={{ height: "32px", width: "auto", display: "block", flexShrink: 0 }}
            />
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ label, Icon, href, badge }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));

            const itemContent = (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center rounded-lg text-nav-item
                  transition-all duration-150 group relative
                  ${collapsed ? "justify-center w-12 h-12 mx-auto" : "gap-3 px-3 py-2.5 w-full"}
                  ${active
                    ? isDark ? "bg-[#18181B] text-[#FAFAFA]" : "bg-[#EFF6FF] text-[#1D4ED8]"
                    : isDark ? "text-[#9CA3AF] hover:bg-[#262626] hover:text-[#FAFAFA]" : "text-slate-600 hover:bg-[#EFF6FF]"
                  }
                `}
              >
                <Icon
                  size={18}
                  weight="duotone"
                  className={`flex-shrink-0 transition-colors ${active ? isDark ? "text-[#FAFAFA]" : "text-[#1D4ED8]" : isDark ? "text-[#9CA3AF] group-hover:text-[#FAFAFA]" : "text-slate-400"}`}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    {badge && !active && (
                      <span className={`text-badge-text px-1.5 py-0.5 rounded-full leading-none ${isDark ? "bg-[#27272A] text-[#A1A1AA]" : "bg-[#1D4ED8]/10 text-[#1D4ED8]"}`}>
                        {badge}
                      </span>
                    )}
                    {active && (
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-[#FAFAFA]" : "bg-[#1D4ED8]"}`} />
                    )}
                  </>
                )}

                {/* Badge dot on icon when collapsed */}
                {collapsed && badge && !active && (
                  <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4D4D8] border-2 ${isDark ? "border-[#000000]" : "border-white"}`} />
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
        <div className="px-2 pb-3 pt-2 space-y-0.5 flex-shrink-0" style={{ borderTop: `1px solid ${isDark ? "#27272A" : "#D0DEFA"}` }}>

          {/* Settings */}
          {collapsed ? (
            <Tooltip title="Settings" placement="right" arrow>
              <span className="flex justify-center">
                <Link
                  href="/settings"
                  className={`flex items-center justify-center w-12 h-12 mx-auto rounded-lg transition-all duration-150 ${isDark ? "text-[#9CA3AF] hover:text-[#FAFAFA] hover:bg-[#262626]" : "text-slate-400 hover:bg-[#EFF6FF]"}`}
                >
                  <Gear size={18} weight="duotone" />
                </Link>
              </span>
            </Tooltip>
          ) : (
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-nav-item transition-all duration-150 ${isDark ? "text-[#9CA3AF] hover:bg-[#262626] hover:text-[#FAFAFA]" : "text-slate-600 hover:bg-[#EFF6FF]"}`}
            >
              <Gear size={18} weight="duotone" className={`flex-shrink-0 ${isDark ? "text-[#9CA3AF]" : "text-slate-400"}`} />
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
                    sx={{ width: 34, height: 34, bgcolor: isDark ? "#27272A" : "#E3ECFC", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
                  >PM</Avatar>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 ${isDark ? "border-[#000000]" : "border-white"}`} />
                </div>
              </span>
            </Tooltip>
          ) : (
            <div className={`flex items-center gap-2.5 mt-1 px-3 py-2 rounded-lg border ${isDark ? "bg-[#18181B] border-[#27272A]" : "bg-[#EFF6FF] border-[#E3ECFC]"}`}>
              <div className="relative flex-shrink-0">
                <Avatar
                  src={OWNER_AVATARS["PM SDL"]}
                  sx={{ width: 30, height: 30, bgcolor: isDark ? "#27272A" : "#E3ECFC", fontSize: "0.6rem", fontWeight: 800 }}
                >PM</Avatar>
                <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 ${isDark ? "border-[#18181B]" : "border-white"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`m-0 text-[16px] leading-[22px] font-medium truncate ${isDark ? "text-[#FFFFFF]" : "text-[#0C2472]"}`}>PM SDL</p>
                <p className="m-0 text-caption text-slate-400 truncate">Admin · dmops@socialdnalabs.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

