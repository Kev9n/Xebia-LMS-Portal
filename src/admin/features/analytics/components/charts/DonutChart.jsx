import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { clsx } from "clsx";

export function DonutChart({
  title,
  description,
  data,
  dataKey = "value",
  nameKey = "name",
  className,
}) {
  // Chart Palette from Xebia
  const defaultColors = [
    "#5C4F61",
    "#855889",
    "#533754",
    "#91759E",
    "#4A1E47",
    "#B8AFCF",
    "#D3CCEC",
    "#6C1D5F",
  ];

  return (
    <div
      className={clsx(
        "relative group glass rounded-2xl border border-white/20 dark:border-white/5 hover:border-primary/50 shadow-sm hover:shadow-glow hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-brand opacity-90" />

      <div className="px-6 pt-6 pb-2 relative z-10">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>

      <div className="px-6 pb-6 pt-2 flex-1 relative z-10">
        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                {data.map((entry, index) => {
                  const color = entry.color || defaultColors[index % defaultColors.length];
                  return (
                    <linearGradient
                      key={`grad-${index}`}
                      id={`colorUv-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={1} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.7} />
                    </linearGradient>
                  );
                })}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.25" />
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey={dataKey}
                nameKey={nameKey}
                stroke="none"
                style={{ filter: "url(#shadow)" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#colorUv-${index})`}
                    className="hover:opacity-80 transition-opacity outline-none cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "1rem",
                  boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
                  color: "#111827",
                  backdropFilter: "blur(16px)",
                }}
                itemStyle={{ fontSize: "13px", fontWeight: "800" }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", fontWeight: "700", paddingTop: "15px" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
