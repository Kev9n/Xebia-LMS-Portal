import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusConfig = {
  pending: {
    color: "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20",
    icon: Clock,
    label: "Pending",
  },
  approved: {
    color: "bg-[#00A99D]/10 text-[#00A99D] border-[#00A99D]/20",
    icon: Check,
    label: "Approved",
  },
  rejected: { color: "bg-red-50 text-red-500 border-red-200", icon: X, label: "Rejected" },
};

const priorityConfig = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20",
  low: "bg-blue-50 text-blue-600 border-blue-200",
};

export function ApprovalCard({ approval, onApprove, onReject, index = 0 }) {
  const status = statusConfig[approval.status] || statusConfig.pending;
  const isPending = approval.status === "pending";
  const dateStr = new Date(approval.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20, height: 0 },
    transition: { duration: 0.3, delay: index * 0.05 },
    layout: true,
    children: _jsx(Card, {
      className: `
          border-0 bg-white shadow-sm transition-all duration-200
          hover:shadow-md ${isPending ? "border-l-[3px] border-l-[#FF6A00]" : ""}
        `,
      children: _jsx(CardContent, {
        className: "p-5",
        children: _jsxs("div", {
          className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
          children: [
            /* Left: Info */
            _jsxs("div", {
              className: "flex items-start gap-4 flex-1",
              children: [
                _jsx(Avatar, {
                  className: "h-10 w-10 shrink-0 border border-[#EDEDED]",
                  children: _jsx(AvatarFallback, {
                    className: "bg-[#6C1D5F]/8 text-xs font-semibold text-[#6C1D5F]",
                    children: approval.requesterAvatar,
                  }),
                }),
                _jsxs("div", {
                  className: "min-w-0 flex-1",
                  children: [
                    _jsxs("div", {
                      className: "flex flex-wrap items-center gap-2",
                      children: [
                        _jsx("h4", {
                          className: "text-sm font-semibold text-[#000000]",
                          children: approval.type,
                        }),
                        _jsx(Badge, {
                          variant: "outline",
                          className: `text-[10px] font-medium ${priorityConfig[approval.priority] || ""}`,
                          children: approval.priority,
                        }),
                        _jsx(Badge, {
                          variant: "outline",
                          className: `text-[10px] font-medium uppercase ${status.color}`,
                          children: status.label,
                        }),
                      ],
                    }),
                    _jsx("p", {
                      className: "mt-1 text-sm text-[#5A5A5A]",
                      children: approval.description,
                    }),
                    _jsxs("p", {
                      className: "mt-1 text-xs text-[#5A5A5A]/70",
                      children: [
                        "Requested by ",
                        _jsx("span", {
                          className: "font-medium text-[#5A5A5A]",
                          children: approval.requester,
                        }),
                        " · ",
                        dateStr,
                      ],
                    }),
                  ],
                }),
              ],
            }),

            /* Right: Actions */
            isPending &&
              _jsxs("div", {
                className: "flex shrink-0 gap-2",
                children: [
                  _jsxs(Button, {
                    size: "sm",
                    className: "bg-[#00A99D] text-white hover:bg-[#00A99D]/90 shadow-sm",
                    onClick: () => onApprove?.(approval.id),
                    children: [_jsx(Check, { className: "mr-1.5 h-3.5 w-3.5" }), "Approve"],
                  }),
                  _jsxs(Button, {
                    size: "sm",
                    variant: "outline",
                    className: "border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600",
                    onClick: () => onReject?.(approval.id),
                    children: [_jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }), "Reject"],
                  }),
                ],
              }),
          ],
        }),
      }),
    }),
  });
}
