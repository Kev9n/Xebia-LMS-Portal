import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserFilters({ onSearchChange, onStatusChange, onRoleChange, activeTab }) {
  return _jsxs("div", {
    className: "flex flex-col gap-3 sm:flex-row sm:items-center",
    children: [
      /* Search */
      _jsxs("div", {
        className: "relative flex-1",
        children: [
          _jsx(Search, {
            className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A5A]",
          }),
          _jsx(Input, {
            placeholder: `Search ${activeTab || "users"}...`,
            className:
              "h-10 border-[#EDEDED] bg-white pl-10 text-sm shadow-sm focus-visible:ring-[#6C1D5F]/30",
            onChange: (e) => onSearchChange?.(e.target.value),
          }),
        ],
      }),

      /* Status Filter */
      _jsxs(Select, {
        onValueChange: (value) => onStatusChange?.(value),
        defaultValue: "all",
        children: [
          _jsx(SelectTrigger, {
            className: "h-10 w-full border-[#EDEDED] bg-white shadow-sm sm:w-[150px]",
            children: _jsx(SelectValue, { placeholder: "Status" }),
          }),
          _jsxs(SelectContent, {
            children: [
              _jsx(SelectItem, { value: "all", children: "All Status" }),
              _jsx(SelectItem, { value: "active", children: "Active" }),
              _jsx(SelectItem, { value: "inactive", children: "Inactive" }),
              _jsx(SelectItem, { value: "pending", children: "Pending" }),
              _jsx(SelectItem, { value: "at-risk", children: "At Risk" }),
            ],
          }),
        ],
      }),
    ],
  });
}
