import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Tag,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  GraduationCap,
  Users,
} from "lucide-react";
import { CourseService, CategoryService } from "@/services/api";
import { Link } from "@tanstack/react-router";
import { useAppStore } from "../../store/useAppStore";
import { clsx } from "clsx";
import { PageEntrance, PageEntranceItem } from "@/components/ui/page-entrance";

const LEVEL_COLORS = {
  Beginner:
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20 dark:border-emerald-500/20",
  Intermediate:
    "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-600/20 dark:border-purple-500/20",
  Advanced:
    "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-600/20 dark:border-orange-500/20",
  Expert:
    "bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-300 border-gray-600/20 dark:border-gray-500/20",
};

export default function Dashboard() {
  const { addToast } = useAppStore();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCategories: 0,
    publishedCourses: 0,
    draftCourses: 0,
    activeCategories: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [courses, categories] = await Promise.all([
          CourseService.getCourses(),
          CategoryService.getCategories(),
        ]);

        const courseList = courses || [];
        const categoryList = categories || [];

        const published = courseList.filter((c) => c.published || c.isPublished).length;
        const activeCats = categoryList.filter((c) => c.active).length;

        setStats({
          totalCourses: courseList.length,
          totalCategories: categoryList.length,
          publishedCourses: published,
          draftCourses: courseList.length - published,
          activeCategories: activeCats,
        });

        // Get 4 most recent courses
        const sortedCourses = [...courseList].sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        setRecentCourses(sortedCourses.slice(0, 4));
      } catch (err) {
        console.error(err);
        addToast("Failed to load dashboard metrics.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [addToast]);

  return (
    <PageEntrance className="x-dashboard-shell">
      <PageEntranceItem>
        <div className="relative overflow-hidden rounded-[var(--radius-soft)] bg-gradient-to-r from-primary via-primary-glow to-accent-2 p-6 text-primary-foreground shadow-[var(--shadow-elegant)] sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <p className="x-micro-copy text-primary-foreground/70">Admin Portal</p>
            <h1 className="font-display text-[var(--text-xl)] font-bold tracking-tight">Xebia LMS</h1>
            <p className="text-sm font-normal text-primary-foreground/90">
              Monitor platform metrics, manage courses and learning paths, and coordinate enterprise curriculum.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 rounded-[var(--radius-soft)] bg-card px-4 py-2 text-xs font-semibold text-primary shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-px active:scale-[0.98]"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Manage Courses
              </Link>
              <Link
                to="/admin/categories"
                className="inline-flex items-center gap-2 rounded-[var(--radius-soft)] border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold text-primary-foreground transition-[transform,background-color] duration-150 hover:bg-primary-foreground/20 active:scale-[0.98]"
              >
                <Tag className="h-3.5 w-3.5" />
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        {[
          {
            label: "Total Courses",
            value: stats.totalCourses,
            icon: BookOpen,
            color: "text-primary bg-primary/10",
            description: `${stats.publishedCourses} Published, ${stats.draftCourses} Draft`,
          },
          {
            label: "Categories",
            value: stats.totalCategories,
            icon: Tag,
            color: "text-accent-2 bg-accent-2/10",
            description: `${stats.activeCategories} Active categories`,
          },
          {
            label: "Published",
            value: stats.publishedCourses,
            icon: CheckCircle,
            color: "text-accent-2 bg-accent-2/10",
            description: "Live & available to learners",
          },
          {
            label: "Under Construction",
            value: stats.draftCourses,
            icon: Clock,
            color: "text-destructive bg-destructive/10",
            description: "Draft / In-progress courses",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="x-card x-bento-span-3 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="x-micro-copy text-muted-foreground">{kpi.label}</p>
                <h3 className="mt-2 font-display text-[var(--text-xl)] font-bold tracking-tight text-foreground">
                  {loading ? "..." : kpi.value}
                </h3>
              </div>
              <div className={`rounded-[var(--radius-soft)] p-3 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">{kpi.description}</p>
          </div>
        ))}
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <div className="x-card x-bento-span-8 flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="x-section-title text-base">Recently Created Courses</h2>
              <p className="x-section-subtitle text-xs">Latest curriculums and learning materials added</p>
            </div>
            <Link
              to="/admin/courses"
              className="flex items-center gap-1 text-xs font-semibold text-accent-2"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading courses...</div>
          ) : recentCourses.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No courses available. Create one to get started!
            </div>
          ) : (
            <div className="space-y-3.5 flex-1">
              {recentCourses.map((course) => {
                const isPublished = course.published || course.isPublished;
                const courseSlug =
                  course.slug || (course.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const level = course.difficultyLevel || course.level || "Beginner";
                const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${courseSlug}`}
                    className="group flex items-center gap-4 rounded-[var(--radius-soft)] border border-border p-4 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-px hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-soft)] bg-primary/10 text-[13px] font-bold uppercase text-primary shadow-sm">
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        {course.title ? course.title.substring(0, 2) : "CO"}
                      </div>
                      {(course.icon || course.thumbnailImageUrl || course.thumbnail) && (
                        <img
                          src={course.icon || course.thumbnailImageUrl || course.thumbnail}
                          alt=""
                          className="w-full h-full object-contain p-1 relative z-10"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {course.title}
                      </h4>
                      <span
                        className={clsx(
                          "text-xs font-bold px-2 py-0.5 rounded-full border shrink-0",
                          levelColor,
                        )}
                      >
                        {level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isPublished
                            ? "bg-accent-2/10 text-accent-2"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="x-card x-bento-span-4 flex flex-col p-6">
          <h2 className="x-section-title mb-4 border-b border-border pb-3 text-base">
            Quick Creator Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/categories"
              className="x-card flex items-center gap-3.5 p-4 text-foreground transition-colors hover:text-accent-2"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-soft)] bg-accent-2 text-accent-foreground shadow-sm">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-sm font-semibold">New Category</span>
                <span className="text-xs font-normal text-muted-foreground">Create course categories</span>
              </div>
            </a>

            <a
              href="/admin/courses"
              className="x-card flex items-center gap-3.5 p-4 text-foreground transition-colors hover:text-primary"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-soft)] bg-primary text-primary-foreground shadow-sm">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-sm font-semibold">New Course</span>
                <span className="text-xs font-normal text-muted-foreground">Add a course curriculum</span>
              </div>
            </a>

            <Link
              to="/admin/curriculum"
              className="x-card flex items-center gap-3.5 p-4 text-foreground transition-colors hover:text-destructive"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-soft)] bg-destructive text-destructive-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-sm font-semibold">Organiser</span>
                <span className="text-xs font-normal text-muted-foreground">Manage learning schedules</span>
              </div>
            </Link>
          </div>
        </div>
      </PageEntranceItem>
    </PageEntrance>
  );
}
