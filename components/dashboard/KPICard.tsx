"use client";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: ReactNode;
  fill: string;          // soft pastel card background
  spark: string;         // deeper coordinating shade for the sparkline
  sparkData: number[];
}

export default function KPICard({
  title,
  value,
  trend,
  icon,
  fill,
  spark,
  sparkData,
}: KPICardProps) {
  const isPositive = trend >= 0;

  const W = 76;
  const H = 30;
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const range = max - min || 1;

  const coords = sparkData.map((d, i) => ({
    x: (i / (sparkData.length - 1)) * W,
    y: H - ((d - min) / range) * (H - 5) - 2,
  }));

  const linePts = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPts = [
    `0,${H}`,
    ...coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`),
    `${W},${H}`,
  ].join(" ");

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default"
      style={{ backgroundColor: fill, boxShadow: "0 6px 24px rgba(15,23,42,0.06)" }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* ── Left: label + value + badge ── */}
        <div className="flex-1 min-w-0">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] mb-2 truncate text-[#4A5675]">
            {title}
          </p>
          <p className="text-[28px] font-extrabold tracking-tight leading-none mb-3 text-[#0C2472]">
            {value}
          </p>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f9fbff]/70 ${
            isPositive ? "text-emerald-700" : "text-red-600"
          }`}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}% vs last month
          </span>
        </div>

        {/* ── Right: icon + sparkline ── */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f9fbff]/70 text-[#0C2472]">
            {icon}
          </div>

          <svg width={W} height={H} style={{ display: "block" }}>
            <polygon points={areaPts} fill={spark} fillOpacity={0.14} />
            <polyline
              points={linePts}
              fill="none"
              stroke={spark}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={coords[coords.length - 1].x.toFixed(1)}
              cy={coords[coords.length - 1].y.toFixed(1)}
              r="2.5"
              fill={spark}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
