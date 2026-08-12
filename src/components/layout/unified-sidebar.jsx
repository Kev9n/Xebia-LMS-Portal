import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Award,
  Bell,
  MessageSquare,
  LogOut,
  User,
  Tag,
  Layers,
  PieChart,
  Users,
  Clock,
  Briefcase,
  Brain,
  ShieldCheck,
  TrendingUp,
  Activity,
  Award as AwardIcon,
  Wallet,
  GraduationCap,
  Target,
  Lightbulb,
  LineChart,
  BarChart2,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";
import { studentProfile } from "@/features/student/mocks/dummy-data";
import { useAppStore } from "@/admin/store/useAppStore";
import { useLMS } from "../../context/LMSContext";
import { clsx } from "clsx";
import logoPurple from "@/assets/logo-purple.png";
import logoWhite from "@/assets/logo-white.png";
import { useDarkMode } from "@/features/student/hooks/use-dark-mode";

const navConfig = Object.freeze({
  student: Object.freeze([
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Courses", href: "/student/courses", icon: BookOpen },
    { name: "My Batches", href: "/student/batches", icon: CalendarDays },
    { name: "Events", href: "/student/events", icon: CalendarDays },
    { name: "Assessments", href: "/student/assessments", icon: ClipboardCheck },
    { name: "Results", href: "/student/results", icon: Award },
    { name: "Notifications", href: "/student/notifications", icon: Bell },
    { name: "Feedback", href: "/student/feedback", icon: MessageSquare },
  ]),
  trainer: Object.freeze([
    { name: "Dashboard", href: "/trainer", icon: LayoutDashboard },
    { name: "Batches", href: "/trainer/batches", icon: Users },
    { name: "Events", href: "/trainer/events", icon: CalendarDays },
    { name: "Assessment Builder", href: "/trainer/assessment-builder", icon: Layers },
    { name: "Evaluation", href: "/trainer/evaluation", icon: ClipboardCheck },
    { name: "Leaderboard", href: "/trainer/leaderboard", icon: Award },
    { name: "Reports", href: "/trainer/reports", icon: PieChart },
    { name: "Notifications", href: "/trainer/notifications", icon: Bell },
  ]),
  admin: Object.freeze([
    Object.freeze({ name: "Dashboard", href: "/admin", icon: LayoutDashboard }),
    Object.freeze({ name: "Notifications", href: "/admin/notifications", icon: Bell }),
    Object.freeze({ name: "Categories", href: "/admin/categories", icon: Tag }),
    Object.freeze({ name: "Courses", href: "/admin/courses", icon: BookOpen }),
    Object.freeze({ name: "Curriculum", href: "/admin/curriculum", icon: Layers }),
    Object.freeze({ name: "Events", href: "/admin/events", icon: CalendarDays }),
    Object.freeze({ name: "Users", href: "/admin/users", icon: Users }),
    Object.freeze({ isDivider: true, name: "Batch Management" }),
    Object.freeze({ name: "Overview", href: "/admin/batches", icon: LayoutDashboard, section: "batch" }),
    Object.freeze({ name: "Analytics", href: "/admin/batches/analytics", icon: PieChart, section: "batch" }),
    Object.freeze({ name: "Allocations", href: "/admin/batches/allocations", icon: ClipboardCheck, section: "batch" }),
    Object.freeze({ name: "Allocate Course", href: "/admin/batches/allocate", icon: GraduationCap, section: "batch" }),
    Object.freeze({ name: "Trainer Workload", href: "/admin/batches/trainers", icon: Users, section: "batch" }),
    Object.freeze({ isDivider: true, name: "Assessment Management" }),
    Object.freeze({ name: "Overview", href: "/admin/assessments", icon: ClipboardCheck, section: "assessment" }),
    Object.freeze({ name: "Analytics", href: "/admin/assessments/analytics", icon: PieChart, section: "assessment" }),
    Object.freeze({ isDivider: true, name: "Analytics Hub" }),
    Object.freeze({ name: "Executive Overview", href: "/admin/analytics/executive", icon: LayoutDashboard, section: "analytics" }),
    Object.freeze({ name: "Learning Coverage", href: "/admin/analytics/coverage", icon: Users, section: "analytics" }),
    Object.freeze({ name: "Learning Hours", href: "/admin/analytics/hours", icon: Clock, section: "analytics" }),
    Object.freeze({ name: "Learning Pillars", href: "/admin/analytics/pillars", icon: Briefcase, section: "analytics" }),
    Object.freeze({ name: "AI Transformation", href: "/admin/analytics/ai", icon: Brain, section: "analytics" }),
    Object.freeze({ name: "Certifications", href: "/admin/analytics/certifications", icon: ShieldCheck, section: "analytics" }),
    Object.freeze({ name: "Flagship Programs", href: "/admin/analytics/programs", icon: AwardIcon, section: "analytics" }),
    Object.freeze({ name: "Learning Trends", href: "/admin/analytics/trends", icon: TrendingUp, section: "analytics" }),
    Object.freeze({ name: "Effectiveness", href: "/admin/analytics/effectiveness", icon: Activity, section: "analytics" }),
    Object.freeze({ name: "Learning Champions", href: "/admin/analytics/champions", icon: AwardIcon, section: "analytics" }),
    Object.freeze({ name: "Project Investment", href: "/admin/analytics/investment", icon: Wallet, section: "analytics" }),
    Object.freeze({ name: "Apprentice Journey", href: "/admin/analytics/apprentice", icon: GraduationCap, section: "analytics" }),
    Object.freeze({ isDivider: true, name: "Future Enhancements" }),
    Object.freeze({ name: "Skill Gap", href: "/admin/analytics/skill-gap", icon: Target, section: "analytics" }),
    Object.freeze({ name: "Recommendations", href: "/admin/analytics/recommendations", icon: Lightbulb, section: "analytics" }),
    Object.freeze({ name: "Predictive Analytics", href: "/admin/analytics/predictive", icon: LineChart, section: "analytics" }),
  ]),
});

