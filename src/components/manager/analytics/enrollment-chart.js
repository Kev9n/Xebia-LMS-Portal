import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrollmentData } from "@/lib/mock-data/manager-data";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return _jsxs("div", {
    className:
      "rounded-xl border border-[#EDEDED]/60 bg-white p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
    children: [
      _jsx("p", {
        className: "mb-2.5 text-xs font-bold text-[#5A5A5A] uppercase tracking-wider",
        children: label,
      }),
      ...payload.map((item, i) =>
        _jsxs(
          "div",
          {
            className: "flex items-center gap-2.5 py-0.5",
            children: [
              _jsx("div", {
                className: "h-2 w-2 rounded-full",
                style: { backgroundColor: item.color },
              }),
              _jsxs("span", {
                className: "text-sm font-medium text-[#5A5A5A]",
                children: [item.name, ": "],
              }),
              _jsx("span", {
                className: "text-sm font-bold text-[#000000] ml-auto",
                children: item.value.toLocaleString(),
              }),
            ],
          },
          i,
        ),
      ),
    ],
  });
}

export function EnrollmentChart({ compact = false }) {
  const { data, isLoading } = useEnrollmentData();

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    children: _jsxs(Card, {
      className:
        "overflow-hidden rounded-2xl border border-[#EDEDED]/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
      children: [
        _jsx(CardHeader, {
          className: "border-b border-[#EDEDED]/40 bg-[#F7F7F8]/30 px-6 py-5",
          children: _jsx(CardTitle, {
            className: "text-[17px] font-bold text-[#000000]",
            children: "Enrollment & Completion Trends",
          }),
        }),
        _jsx(CardContent, {
          className: "p-6",
          children: isLoading
            ? _jsx(Skeleton, {
                className: `w-full rounded-xl ${compact ? "h-[200px]" : "h-[320px]"}`,
              })
            : _jsx(ResponsiveContainer, {
                width: "100%",
                height: compact ? 200 : 320,
                children: _jsxs(AreaChart, {
                  data,
                  margin: { top: 10, right: 10, left: -20, bottom: 0 },
                  children: [
                    _jsx("defs", {
                      children: [
                        _jsxs("linearGradient", {
                          id: "enrollGradient",
                          x1: "0",
                          y1: "0",
                          x2: "0",
                          y2: "1",
                          children: [
                            _jsx("stop", { offset: "5%", stopColor: "#6C1D5F", stopOpacity: 0.25 }),
                            _jsx("stop", { offset: "95%", stopColor: "#6C1D5F", stopOpacity: 0.0 }),
                          ],
                        }),
                        _jsxs("linearGradient", {
                          id: "completeGradient",
                          x1: "0",
                          y1: "0",
                          x2: "0",
                          y2: "1",
                          children: [
                            _jsx("stop", { offset: "5%", stopColor: "#00A99D", stopOpacity: 0.25 }),
                            _jsx("stop", { offset: "95%", stopColor: "#00A99D", stopOpacity: 0.0 }),
                          ],
                        }),
                      ],
                    }),
                    _jsx(CartesianGrid, {
                      strokeDasharray: "4 4",
                      stroke: "#EDEDED",
                      vertical: false,
                    }),
                    _jsx(XAxis, {
                      dataKey: "month",
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: "#888888", fontSize: 12, fontWeight: 500 },
                      dy: 10,
                    }),
                    _jsx(YAxis, {
                      axisLine: false,
                      tickLine: false,
                      tick: { fill: "#888888", fontSize: 12, fontWeight: 500 },
                      dx: -10,
                    }),
                    _jsx(Tooltip, {
                      content: _jsx(CustomTooltip, {}),
                      cursor: { stroke: "#EDEDED", strokeWidth: 2, strokeDasharray: "4 4" },
                    }),
                    !compact &&
                      _jsx(Legend, {
                        wrapperStyle: {
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#5A5A5A",
                          paddingTop: "20px",
                        },
                        iconType: "circle",
                      }),
                    _jsx(Area, {
                      type: "monotone",
                      dataKey: "enrollments",
                      name: "Enrollments",
                      stroke: "#6C1D5F",
                      strokeWidth: 3,
                      fill: "url(#enrollGradient)",
                      activeDot: { r: 6, strokeWidth: 0, fill: "#6C1D5F" },
                    }),
                    _jsx(Area, {
                      type: "monotone",
                      dataKey: "completions",
                      name: "Completions",
                      stroke: "#00A99D",
                      strokeWidth: 3,
                      fill: "url(#completeGradient)",
                      activeDot: { r: 6, strokeWidth: 0, fill: "#00A99D" },
                    }),
                  ],
                }),
              }),
        }),
      ],
    }),
  });
}
