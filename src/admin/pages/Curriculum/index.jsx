import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { CourseService, CategoryService } from "@/services/api";
import { useRouter } from "@tanstack/react-router";
import {
  Search,
  Globe,
  Clock,
  BookOpen,
  ChevronRight,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const LEVEL_COLORS = {
  Beginner: "bg-emerald-500 text-white",
  Intermediate: "bg-purple-600 text-white",
  Advanced: "bg-orange-500 text-white",
  Expert: "bg-gray-800 dark:bg-gray-700 text-white",
};

const CAT_COLORS = ["#e879f9", "#22d3ee", "#f97316", "#a78bfa", "#34d399", "#fb923c", "#60a5fa"];

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
  "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&q=80",
];

export default function Curriculum() {
  const { addToast } = useAppStore();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterStatus, setFilterStatus] = useState("All Status");

  useEffect(() => {
    async function load() {
      try {
        const [c, cats] = await Promise.all([
          CourseService.getCourses(),
          CategoryService.getCategories(),
        ]);
        setCourses(c || []);
        setCategories(cats || []);
      } catch {
        addToast("Failed to load courses.", "error");
      }
    }
    load();
  }, [addToast]);

  const filtered = courses.filter((c) => {
    const level = c.difficultyLevel || c.level || "Beginner";
    const isPublished = c.published || c.isPublished;
    const active = c.active !== false;
    if (filterLevel !== "All Levels" && level !== filterLevel) return false;
    if (filterStatus !== "All Status") {
      if (filterStatus === "Active" && !active) return false;
      if (filterStatus === "Inactive" && active) return false;
    }
    if (search && !(c.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalModules = courses.reduce((s, c) => s + (c.modules || c.moduleCount || 0), 0);
  const totalBlocks = courses.reduce((s, c) => s + (c.blocks || c.blockCount || 0), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Curriculum</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Select a course below to manage its modules, submodules, and content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-[#6C1D5F]/20 border border-purple-200 dark:border-[#6C1D5F]/30 rounded-full text-[12px] font-semibold text-purple-700 dark:text-purple-300">
            <BookOpen className="w-3.5 h-3.5" />
            {courses.length} Courses
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-full text-[12px] font-semibold text-blue-600 dark:text-blue-300">
            <Layers className="w-3.5 h-3.5" />
            {totalModules} Modules
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-[#01AC9F]/20 border border-teal-200 dark:border-[#01AC9F]/30 rounded-full text-[12px] font-semibold text-teal-600 dark:text-teal-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {totalBlocks} Blocks
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-[#3a3a4a] rounded-lg text-sm bg-white dark:bg-[#1a1a24] text-gray-900 dark:text-white outline-none focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] transition-all"
          />
        </div>
        {[
          {
            value: filterLevel,
            set: setFilterLevel,
            opts: ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"],
          },
          { value: filterStatus, set: setFilterStatus, opts: ["All Status", "Active", "Inactive"] },
        ].map(({ value, set, opts }) => (
          <div key={opts[0]} className="relative min-w-[140px]">
            <select
              value={value}
              onChange={(e) => set(e.target.value)}
              className="w-full appearance-none pl-3 pr-7 py-2 border border-gray-200 dark:border-[#3a3a4a] rounded-lg text-sm bg-white dark:bg-[#1a1a24] text-gray-700 dark:text-gray-300 outline-none focus:border-[#6C1D5F] focus:ring-1 focus:ring-[#6C1D5F] cursor-pointer transition-all"
            >
              {opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto hidden sm:block">
          {filtered.length} courses
        </span>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filtered.map((course, idx) => {
            const level = course.difficultyLevel || course.level || "Beginner";
            const cat = course.categoryName || course.category || "";
            const catIdx = categories.findIndex((c) => c.name === cat);
            const isPublished = course.published || course.isPublished;
            const active = course.active !== false;
            const duration =
              course.duration || (course.durationHours ? `${course.durationHours} hrs` : "N/A");
            const lang = course.language || "English";
            const moduleCount = course.modules || course.moduleCount || 0;
            const slug = course.courseCode || course.slug || course.id;
            const img =
              course.thumbnailImageUrl || course.thumbnail || MOCK_IMAGES[idx % MOCK_IMAGES.length];
            const isFeatured = course.isFeatured || course.featured;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, delay: idx * 0.04 }}
                className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
                onClick={() =>
                  router.navigate({ to: "/admin/courses/builder", search: { courseId: course.id } })
                }
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-gray-900 shrink-0">
                  <img
                    src={img}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = MOCK_IMAGES[idx % MOCK_IMAGES.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Featured dot */}
                  {isFeatured && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-orange-400 rounded-full border-2 border-white shadow" />
                  )}

                  {/* Checkbox placeholder */}
                  <div className="absolute bottom-3 left-3 w-6 h-6 bg-white/20 border border-white/60 rounded" />
                </div>

                <div className="p-4 space-y-3 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {cat && (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{
                          backgroundColor:
                            CAT_COLORS[
                              catIdx >= 0 ? catIdx % CAT_COLORS.length : idx % CAT_COLORS.length
                            ],
                        }}
                      >
                        {cat}
                      </span>
                    )}
                    <span
                      className={clsx(
                        "text-[11px] font-bold px-2.5 py-0.5 rounded-full",
                        LEVEL_COLORS[level] || LEVEL_COLORS.Beginner,
                      )}
                    >
                      {level}
                    </span>
                  </div>

                  {/* Title + slug */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 font-mono mt-1">
                      /{slug}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-[12px] text-gray-500 dark:text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      {lang}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {moduleCount} Modules
                    </span>
                  </div>

                  {/* Status + Open */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100 dark:border-[#2e2e3e]">
                    <div className="flex gap-1.5">
                      <span
                        className={clsx(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                          active
                            ? "bg-teal-50 dark:bg-[#01AC9F]/10 text-teal-600 dark:text-[#01AC9F]"
                            : "bg-gray-100 dark:bg-[#252535] text-gray-500 dark:text-gray-400",
                        )}
                      >
                        <span
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            active ? "bg-teal-400 dark:bg-[#01AC9F]" : "bg-gray-400",
                          )}
                        />
                        {active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={clsx(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                          isPublished
                            ? "bg-purple-50 dark:bg-[#6C1D5F]/20 text-purple-600 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-[#252535] text-gray-500 dark:text-gray-400",
                        )}
                      >
                        <span
                          className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            isPublished ? "bg-purple-400 dark:bg-[#6C1D5F]" : "bg-gray-400",
                          )}
                        />
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.navigate({
                          to: "/admin/courses/builder",
                          search: { courseId: course.id },
                        });
                      }}
                      className="flex items-center gap-1 text-[12px] font-bold text-gray-500 dark:text-gray-400 hover:text-[#6C1D5F] dark:hover:text-white transition-colors"
                    >
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-3 text-gray-200 dark:text-gray-600" />
            <p className="text-sm">
              No courses found. Create a course first to build its curriculum.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
