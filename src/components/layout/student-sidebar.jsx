import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Award,
  Bell,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { studentProfile } from "@/features/student/mocks/dummy-data";
import { clsx } from "clsx";
import { useAppStore } from "@/admin/store/useAppStore";
import { useEffect } from "react";

const navItems = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "My Courses", href: "/student/courses", icon: BookOpen },
  { name: "My Batches", href: "/student/batches", icon: CalendarDays },
  { name: "Assessments", href: "/student/assessments", icon: ClipboardCheck },
  { name: "Results", href: "/student/results", icon: Award },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "Feedback", href: "/student/feedback", icon: MessageSquare },
];

export function StudentSidebar({ isMobileOpen, setIsMobileOpen, isSidebarCollapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { setActiveSidebarItem } = useAppStore();

  const initials = studentProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Update breadcrumb based on current path
  useEffect(() => {
    const activeItem = navItems.find((item) =>
      item.href === "/student"
        ? currentPath === "/student" || currentPath === "/student/"
        : currentPath.startsWith(item.href),
    );
    if (activeItem) {
      setActiveSidebarItem(activeItem.name);
    }
  }, [currentPath, setActiveSidebarItem]);

  const handleNavClick = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <div className={clsx("sidebar sidebar-student", isSidebarCollapsed && "collapsed")}>
      {/* Brand */}
      <div className="sidebar-brand">
        <Link
          to="/student"
          onClick={() => handleNavClick()}
          className="logo"
          style={{ textDecoration: "none" }}
        >
          <div className="logo-mark">
            <span>X</span>
          </div>
          <div>
            <div className="logo-text">Xebia LMS</div>
            <div className="logo-sub">Student Portal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="nav-section">Main Menu</div>

        {navItems.map((item) => {
          const isActive =
            item.href === "/student"
              ? currentPath === "/student" || currentPath === "/student/"
              : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => handleNavClick()}
              className={clsx("nav-item", isActive && "active")}
              style={{ textDecoration: "none" }}
            >
              <item.icon className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="sidebar-footer">
        <div className="sidebar-user" style={{ textDecoration: "none" }}>
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{studentProfile.name}</div>
          </div>
        </div>
        <button className="sidebar-user w-full text-left mt-1 border-none bg-transparent">
          <div className="user-avatar" style={{ background: "transparent", color: "inherit" }}>
            <LogOut className="w-[18px] h-[18px] opacity-60" />
          </div>
          <div className="user-info">
            <div className="user-name text-destructive">Logout</div>
          </div>
        </button>
      </div>
    </div>
  );
}