const portalTitles = {
  student: "Student Portal",
  trainer: "Trainer Portal",
  admin: "Admin Portal",
  analytics: "Analytics Hub",
};

export function UnifiedSidebar({ isMobileOpen, setIsMobileOpen, portalType = "student" }) {
  const { isSidebarCollapsed, adminProfile, setActiveSidebarItem, setBreadcrumbs } = useAppStore();
  const { currentUser } = useLMS();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isBatchMgmtOpen, setIsBatchMgmtOpen] = useState(true);
  const [isAssessmentMgmtOpen, setIsAssessmentMgmtOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isDark = useDarkMode();

  // Deep clone navItems and deduplicate by href to prevent any rendering duplication
  const navItems = useMemo(() => {
    const source = navConfig[portalType] || navConfig.student;
    const cloned = source.map((item) => ({ ...item }));
    const seen = new Set();
    return cloned.filter((item) => {
      if (item.isDivider) return true;
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
  }, [portalType]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let activeItem = null;

    for (const item of navItems) {
      if (item.isDivider) continue;

      const isExactMatch = item.href === `/${portalType}`;
      if (isExactMatch) {
        if (currentPath === `/${portalType}` || currentPath === `/${portalType}/`) {
          activeItem = item;
          break;
        }
      } else if (currentPath.startsWith(item.href)) {
        if (!activeItem || item.href.length > activeItem.href.length) {
          activeItem = item;
        }
      }
    }

    if (activeItem) {
      setActiveSidebarItem(activeItem.name);

      const crumbs = [];
      if (portalType === "admin") {
        crumbs.push({ label: "Admin", href: "/admin" });
        if (activeItem.href?.startsWith("/admin/analytics") && activeItem.name !== "Dashboard") {
          crumbs.push({ label: "Analytics", href: "/admin/analytics/executive" });
        }
      } else if (portalType === "student") {
        crumbs.push({ label: "Student", href: "/student" });
      }

      if (activeItem.name !== "Dashboard") {
        crumbs.push({ label: activeItem.name, href: activeItem.href });
      } else {
        crumbs.push({ label: "Dashboard", href: activeItem.href });
      }

      setBreadcrumbs(crumbs);
    }
  }, [currentPath, portalType, navItems, setActiveSidebarItem, setBreadcrumbs]);

  const handleNavClick = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const portalTitle = portalTitles[portalType] || "Portal";

  const profileName =
    portalType === "student"
      ? currentUser?.name || "Student"
      : portalType === "trainer"
        ? currentUser?.name || "Trainer User"
        : adminProfile?.name || "Admin User";
  const initials = profileName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={clsx("sidebar sidebar-student", isMobileOpen && "mobile-open", isSidebarCollapsed && !isMobileOpen && "collapsed")}>
      {/* Brand */}
      <div className="sidebar-brand">
        <Link
          to="/"
          onClick={() => handleNavClick()}
          className="logo"
          style={{ textDecoration: "none" }}
        >
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src={isDark ? logoWhite : logoPurple}
              alt="Xebia Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="logo-text">Xebia LMS</div>
            <div className="logo-sub">{portalTitle}</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav custom-scrollbar overflow-y-auto">
        <div className="nav-section">Main Menu</div>

        {navItems.map((item, index) => {
          // Hide analytics section items if collapsed
          if (item.section === "analytics" && !isAnalyticsOpen) {
            return null;
          }
          if (item.name === "Future Enhancements" && !isAnalyticsOpen) {
            return null;
          }

          // Hide batch management items if collapsed
          if (item.section === "batch" && !isBatchMgmtOpen) {
            return null;
          }

          // Hide assessment management items if collapsed
          if (item.section === "assessment" && !isAssessmentMgmtOpen) {
            return null;
          }

          if (item.isDivider) {
            if (item.name === "Batch Management") {
              return (
                <div
                  key={`divider-batch`}
                  className="nav-section mt-6 mb-2 text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-white opacity-90 cursor-pointer flex items-center justify-between hover:opacity-100 transition-opacity min-h-[44px] py-2"
                  onClick={() => setIsBatchMgmtOpen(!isBatchMgmtOpen)}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {item.name}
                  </span>
                  <span>
                    {isBatchMgmtOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              );
            }
            if (item.name === "Assessment Management") {
              return (
                <div
                  key={`divider-assessment`}
                  className="nav-section mt-6 mb-2 text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-white opacity-90 cursor-pointer flex items-center justify-between hover:opacity-100 transition-opacity min-h-[44px] py-2"
                  onClick={() => setIsAssessmentMgmtOpen(!isAssessmentMgmtOpen)}
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    {item.name}
                  </span>
                  <span>
                    {isAssessmentMgmtOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              );
            }
            if (item.name === "Analytics Hub") {
              return (
                <div
                  key={`divider-analytics`}
                  className="nav-section mt-6 mb-2 text-[11px] uppercase tracking-wider font-bold text-gray-900 dark:text-white opacity-90 cursor-pointer flex items-center justify-between hover:opacity-100 transition-opacity min-h-[44px] py-2"
                  onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                >
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5" />
                    {item.name}
                  </span>
                  <span>
                    {isAnalyticsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={`divider-${index}`}
                className="nav-section mt-6 mb-2 text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 opacity-90"
              >
                {item.name}
              </div>
            );
          }
          const isPortalRoot = item.href === `/${portalType}` || item.href === `/${portalType}/`;
          const isActive = isPortalRoot
            ? currentPath === item.href || currentPath === item.href + "/"
            : currentPath === item.href;

          return (
            <div
              key={item.href}
              onClick={() => {
                navigate({ to: item.href });
                handleNavClick();
              }}
              className={clsx("nav-item", isActive && "active")}
              style={{ textDecoration: "none", cursor: "pointer" }}
            >
              <item.icon className="nav-icon" />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="sidebar-footer">
        <div className="sidebar-user" style={{ textDecoration: "none" }}>
          <div className="user-avatar" style={{ background: "rgba(255,255,255,0.1)" }}>
            {mounted ? initials : ""}
          </div>
          <div className="user-info">
            <div className="user-name">{mounted ? profileName : "Loading..."}</div>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("lms_token");
            window.location.href = "/";
          }}
          className="sidebar-user w-full text-left mt-1 border-none bg-transparent"
        >
          <div className="user-avatar" style={{ background: "transparent", color: "inherit" }}>
            <LogOut className="w-[18px] h-[18px] opacity-60 text-destructive" />
          </div>
          <div className="user-info">
            <div className="user-name text-destructive">Logout</div>
          </div>
        </button>
      </div>
    </div>
  );
}
