import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  Tag,
  Layers,
  LogOut,
  LayoutDashboard,
  PieChart,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  BarChart,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import logoPurple from "../../../assets/logo-purple.png";
import logoWhite from "../../../assets/logo-white.png";

const NavItem = ({ icon: Icon, label, isActive, onClick, hasChildren, isExpanded, hideArrow }) => (
  <div
    onClick={onClick}
    className={clsx(
      "nav-item flex items-center justify-between cursor-pointer",
      isActive && "active",
    )}
  >
    <div className="flex items-center gap-3 w-full">
      <Icon className="nav-icon" />
      <span className="flex-1 text-left">{label}</span>
      {hasChildren &&
        !hideArrow &&
        (isExpanded ? (
          <ChevronDown className="w-4 h-4 opacity-50 ml-auto" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-50 ml-auto" />
        ))}
    </div>
  </div>
);

const SubNavItem = ({ label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      "px-10 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-colors duration-200 min-h-[40px] flex items-center",
      isActive
        ? "text-primary bg-primary/10 font-bold dark:bg-white dark:text-[#4A1E47]"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/15",
    )}
  >
    {label}
  </div>
);

export function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const router = useRouter();
  const location = useLocation();
  const currentPath = location.pathname;
  const { setActiveSidebarItem, adminProfile, isSidebarCollapsed, toggleSidebar } = useAppStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(
    currentPath.startsWith("/admin/analytics"),
  );

  useEffect(() => {
    if (currentPath === "/admin" || currentPath === "/admin/") {
      setActiveSidebarItem("Dashboard");
    } else if (currentPath.startsWith("/admin/courses")) {
      setActiveSidebarItem("Courses");
    } else if (currentPath.startsWith("/admin/categories")) {
      setActiveSidebarItem("Categories");
    } else if (currentPath.startsWith("/admin/curriculum")) {
      setActiveSidebarItem("Curriculum");
    } else if (currentPath.startsWith("/admin/analytics")) {
      setActiveSidebarItem("Analytics");
      if (!isSidebarCollapsed) {
        setIsAnalyticsExpanded(true);
      }
    }
  }, [currentPath, setActiveSidebarItem, isSidebarCollapsed]);

  // Auto-close sidebar on mobile when navigating
  const handleNavClick = (path) => {
    router.navigate({ to: path });
    if (isMobile && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // On mobile, use isMobileOpen to control visibility
  // On desktop, use isSidebarCollapsed for width toggle
  const shouldShowOnMobile = isMobile ? isMobileOpen : true;
  const isCollapsed = isMobile ? !isMobileOpen : isSidebarCollapsed;

  return (
    <>
      <aside
        className={clsx(
          "sidebar sidebar-admin bg-white dark:bg-[#15151f]",
          isMobile && !isMobileOpen && "collapsed",
          isMobile && isMobileOpen && "mobile-open",
          !isMobile && isSidebarCollapsed && "collapsed",
        )}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="logo cursor-pointer" onClick={() => handleNavClick("/")}>
            <div className="logo-mark">
              <span>X</span>
            </div>
            <div>
              <div className="logo-text">Xebia LMS</div>
              <div className="logo-sub">Enterprise Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav custom-scrollbar" style={{ overflowY: "auto" }}>
          <div className="nav-section">Dashboard ⭐</div>

          <NavItem
            icon={LayoutDashboard}
            label="Course & Content"
            isActive={currentPath === "/"}
            onClick={() => handleNavClick("/")}
          />

          <div className="nav-section mt-4">Analytics</div>
          <NavItem
            icon={PieChart}
            label="Analytics Hub"
            isActive={currentPath.startsWith("/admin/analytics")}
            hasChildren={true}
            isExpanded={isAnalyticsExpanded}
            hideArrow={isSidebarCollapsed}
            onClick={() => {
              if (isSidebarCollapsed) {
                handleNavClick("/admin/analytics/executive");
              } else {
                setIsAnalyticsExpanded(!isAnalyticsExpanded);
                if (!isAnalyticsExpanded && currentPath === "/") {
                  handleNavClick("/admin/analytics/executive");
                }
              }
            }}
          />

          {!isSidebarCollapsed && isAnalyticsExpanded && (
            <div className="flex flex-col gap-1 mt-1 mb-2 animate-in slide-in-from-top-2 duration-200">
              <SubNavItem
                label="Executive Overview"
                isActive={currentPath === "/admin/analytics/executive"}
                onClick={() => handleNavClick("/admin/analytics/executive")}
              />
              <SubNavItem
                label="Learning Coverage"
                isActive={currentPath === "/admin/analytics/coverage"}
                onClick={() => handleNavClick("/admin/analytics/coverage")}
              />
              <SubNavItem
                label="Learning Hours"
                isActive={currentPath === "/admin/analytics/hours"}
                onClick={() => handleNavClick("/admin/analytics/hours")}
              />
              <SubNavItem
                label="Learning Pillars"
                isActive={currentPath === "/admin/analytics/pillars"}
                onClick={() => handleNavClick("/admin/analytics/pillars")}
              />
              <SubNavItem
                label="AI Transformation"
                isActive={currentPath === "/admin/analytics/ai-transformation"}
                onClick={() => handleNavClick("/admin/analytics/ai-transformation")}
              />
              <SubNavItem
                label="Certifications"
                isActive={currentPath === "/admin/analytics/certifications"}
                onClick={() => handleNavClick("/admin/analytics/certifications")}
              />
              <SubNavItem
                label="Flagship Programs"
                isActive={currentPath === "/admin/analytics/flagship-programs"}
                onClick={() => handleNavClick("/admin/analytics/flagship-programs")}
              />
              <SubNavItem
                label="Learning Trends"
                isActive={currentPath === "/admin/analytics/learning-trends"}
                onClick={() => handleNavClick("/admin/analytics/learning-trends")}
              />
              <SubNavItem
                label="Training Effectiveness"
                isActive={currentPath === "/admin/analytics/training-effectiveness"}
                onClick={() => handleNavClick("/admin/analytics/training-effectiveness")}
              />
              <SubNavItem
                label="Learning Champions"
                isActive={currentPath === "/admin/analytics/learning-champions"}
                onClick={() => handleNavClick("/admin/analytics/learning-champions")}
              />
              <SubNavItem
                label="Project Investment"
                isActive={currentPath === "/admin/analytics/project-investment"}
                onClick={() => handleNavClick("/admin/analytics/project-investment")}
              />
              <SubNavItem
                label="Fresher Journey"
                isActive={currentPath === "/admin/analytics/fresher-journey"}
                onClick={() => handleNavClick("/admin/analytics/fresher-journey")}
              />
            </div>
          )}

          <div className="nav-section mt-4">Management</div>
          <NavItem
            icon={Tag}
            label="Categories"
            isActive={
              currentPath === "/admin/categories" ||
              currentPath === "/admin/categories/" ||
              currentPath.startsWith("/admin/categories/")
            }
            onClick={() => handleNavClick("/admin/categories")}
          />
          <NavItem
            icon={BookOpen}
            label="Courses"
            isActive={
              currentPath === "/admin/courses" ||
              currentPath === "/admin/courses/" ||
              currentPath.startsWith("/admin/courses/")
            }
            onClick={() => handleNavClick("/admin/courses")}
          />
          <NavItem
            icon={Layers}
            label="Curriculum"
            isActive={
              currentPath === "/admin/curriculum" || currentPath.startsWith("/admin/curriculum")
            }
            onClick={() => handleNavClick("/admin/curriculum")}
          />
          <NavItem
            icon={LogOut}
            label="Student Portal"
            isActive={false}
            onClick={() => handleNavClick("/student")}
          />
        </div>

        {/* Footer */}
        <div className="sidebar-footer mt-auto">
          <div
            onClick={() => {
              localStorage.removeItem("lms_token");
              window.close();
            }}
            className="sidebar-user"
          >
            <div className="user-avatar overflow-hidden">
              {adminProfile?.image ? (
                <img
                  src={adminProfile.image}
                  alt={adminProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{adminProfile?.name?.charAt(0) || "A"}</span>
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{adminProfile?.name || "Admin User"}</div>
              <div className="user-role">{adminProfile?.email || "admin@xebia.com"}</div>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen && setIsMobileOpen(false)} />
      )}
      {!isMobile && !isSidebarCollapsed && (
        <div className="sidebar-overlay md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
}
