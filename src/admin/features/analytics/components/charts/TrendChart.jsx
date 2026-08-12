import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { clsx } from "clsx";

export function TrendChart({ title, description, data, xAxisKey, lines, className }) {
  // Chart Palette from Xebia
  const defaultColors = ["#01AC9F", "#FF6200", "#6C1D5F", "#5C4F61", "#91759E"];

  return (
    <div
      className={clsx(
        "relative group glass rounded-2xl border border-white/20 dark:border-white/5 hover:border-primary/50 shadow-sm hover:shadow-glow hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-brand opacity-90" />

      <div className="px-6 pt-6 pb-4 shrink-0 relative z-10">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>

      <div className="px-6 pb-6 pt-0 flex-1 min-h-[280px] relative z-10">
        <div className="h-full w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {lines.map((line, idx) => {
                  const color = line.color || defaultColors[idx % defaultColors.length];
                  return (
                    <linearGradient
                      key={`colorUv-${idx}`}
                      id={`colorUv-${idx}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="opacity-10 dark:opacity-20"
              />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="opacity-50"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="opacity-50"
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "1rem",
                  boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
                  color: "#111827",
                  backdropFilter: "blur(16px)",
                }}
                itemStyle={{ fontSize: "13px", fontWeight: "800" }}
                labelStyle={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px", fontSize: "12px", fontWeight: "700" }}
                iconType="circle"
              />

              {lines.map((line, idx) => {
                const color = line.color || defaultColors[idx % defaultColors.length];
                return (
                  <Area
                    key={line.dataKey}
                    type="monotone"
                    dataKey={line.dataKey}
                    name={line.name || line.dataKey}
                    stroke={color}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill={`url(#colorUv-${idx})`}
                    activeDot={{ r: 6, strokeWidth: 2, fill: color, stroke: "#fff" }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
