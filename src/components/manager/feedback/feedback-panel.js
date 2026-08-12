import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackCard } from "./feedback-card";
import { useFeedback } from "@/lib/mock-data/manager-data";

export function FeedbackPanel() {
  const { data: feedbackData, isLoading } = useFeedback();
  const [courseFilter, setCourseFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const courses = useMemo(() => {
    if (!feedbackData) return [];
    return [...new Set(feedbackData.map((f) => f.course))];
  }, [feedbackData]);

  const filtered = useMemo(() => {
    if (!feedbackData) return [];
    let result = feedbackData;
    if (courseFilter !== "all") {
      result = result.filter((f) => f.course === courseFilter);
    }
    if (ratingFilter !== "all") {
      const r = parseInt(ratingFilter);
      result = result.filter((f) => f.rating === r);
    }
    return result;
  }, [feedbackData, courseFilter, ratingFilter]);

  const stats = useMemo(() => {
    if (!feedbackData) return { avg: 0, distribution: [], sentiments: {} };
    const total = feedbackData.length;
    const avg = (feedbackData.reduce((s, f) => s + f.rating, 0) / total).toFixed(1);
    const distribution = [5, 4, 3, 2, 1].map((r) => ({
      rating: r,
      count: feedbackData.filter((f) => f.rating === r).length,
      percentage: Math.round((feedbackData.filter((f) => f.rating === r).length / total) * 100),
    }));
    const sentiments = {
      positive: feedbackData.filter((f) => f.sentiment === "positive").length,
      neutral: feedbackData.filter((f) => f.sentiment === "neutral").length,
      negative: feedbackData.filter((f) => f.sentiment === "negative").length,
    };
    return { avg, distribution, sentiments, total };
  }, [feedbackData]);

  if (isLoading) {
    return _jsx("div", {
      className: "space-y-6",
      children: [
        _jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
        _jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
      ],
    });
  }

  return _jsxs(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    className: "space-y-6",
    children: [
      /* Overview Cards */
      _jsx("div", {
        className: "grid grid-cols-1 gap-5 lg:grid-cols-3",
        children: [
          /* Average Rating */
          _jsx(Card, {
            className: "border-0 bg-white shadow-sm",
            children: _jsx(CardContent, {
              className: "flex flex-col items-center justify-center p-6",
              children: _jsxs("div", {
                className: "text-center",
                children: [
                  _jsx("p", {
                    className: "text-5xl font-bold text-[#6C1D5F]",
                    children: stats.avg,
                  }),
                  _jsx("div", {
                    className: "mt-2 flex justify-center gap-0.5",
                    children: Array.from({ length: 5 }).map((_, i) =>
                      _jsx(
                        "span",
                        {
                          className: `text-lg ${i < Math.round(stats.avg) ? "text-[#FF6A00]" : "text-gray-200"}`,
                          children: "★",
                        },
                        i,
                      ),
                    ),
                  }),
                  _jsxs("p", {
                    className: "mt-1 text-sm text-[#5A5A5A]",
                    children: ["Based on ", stats.total, " reviews"],
                  }),
                ],
              }),
            }),
          }),

          /* Rating Distribution */
          _jsxs(Card, {
            className: "border-0 bg-white shadow-sm",
            children: [
              _jsx(CardHeader, {
                className: "pb-2",
                children: _jsx(CardTitle, {
                  className: "text-sm font-semibold text-[#000000]",
                  children: "Rating Distribution",
                }),
              }),
              _jsx(CardContent, {
                children: _jsx("div", {
                  className: "space-y-2.5",
                  children: stats.distribution.map((d) =>
                    _jsxs(
                      "div",
                      {
                        className: "flex items-center gap-3",
                        children: [
                          _jsxs("span", {
                            className:
                              "flex w-6 items-center gap-0.5 text-sm font-medium text-[#5A5A5A]",
                            children: [
                              d.rating,
                              _jsx("span", {
                                className: "text-[10px] text-[#FF6A00]",
                                children: "★",
                              }),
                            ],
                          }),
                          _jsx(Progress, {
                            value: d.percentage,
                            className: "h-2 flex-1 bg-[#EDEDED]",
                          }),
                          _jsxs("span", {
                            className: "w-8 text-right text-xs font-medium text-[#5A5A5A]",
                            children: [d.count],
                          }),
                        ],
                      },
                      d.rating,
                    ),
                  ),
                }),
              }),
            ],
          }),

          /* Sentiment Summary */
          _jsxs(Card, {
            className: "border-0 bg-white shadow-sm",
            children: [
              _jsx(CardHeader, {
                className: "pb-2",
                children: _jsx(CardTitle, {
                  className: "text-sm font-semibold text-[#000000]",
                  children: "Sentiment Analysis",
                }),
              }),
              _jsx(CardContent, {
                children: _jsx("div", {
                  className: "space-y-4",
                  children: [
                    {
                      label: "Positive",
                      value: stats.sentiments.positive,
                      icon: ThumbsUp,
                      color: "text-[#00A99D]",
                      bg: "bg-[#00A99D]/8",
                    },
                    {
                      label: "Neutral",
                      value: stats.sentiments.neutral,
                      icon: Minus,
                      color: "text-[#FF6A00]",
                      bg: "bg-[#FF6A00]/8",
                    },
                    {
                      label: "Negative",
                      value: stats.sentiments.negative,
                      icon: ThumbsDown,
                      color: "text-red-500",
                      bg: "bg-red-50",
                    },
                  ].map((s) =>
                    _jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between",
                        children: [
                          _jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              _jsx("div", {
                                className: `flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`,
                                children: _jsx(s.icon, { className: `h-4 w-4 ${s.color}` }),
                              }),
                              _jsx("span", {
                                className: "text-sm font-medium text-[#5A5A5A]",
                                children: s.label,
                              }),
                            ],
                          }),
                          _jsx("span", {
                            className: "text-lg font-bold text-[#000000]",
                            children: s.value,
                          }),
                        ],
                      },
                      s.label,
                    ),
                  ),
                }),
              }),
            ],
          }),
        ],
      }),

      /* Filters */
      _jsxs("div", {
        className: "flex flex-col gap-3 sm:flex-row",
        children: [
          _jsxs(Select, {
            value: courseFilter,
            onValueChange: setCourseFilter,
            children: [
              _jsx(SelectTrigger, {
                className: "h-10 w-full border-[#EDEDED] bg-white shadow-sm sm:w-[250px]",
                children: _jsx(SelectValue, { placeholder: "Filter by course" }),
              }),
              _jsxs(SelectContent, {
                children: [
                  _jsx(SelectItem, { value: "all", children: "All Courses" }),
                  ...courses.map((c) => _jsx(SelectItem, { value: c, children: c }, c)),
                ],
              }),
            ],
          }),
          _jsxs(Select, {
            value: ratingFilter,
            onValueChange: setRatingFilter,
            children: [
              _jsx(SelectTrigger, {
                className: "h-10 w-full border-[#EDEDED] bg-white shadow-sm sm:w-[150px]",
                children: _jsx(SelectValue, { placeholder: "Rating" }),
              }),
              _jsxs(SelectContent, {
                children: [
                  _jsx(SelectItem, { value: "all", children: "All Ratings" }),
                  _jsx(SelectItem, { value: "5", children: "5 Stars" }),
                  _jsx(SelectItem, { value: "4", children: "4 Stars" }),
                  _jsx(SelectItem, { value: "3", children: "3 Stars" }),
                  _jsx(SelectItem, { value: "2", children: "2 Stars" }),
                  _jsx(SelectItem, { value: "1", children: "1 Star" }),
                ],
              }),
            ],
          }),
        ],
      }),

      /* Feedback List */
      _jsx("div", {
        className: "space-y-3",
        children:
          filtered.length === 0
            ? _jsx("div", {
                className: "rounded-xl bg-white p-12 text-center shadow-sm",
                children: _jsxs("div", {
                  children: [
                    _jsx(Star, { className: "mx-auto h-12 w-12 text-[#FF6A00]/30" }),
                    _jsx("p", {
                      className: "mt-3 text-sm font-medium text-[#5A5A5A]",
                      children: "No feedback matches your filters",
                    }),
                  ],
                }),
              })
            : filtered.map((fb, index) => _jsx(FeedbackCard, { feedback: fb, index }, fb.id)),
      }),
    ],
  });
}
