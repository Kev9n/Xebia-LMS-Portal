import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const statusColors = {
  active: "bg-[#00A99D]/10 text-[#00A99D] border-[#00A99D]/20",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20",
  "at-risk": "bg-red-50 text-red-500 border-red-200",
};

export function UserDetailsDialog({ user, open, onOpenChange, type }) {
  if (!user) return null;

  return _jsx(Dialog, {
    open,
    onOpenChange,
    children: _jsxs(DialogContent, {
      className: "max-w-md border-0 bg-white shadow-xl",
      children: [
        _jsx(DialogHeader, {
          children: _jsx(DialogTitle, {
            className: "text-lg font-semibold text-[#000000]",
            children: "User Details",
          }),
        }),

        _jsxs("div", {
          className: "space-y-6",
          children: [
            /* Profile Section */
            _jsxs("div", {
              className: "flex items-center gap-4",
              children: [
                _jsx(Avatar, {
                  className: "h-14 w-14 border-2 border-[#6C1D5F]/10",
                  children: _jsx(AvatarFallback, {
                    className: "bg-[#6C1D5F]/8 text-base font-semibold text-[#6C1D5F]",
                    children: user.avatar || user.logo || user.name?.slice(0, 2),
                  }),
                }),
                _jsxs("div", {
                  children: [
                    _jsx("h3", {
                      className: "font-semibold text-[#000000]",
                      children: user.name,
                    }),
                    user.email &&
                      _jsx("p", {
                        className: "text-sm text-[#5A5A5A]",
                        children: user.email,
                      }),
                    user.location &&
                      _jsx("p", {
                        className: "text-sm text-[#5A5A5A]",
                        children: user.location,
                      }),
                    _jsx(Badge, {
                      variant: "outline",
                      className: `mt-1 text-[10px] font-medium uppercase ${statusColors[user.status] || ""}`,
                      children: user.status,
                    }),
                  ],
                }),
              ],
            }),

            _jsx(Separator, {}),

            /* Details Grid */
            _jsx("div", {
              className: "grid grid-cols-2 gap-4",
              children: (() => {
                const details = [];
                if (type === "universities") {
                  details.push(
                    { label: "Students", value: user.students?.toLocaleString() },
                    { label: "Courses", value: user.courses },
                  );
                } else if (type === "trainers") {
                  details.push(
                    { label: "Specialization", value: user.specialization, span: true },
                    { label: "Rating", value: `${user.rating} / 5.0` },
                    { label: "Courses", value: user.courses },
                    { label: "Students", value: user.students?.toLocaleString() },
                  );
                } else {
                  details.push(
                    { label: "University", value: user.university, span: true },
                    { label: "Courses Enrolled", value: user.coursesEnrolled },
                    { label: "Status", value: user.status },
                  );
                }
                return details.map((d) =>
                  _jsxs(
                    "div",
                    {
                      className: d.span ? "col-span-2" : "",
                      children: [
                        _jsx("p", {
                          className: "text-xs font-medium uppercase text-[#5A5A5A]",
                          children: d.label,
                        }),
                        _jsx("p", {
                          className: "mt-0.5 text-sm font-semibold text-[#000000]",
                          children: d.value,
                        }),
                      ],
                    },
                    d.label,
                  ),
                );
              })(),
            }),

            /* Progress (for students) */
            {
              ...(type === "students" && user.progress != null
                ? _jsxs("div", {
                    children: [
                      _jsxs("div", {
                        className: "flex items-center justify-between text-sm",
                        children: [
                          _jsx("span", {
                            className: "font-medium text-[#5A5A5A]",
                            children: "Overall Progress",
                          }),
                          _jsx("span", {
                            className: "font-semibold text-[#000000]",
                            children: `${user.progress}%`,
                          }),
                        ],
                      }),
                      _jsx(Progress, {
                        value: user.progress,
                        className: "mt-2 h-2 bg-[#EDEDED]",
                      }),
                    ],
                  })
                : _jsx("span", {})),
            },
          ],
        }),
      ],
    }),
  });
}
