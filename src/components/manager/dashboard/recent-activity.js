import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Star,
  AlertTriangle,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecentActivity } from "@/lib/mock-data/manager-data";
import { Skeleton } from "@/components/ui/skeleton";

const iconComponentMap = {
  "user-plus": UserPlus,
  "check-circle": CheckCircle2,
  "shield-check": ShieldCheck,
  star: Star,
  "alert-triangle": AlertTriangle,
  "message-square": MessageSquare,
  trophy: Trophy,
};

const typeColorMap = {
  enrollment: "bg-[#6C1D5F]/10 text-[#6C1D5F]",
  completion: "bg-[#00A99D]/10 text-[#00A99D]",
  approval: "bg-[#8A177D]/10 text-[#8A177D]",
  feedback: "bg-blue-50 text-blue-600",
  alert: "bg-[#FF6A00]/10 text-[#FF6A00]",
};

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity();

  return _jsxs(Card, {
    className: "border-0 bg-white shadow-sm",
    children: [
      _jsx(CardHeader, {
        className: "pb-3",
        children: _jsx(CardTitle, {
          className: "text-base font-semibold text-[#000000]",
          children: "Recent Activity",
        }),
      }),
      _jsx(CardContent, {
        className: "p-0",
        children: _jsx(ScrollArea, {
          className: "h-[400px] px-6 pb-4",
          children: isLoading
            ? _jsx("div", {
                className: "space-y-4",
                children: Array.from({ length: 6 }).map((_, i) =>
                  _jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i),
                ),
              })
            : _jsx("div", {
                className: "space-y-1",
                children: activities.map((activity, index) => {
                  const IconComp = iconComponentMap[activity.icon] || CheckCircle2;
                  const colorClass = typeColorMap[activity.type] || typeColorMap.enrollment;

                  return _jsx(
                    motion.div,
                    {
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      transition: { duration: 0.3, delay: index * 0.05 },
                      children: _jsxs("div", {
                        className: `
                          flex items-start gap-3 rounded-lg p-3 transition-colors
                          hover:bg-[#EDEDED]/60
                        `,
                        children: [
                          _jsx("div", {
                            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`,
                            children: _jsx(IconComp, { className: "h-4 w-4" }),
                          }),
                          _jsxs("div", {
                            className: "min-w-0 flex-1",
                            children: [
                              _jsx("p", {
                                className: "text-sm text-[#000000] leading-snug",
                                children: activity.message,
                              }),
                              _jsx("p", {
                                className: "mt-0.5 text-xs text-[#5A5A5A]",
                                children: activity.time,
                              }),
                            ],
                          }),
                        ],
                      }),
                    },
                    activity.id,
                  );
                }),
              }),
        }),
      }),
    ],
  });
}
