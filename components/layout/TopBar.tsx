"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { MagnifyingGlass, Bell, Plus, Command, Sun, Moon, List } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";
import { useTheme } from "@/components/ThemeContext";
import { useSidebar } from "@/components/SidebarContext";

export default function TopBar({ title }: { title?: string }) {
  const [search, setSearch] = useState("");
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { openMobile } = useSidebar();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={`sticky top-0 z-40 border-b px-4 lg:px-8 py-3 lg:py-6 h-auto flex items-center gap-3 lg:gap-8 transition-colors duration-300 ${isDark ? "bg-[#0A0A0A] border-[#27272A]" : "bg-[#E3ECFC] border-[#E3ECFC]"}`}>

      {/* Mobile hamburger — hidden on desktop */}
      <button
        onClick={openMobile}
        className={`lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isDark ? "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#262626]" : "text-slate-500 hover:text-[#1D4ED8] hover:bg-[#EFF6FF]"}`}
        aria-label="Open navigation"
      >
        <List size={20} weight="bold" />
      </button>

      {/* Left — page title / date */}
      <div className="flex-1 min-w-0">
        {title ? (
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <h1 className={`text-[16px] lg:text-[18px] font-extrabold leading-none tracking-tight m-0 ${isDark ? "text-white" : "text-[#0C2472]"}`}>{title}</h1>
            <span className="hidden sm:inline text-[11.5px] text-slate-400 font-medium">· {today}</span>
          </div>
        ) : (
          <p className="hidden sm:block text-[12px] text-slate-400 font-medium whitespace-nowrap">{today}</p>
        )}
      </div>

      {/* Search — hidden on mobile, visible md+ */}
      <div className={`hidden md:flex items-center gap-2 border rounded-xl px-3 py-1.5 w-60 group transition-all ${isDark ? "bg-[#0A0A0A] border-[#27272A] focus-within:border-[#D4D4D8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_rgba(212,212,216,0.2)]" : "bg-[#f9fbff] border-[#E3ECFC] focus-within:border-[#1D4ED8] focus-within:border-2 focus-within:shadow-[0_0_0_2px_#4A7AE8]"}`}>
        <MagnifyingGlass size={15} color="#737373" weight="duotone" />
        <InputBase
          placeholder="Search leads, deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            fontSize: "0.78rem",
            color: isDark ? "#D4D4D8" : "#334155",
            "& input::placeholder": { color: "#94A3B8", opacity: 1 },
          }}
        />
        <Tooltip title="⌘K">
          <Command size={13} color="#E2E8F0" weight="duotone" />
        </Tooltip>
      </div>

      {/* New Deal — full button on md+, icon-only on mobile */}
      <Button
        variant="contained"
        size="small"
        startIcon={<Plus size={16} weight="duotone" />}
        sx={{
          bgcolor: isDark ? "#18181B" : "#1D4ED8",
          borderRadius: "9px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.78rem",
          px: { xs: 1, md: 2 },
          py: 0.9,
          minWidth: { xs: 36, md: "auto" },
          boxShadow: isDark ? "0 1px 4px 0 rgba(0,0,0,0.6)" : "0 1px 8px 0 #1D4ED833",
          whiteSpace: "nowrap",
          "& .MuiButton-startIcon": { mr: { xs: 0, md: 0.5 } },
          "&:hover":  { bgcolor: isDark ? "#27272A" : "#60A5FA", boxShadow: isDark ? "0 2px 8px 0 rgba(0,0,0,0.7)" : "0 2px 14px 0 #60A5FA55" },
          "&:active": { bgcolor: isDark ? "#3F3F46" : "#0C2472" },
        }}
      >
        <span className="hidden md:inline">New Deal</span>
      </Button>

      {/* Dark / Light toggle */}
      <Tooltip title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}>
        <IconButton
          onClick={toggle}
          size="small"
          sx={{
            borderRadius: "9px",
            border: `1.5px solid ${isDark ? "#27272A" : "#E3ECFC"}`,
            bgcolor: isDark ? "#0A0A0A" : "#f9fbff",
            "&:hover": { bgcolor: isDark ? "#18181B" : "#EFF6FF" },
            transition: "all 0.2s ease",
          }}
        >
          {isDark
            ? <Sun size={17} color="#FBBF24" weight="duotone" />
            : <Moon size={17} color="#64748B" weight="duotone" />
          }
        </IconButton>
      </Tooltip>

      {/* Notifications */}
      <Tooltip title="3 unread notifications">
        <IconButton size="small" sx={{ borderRadius: "8px", "&:hover": { bgcolor: isDark ? "#262626" : "#EFF6FF" } }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontSize: "0.58rem", height: 15, minWidth: 15, padding: "0 3px" } }}
          >
            <Bell size={20} color={isDark ? "#737373" : "#64748B"} weight="duotone" />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Avatar */}
      <Tooltip title="PM SDL — Admin">
        <Avatar
          src={OWNER_AVATARS["PM SDL"]}
          sx={{ width: 32, height: 32, bgcolor: isDark ? "#27272A" : "#1D4ED8", fontSize: "0.6rem", fontWeight: 800, cursor: "pointer" }}
          className={`ring-2 ring-transparent transition-all ${isDark ? "hover:ring-[#D4D4D8]" : "hover:ring-[#4A7AE8]"}`}
        >
          PM
        </Avatar>
      </Tooltip>
    </header>
  );
}

