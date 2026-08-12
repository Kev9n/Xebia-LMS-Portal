import React from "react";
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { clsx } from "clsx";

export function FunnelChartWrapper({
  title,
  description,
  data,
  dataKey = "value",
  nameKey = "name",
  className,
}) {
  // Chart Palette from Xebia
  const defaultColors = ["#01AC9F", "#FF6200", "#6C1D5F", "#5C4F61", "#91759E"];

  const chartData = data.map((item, idx) => ({
    ...item,
    fill: item.color || defaultColors[idx % defaultColors.length],
  }));

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
            <RechartsFunnelChart>
              <Tooltip
                cursor={{ fill: "currentColor", opacity: 0.05 }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  borderRadius: "1rem",
                  boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
                  color: "#111827",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
                itemStyle={{ fontSize: "13px", fontWeight: "800" }}
              />
              <Funnel dataKey={dataKey} data={chartData} isAnimationActive>
                <LabelList
                  position="right"
                  fill="currentColor"
                  stroke="none"
                  dataKey={nameKey}
                  style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.7 }}
                />
                <LabelList
                  position="inside"
                  fill="#fff"
                  stroke="none"
                  dataKey={dataKey}
                  style={{
                    fontSize: "14px",
                    fontWeight: "900",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                />
              </Funnel>
            </RechartsFunnelChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
