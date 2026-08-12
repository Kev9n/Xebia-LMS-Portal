import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Layers,
  Edit3,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Globe,
  Filter,
  MoreVertical,
  GraduationCap,
  FileText,
  Bookmark,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CourseService, CategoryService } from "@/services/api";
import { useRouter, Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import CreateCourse from "./CreateCourse";

const ITEMS_PER_PAGE = 12; // Adjusted for 4-column grid (3 rows)

const LEVEL_COLORS = {
  Beginner: {
    bg: "bg-[#01AC9F]/10 text-[#01AC9F] ring-[#01AC9F]/20 dark:bg-[#01AC9F]/20 dark:ring-[#01AC9F]/30",
    dot: "bg-[#01AC9F]",
  },
  Intermediate: {
    bg: "bg-[#84117C]/10 text-[#84117C] dark:text-[#D3CCEC] ring-[#84117C]/20 dark:bg-[#84117C]/20 dark:ring-[#84117C]/30",
    dot: "bg-[#84117C]",
  },
  Advanced: {
    bg: "bg-[#FF6200]/10 text-[#FF6200] ring-[#FF6200]/20 dark:bg-[#FF6200]/20 dark:ring-[#FF6200]/30",
    dot: "bg-[#FF6200]",
  },
  Expert: {
    bg: "bg-[#5A5A5A]/10 text-[#5A5A5A] dark:text-gray-300 ring-[#5A5A5A]/20 dark:bg-[#5A5A5A]/20 dark:ring-[#5A5A5A]/30",
    dot: "bg-[#5A5A5A] dark:bg-gray-400",
  },
};

const CAT_COLORS = ["#e879f9", "#22d3ee", "#f97316", "#a78bfa", "#34d399", "#fb923c", "#60a5fa"];

function catColor(name = "", idx = 0) {
  return CAT_COLORS[idx % CAT_COLORS.length];
}

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
];

