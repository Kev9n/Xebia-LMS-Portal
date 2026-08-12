import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollmentChart } from "./enrollment-chart";
import { CompletionChart } from "./completion-chart";
import { PerformanceChart } from "./performance-chart";

const summaryStats = [
  {
    label: "Total Enrollments",
    value: "9,360",
    icon: Users,
    color: "text-[#6C1D5F]",
    bg: "bg-[#6C1D5F]/8",
  },
  {
    label: "Avg. Completion Time",
    value: "4.2 wks",
    icon: Clock,
    color: "text-[#00A99D]",
    bg: "bg-[#00A99D]/8",
  },
  {
    label: "Avg. Score",
    value: "84.8%",
    icon: Award,
    color: "text-[#FF6A00]",
    bg: "bg-[#FF6A00]/8",
  },
  {
    label: "Growth Rate",
    value: "+18.3%",
    icon: TrendingUp,
    color: "text-[#8A177D]",
    bg: "bg-[#8A177D]/8",
  },
];

export function AnalyticsGrid() {
  return _jsxs(motion.div, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
    className: "space-y-6",
    children: [
      /* Summary Cards */
      _jsx("div", {
        className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
        children: summaryStats.map((stat, index) =>
          _jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: index * 0.08 },
              children: _jsx(Card, {
                className: "border-0 bg-white shadow-sm",
                children: _jsxs(CardContent, {
                  className: "flex items-center gap-3 p-4",
                  children: [
                    _jsx("div", {
                      className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`,
                      children: _jsx(stat.icon, { className: `h-5 w-5 ${stat.color}` }),
                    }),
                    _jsxs("div", {
                      children: [
                        _jsx("p", {
                          className: "text-xl font-bold text-[#000000]",
                          children: stat.value,
                        }),
                        _jsx("p", {
                          className: "text-xs text-[#5A5A5A]",
                          children: stat.label,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            },
            stat.label,
          ),
        ),
      }),

      /* Charts Grid */
      _jsx(EnrollmentChart, {}),

      _jsxs("div", {
        className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
        children: [_jsx(CompletionChart, {}), _jsx(PerformanceChart, {})],
      }),
    ],
  });
}
