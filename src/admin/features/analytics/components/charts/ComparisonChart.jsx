import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { clsx } from "clsx";

export function ComparisonChart({
  title,
  description,
  data,
  xAxisKey,
  bars,
  className,
  stacked = false,
}) {
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
            <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {bars.map((bar, idx) => {
                  const color = bar.color || defaultColors[idx % defaultColors.length];
                  return (
                    <linearGradient
                      key={`colorUv-${idx}`}
                      id={`colorUv-${idx}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
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
                cursor={{ fill: "currentColor", opacity: 0.05 }}
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

              {bars.map((bar, idx) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  name={bar.name || bar.dataKey}
                  fill={`url(#colorUv-${idx})`}
                  radius={stacked ? [0, 0, 0, 0] : [6, 6, 0, 0]}
                  stackId={stacked ? "a" : undefined}
                  maxBarSize={40}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Bar>
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