export default function Courses() {
  const { addToast } = useAppStore();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (window.location.search.includes("create=true")) {
      setShowCreate(true);
      // Clean up the URL
      window.history.replaceState({}, "", "/courses");
    }
  }, []);

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Levels");
  const [filterCat, setFilterCat] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterFavorites, setFilterFavorites] = useState("All Courses");
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("coursesViewMode") || "grid";
    }
    return "grid";
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("coursesViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseData, catData] = await Promise.all([
          CourseService.getCourses(),
          CategoryService.getCategories(),
        ]);

        // Fetch hierarchies to get actual module counts without mocking
        const coursesWithCounts = await Promise.all(
          (courseData || []).map(async (c) => {
            try {
              const hierarchy = await CourseService.getCourseHierarchy(c.id);
              return {
                ...c,
                modulesCount: hierarchy?.modulesCount || 0,
                studentsCount: c.studentsCount || 0, // Assuming backend might add this later, keep it 0 for now
              };
            } catch (e) {
              return { ...c, modulesCount: 0, studentsCount: 0 };
            }
          }),
        );

        setCourses(coursesWithCounts);
        setCategories(catData || []);
      } catch (err) {
        addToast("Failed to load courses.", "error");
      }
    }
    fetchData();
  }, [addToast]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await CourseService.deleteCourse(id);
      setCourses((c) => c.filter((x) => x.id !== id));
      addToast("Course deleted successfully.", "success");
    } catch {
      addToast("Failed to delete course.", "error");
    }
  };

  const handleToggleFeatured = (id) => {
    setCourses((c) => c.map((x) => (x.id === id ? { ...x, featured: !x.featured } : x)));
  };

  const handleToggleStatus = async (course, type) => {
    let updates = {};
    if (type === "publish") {
      const nextPub = !(course.published || course.isPublished);
      updates = { published: nextPub, isPublished: nextPub };
    } else {
      const currentActive = course.isActive !== false && course.active !== false;
      const nextAct = !currentActive;
      updates = { active: nextAct, isActive: nextAct };
    }
    try {
      await CourseService.updateCourse(course.id, { ...course, ...updates });
      setCourses((c) => c.map((x) => (x.id === course.id ? { ...x, ...updates } : x)));
      addToast(`Course updated successfully.`, "success");
    } catch {
      addToast("Failed to update course.", "error");
    }
  };

  const getCategoryName = (c) => {
    if (c.categoryName) return c.categoryName;
    if (c.category?.name) return c.category.name;
    if (c.categoryId) {
      const found = categories.find((cat) => cat.id === c.categoryId);
      if (found) return found.name;
    }
    return typeof c.category === "string" ? c.category : "";
  };

  const filtered = courses.filter((c) => {
    const level = c.difficultyLevel || c.level || "Beginner";
    const cat = getCategoryName(c);
    const active = c.isActive !== false && c.active !== false;

    if (filterLevel !== "All Levels" && level !== filterLevel) return false;
    if (filterCat !== "All Categories" && cat !== filterCat) return false;
    if (filterStatus !== "All Status") {
      const isPub = c.published || c.isPublished;
      if (filterStatus === "Published" && !isPub) return false;
      if (filterStatus === "Draft" && isPub) return false;
      if (filterStatus === "Active" && !active) return false;
      if (filterStatus === "Inactive" && active) return false;
    }
    if (filterFavorites === "Favorites" && !c.featured) return false;
    if (
      search &&
      !(c.title || "").toLowerCase().includes(search.toLowerCase()) &&
      !(c.courseCode || c.slug || "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (showCreate) {
    return (
      <CreateCourse
        editData={editData}
        categories={categories}
        onBack={() => {
          setShowCreate(false);
          setEditData(null);
          CourseService.getCourses()
            .then((d) => setCourses(d || []))
            .catch(() => {});
        }}
        onSaved={(course) => {
          if (editData) {
            setCourses((cs) => cs.map((c) => (c.id === course.id ? course : c)));
          } else {
            setCourses((cs) => [course, ...cs]);
          }
          setShowCreate(false);
          setEditData(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header & Stats Container */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#6C1D5F]/10 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-[#6C1D5F] dark:text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Courses
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Manage and organize your learning library.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setShowCreate(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-bold rounded-xl transition-all shadow-[0_2px_10px_-2px_rgba(108,29,95,0.4)] hover:shadow-[0_4px_14px_-2px_rgba(108,29,95,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "TOTAL COURSES",
              value: courses.length,
              desc: "All courses in library",
              icon: BookOpen,
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-purple-500/10",
            },
            {
              label: "PUBLISHED COURSES",
              value: courses.filter((c) => c.published || c.isPublished).length,
              desc: "Courses are live",
              icon: GraduationCap,
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "DRAFT COURSES",
              value: courses.length - courses.filter((c) => c.published || c.isPublished).length,
              desc: "Work in progress",
              icon: FileText,
              color: "text-orange-500 dark:text-orange-400",
              bg: "bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "TOTAL ENROLLMENTS",
              value: courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0),
              desc: "Across all courses",
              icon: Users,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                    {stat.value}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-1">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col xl:flex-row items-center justify-between gap-2">
        {/* Left Group */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto overflow-x-auto hide-scrollbar">
          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search courses by title or slug..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-0"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden sm:block mx-1 shrink-0"></div>

          {/* Favorites Filter (All Courses) */}
          <div className="relative shrink-0">
            <select
              value={filterFavorites}
              onChange={(e) => {
                setFilterFavorites(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-[130px]"
            >
              {["All Courses", "Favorites"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
          </div>

          {/* Grid/List Toggle */}
          <div className="flex bg-gray-100 dark:bg-[#1a1a24] rounded-xl p-1 shrink-0 ml-1">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === "grid"
                  ? "bg-white dark:bg-[#252535] text-[#6C1D5F] dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={clsx(
                "p-2 rounded-lg transition-all",
                viewMode === "list"
                  ? "bg-white dark:bg-[#252535] text-[#6C1D5F] dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar shrink-0 justify-start xl:justify-end">
          <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden xl:block mx-1 shrink-0"></div>

          {[
            {
              value: filterLevel,
              set: setFilterLevel,
              opts: ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"],
            },
            {
              value: filterCat,
              set: setFilterCat,
              opts: ["All Categories", ...categories.map((c) => c.name)],
            },
            {
              value: filterStatus,
              set: setFilterStatus,
              opts: ["All Status", "Published", "Draft", "Active", "Inactive"],
            },
          ].map(({ value, set, opts }) => (
            <div key={opts[0]} className="relative shrink-0">
              <select
                value={value}
                onChange={(e) => {
                  set(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-[130px]"
              >
                {opts.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid / Card View ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {paginated.map((course, idx) => {
              const level = course.difficultyLevel || course.level || "Beginner";
              const cat = getCategoryName(course);
              const catIdx = categories.findIndex((c) => c.name === cat);
              const isPublished = course.published || course.isPublished;
              const active = course.isActive !== false && course.active !== false;
              const duration =
                `${course.durationHours ? course.durationHours + "h " : ""}${course.durationMinutes ? course.durationMinutes + "m" : ""}`.trim() ||
                course.duration ||
                "N/A";
              const lang = course.language || "English";
              const levelStyle = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
              const slug =
                course.slug || (course.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const thumb = course.thumbnailImageUrl || course.thumbnail || course.icon;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="group bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl flex flex-col h-full overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
                  onClick={(e) => {
                    if (e.target.closest("button")) return;
                    router.navigate({
                      to: "/admin/courses/$courseSlug",
                      params: { courseSlug: slug },
                    });
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 z-0">
                      <span className="text-4xl font-bold opacity-30 uppercase tracking-wider">
                        {course.title ? course.title.substring(0, 2) : "CO"}
                      </span>
                    </div>
                    {thumb && (
                      <img
                        src={thumb}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span
                        className={clsx(
                          "text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm",
                          isPublished ? "bg-[#84117C] text-white" : "bg-[#FF6200] text-white",
                        )}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <span
                        className={clsx(
                          "text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm",
                          active ? "bg-[#01AC9F] text-white" : "bg-[#5A5A5A] text-white",
                        )}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFeatured(course.id);
                      }}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:scale-105 transition-transform shadow-sm z-20"
                    >
                      <Bookmark
                        className={clsx(
                          "w-4 h-4",
                          course.featured
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-500 dark:text-gray-300",
                        )}
                      />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col relative">
                    {/* Title */}
                    <div className="mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors leading-tight block mb-1 line-clamp-2">
                        {course.title}
                      </span>
                    </div>

                    {/* Meta Top (Level) */}
                    <div className="mb-2">
                      <span
                        className={clsx(
                          "inline-flex items-center text-xs font-bold px-2 py-1 rounded-md text-white shadow-sm tracking-wide",
                          level === "Beginner"
                            ? "bg-[#01AC9F]"
                            : level === "Intermediate"
                              ? "bg-[#84117C]"
                              : "bg-[#FF6200]",
                        )}
                      >
                        {level}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {course.description ||
                        course.shortDescription ||
                        "No description available for this course. Click to learn more."}
                    </p>

                    {/* Meta Stats */}
                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-[#2e2e3e] flex items-center justify-between text-xs sm:text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          {course.modules?.length || course.modulesCount || 0} Modules
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          {course.studentsCount || 0} Students
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          {duration}
                        </span>
                      </div>

                      <div className="relative group/menu">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] transition-colors text-gray-500"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-full right-0 mb-2 w-36 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all flex flex-col overflow-hidden z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditData(course);
                              setShowCreate(true);
                            }}
                            className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(course, "active");
                            }}
                            className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                          >
                            {active ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(course, "publish");
                            }}
                            className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                          >
                            {isPublished ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                            {isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-[#2e2e3e] w-full my-0.5"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(course.id);
                            }}
                            className="px-4 py-2 text-xs font-bold text-red-600 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── List / Table View ── */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto table-scroll-hint">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#2e2e3e]">
                {["Course", "Category", "Level", "Duration", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={clsx(
                      "px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                      h === "Actions" && "text-right",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
              <AnimatePresence>
                {paginated.map((course, idx) => {
                  const level = course.difficultyLevel || course.level || "Beginner";
                  const cat = getCategoryName(course);
                  const catIdx = categories.findIndex((c) => c.name === cat);
                  const isPublished = course.published || course.isPublished;
                  const active = course.isActive !== false && course.active !== false;
                  const duration =
                    `${course.durationHours ? course.durationHours + "h " : ""}${course.durationMinutes ? course.durationMinutes + "m" : ""}`.trim() ||
                    course.duration ||
                    "N/A";
                  const slug =
                    course.slug || (course.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const levelStyle = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
                  const thumb = course.thumbnailImageUrl || course.thumbnail || course.icon;

                  return (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-100 dark:hover:bg-[#1a1a24] transition-colors cursor-pointer"
                      onClick={(e) => {
                        if (e.target.closest("button")) return;
                        router.navigate({
                          to: "/admin/courses/$courseSlug",
                          params: { courseSlug: slug },
                        });
                      }}
                    >
                      {/* Course */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400 relative">
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                              <span className="text-lg font-bold opacity-30 uppercase">
                                {course.title ? course.title.substring(0, 2) : "CO"}
                              </span>
                            </div>
                            {thumb && (
                              <img
                                src={thumb}
                                alt=""
                                className="w-full h-full object-contain p-1 relative z-10"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors leading-tight block">
                              {course.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        {cat !== "—" ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-sm"
                            style={{ backgroundColor: catColor(cat, catIdx >= 0 ? catIdx : idx) }}
                          >
                            {cat}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      {/* Level */}
                      <td className="px-6 py-4">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ring-1 ring-inset",
                            levelStyle.bg,
                          )}
                        >
                          <span className={clsx("w-1.5 h-1.5 rounded-full", levelStyle.dot)} />
                          {level}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {duration}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "text-xs font-bold px-2.5 py-1 rounded-md text-white",
                              active ? "bg-green-500" : "bg-red-500",
                            )}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                          <span
                            className={clsx(
                              "text-xs font-bold px-2.5 py-1 rounded-md",
                              isPublished
                                ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                : "bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400",
                            )}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 relative group/menu">
                          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] transition-colors text-gray-500">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all flex flex-col overflow-hidden z-20 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditData(course);
                                setShowCreate(true);
                              }}
                              className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(course, "active");
                              }}
                              className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                            >
                              {active ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                              )}
                              {active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(course, "publish");
                              }}
                              className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535]"
                            >
                              {isPublished ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                              {isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-[#2e2e3e] w-full my-0.5"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course.id);
                              }}
                              className="px-4 py-2 text-xs font-bold text-red-600 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          </div>
          {paginated.length === 0 && (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">
              No courses found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} courses
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252535] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={clsx(
                    "w-8 h-8 rounded-lg text-sm font-bold transition-colors mx-0.5",
                    p === currentPage
                      ? "bg-[#6C1D5F] text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252535]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252535] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
