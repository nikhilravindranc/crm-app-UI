import type { Metadata } from "next";
import { Figtree, DM_Sans } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";

// ── Figtree: headings & eyebrows ──────────────────────────────────
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

// ── DM Sans: body, labels, descriptions ──────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social DNA Labs — CRM",
  description: "Customer Relationship Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${dmSans.variable}`}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
