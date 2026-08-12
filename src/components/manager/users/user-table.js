import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFilters } from "./user-filters";
import { UserDetailsDialog } from "./user-details-dialog";
import { useUniversities, useTrainers, useStudents } from "@/lib/mock-data/manager-data";

const statusColors = {
  active: "bg-[#00A99D]/10 text-[#00A99D] border-[#00A99D]/20",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20",
  "at-risk": "bg-red-50 text-red-500 border-red-200",
};

export function UserTable() {
  const [activeTab, setActiveTab] = useState("universities");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: universities, isLoading: uniLoading } = useUniversities();
  const { data: trainersData, isLoading: trainerLoading } = useTrainers();
  const { data: studentsData, isLoading: studentLoading } = useStudents();

  const filterData = (data) => {
    if (!data) return [];
    let filtered = data;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.university?.toLowerCase().includes(q) ||
          item.specialization?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    return filtered;
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    children: [
      _jsxs(Tabs, {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "space-y-5",
        children: [
          _jsxs(TabsList, {
            className: "h-11 bg-[#EDEDED] p-1",
            children: [
              _jsx(TabsTrigger, {
                value: "universities",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#6C1D5F] data-[state=active]:shadow-sm",
                children: "Universities",
              }),
              _jsx(TabsTrigger, {
                value: "trainers",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#6C1D5F] data-[state=active]:shadow-sm",
                children: "Trainers",
              }),
              _jsx(TabsTrigger, {
                value: "students",
                className:
                  "text-sm data-[state=active]:bg-white data-[state=active]:text-[#6C1D5F] data-[state=active]:shadow-sm",
                children: "Students",
              }),
            ],
          }),

          /* Filters */
          _jsx(UserFilters, {
            activeTab,
            onSearchChange: setSearch,
            onStatusChange: setStatusFilter,
          }),

          /* Universities Tab */
          _jsx(TabsContent, {
            value: "universities",
            children: _jsx(Card, {
              className: "border-0 bg-white shadow-sm",
              children: _jsx(CardContent, {
                className: "p-0",
                children: uniLoading
                  ? _jsx(TableSkeleton, { cols: 5 })
                  : _jsx(Table, {
                      children: [
                        _jsx(TableHeader, {
                          children: _jsxs(TableRow, {
                            className: "border-[#EDEDED] hover:bg-transparent",
                            children: [
                              _jsx(TableHead, {
                                className: "pl-6 font-semibold text-[#5A5A5A]",
                                children: "University",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Location",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Students",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Courses",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Status",
                              }),
                            ],
                          }),
                        }),
                        _jsx(TableBody, {
                          children: filterData(universities).map((uni) =>
                            _jsxs(
                              TableRow,
                              {
                                className:
                                  "cursor-pointer border-[#EDEDED] transition-colors hover:bg-[#EDEDED]/40",
                                onClick: () => handleRowClick(uni),
                                children: [
                                  _jsx(TableCell, {
                                    className: "pl-6",
                                    children: _jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        _jsx(Avatar, {
                                          className: "h-9 w-9 border border-[#EDEDED]",
                                          children: _jsx(AvatarFallback, {
                                            className:
                                              "bg-[#6C1D5F]/8 text-xs font-semibold text-[#6C1D5F]",
                                            children: uni.logo,
                                          }),
                                        }),
                                        _jsx("span", {
                                          className: "font-medium text-[#000000]",
                                          children: uni.name,
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx(TableCell, {
                                    className: "text-[#5A5A5A]",
                                    children: uni.location,
                                  }),
                                  _jsx(TableCell, {
                                    className: "font-medium",
                                    children: uni.students.toLocaleString(),
                                  }),
                                  _jsx(TableCell, {
                                    className: "font-medium",
                                    children: uni.courses,
                                  }),
                                  _jsx(TableCell, {
                                    children: _jsx(Badge, {
                                      variant: "outline",
                                      className: `text-[10px] font-medium uppercase ${statusColors[uni.status] || ""}`,
                                      children: uni.status,
                                    }),
                                  }),
                                ],
                              },
                              uni.id,
                            ),
                          ),
                        }),
                      ],
                    }),
              }),
            }),
          }),

          /* Trainers Tab */
          _jsx(TabsContent, {
            value: "trainers",
            children: _jsx(Card, {
              className: "border-0 bg-white shadow-sm",
              children: _jsx(CardContent, {
                className: "p-0",
                children: trainerLoading
                  ? _jsx(TableSkeleton, { cols: 6 })
                  : _jsx(Table, {
                      children: [
                        _jsx(TableHeader, {
                          children: _jsxs(TableRow, {
                            className: "border-[#EDEDED] hover:bg-transparent",
                            children: [
                              _jsx(TableHead, {
                                className: "pl-6 font-semibold text-[#5A5A5A]",
                                children: "Trainer",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Specialization",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Rating",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Courses",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Students",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Status",
                              }),
                            ],
                          }),
                        }),
                        _jsx(TableBody, {
                          children: filterData(trainersData).map((trainer) =>
                            _jsxs(
                              TableRow,
                              {
                                className:
                                  "cursor-pointer border-[#EDEDED] transition-colors hover:bg-[#EDEDED]/40",
                                onClick: () => handleRowClick(trainer),
                                children: [
                                  _jsx(TableCell, {
                                    className: "pl-6",
                                    children: _jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        _jsx(Avatar, {
                                          className: "h-9 w-9 border border-[#EDEDED]",
                                          children: _jsx(AvatarFallback, {
                                            className:
                                              "bg-[#8A177D]/8 text-xs font-semibold text-[#8A177D]",
                                            children: trainer.avatar,
                                          }),
                                        }),
                                        _jsxs("div", {
                                          children: [
                                            _jsx("p", {
                                              className: "font-medium text-[#000000]",
                                              children: trainer.name,
                                            }),
                                            _jsx("p", {
                                              className: "text-xs text-[#5A5A5A]",
                                              children: trainer.email,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx(TableCell, {
                                    className: "text-[#5A5A5A]",
                                    children: trainer.specialization,
                                  }),
                                  _jsx(TableCell, {
                                    children: _jsxs("div", {
                                      className: "flex items-center gap-1",
                                      children: [
                                        _jsx("span", {
                                          className: "text-sm text-[#FF6A00]",
                                          children: "★",
                                        }),
                                        _jsx("span", {
                                          className: "font-medium",
                                          children: trainer.rating,
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx(TableCell, {
                                    className: "font-medium",
                                    children: trainer.courses,
                                  }),
                                  _jsx(TableCell, {
                                    className: "font-medium",
                                    children: trainer.students.toLocaleString(),
                                  }),
                                  _jsx(TableCell, {
                                    children: _jsx(Badge, {
                                      variant: "outline",
                                      className: `text-[10px] font-medium uppercase ${statusColors[trainer.status] || ""}`,
                                      children: trainer.status,
                                    }),
                                  }),
                                ],
                              },
                              trainer.id,
                            ),
                          ),
                        }),
                      ],
                    }),
              }),
            }),
          }),

          /* Students Tab */
          _jsx(TabsContent, {
            value: "students",
            children: _jsx(Card, {
              className: "border-0 bg-white shadow-sm",
              children: _jsx(CardContent, {
                className: "p-0",
                children: studentLoading
                  ? _jsx(TableSkeleton, { cols: 5 })
                  : _jsx(Table, {
                      children: [
                        _jsx(TableHeader, {
                          children: _jsxs(TableRow, {
                            className: "border-[#EDEDED] hover:bg-transparent",
                            children: [
                              _jsx(TableHead, {
                                className: "pl-6 font-semibold text-[#5A5A5A]",
                                children: "Student",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "University",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Progress",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Courses",
                              }),
                              _jsx(TableHead, {
                                className: "font-semibold text-[#5A5A5A]",
                                children: "Status",
                              }),
                            ],
                          }),
                        }),
                        _jsx(TableBody, {
                          children: filterData(studentsData).map((student) =>
                            _jsxs(
                              TableRow,
                              {
                                className:
                                  "cursor-pointer border-[#EDEDED] transition-colors hover:bg-[#EDEDED]/40",
                                onClick: () => handleRowClick(student),
                                children: [
                                  _jsx(TableCell, {
                                    className: "pl-6",
                                    children: _jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        _jsx(Avatar, {
                                          className: "h-9 w-9 border border-[#EDEDED]",
                                          children: _jsx(AvatarFallback, {
                                            className:
                                              "bg-[#00A99D]/8 text-xs font-semibold text-[#00A99D]",
                                            children: student.avatar,
                                          }),
                                        }),
                                        _jsxs("div", {
                                          children: [
                                            _jsx("p", {
                                              className: "font-medium text-[#000000]",
                                              children: student.name,
                                            }),
                                            _jsx("p", {
                                              className: "text-xs text-[#5A5A5A]",
                                              children: student.email,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx(TableCell, {
                                    className: "text-[#5A5A5A] text-sm",
                                    children: student.university,
                                  }),
                                  _jsx(TableCell, {
                                    children: _jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        _jsx(Progress, {
                                          value: student.progress,
                                          className: "h-2 w-20 bg-[#EDEDED]",
                                        }),
                                        _jsxs("span", {
                                          className: "text-sm font-medium text-[#000000]",
                                          children: [student.progress, "%"],
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx(TableCell, {
                                    className: "font-medium",
                                    children: student.coursesEnrolled,
                                  }),
                                  _jsx(TableCell, {
                                    children: _jsx(Badge, {
                                      variant: "outline",
                                      className: `text-[10px] font-medium uppercase ${statusColors[student.status] || ""}`,
                                      children: student.status,
                                    }),
                                  }),
                                ],
                              },
                              student.id,
                            ),
                          ),
                        }),
                      ],
                    }),
              }),
            }),
          }),
        ],
      }),

      _jsx(UserDetailsDialog, {
        user: selectedUser,
        open: dialogOpen,
        onOpenChange: setDialogOpen,
        type: activeTab,
      }),
    ],
  });
}

function TableSkeleton({ cols = 5 }) {
  return _jsx("div", {
    className: "p-4 space-y-3",
    children: Array.from({ length: 5 }).map((_, i) =>
      _jsx(
        "div",
        {
          className: "flex gap-4",
          children: Array.from({ length: cols }).map((_, j) =>
            _jsx(Skeleton, { className: "h-8 flex-1 rounded" }, j),
          ),
        },
        i,
      ),
    ),
  });
}
