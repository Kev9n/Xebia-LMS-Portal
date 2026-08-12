import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

import {
  Tag, BookOpen, Clock, ArrowLeft, Users, Star, ChevronRight, Check, Edit3, Archive, CheckCircle,
  Activity, Award, AlertCircle, Cloud, Eye, MoreVertical, TrendingUp, Globe, FileText, Sparkles, Trash2,
  Loader2,
} from "lucide-react";
import { CategoryService, CourseService } from "@/services/api";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useAppStore } from "../../store/useAppStore";
import CreateCategory from "./CreateCategory";

const BRAND = "#6C1D5F";
const TEAL = "#01AC9F";

function SectionCard({ children, accentFrom, accentTo, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
      className={clsx("glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500", className)}
    >
      <div
        className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 z-50"
        style={{
          backgroundColor: accentFrom,
          backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none z-0"
        style={{ backgroundColor: accentFrom }}
      />
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ backgroundColor: `${accentFrom}30` }}
      />
      <div className="p-5 pt-5 relative z-10">{children}</div>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, label, required, iconColor }) {
  return (
    <div className="flex items-center gap-3 mb-5 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/10 bg-white dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <label className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}

const CATEGORY_ICONS = {
  cloud: Cloud,
  devops: Activity,
  programming: FileText,
  data: TrendingUp,
  security: Eye,
  default: Tag,
};

function getCategoryIcon(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("cloud")) return Cloud;
  if (lower.includes("devops") || lower.includes("ops")) return Activity;
  if (
    lower.includes("data") ||
    lower.includes("analytics") ||
    lower.includes("ai") ||
    lower.includes("ml")
  )
    return TrendingUp;
  if (lower.includes("security") || lower.includes("cyber")) return Eye;
  if (
    lower.includes("program") ||
    lower.includes("develop") ||
    lower.includes("web") ||
    lower.includes("mobile") ||
    lower.includes("java") ||
    lower.includes("react") ||
    lower.includes("python")
  )
    return FileText;
  return Tag;
}

export default function CategoryDetail() {
  const { categorySlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);

  async function loadCategoryDetails() {
    try {
      const [catData, allCourses] = await Promise.all([
        CategoryService.getCategoryBySlug(categorySlug),
        CourseService.getCourses(),
      ]);

      setCategory(catData);

      const filteredCourses = (allCourses || []).filter(
        (course) =>
          course.categoryId === catData.id ||
          (course.categoryName && course.categoryName.toLowerCase() === catData.name.toLowerCase()),
      );
      setCourses(filteredCourses);
    } catch (err) {
      console.error(err);
      addToast("Failed to load category details.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategoryDetails();
  }, [categorySlug, addToast]);

  const handleStatusToggle = async () => {
    if (!category) return;
    const nextActiveState = !category.active;
    try {
      const updated = await CategoryService.updateCategory(category.id, {
        ...category,
        isActive: nextActiveState,
      });
      setCategory(updated || { ...category, active: nextActiveState });
      addToast(
        `Category "${category.name}" ${nextActiveState ? "activated" : "archived"}.`,
        "success",
      );
    } catch (err) {
      console.error(err);
      addToast("Failed to update category status.", "error");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await CategoryService.deleteCategory(category.id);
        addToast(`Category "${category.name}" deleted successfully`, "success");
        navigate({ to: "/admin/categories" });
      } catch (err) {
        addToast("Failed to delete category", "error");
        console.error(err);
      }
    }
  };

  if (isEditing && category) {
    return (
      <CreateCategory
        editData={category}
        onBack={() => {
          setIsEditing(false);
          loadCategoryDetails();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F] mb-4" />
        <span className="text-sm font-bold tracking-widest uppercase">Loading Category...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#6C1D5F]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-10 rounded-3xl text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-red-500" />
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Category Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            The category you are trying to view does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate({ to: "/admin/categories" })}
            className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Back to Categories
          </button>
        </motion.div>
      </div>
    );
  }

  const publishedCourses = courses.filter((c) => c.published || c.isPublished).length;
  const draftCourses = courses.length - publishedCourses;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrollmentsCount || 0), 0);
  const completionRate = 0; 
  const avgRating = 0; 
  const color = category.color || "#6C1D5F";
  const CategoryIcon = getCategoryIcon(category.name);
  const slug = category.slug || (category.name || "").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300 relative pb-12">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C1D5F]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#01AC9F]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 relative z-10">
        <button onClick={() => navigate({ to: "/admin" })} className="hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">Dashboard</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
        <button onClick={() => navigate({ to: "/admin/categories" })} className="hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">Categories</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
        <span className="text-gray-900 dark:text-white font-bold">{category.name}</span>
      </div>

      {/* Hero Header Section */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} 
        className="glass-strong !border-0 rounded-[28px] overflow-hidden relative group transition-all duration-500 mb-8 p-6 sm:p-8">
        <div className="absolute top-0 left-0 w-full h-[6px] transition-all duration-500 z-50" style={{ backgroundColor: color, backgroundImage: `linear-gradient(to right, ${color}, ${TEAL})` }} />
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(135deg, ${color}, transparent)` }} />
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start xl:items-center gap-6">
            <div className="flex items-center justify-center shrink-0 relative group/icon">
              {category.icon && !category.icon.startsWith("http") && !category.icon.startsWith("blob:") && !category.icon.startsWith("data:") ? (
                <div
                  className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex items-center justify-center shadow-lg overflow-hidden rounded-[24px] relative bg-white/60 dark:bg-black/40 backdrop-blur-md group-hover/icon:scale-105 transition-transform duration-300"
                  style={{ border: `2px solid ${color}40` }}
                >
                  <span className="text-[90px] sm:text-[100px] leading-none absolute flex items-center justify-center w-full h-full drop-shadow-sm">
                    {category.icon}
                  </span>
                </div>
              ) : category.icon ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] object-cover rounded-[24px] shadow-lg bg-white dark:bg-[#151515] group-hover/icon:scale-105 transition-transform duration-300"
                  style={{ border: `2px solid ${color}40` }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/180x180/f8fafc/94a3b8?text=${encodeURIComponent(category.name)}`;
                  }}
                />
              ) : (
                <div
                  className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex items-center justify-center shadow-lg overflow-hidden rounded-[24px] bg-white/60 dark:bg-black/40 backdrop-blur-md group-hover/icon:scale-105 transition-transform duration-300"
                  style={{ border: `2px solid ${color}40` }}
                >
                  <CategoryIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-sm" style={{ color }} />
                </div>
              )}
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap mb-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-transparent bg-clip-text tracking-tight" style={{ backgroundImage: `linear-gradient(to right, ${color}, ${TEAL})` }}>
                  {category.name}
                </h1>
                <span
                  className={clsx("inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider", category.active ? "bg-green-500 text-white" : "bg-red-500 text-white")}
                >
                  {category.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center gap-1.5 bg-gray-100/50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                    Created {category.createdAt ? new Date(category.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100/50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200/50 dark:border-white/5">
                   <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                   <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{courses.length} Courses Linked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center xl:justify-end gap-3 shrink-0">
            <button
              onClick={handleStatusToggle}
              className={clsx("inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5", category.active ? "border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 bg-white/50 dark:bg-black/20" : "border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white")}
            >
              {category.active ? <Archive className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {category.active ? "Archive" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-red-200 dark:border-red-500/20 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all bg-white/50 dark:bg-black/20 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${color}, ${TEAL})` }}
            >
              <Edit3 className="w-4 h-4" /> Edit Category
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Courses", value: courses.length, icon: BookOpen, color: "#845EC2" },
          { label: "Published", value: publishedCourses, icon: CheckCircle, color: "#01AC9F" },
          { label: "Draft", value: draftCourses, icon: Edit3, color: "#FF9671" },
        ].map((stat, i) => (
          <SectionCard key={i} accentFrom={stat.color} accentTo={stat.color} delay={0.1 + i * 0.05} className="!p-3">
             <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-2 uppercase tracking-wider">
              {stat.label}
            </p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5 tracking-tight">
              {stat.value}
            </h3>
          </SectionCard>
        ))}

        {/* Category Health (Moved from sidebar) */}
        <SectionCard accentFrom="#4A90D9" accentTo="#2980B9" delay={0.25} className="!p-3 flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Category Health</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Completion</span>
                <span className="text-xs font-black text-[#4A90D9]">{completionRate}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden shadow-inner">
                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${completionRate}%`, background: `linear-gradient(90deg, #4A90D9, #2980B9)` }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-white/10">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Avg Rating</span>
              <span className="flex items-center gap-1 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-amber-600 dark:text-amber-400">{avgRating} <span className="text-gray-400 text-[10px] font-semibold">/ 5.0</span></span>
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200/50 dark:border-white/10 flex gap-8 px-2 relative z-10 overflow-x-auto hide-scrollbar">
        {["Overview", "Courses", "Activity Log"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "pb-4 font-bold text-sm transition-all border-b-2 -mb-[1px] relative whitespace-nowrap",
              activeTab === tab
                ? "border-b-transparent text-gray-900 dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            {activeTab === tab && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-1px] left-0 w-full h-[3px] rounded-t-full" style={{ background: `linear-gradient(to right, ${color}, ${TEAL})` }} />
            )}
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div key="overview" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <SectionCard accentFrom={color} accentTo={TEAL} delay={0.2} className="!p-4">
                <SectionTitle icon={FileText} label="General Information" iconColor={color} />
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Visibility</span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100/50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-white/5">
                      {category.active ? <Globe className="w-4 h-4 text-green-500" /> : <Archive className="w-4 h-4 text-red-500" />}
                      {category.active ? "Public - Visible to all students" : "Hidden - Admin Only"}
                    </span>
                  </div>
                </div>
                <div className="pt-5 border-t border-gray-200/50 dark:border-white/10">
                  <span className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Marketing Description</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white/40 dark:bg-black/20 p-5 rounded-2xl border border-gray-100 dark:border-white/5 font-medium shadow-sm">
                    {category.description || `This category encompasses all modules related to ${category.name}. Courses cover fundamental concepts as well as advanced topics, providing a comprehensive learning experience for enterprise teams.`}
                  </p>
                </div>
              </SectionCard>

              <SectionCard accentFrom="#01AC9F" accentTo="#4A90D9" delay={0.25}>
                <div className="flex items-center justify-between mb-6">
                  <SectionTitle icon={BookOpen} label="Recent Courses" iconColor="#01AC9F" />
                  <button onClick={() => setActiveTab("Courses")} className="text-xs font-bold text-[#01AC9F] hover:underline flex items-center gap-1 group bg-[#01AC9F]/5 px-3 py-1.5 rounded-lg hover:bg-[#01AC9F]/10 transition-colors">
                    View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="py-10 text-center text-sm font-medium text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/30 dark:bg-black/10">
                    No courses linked to this category yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courses.slice(0, 4).map((course) => {
                      const isPublished = course.published || course.isPublished;
                      const students = course.enrollmentsCount || 0;
                      const courseSlug = course.slug || (course.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      return (
                        <Link key={course.id} to={`/admin/courses/${courseSlug}`} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white/60 dark:bg-black/20 hover:border-[#01AC9F]/30 hover:bg-[#01AC9F]/5 transition-all group hover:shadow-md hover:-translate-y-0.5">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#01AC9F]/10 text-[#01AC9F] flex items-center justify-center font-black text-xs shrink-0 uppercase shadow-inner">
                              {course.title ? course.title.substring(0, 2) : "CO"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#01AC9F] transition-colors truncate">{course.title}</h4>
                              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1">{students} Enrolled Learners</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={clsx("text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider", isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400")}>
                              {isPublished ? "Published" : "Draft"}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-black/40 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </SectionCard>

              <SectionCard accentFrom={color} accentTo="#FF9671" delay={0.3} className="!p-4">
                <SectionTitle icon={TrendingUp} label="Enrollment Growth" iconColor={color} />
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{ name: "Jan", students: 400 }, { name: "Feb", students: 600 }, { name: "Mar", students: 800 }, { name: "Apr", students: 1200 }, { name: "May", students: 1500 }, { name: "Jun", students: 2000 }]}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11, fontWeight: "bold" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11, fontWeight: "bold" }} dx={-10} />
                      <Tooltip
                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
                        itemStyle={{ color: color, fontWeight: "900" }}
                      />
                      <Area type="monotone" dataKey="students" stroke={color} strokeWidth={4} fillOpacity={1} fill="url(#colorStudents)" activeDot={{ r: 6, strokeWidth: 0, fill: color }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "Courses" && (
            <motion.div key="courses" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionCard accentFrom="#01AC9F" accentTo="#4A90D9" delay={0.1}>
                <div className="flex items-center justify-between mb-6">
                  <SectionTitle icon={BookOpen} label={`All Courses in ${category.name}`} iconColor="#01AC9F" />
                  <span className="text-[10px] font-black text-gray-500 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg">{courses.length} TOTAL</span>
                </div>

                {courses.length === 0 ? (
                  <div className="py-16 text-center text-sm font-medium text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-black/20">
                    <BookOpen className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    No courses linked to this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {courses.map((course) => {
                      const isPublished = course.published || course.isPublished;
                      const duration = course.duration || (course.durationHours ? `${course.durationHours} hrs` : "N/A");
                      const level = course.difficultyLevel || course.level || "Beginner";
                      const students = course.enrollmentsCount || 0;
                      const courseSlug = course.slug || (course.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      return (
                        <Link key={course.id} to={`/admin/courses/${courseSlug}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white/60 dark:bg-black/20 hover:border-[#01AC9F]/30 hover:bg-[#01AC9F]/5 transition-all group hover:shadow-md hover:-translate-y-0.5">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-[#01AC9F]/10 text-[#01AC9F] flex items-center justify-center font-black text-sm shrink-0 uppercase shadow-inner">
                              {course.title ? course.title.substring(0, 2) : "CO"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#01AC9F] transition-colors truncate">{course.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-2">
                                <span className="font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{course.courseCode || "No Code"}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>
                                <span>·</span>
                                <span className="text-orange-500">{level}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {students}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-white/5">
                            <span className={clsx("text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider", isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400")}>
                              {isPublished ? "Published" : "Draft"}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-black/40 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "Activity Log" && (
            <motion.div key="activity" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionCard accentFrom="#6C757D" accentTo="#495057" delay={0.1}>
                <SectionTitle icon={Activity} label="Activity Log" iconColor="#6C757D" />
                <div className="space-y-6 mt-6">
                  {[
                    { time: "3 hours ago", title: "Metrics Regenerated", desc: "Category detail metrics were regenerated by System Task.", icon: Activity, color: "#01AC9F" },
                    { time: "1 day ago", title: "New Course Added", desc: `Admin User published a new course in "${category.name}".`, icon: BookOpen, color: "#FF9671" },
                    { time: "2 days ago", title: "Description Updated", desc: "Category marketing description was modified by Admin User.", icon: Edit3, color: "#845EC2" },
                    { time: "5 days ago", title: "Visibility Changed", desc: "Category visibility set to Public - All Students.", icon: Eye, color: "#FF6200" },
                    { time: "1 week ago", title: "Category Created", desc: "Category was created and initialized successfully.", icon: Sparkles, color: "#01AC9F" },
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-5 relative">
                      {idx !== 4 && <div className="absolute top-8 left-[19px] w-[1.5px] h-full bg-gray-200 dark:bg-white/10 z-0" />}
                      <div className="shrink-0 relative z-10 mt-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: `${act.color}15` }}>
                          <act.icon className="w-4 h-4" style={{ color: act.color }} />
                        </div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-1.5 gap-4">
                            <h4 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-snug">{act.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap mt-0.5">{act.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{act.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-8 self-start z-10 w-full">
          <SectionCard accentFrom={color} accentTo={TEAL} delay={0.25} className="!p-4">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Quick Info</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Color Identity</span>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg shadow-sm border border-black/10 dark:border-white/10" style={{ backgroundColor: color }} />
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300 uppercase text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">{color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Total Courses</span>
                <span className="font-black text-gray-800 dark:text-white text-lg">{courses.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="text-gray-500 dark:text-gray-400 font-semibold">Total Learners</span>
                <span className="font-black text-gray-800 dark:text-white text-lg">{totalStudents.toLocaleString()}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard accentFrom="#D65DB1" accentTo="#845EC2" delay={0.3} className="!p-4">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Content Mix</p>
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ name: "Video Lectures", value: 45 }, { name: "Quizzes", value: 25 }, { name: "Assignments", value: 20 }, { name: "Reading Material", value: 10 }]} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {[{ name: "Video Lectures", value: 45 }, { name: "Quizzes", value: 25 }, { name: "Assignments", value: 20 }, { name: "Reading Material", value: 10 }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#845EC2", "#D65DB1", "#FF9671", "#FFC75F"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", fontWeight: "bold" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-black text-gray-900 dark:text-white">4</span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Types</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["Videos", "Quizzes", "Tasks", "Reading"].map((label, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: ["#845EC2", "#D65DB1", "#FF9671", "#FFC75F"][idx] }} />
                  {label}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
