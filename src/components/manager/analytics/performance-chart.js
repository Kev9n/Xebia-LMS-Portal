import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformanceData } from "@/lib/mock-data/manager-data";

const barColors = [
  "#6C1D5F",
  "#8A177D",
  "#4A1E47",
  "#00A99D",
  "#5B1E53",
  "#793B74",
  "#FF6A00",
  "#533754",
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return _jsxs("div", {
    className:
      "rounded-xl border border-[#EDEDED]/60 bg-white p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
    children: [
      _jsx("p", {
        className: "mb-2 text-xs font-bold text-[#5A5A5A] uppercase tracking-wider",
        children: label,
      }),
      _jsxs("p", {
        className: "text-sm font-medium text-[#5A5A5A] py-0.5",
        children: [
          "Avg. Score: ",
          _jsxs("span", {
            className: "font-bold text-[#000000]",
            children: [payload[0].value, "%"],
          }),
        ],
      }),
      _jsxs("p", {
        className: "text-sm font-medium text-[#5A5A5A] py-0.5",
        children: [
          "Students: ",
          _jsx("span", {
            className: "font-bold text-[#000000]",
            children: payload[0].payload.students.toLocaleString(),
          }),
        ],
      }),
    ],
  });
}

export function PerformanceChart() {
  const { data, isLoading } = usePerformanceData();

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.2 },
    children: _jsxs(Card, {
      className:
        "overflow-hidden rounded-2xl border border-[#EDEDED]/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
      children: [
        _jsx(CardHeader, {
          className: "border-b border-[#EDEDED]/40 bg-[#F7F7F8]/30 px-6 py-5",
          children: _jsx(CardTitle, {
            className: "text-[17px] font-bold text-[#000000]",
            children: "Top Performing Courses",
          }),
        }),
        _jsx(CardContent, {
          className: "p-6",
          children: isLoading
            ? _jsx(Skeleton, { className: "h-[320px] w-full rounded-xl" })
            : _jsx(ResponsiveContainer, {
                width: "100%",
                height: 320,
                children: _jsxs(BarChart, {
                  data,
                  margin: { top: 10, right: 10, left: -20, bottom: 0 },
                  children: [
                    _jsx(CartesianGrid, {
                      strokeDasharray: "4 4",
                      stroke: "#EDEDED",
                      vertical: false,
                    }),
                    _jsx(XAxis, {
                      dataKey: "course",
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: "#888888", fontSize: 11, fontWeight: 500 },
                      interval: 0,
                      angle: -15,
                      textAnchor: "end",
                      dy: 5,
                    }),
                    _jsx(YAxis, {
                      domain: [60, 100],
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: "#888888", fontSize: 12, fontWeight: 500 },
                      dx: -10,
                    }),
                    _jsx(Tooltip, {
                      content: _jsx(CustomTooltip, {}),
                      cursor: { fill: "#EDEDED", opacity: 0.4 },
                    }),
                    _jsx(Bar, {
                      dataKey: "avgScore",
                      radius: [8, 8, 0, 0],
                      maxBarSize: 45,
                      children: data?.map((_, i) =>
                        _jsx(Cell, { fill: barColors[i % barColors.length] }, i),
                      ),
                    }),
                  ],
                }),
              }),
        }),
      ],
    }),
  });
}
