import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Calendar,
  Users,
  ClipboardList,
  Video,
  MessageSquare,
  Bell,
  BarChart2,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/organiser",
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    href: "/organiser/courses",
    icon: BookOpen,
  },
  {
    name: "Content Library",
    href: "/organiser/content-library",
    icon: FolderOpen,
  },
  {
    name: "Batches & Enrolments",
    href: "/organiser/batches",
    icon: Calendar,
  },
  {
    name: "Students",
    href: "/organiser/students",
    icon: Users,
  },
  {
    name: "Assessments",
    href: "/organiser/assessments",
    icon: ClipboardList,
  },
  {
    name: "Video Lessons",
    href: "/organiser/video-lessons",
    icon: Video,
  },
  {
    name: "Engagement",
    href: "/organiser/discussions",
    icon: MessageSquare,
  },
  {
    name: "Notifications",
    href: "/organiser/notifications",
    icon: Bell,
  },
  {
    name: "Reports",
    href: "/organiser/reports",
    icon: BarChart2,
  },
  {
    name: "Profile",
    href: "/organiser/settings",
    search: { tab: "profile" },
    icon: User,
  },
  {
    name: "Settings",
    href: "/organiser/settings",
    search: { tab: "settings" },
    icon: Settings,
  },
  {
    name: "Logout",
    href: "/",
    icon: LogOut,
    isLogout: true,
  },
];

export function OrganiserSidebar({ isCollapsed, setIsCollapsed, isMobile }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <TooltipProvider>
      <motion.aside
        animate={{
          width: isCollapsed ? (isMobile ? 0 : 80) : 280,
          opacity: isCollapsed && isMobile ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full flex flex-col border-r border-border/30 bg-card/65 backdrop-blur-xl shrink-0 overflow-hidden relative z-40 select-none"
      >
        {/* Sidebar Header with Logo */}
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-4 border-b border-border/30 gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Dark mode: white logo */}
            <img
              src="/logo-white.png"
              className="hidden dark:block h-11 w-11 rounded-xl object-contain shrink-0 drop-shadow-md"
              alt="Xebia logo"
            />
            {/* Light mode: purple logo */}
            <img
              src="/logo-purple.png"
              className="block dark:hidden h-11 w-11 rounded-xl object-contain shrink-0 drop-shadow-sm"
              alt="Xebia logo"
            />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col text-left justify-center overflow-hidden"
              >
                <span className="font-display font-extrabold text-sm leading-tight tracking-wider text-foreground">
                  Xebia
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Organiser portal
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 py-4 overflow-y-hidden px-3 space-y-1.5">
          {sidebarItems
            .filter((item) => !item.isLogout)
            .map((item) => {
              const isActive =
                item.name === "Profile"
                  ? currentPath === "/organiser/settings" &&
                    (location.search?.tab === "profile" || !location.search?.tab)
                  : item.name === "Settings"
                    ? currentPath === "/organiser/settings" && location.search?.tab === "settings"
                    : currentPath === item.href ||
                      (item.href !== "/organiser" && currentPath.startsWith(item.href));

              return (
                <div key={item.name}>
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        search={item.search}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary/10 text-primary font-bold shadow-sm border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <item.icon
                          className={`h-4.5 w-4.5 shrink-0 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-xs font-semibold truncate"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        className="bg-card/95 backdrop-blur text-foreground border border-border/40 shadow-elegant font-bold text-xs rounded-lg p-2.5"
                      >
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              );
            })}

          {/* Divider + Logout */}
          <div className="pt-2 pb-1">
            <div className="border-t border-border/30 mb-2" />
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-destructive/80 hover:text-destructive hover:bg-destructive/10 font-semibold"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs font-semibold truncate"
                    >
                      Logout
                    </motion.span>
                  )}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="bg-card/95 backdrop-blur text-destructive border border-border/40 shadow-elegant font-bold text-xs rounded-lg p-2.5"
                >
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
