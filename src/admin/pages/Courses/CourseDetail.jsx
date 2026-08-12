import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";

import {
  BookOpen,
  Layers,
  Play,
  Settings,
  Activity,
  Clock,
  ArrowLeft,
  Award,
  Users,
  Star,
  FileText,
  Check,
  Edit3,
  Globe,
  ChevronRight,
  Info,
  Shield,
  Eye,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  ExternalLink,
  MoreVertical,
  EyeOff,
} from "lucide-react";
import { CourseService, CategoryService } from "@/services/api";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useAppStore } from "../../store/useAppStore";
import CreateCourse from "./CreateCourse";
import HierarchyBuilder from "./HierarchyBuilder";

export default function CourseDetail() {
  const { courseSlug } = useParams({ strict: false });
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, catData] = await Promise.all([
          CourseService.getCourseBySlug(courseSlug),
          CategoryService.getCategories(),
        ]);
        const hierarchyData = await CourseService.getCourseHierarchy(data.id);
        setCourse(hierarchyData || data);
        setCategories(catData);
      } catch (err) {
        console.error(err);
        addToast("Failed to load course details.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseSlug, addToast]);

  const handlePublishToggle = async () => {
    if (!course) return;
    const nextPublishedState = !(course.published || course.isPublished);
    try {
      const payload = {
        ...course,
        categoryId: course.category?.id || course.categoryId,
        level: course.difficultyLevel || course.level,
        shortDescription: course.subtitle || course.shortDescription,
        published: nextPublishedState,
      };
      await CourseService.updateCourse(course.id, payload);
      setCourse({ ...course, published: nextPublishedState, isPublished: nextPublishedState });
      addToast(
        `Course ${nextPublishedState ? "published" : "unpublished"} successfully`,
        "success",
      );
    } catch {
      addToast("Failed to update course status", "error");
    }
  };

  const handleActiveToggle = async () => {
    if (!course) return;
    const currentActive = course.isActive !== false && course.active !== false;
    const nextActiveState = !currentActive;
    try {
      const payload = {
        ...course,
        categoryId: course.category?.id || course.categoryId,
        level: course.difficultyLevel || course.level,
        shortDescription: course.subtitle || course.shortDescription,
        active: nextActiveState,
        isActive: nextActiveState,
      };
      await CourseService.updateCourse(course.id, payload);
      setCourse({ ...course, active: nextActiveState, isActive: nextActiveState });
      addToast(`Course ${nextActiveState ? "activated" : "deactivated"} successfully`, "success");
    } catch {
      addToast("Failed to update course status", "error");
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await CourseService.deleteCourse(course.id);
      addToast("Course deleted successfully", "success");
      navigate({ to: "/courses" });
    } catch (err) {
      addToast("Failed to delete course", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6C1D5F] mb-4"></div>
        <span>Loading course detail data...</span>
      </div>
    );
  }

  if (isEditing && course) {
    return (
      <CreateCourse
        editData={course}
        categories={categories}
        onBack={() => setIsEditing(false)}
        onSaved={(updated) => {
          setCourse(updated);
          setIsEditing(false);
        }}
      />
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The course you are trying to view does not exist or has been removed.
        </p>
        <Link to="/admin/courses" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const level = course.difficultyLevel || course.level || "Expert";
  const isPublished = course.published || course.isPublished;
  const isActive = course.isActive !== false && course.active !== false;
  const hrs = parseInt(course.durationHours) || 0;
  const mins = parseInt(course.durationMinutes) || 0;
  const duration =
    hrs > 0 || mins > 0
      ? `${hrs > 0 ? hrs + " hr" : ""}${hrs > 0 && mins > 0 ? " " : ""}${mins > 0 ? mins + " min" : ""}`
      : course.duration || "0 hr";

  const stats = {
    enrollments: course.enrollmentsCount?.toLocaleString() || "0",
    rating: course.rating ? `${course.rating} / 5` : "N/A",
    views:
      course.totalViews > 1000
        ? `${(course.totalViews / 1000).toFixed(1)}k`
        : course.totalViews || "0",
    retention: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#6C1D5F] dark:hover:text-[#84117C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course List
      </Link>

      <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-[#2e2e3e] mb-8 relative min-h-[24rem] flex flex-col justify-end group">
        {/* Background Banner */}
        <div className="absolute inset-0 z-0 bg-[#6C1D5F]/20">
          {(course.bannerImage || course.thumbnailImageUrl || course.thumbnail) && (
            <img
              src={course.bannerImage || course.thumbnailImageUrl || course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          {/* Strong gradient overlay to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 pointer-events-none" />
        </div>

        {/* Content Over Banner */}
        <div className="px-6 md:px-10 pb-10 pt-20 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-end md:items-center mt-auto">
          {/* Icon */}
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-[#15151f] rounded-2xl p-2 shadow-2xl border-4 border-white dark:border-[#2e2e3e] shrink-0 relative z-20 transition-transform duration-300 hover:-translate-y-1 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-300 dark:text-[#2e2e3e] opacity-50">
                {course.title ? course.title.substring(0, 2).toUpperCase() : "CO"}
              </span>
            </div>
            {(course.icon || course.thumbnailImageUrl || course.thumbnail) && (
              <img
                src={course.icon || course.thumbnailImageUrl || course.thumbnail}
                alt="Icon"
                className="w-full h-full object-cover rounded-xl bg-gray-100 dark:bg-gray-800 relative z-10"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(108,29,95,0.6)] tracking-wide ${isPublished ? "bg-gradient-to-r from-[#6C1D5F] to-[#84117C] text-white" : "bg-white/20 backdrop-blur-sm text-white"}`}
              >
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
              <span
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(108,29,95,0.6)] tracking-wide ${isActive ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]"}`}
              >
                {isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-100 bg-blue-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.6)] tracking-wide">
                <Award className="w-3.5 h-3.5 text-blue-300" />
                {level}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 w-full">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Edit3 className="w-4 h-4" /> Edit Course
              </button>
              <button
                onClick={handleDeleteCourse}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_20px_rgba(220,38,38,0.7)] hover:-translate-y-0.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Course
              </button>
              <button
                onClick={handlePublishToggle}
                className={`inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-md border text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 ${
                  isPublished
                    ? "bg-amber-500/20 border-amber-400/30 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                    : "bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                }`}
              >
                {isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-400" /> Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-emerald-400" /> Publish
                  </>
                )}
              </button>
              <button
                onClick={handleActiveToggle}
                className={`inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-md border text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-red-500/20 border-red-400/30 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                    : "bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                }`}
              >
                {isActive ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" /> Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: "MODULES",
            value: course.modulesCount || 0,
            icon: BookOpen,
            color: "text-[#6C1D5F] bg-[#6C1D5F]/10 dark:text-[#84117C] dark:bg-[#84117C]/20",
          },
          {
            label: "SUBMODULES",
            value: course.submodulesCount || 0,
            icon: Layers,
            color: "text-[#01AC9F] bg-[#01AC9F]/10",
          },
          {
            label: "LESSONS",
            value: course.lessonsCount || 0,
            icon: FileText,
            color: "text-orange-500 bg-orange-500/10",
          },
          {
            label: "DURATION",
            value: duration,
            icon: Clock,
            color: "text-pink-500 bg-pink-500/10",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all perspective-1000"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-b border-gray-200 dark:border-[#2e2e3e] mt-6">
        <div className="flex gap-8 px-1">
          {["Overview", "Curriculum", "Media", "Settings", "Activity", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${
                activeTab === tab
                  ? "border-[#6C1D5F] text-[#6C1D5F] dark:border-[#84117C] dark:text-[#84117C]"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div
          className={`${activeTab === "Overview" ? "lg:col-span-2" : "lg:col-span-3"} space-y-6`}
        >
          {activeTab === "Overview" && (
            <>
              <motion.div
                className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8 transition-colors perspective-1000"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.01, rotateX: 1, rotateY: 1 }}
              >
                <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-4">
                  General Information
                </h3>
                <div className="text-[14px] text-gray-800 dark:text-gray-100 leading-relaxed space-y-4">
                  {(course.subtitle || course.shortDescription) && (
                    <p className="whitespace-pre-line font-medium text-gray-700 dark:text-gray-300">
                      {course.subtitle || course.shortDescription}
                    </p>
                  )}
                  {course.description ? (
                    <p className="whitespace-pre-line">{course.description}</p>
                  ) : (
                    <>
                      <p>
                        This comprehensive course provides a deep dive into advanced cloud
                        architecture patterns. Students will learn to design highly available,
                        scalable, and secure cloud environments using industry best practices. We
                        cover multi-cloud strategies, serverless orchestration, and high-performance
                        data warehousing.
                      </p>
                      <p>
                        Whether you're preparing for expert-level certifications or designing
                        real-world enterprise systems, this course bridges the gap between
                        theoretical concepts and practical deployment.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>

              {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                <motion.div
                  className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8 relative overflow-hidden transition-colors perspective-1000"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.01, rotateX: -1, rotateY: 1 }}
                >
                  <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                    Learning Outcomes
                    <Star className="w-5 h-5 text-gray-300 dark:text-gray-600 ml-1" />
                  </h3>
                  <div className="space-y-4 text-[14px] text-gray-800 dark:text-gray-100">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6C1D5F]/10 dark:bg-[#84117C]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-[#6C1D5F] dark:text-[#84117C]" />
                        </div>
                        <span className="leading-relaxed">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {course.prerequisites && course.prerequisites.length > 0 && (
                <motion.div
                  className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8 relative overflow-hidden transition-colors perspective-1000"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.01, rotateX: 1, rotateY: -1 }}
                >
                  <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                    Prerequisites
                    <Check className="w-5 h-5 text-gray-300 dark:text-gray-600 ml-1" />
                  </h3>
                  <div className="space-y-4 text-[14px] text-gray-800 dark:text-gray-100">
                    {course.prerequisites.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6C1D5F]/10 dark:bg-[#84117C]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#6C1D5F] dark:text-[#84117C]" />
                        </div>
                        <span className="leading-relaxed">{req}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {activeTab === "Curriculum" && (
            <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8">
              <HierarchyBuilder course={course} />
            </div>
          )}
          {activeTab === "Media" && (
            <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                <Play className="w-5 h-5 text-gray-400" />
                Media Assets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Course Thumbnail
                  </h4>
                  <div className="aspect-video rounded-xl bg-gray-100 dark:bg-[#1c1c27] border-2 border-dashed border-gray-300 dark:border-[#2e2e3e] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252535] cursor-pointer transition-colors">
                    <Layers className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Upload Image</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Preview Video
                  </h4>
                  <div className="aspect-video rounded-xl bg-gray-100 dark:bg-[#1c1c27] border-2 border-dashed border-gray-300 dark:border-[#2e2e3e] flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-[#252535] cursor-pointer transition-colors">
                    <Play className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Upload Video</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Settings" && (
            <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                Course Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2e2e3e]">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Allow Enrollments</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Students can currently enroll in this course.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2e2e3e]">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Featured Course</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display this course prominently on the homepage.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Activity" && (
            <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                Recent Activity
              </h3>
              <div className="relative border-l-2 border-gray-200 dark:border-[#2e2e3e] ml-3 space-y-6 pb-4">
                {[
                  {
                    action: "Course published",
                    date: "2 hours ago",
                    icon: Globe,
                    color: "bg-emerald-500",
                  },
                  {
                    action: "Module 1 updated",
                    date: "1 day ago",
                    icon: Edit3,
                    color: "bg-blue-500",
                  },
                  {
                    action: "Course created",
                    date: "3 days ago",
                    icon: FileText,
                    color: "bg-[#6C1D5F]",
                  },
                ].map((act, i) => (
                  <div key={i} className="pl-6 relative">
                    <div
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#15151f] ${act.color}`}
                    />
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      {act.action}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{act.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "Analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-[#84117C] mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Course Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* BarChart for Module Completion */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="perspective-1000"
                >
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Module Completion Rate
                  </h4>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Mod 1", complete: 95 },
                          { name: "Mod 2", complete: 85 },
                          { name: "Mod 3", complete: 70 },
                          { name: "Mod 4", complete: 45 },
                          { name: "Mod 5", complete: 20 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#888", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#888", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "#f3f4f6" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar dataKey="complete" fill="#6C1D5F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* RadarChart for Engagement Dimensions */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="perspective-1000"
                >
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Student Engagement
                  </h4>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={[
                          { subject: "Video Watch", A: 120, fullMark: 150 },
                          { subject: "Quiz Score", A: 98, fullMark: 150 },
                          { subject: "Discussion", A: 86, fullMark: 150 },
                          { subject: "Downloads", A: 99, fullMark: 150 },
                          { subject: "Feedback", A: 85, fullMark: 150 },
                        ]}
                      >
                        <PolarGrid stroke="#eee" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 11 }} />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 150]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Engagement"
                          dataKey="A"
                          stroke="#01AC9F"
                          fill="#01AC9F"
                          fillOpacity={0.4}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#6C1D5F] dark:text-[#84117C]">
                  Course Status
                </h3>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" /> Enrollments
                  </div>
                  <span className="font-bold text-[#6C1D5F] dark:text-[#84117C]">
                    {stats.enrollments}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <Star className="w-4 h-4 text-orange-400" /> Avg. Rating
                  </div>
                  <span className="font-bold text-[#6C1D5F] dark:text-[#84117C]">
                    {stats.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" /> Profile Views
                  </div>
                  <span className="font-bold text-[#6C1D5F] dark:text-[#84117C]">
                    {stats.views}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2e2e3e]">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  <span>Retention Rate</span>
                  <span className="text-gray-400 dark:text-gray-500">High</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-[#252535] rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#6C1D5F] to-[#01AC9F]"
                    style={{ width: `${stats.retention}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {stats.retention}%
                </span>
              </div>
            </div>

            {(() => {
              const highlights = Array.isArray(course.highlights)
                ? course.highlights
                : course.highlights
                  ? course.highlights.split("\n").filter(Boolean)
                  : [];
              return (
                <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                    Course Highlights
                    <Award className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto" />
                  </h3>
                  {highlights.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                      {highlights.map((highlight, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No highlights provided.</p>
                  )}
                </div>
              );
            })()}

            {(() => {
              const opportunities = Array.isArray(course.careerOpportunities)
                ? course.careerOpportunities
                : course.careerOpportunities
                  ? course.careerOpportunities.split("\n").filter(Boolean)
                  : [];
              return (
                <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 transition-colors">
                  <h3 className="text-lg font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                    Career Opportunities
                    <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto" />
                  </h3>
                  {opportunities.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                      {opportunities.map((opp, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {opp}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No career opportunities provided.
                    </p>
                  )}
                </div>
              );
            })()}

            {course.targetAudience && course.targetAudience.length > 0 && (
              <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 transition-colors">
                <h3 className="text-lg font-bold text-[#6C1D5F] dark:text-[#84117C] mb-6 flex items-center gap-2">
                  Target Audience
                  <Users className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto" />
                </h3>
                <ul className="list-disc pl-5 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                  {course.targetAudience.map((audience, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
