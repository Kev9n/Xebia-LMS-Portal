import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Clock,
  Users,
  FileText,
  Code,
  Upload,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import { clsx } from "clsx";

const TYPE_CONFIG = {
  mcq: { bg: "#6C1D5F", label: "MCQ", icon: FileText },
  coding: { bg: "#3B82F6", label: "Coding", icon: Code },
  assignment: { bg: "#84117C", label: "Assignment", icon: Upload },
  file_upload: { bg: "#84117C", label: "Assignment", icon: Upload },
  mixed: { bg: "#FF6200", label: "Mixed", icon: FileText },
  true_false: { bg: "#01AC9F", label: "True/False", icon: CheckCircle },
  multiple_select: { bg: "#84117C", label: "Multi-Select", icon: CheckCircle },
  short_answer: { bg: "#6B7280", label: "Short Answer", icon: FileText },
  paragraph: { bg: "#6B7280", label: "Paragraph", icon: FileText },
};

export default function AssessmentCard({ assessment, index = 0 }) {
  const navigate = useNavigate();
  const type = TYPE_CONFIG[assessment.type] || TYPE_CONFIG.mcq;
  const TypeIcon = type.icon;
  const color = type.bg;

  const isLive = assessment.status === "published" &&
    assessment.startDate && assessment.endDate &&
    new Date() >= new Date(assessment.startDate) &&
    new Date() <= new Date(assessment.endDate);

  const isPublished = assessment.status === "published";
  const isDraft = assessment.status === "draft";
  const isArchived = assessment.status === "archived";

  const statusLabel = isLive ? "Live" : isPublished ? "Published" : isDraft ? "Draft" : isArchived ? "Expired" : assessment.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => navigate({ to: "/admin/assessments/" + assessment.id })}
      className="group bg-white dark:bg-[#15151f] rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 relative cursor-pointer border-[3px]"
      style={{
        borderColor: `${color}50`,
        boxShadow: `0 4px 20px -5px ${color}40`,
      }}
      whileHover={{
        y: -5,
        borderColor: color,
        boxShadow: `0 15px 45px -5px ${color}99, 0 0 20px 0 ${color}60`,
      }}
    >
      {/* Header with type icon on colored background */}
      <div
        className="w-full h-32 shrink-0 overflow-hidden relative flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ backgroundColor: color }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full" style={{ backgroundColor: color }}></div>
        </div>

        <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
          <TypeIcon className="w-7 h-7" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span
            className={clsx(
              "text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm",
              isLive ? "bg-[#01AC9F] text-white" :
              isPublished ? "bg-[#84117C] text-white" :
              isDraft ? "bg-gray-500 text-white" :
              "bg-[#FF6200] text-white"
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* Difficulty Badge */}
        {assessment.difficulty && (
          <div className="absolute top-4 left-4 z-20">
            <span
              className={clsx(
                "text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm",
                assessment.difficulty === "Easy" ? "bg-[#01AC9F] text-white" :
                assessment.difficulty === "Hard" ? "bg-[#FF6200] text-white" :
                "bg-[#84117C] text-white"
              )}
            >
              {assessment.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col cursor-pointer p-6 pt-5 bg-white dark:bg-[#15151f]">
        <div className="mb-auto">
          <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors leading-tight block mb-2 line-clamp-2">
            {assessment.title}
          </span>
          {assessment.topic && (
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {assessment.topic}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2e2e3e] mt-2">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
            {assessment.course && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span className="whitespace-nowrap">
                  {assessment.course.length > 10 ? assessment.course.substring(0, 10) + "..." : assessment.course}
                </span>
              </div>
            )}
            {assessment.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <span>{assessment.duration}m</span>
              </div>
            )}
            {assessment.marks && (
              <span className="text-[#6C1D5F] dark:text-[#84117C] font-bold">
                {assessment.marks} pts
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 transition-opacity">
            {assessment.questions && (
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <FileText className="w-4 h-4" />
                {assessment.questions.length} Qs
              </span>
            )}
            {assessment.batches && assessment.batches.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 ml-2">
                <GraduationCap className="w-4 h-4" />
                {assessment.batches.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
