"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const HEADING = "var(--font-heading), sans-serif";
const BODY    = "var(--font-body), system-ui, -apple-system, sans-serif";

// ── Brand tokens ────────────────────────────────────
const C = {
  depth:   "#0C2472",  // Sidebar bg, button pressed, dark badges
  primary: "#1D4ED8",  // Active nav, primary CTAs, focus border, links
  action:  "#3B82F6",  // Secondary buttons, info badges, helper text
  hover:   "#60A5FA",  // Button hover bg, nav hover, row hover (4%), link hover
  soft:    "#93C5FD",  // Focus rings, selected rows, tooltips
  tint:    "#E3ECFC",  // Form borders, section dividers, table header bg, card borders
  surface: "#EFF6FF",  // Form bg, table row bg, modal bg, default page bg
};

const theme = createTheme({
  palette: {
    primary:   { main: C.primary },
    secondary: { main: C.depth   },
    success:   { main: "#10B981" },
    warning:   { main: "#F59E0B" },
    error:     { main: "#EF4444" },
    background: {
      default: "#f9fbff",
      paper: "#f9fbff",
    },
  },
  typography: {
    fontFamily: BODY,
    h1: { fontFamily: HEADING, fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: HEADING, fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontFamily: HEADING, fontWeight: 600 },
    h4: { fontFamily: HEADING, fontWeight: 600 },
    h5: { fontFamily: HEADING, fontWeight: 600 },
    h6: { fontFamily: HEADING, fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },

  components: {
    // ── Buttons ────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          fontFamily: BODY,
          transition: "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
          padding: "10px 16px",
          fontSize: "0.875rem",
        },
        // Primary action buttons: default=Primary, hover=Hover, pressed=Depth
        containedPrimary: {
          backgroundColor: C.primary,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: C.hover,
            boxShadow: `0 4px 12px 0 ${C.primary}20`,
          },
          "&:active": {
            backgroundColor: C.depth,
            boxShadow: `0 1px 3px 0 ${C.depth}20`,
            transform: "scale(0.98)",
          },
          "&.Mui-disabled": {
            backgroundColor: C.tint,
            color: "#9CA3AF",
            boxShadow: "none",
          },
        },
        // Secondary / outlined buttons: border=light, text=Primary
        outlinedPrimary: {
          borderColor: "#E3ECFC",
          color: C.primary,
          backgroundColor: "#f9fbff",
          "&:hover": {
            borderColor: C.primary,
            backgroundColor: `${C.primary}08`,
            boxShadow: `0 1px 3px 0 ${C.primary}10`,
          },
          "&:active": {
            borderColor: C.primary,
            backgroundColor: `${C.primary}12`,
          },
          "&.Mui-disabled": {
            borderColor: "#E3ECFC",
            color: "#9CA3AF",
            backgroundColor: "transparent",
          },
        },
        // Text buttons
        textPrimary: {
          color: C.primary,
          "&:hover": { backgroundColor: C.surface, color: C.depth },
          "&:active": { color: C.depth },
        },
      },
    },

    // ── Form Inputs ────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.875rem",
          backgroundColor: "#f9fbff",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E3ECFC",
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D5DC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: C.primary,
            borderWidth: 1.5,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${C.soft}40`,
          },
          "&.Mui-disabled": {
            backgroundColor: "#EFF6FF",
            opacity: 1,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E3ECFC" },
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EF4444",
          },
        },
        input: { padding: "10px 12px" },
      },
    },

    MuiInputBase: {
      styleOverrides: { root: { fontFamily: BODY } },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.79rem",
          color: "#6B7280",
          "&.Mui-focused": { color: C.primary },
          "&.Mui-error":   { color: "#EF4444" },
        },
      },
    },

    // ── Select ─────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: BODY,
          fontSize: "0.875rem",
          padding: "10px 12px",
          backgroundColor: "#f9fbff",
          borderRadius: "8px",
        },
      },
    },

    // ── Chip / Badge ───────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: "0.75rem",
          backgroundColor: "#F0F1F3",
          color: C.depth,
          borderRadius: "6px",
          padding: "4px 8px",
        },
        colorPrimary: {
          backgroundColor: `${C.primary}15`,
          color: C.primary,
        },
      },
    },

    // ── Table ──────────────────────────────────────────
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          borderColor: "#E3ECFC",
          padding: "12px 16px",
          backgroundColor: "#f9fbff",
        },
        head: {
          fontFamily: HEADING,
          fontWeight: 700,
          color: C.depth,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          backgroundColor: "#EFF6FF",
          borderColor: "#E3ECFC",
        },
        body: {
          backgroundColor: "#f9fbff",
          "&:hover": {
            backgroundColor: `${C.primary}02`,
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover td": {
            backgroundColor: `${C.hover}0A`,  // Hover @ 4% opacity
          },
        },
      },
    },

    // ── Menu / MenuItem ────────────────────────────────
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: BODY,
          fontSize: "0.82rem",
          "&:hover": { backgroundColor: C.surface },
          "&.Mui-selected": {
            backgroundColor: `${C.primary}12`,
            color: C.primary,
            "&:hover": { backgroundColor: `${C.primary}1A` },
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: { primary: { fontFamily: BODY } },
    },

    // ── Checkbox ───────────────────────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#CBD5E1",
          "&.Mui-checked":                  { color: C.primary },
          "&.MuiCheckbox-indeterminate":    { color: C.primary },
          "&:hover": { backgroundColor: `${C.soft}20` },
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.depth,
          fontSize: "0.7rem",
          fontFamily: BODY,
          borderRadius: "8px",
          padding: "5px 10px",
        },
        arrow: { color: C.depth },
      },
    },

    // ── Dialog / Modal ─────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f9fbff",
          borderRadius: "16px",
          border: `1px solid #E3ECFC`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        },
      },
    },

    // ── Divider ────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.tint },
      },
    },

    // ── Badge ──────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        colorPrimary: { backgroundColor: C.primary },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
