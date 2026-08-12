import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { UserPlus, BookPlus, ShieldCheck, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    title: "Add User",
    description: "Register a new student or trainer",
    icon: UserPlus,
    href: "/manager/users",
    color: "bg-[#6C1D5F]",
  },
  {
    title: "Create Course",
    description: "Set up a new learning course",
    icon: BookPlus,
    href: "/manager/users",
    color: "bg-[#8A177D]",
  },
  {
    title: "Review Approvals",
    description: "Pending items need your attention",
    icon: ShieldCheck,
    href: "/manager/approvals",
    color: "bg-[#FF6A00]",
  },
  {
    title: "View Reports",
    description: "Analytics and performance data",
    icon: BarChart3,
    href: "/manager/analytics",
    color: "bg-[#00A99D]",
  },
];

export function QuickActions() {
  return _jsxs(Card, {
    className: "border-0 bg-white shadow-sm",
    children: [
      _jsx(CardHeader, {
        className: "pb-3",
        children: _jsx(CardTitle, {
          className: "text-base font-semibold text-[#000000]",
          children: "Quick Actions",
        }),
      }),
      _jsx(CardContent, {
        children: _jsx("div", {
          className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
          children: actions.map((action, index) =>
            _jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.3, delay: index * 0.08 },
                children: _jsx(Link, {
                  to: action.href,
                  className: `
                    group flex items-center gap-4 rounded-xl border border-transparent
                    bg-[#EDEDED]/50 p-4 transition-all duration-200
                    hover:border-[#6C1D5F]/10 hover:bg-white hover:shadow-sm
                  `,
                  children: _jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [
                      _jsx("div", {
                        className: `
                          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                          ${action.color} transition-transform duration-200
                          group-hover:scale-105
                        `,
                        children: _jsx(action.icon, {
                          className: "h-5 w-5 text-white",
                        }),
                      }),
                      _jsxs("div", {
                        children: [
                          _jsx("p", {
                            className: "text-sm font-semibold text-[#000000]",
                            children: action.title,
                          }),
                          _jsx("p", {
                            className: "text-xs text-[#5A5A5A]",
                            children: action.description,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              },
              action.title,
            ),
          ),
        }),
      }),
    ],
  });
}
