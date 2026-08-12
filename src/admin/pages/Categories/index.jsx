import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Tag,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  BookOpen,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { CategoryService, CourseService } from "@/services/api";
import CreateCategory from "./CreateCategory";
import { clsx } from "clsx";
import { Link, useRouter } from "@tanstack/react-router";

const ITEMS_PER_PAGE = 12; // Standardized to 12 for grid

export default function Categories() {
  const router = useRouter();
  const { addToast } = useAppStore();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lms_courses_v1");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, coursesData] = await Promise.all([
          CategoryService.getCategories(),
          CourseService.getCourses().catch(() => []), // fail gracefully if course API isn't ready
        ]);
        setCategories(categoriesData);
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        }
      } catch {
        addToast("Failed to load categories", "error");
      }
    };
    fetchData();
  }, [addToast]);

  const [showCreatePage, setShowCreatePage] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Sort: Name A-Z");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (window.location.search.includes("create=true")) {
      setShowCreatePage(true);
      // Clean up the URL
      window.history.replaceState({}, "", "/categories");
    }
  }, []);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("categoriesViewMode") || "grid";
    }
    return "grid";
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("categoriesViewMode", viewMode);
  }, [viewMode]);

  const categoriesWithCount = categories.map((cat) => {
    const linkedCourses = courses.filter((c) => c.categoryId === cat.id);
    return { ...cat, actualCount: linkedCourses.length };
  });

  const filteredCategories = categoriesWithCount
    .filter((cat) => {
      const matchesStatus =
        statusFilter === "All Status" ? true : statusFilter === "Active" ? cat.active : !cat.active;
      const matchesSearch = (cat.name || "").toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Sort: Name A-Z") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "Sort: Name Z-A") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "Sort: Recently Created")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleEdit = (category) => {
    setEditData(category);
    setShowCreatePage(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await CategoryService.deleteCategory(id);
        setCategories(categories.filter((c) => c.id !== id));
        addToast("Category deleted successfully.", "success");
      } catch (error) {
        addToast(error.message || "Failed to delete category", "error");
      }
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setShowCreatePage(true);
  };

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = categories.filter((c) => !c.active).length;
  const totalCourses = courses.length;

  if (showCreatePage) {
    return (
      <CreateCategory
        editData={editData}
        onBack={() => {
          setShowCreatePage(false);
          setEditData(null);
          CategoryService.getCategories()
            .then((data) => setCategories(data))
            .catch(() => {});
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Organize your courses into structured domains.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_2px_10px_-2px_rgba(108,29,95,0.4)] hover:shadow-[0_4px_14px_-2px_rgba(108,29,95,0.5)] hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "TOTAL CATEGORIES",
            value: totalCategories,
            desc: "All structured domains",
            icon: Tag,
            color: "text-pink-600 dark:text-pink-400",
            bg: "bg-pink-50 dark:bg-pink-500/10",
          },
          {
            label: "ACTIVE",
            value: activeCount,
            desc: "Currently in use",
            icon: CheckCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "INACTIVE",
            value: inactiveCount,
            desc: "Hidden or archived",
            icon: XCircle,
            color: "text-orange-500 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-500/10",
          },
          {
            label: "TOTAL COURSES",
            value: totalCourses,
            desc: "Across all categories",
            icon: BookOpen,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-500/10",
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
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
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

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col lg:flex-row items-center gap-2">
        <div className="relative flex-1 w-full min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-0"
          />
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden lg:block mx-2"></div>

        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-[130px]"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
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

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-[160px]"
            >
              <option>Sort: Name A-Z</option>
              <option>Sort: Name Z-A</option>
              <option>Sort: Recently Created</option>
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

          <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] mx-2 shrink-0"></div>

          <div className="flex bg-gray-100 dark:bg-[#1a1a24] rounded-xl p-1 shrink-0">
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
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {paginatedCategories.map((cat, index) => {
              const color = cat.color || "#6C1D5F";
              const slug = cat.slug || (cat.name || "").toLowerCase().replace(/\s+/g, "-");
              const students = cat.students || 0;
              const courseCount = cat.actualCount || cat.courseCount || 0;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
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
                  <div
                    className="w-full h-32 shrink-0 overflow-hidden cursor-pointer relative flex items-center justify-center"
                    style={{
                      backgroundColor:
                        cat.icon &&
                        (cat.icon.startsWith("http") || cat.icon.startsWith("data:image/"))
                          ? "var(--tw-bg-opacity)"
                          : color,
                    }}
                    onClick={(e) => {
                      if (e.target.closest("button")) return;
                      router.navigate({
                        to: `/admin/categories/$categorySlug`,
                        params: { categorySlug: slug },
                      });
                    }}
                  >
                    {cat.icon &&
                    (cat.icon.startsWith("http") || cat.icon.startsWith("data:image/")) ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/1200x675/ffffff/94a3b8?text=${encodeURIComponent(cat.name)}`;
                        }}
                      />
                    ) : cat.icon ? (
                      <span className="text-7xl leading-none absolute flex items-center justify-center w-full h-full group-hover:scale-105 transition-transform duration-200">
                        {cat.icon}
                      </span>
                    ) : null}
                    <div className="absolute top-4 right-4">
                      <span
                        className={clsx(
                          "text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm",
                          cat.active ? "bg-green-500 text-white" : "bg-red-500 text-white",
                        )}
                      >
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex-1 flex flex-col cursor-pointer p-6 pt-5 bg-white dark:bg-[#15151f]"
                    onClick={(e) => {
                      // Prevent navigation if clicking on action buttons
                      if (e.target.closest("button")) return;
                      router.navigate({
                        to: `/admin/categories/$categorySlug`,
                        params: { categorySlug: slug },
                      });
                    }}
                  >
                    <div className="mb-auto">
                      <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors leading-tight block mb-2">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <p
                          className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3 mb-3"
                          title={cat.description}
                        >
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2e2e3e] mt-2">
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span>
                            {courseCount}
                            <span className="font-medium text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">
                              Courses
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span>{students.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 transition-opacity">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#2e2e3e]">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  Courses
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
              <AnimatePresence>
                {paginatedCategories.map((cat) => {
                  const color = cat.color || "#6C1D5F";
                  const slug = cat.slug || (cat.name || "").toLowerCase().replace(/\s+/g, "-");
                  const courseCount = cat.actualCount || cat.courseCount || 0;
                  return (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-100 dark:hover:bg-[#1a1a24] transition-colors cursor-pointer"
                      onClick={(e) => {
                        if (e.target.closest("button")) return;
                        router.navigate({
                          to: `/admin/categories/$categorySlug`,
                          params: { categorySlug: slug },
                        });
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden"
                            style={{ backgroundColor: `${color}20`, border: `2px solid ${color}` }}
                          >
                            {cat.icon &&
                            (cat.icon.startsWith("http") || cat.icon.startsWith("data:image/")) ? (
                              <img
                                src={cat.icon}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-4xl leading-none">{cat.icon || "📚"}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] transition-colors">
                              {cat.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-sm hidden sm:table-cell">
                        <p className="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                          <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {courseCount}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={clsx(
                            "text-xs font-bold px-3 py-1 rounded-md shadow-sm",
                            cat.active ? "bg-green-500 text-white" : "bg-red-500 text-white",
                          )}
                        >
                          {cat.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#353545] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {paginatedCategories.length === 0 && (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">No categories found.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing {filteredCategories.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)} of{" "}
          {filteredCategories.length} categories
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "w-8 h-8 rounded-lg text-sm font-bold transition-colors mx-0.5",
                    page === currentPage
                      ? "bg-[#01AC9F] text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252535]",
                  )}
                >
                  {page}
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
