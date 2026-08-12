import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, suffix = "", trend, icon: Icon, index = 0 }) {
  const isPositive = trend >= 0;

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: index * 0.1, ease: "easeOut" },
    children: _jsx(Card, {
      className: `
          group relative overflow-hidden border border-[#EDEDED]/60 bg-white
          rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]
          transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        `,
      children: _jsxs(CardContent, {
        className: "p-6",
        children: [
          /* Top row: icon + trend */
          _jsxs("div", {
            className: "flex items-start justify-between",
            children: [
              _jsx("div", {
                className: `
                    flex h-12 w-12 items-center justify-center rounded-2xl
                    bg-gradient-to-br from-[#6C1D5F]/10 to-[#6C1D5F]/5
                    transition-all duration-300 group-hover:scale-110 group-hover:from-[#6C1D5F]/15 group-hover:to-[#6C1D5F]/10
                  `,
                children: _jsx(Icon, {
                  className: "h-6 w-6 text-[#6C1D5F]",
                }),
              }),
              _jsxs("div", {
                className: `
                    flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide
                    ${isPositive ? "bg-[#00A99D]/10 text-[#00A99D]" : "bg-red-50 text-red-600"}
                  `,
                children: [
                  isPositive
                    ? _jsx(TrendingUp, { className: "h-3.5 w-3.5" })
                    : _jsx(TrendingDown, { className: "h-3.5 w-3.5" }),
                  _jsxs("span", {
                    children: [isPositive ? "+" : "", trend, "%"],
                  }),
                ],
              }),
            ],
          }),

          /* Value */
          _jsx("p", {
            className: "mt-5 text-[32px] font-extrabold tracking-tight text-[#000000]",
            children: typeof value === "number" ? value.toLocaleString() + suffix : value + suffix,
          }),

          /* Label */
          _jsx("p", {
            className: "mt-1 text-sm font-medium text-[#5A5A5A]",
            children: label,
          }),

          /* Decorative gradient bar */
          _jsx("div", {
            className: `
                absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r
                from-[#6C1D5F] via-[#8A177D] to-[#00A99D]
                opacity-0 transition-opacity duration-300 group-hover:opacity-100
              `,
          }),
        ],
      }),
    }),
  });
}
