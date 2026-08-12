import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompletionData } from "@/lib/mock-data/manager-data";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pct = Math.round((d.completed / d.total) * 100);
  return _jsxs("div", {
    className:
      "rounded-xl border border-[#EDEDED]/60 bg-white p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
    children: [
      _jsx("p", {
        className: "mb-1.5 text-xs font-bold text-[#5A5A5A] uppercase tracking-wider",
        children: d.category,
      }),
      _jsxs("p", {
        className: "text-sm font-medium text-[#000000]",
        children: [
          d.completed,
          " / ",
          d.total,
          " completed (",
          _jsx("span", { className: "font-bold text-[#6C1D5F]", children: pct + "%" }),
          ")",
        ],
      }),
    ],
  });
}

function CustomLegend({ payload }) {
  return _jsx("div", {
    className: "mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2",
    children: payload?.map((entry, i) =>
      _jsxs(
        "div",
        {
          className: "flex items-center gap-2",
          children: [
            _jsx("div", {
              className: "h-3 w-3 rounded-full",
              style: { backgroundColor: entry.color },
            }),
            _jsx("span", {
              className: "text-[13px] font-medium text-[#5A5A5A]",
              children: entry.value,
            }),
          ],
        },
        i,
      ),
    ),
  });
}

export function CompletionChart() {
  const { data, isLoading } = useCompletionData();

  const pieData = data?.map((d) => ({
    ...d,
    name: d.category,
    value: d.completed,
  }));

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1 },
    children: _jsxs(Card, {
      className:
        "overflow-hidden rounded-2xl border border-[#EDEDED]/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
      children: [
        _jsx(CardHeader, {
          className: "border-b border-[#EDEDED]/40 bg-[#F7F7F8]/30 px-6 py-5",
          children: _jsx(CardTitle, {
            className: "text-[17px] font-bold text-[#000000]",
            children: "Completion by Category",
          }),
        }),
        _jsx(CardContent, {
          className: "p-6",
          children: isLoading
            ? _jsx(Skeleton, { className: "mx-auto h-[320px] w-full rounded-xl" })
            : _jsx(ResponsiveContainer, {
                width: "100%",
                height: 320,
                children: _jsxs(PieChart, {
                  children: [
                    _jsx(Pie, {
                      data: pieData,
                      cx: "50%",
                      cy: "45%",
                      innerRadius: 70,
                      outerRadius: 115,
                      paddingAngle: 4,
                      dataKey: "value",
                      stroke: "none",
                      children: pieData.map((entry, i) => _jsx(Cell, { fill: entry.color }, i)),
                    }),
                    _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
                    _jsx(Legend, { content: _jsx(CustomLegend, {}) }),
                  ],
                }),
              }),
        }),
      ],
    }),
  });
}
