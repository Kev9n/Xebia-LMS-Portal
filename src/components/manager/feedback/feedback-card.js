import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const sentimentConfig = {
  positive: { color: "bg-[#00A99D]/10 text-[#00A99D] border-[#00A99D]/20", label: "Positive" },
  neutral: { color: "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/20", label: "Neutral" },
  negative: { color: "bg-red-50 text-red-500 border-red-200", label: "Negative" },
};

function StarRating({ rating }) {
  return _jsx("div", {
    className: "flex items-center gap-0.5",
    children: Array.from({ length: 5 }).map((_, i) =>
      _jsx(
        "span",
        {
          className: `text-sm ${i < rating ? "text-[#FF6A00]" : "text-gray-200"}`,
          children: "★",
        },
        i,
      ),
    ),
  });
}

export function FeedbackCard({ feedback, index = 0 }) {
  const sentiment = sentimentConfig[feedback.sentiment] || sentimentConfig.neutral;
  const dateStr = new Date(feedback.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return _jsx(motion.div, {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: index * 0.05 },
    children: _jsx(Card, {
      className: "border-0 bg-white shadow-sm transition-all duration-200 hover:shadow-md",
      children: _jsx(CardContent, {
        className: "p-5",
        children: _jsxs("div", {
          className: "space-y-3",
          children: [
            /* Header */
            _jsxs("div", {
              className: "flex items-start justify-between",
              children: [
                _jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    _jsx(Avatar, {
                      className: "h-10 w-10 border border-[#EDEDED]",
                      children: _jsx(AvatarFallback, {
                        className: "bg-[#6C1D5F]/8 text-xs font-semibold text-[#6C1D5F]",
                        children: feedback.studentAvatar,
                      }),
                    }),
                    _jsxs("div", {
                      children: [
                        _jsx("p", {
                          className: "text-sm font-semibold text-[#000000]",
                          children: feedback.student,
                        }),
                        _jsx("p", {
                          className: "text-xs text-[#5A5A5A]",
                          children: feedback.course,
                        }),
                      ],
                    }),
                  ],
                }),
                _jsx(Badge, {
                  variant: "outline",
                  className: `text-[10px] font-medium ${sentiment.color}`,
                  children: sentiment.label,
                }),
              ],
            }),

            /* Stars + Date */
            _jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                _jsx(StarRating, { rating: feedback.rating }),
                _jsx("span", {
                  className: "text-xs text-[#5A5A5A]/70",
                  children: dateStr,
                }),
              ],
            }),

            /* Comment */
            _jsx("p", {
              className: "text-sm leading-relaxed text-[#5A5A5A]",
              children: feedback.comment,
            }),
          ],
        }),
      }),
    }),
  });
}
