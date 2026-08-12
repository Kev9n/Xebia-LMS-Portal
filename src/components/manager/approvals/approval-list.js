import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, ListFilter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApprovalCard } from "./approval-card";
import { useApprovals, useUpdateApproval } from "@/lib/mock-data/manager-data";
import { toast } from "sonner";

export function ApprovalList() {
  const [filter, setFilter] = useState("all");
  const { data: approvals, isLoading } = useApprovals();
  const updateApproval = useUpdateApproval();

  const handleApprove = (id) => {
    updateApproval.mutate(
      { id, status: "approved" },
      { onSuccess: () => toast.success("Request approved successfully") },
    );
  };

  const handleReject = (id) => {
    updateApproval.mutate(
      { id, status: "rejected" },
      { onSuccess: () => toast.success("Request rejected") },
    );
  };

  const filteredApprovals = approvals
    ? filter === "all"
      ? approvals
      : approvals.filter((a) => a.status === filter)
    : [];

  const counts = approvals
    ? {
        all: approvals.length,
        pending: approvals.filter((a) => a.status === "pending").length,
        approved: approvals.filter((a) => a.status === "approved").length,
        rejected: approvals.filter((a) => a.status === "rejected").length,
      }
    : { all: 0, pending: 0, approved: 0, rejected: 0 };

  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    className: "space-y-6",
    children: [
      /* Summary Stats */
      _jsx("div", {
        className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
        children: [
          {
            label: "Total Requests",
            value: counts.all,
            icon: ListFilter,
            color: "text-[#6C1D5F]",
            bg: "bg-[#6C1D5F]/8",
          },
          {
            label: "Pending",
            value: counts.pending,
            icon: Clock,
            color: "text-[#FF6A00]",
            bg: "bg-[#FF6A00]/8",
          },
          {
            label: "Approved",
            value: counts.approved,
            icon: CheckCircle2,
            color: "text-[#00A99D]",
            bg: "bg-[#00A99D]/8",
          },
          {
            label: "Rejected",
            value: counts.rejected,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((stat) =>
          _jsx(
            Card,
            {
              className: "border-0 bg-white shadow-sm",
              children: _jsxs(CardContent, {
                className: "flex items-center gap-3 p-4",
                children: [
                  _jsx("div", {
                    className: `flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`,
                    children: _jsx(stat.icon, { className: `h-5 w-5 ${stat.color}` }),
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("p", {
                        className: "text-2xl font-bold text-[#000000]",
                        children: isLoading ? "—" : stat.value,
                      }),
                      _jsx("p", {
                        className: "text-xs text-[#5A5A5A]",
                        children: stat.label,
                      }),
                    ],
                  }),
                ],
              }),
            },
            stat.label,
          ),
        ),
      }),

      /* Tabs */
      _jsxs(Tabs, {
        value: filter,
        onValueChange: setFilter,
        children: [
          _jsxs(TabsList, {
            className: "h-11 bg-[#EDEDED] p-1",
            children: [
              _jsxs(TabsTrigger, {
                value: "all",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#6C1D5F] data-[state=active]:shadow-sm",
                children: ["All (", counts.all, ")"],
              }),
              _jsxs(TabsTrigger, {
                value: "pending",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#FF6A00] data-[state=active]:shadow-sm",
                children: ["Pending (", counts.pending, ")"],
              }),
              _jsxs(TabsTrigger, {
                value: "approved",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#00A99D] data-[state=active]:shadow-sm",
                children: ["Approved (", counts.approved, ")"],
              }),
              _jsxs(TabsTrigger, {
                value: "rejected",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow-sm",
                children: ["Rejected (", counts.rejected, ")"],
              }),
            ],
          }),

          _jsx("div", {
            className: "mt-4",
            children: isLoading
              ? _jsx("div", {
                  className: "space-y-3",
                  children: Array.from({ length: 4 }).map((_, i) =>
                    _jsx(Skeleton, { className: "h-28 w-full rounded-xl" }, i),
                  ),
                })
              : _jsx(AnimatePresence, {
                  mode: "popLayout",
                  children:
                    filteredApprovals.length === 0
                      ? _jsx(motion.div, {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          className: "rounded-xl bg-white p-12 text-center shadow-sm",
                          children: _jsxs("div", {
                            children: [
                              _jsx(CheckCircle2, {
                                className: "mx-auto h-12 w-12 text-[#00A99D]/40",
                              }),
                              _jsx("p", {
                                className: "mt-3 text-sm font-medium text-[#5A5A5A]",
                                children: "No approvals in this category",
                              }),
                            ],
                          }),
                        })
                      : _jsx("div", {
                          className: "space-y-3",
                          children: filteredApprovals.map((approval, index) =>
                            _jsx(
                              ApprovalCard,
                              {
                                approval,
                                onApprove: handleApprove,
                                onReject: handleReject,
                                index,
                              },
                              approval.id,
                            ),
                          ),
                        }),
                }),
          }),
        ],
      }),
    ],
  });
}
