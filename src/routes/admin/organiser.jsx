import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { OrganiserSidebar } from "@/components/organiser-sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  User,
  Settings,
  LogOut,
  BookOpen,
  Users,
  CalendarCheck,
  ClipboardList,
  X,
  CheckCheck,
  AlertCircle,
  Info,
  Zap,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/organiser")({
  component: OrganiserLayout,
});

// ── Mock search data ─────────────────────────────────────────────────────────
const SEARCH_DATA = [
  {
    id: 1,
    type: "Course",
    icon: BookOpen,
    label: "Cloud Architecture Masterclass",
    sub: "CS-308 • Published",
    href: "/organiser/courses",
  },
  {
    id: 2,
    type: "Course",
    icon: BookOpen,
    label: "Spring Boot Middleware Patterns",
    sub: "CS-210 • Draft",
    href: "/organiser/courses",
  },
  {
    id: 3,
    type: "Course",
    icon: BookOpen,
    label: "React Query In-Depth",
    sub: "CS-402 • Published",
    href: "/organiser/courses",
  },
  {
    id: 4,
    type: "Student",
    icon: GraduationCap,
    label: "Aryan Mehta",
    sub: "aryan.m@techuni.edu",
    href: "/organiser/students",
  },
  {
    id: 5,
    type: "Student",
    icon: GraduationCap,
    label: "Priya Sharma",
    sub: "priya.s@techuni.edu",
    href: "/organiser/students",
  },
  {
    id: 6,
    type: "Student",
    icon: GraduationCap,
    label: "Rohit Kumar",
    sub: "rohit.k@central.edu",
    href: "/organiser/students",
  },
  {
    id: 7,
    type: "Batch",
    icon: CalendarCheck,
    label: "Spring Boot Jan 2026",
    sub: "42 students • Active",
    href: "/organiser/batches",
  },
  {
    id: 8,
    type: "Batch",
    icon: CalendarCheck,
    label: "React Advanced Cohort",
    sub: "28 students • Active",
    href: "/organiser/batches",
  },
  {
    id: 9,
    type: "Assessment",
    icon: ClipboardList,
    label: "Midterm MCQ — Cloud Architecture",
    sub: "Pending 12 submissions",
    href: "/organiser/assessments",
  },
  {
    id: 10,
    type: "Assessment",
    icon: ClipboardList,
    label: "React Practical Exam",
    sub: "Graded • 84% avg",
    href: "/organiser/assessments",
  },
];

// ── Mock notifications ────────────────────────────────────────────────────────
const INITIAL_NOTIFS = [
  {
    id: 1,
    read: false,
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    title: "Submission Deadline Missed",
    body: "4 students missed the React Exam submission.",
    time: "2 min ago",
  },
  {
    id: 2,
    read: false,
    icon: Zap,
    color: "text-destructive",
    bg: "bg-destructive/10",
    title: "Batch Sync Required",
    body: "Spring Boot Jan 2026 timetable needs confirmation.",
    time: "18 min ago",
  },
  {
    id: 3,
    read: false,
    icon: Info,
    color: "text-accent-2",
    bg: "bg-accent-2/10",
    title: "New Student Enrolled",
    body: "Aryan Mehta joined Cloud Architecture Masterclass.",
    time: "1 hr ago",
  },
  {
    id: 4,
    read: true,
    icon: CheckCheck,
    color: "text-accent-2",
    bg: "bg-accent-2/10",
    title: "Report Export Ready",
    body: "Your June analytics PDF is ready to download.",
    time: "3 hr ago",
  },
  {
    id: 5,
    read: true,
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Course Published",
    body: "Spring Boot Middleware Patterns is now live.",
    time: "Yesterday",
  },
];

const TYPE_COLORS = {
  Course: "text-primary bg-primary/10",
  Student: "text-accent-2   bg-accent-2/10",
  Batch: "text-accent-2   bg-accent-2/10",
  Assessment: "text-primary-glow   bg-primary-glow/10",
};

function OrganiserLayout() {
  const [dark, setDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const unreadCount = notifs.filter((n) => !n.read).length;

  // ── Keyboard shortcut Ctrl+K ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
    else setSearchQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const filteredResults =
    searchQuery.trim().length > 0
      ? SEARCH_DATA.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sub.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : SEARCH_DATA;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <OrganiserSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden relative" style={{ zoom: 0.8 }}>
        {/* ── Top Header ─────────────────────────────────────────────────── */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/30 px-4 glass backdrop-blur-md sticky top-0 z-30 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle Sidebar"
              className="h-9 w-9 rounded-full border border-border/40 bg-card hover:bg-secondary grid place-items-center cursor-pointer transition-colors"
            >
              <Menu className="h-4.5 w-4.5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <span>Xebia</span>
              <span className="text-sm font-medium text-muted-foreground mt-1 hidden sm:block">
                Enterprise LMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Scope selector */}
            <div className="hidden md:flex items-center gap-2 text-sm border border-border/40 rounded-full px-3.5 py-1.5 bg-secondary/50 backdrop-blur-sm">
              <span className="text-muted-foreground">Scope:</span>
              <select
                className="bg-secondary/0 border-none outline-none font-semibold text-foreground cursor-pointer text-xs [color-scheme:inherit]"
                style={{ background: "transparent" }}
              >
                <option style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}>
                  University of Technology
                </option>
                <option style={{ backgroundColor: "var(--card)", color: "var(--foreground)" }}>
                  Corporate Training Corp
                </option>
              </select>
            </div>

            {/* ── Search Button ─────────────────────────────────────────── */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open global search"
              className="h-9 w-9 rounded-full border border-border/40 bg-card hover:bg-secondary grid place-items-center cursor-pointer transition-colors"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="h-9 w-9 rounded-full border border-border/40 bg-card hover:bg-secondary grid place-items-center cursor-pointer transition-colors"
            >
              {dark ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* ── Notification Button ───────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setIsDropdownOpen(false);
                }}
                aria-label="Open notifications"
                className="h-9 w-9 rounded-full border border-border/40 bg-card hover:bg-secondary grid place-items-center relative cursor-pointer transition-colors"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-11 w-80 rounded-2xl glass-strong border border-border/40 shadow-elegant z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
                        <span className="font-bold text-sm text-foreground">Notifications</span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                            >
                              Mark all read
                            </button>
                          )}
                          <button onClick={() => setNotifOpen(false)} className="cursor-pointer">
                            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Notification list */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-border/20">
                        {notifs.map((n) => (
                          <motion.div
                            key={n.id}
                            layout
                            onClick={() => markRead(n.id)}
                            className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-secondary/30 ${!n.read ? "bg-primary/[0.04]" : ""}`}
                          >
                            <div
                              className={`shrink-0 h-8 w-8 rounded-xl flex items-center justify-center ${n.bg}`}
                            >
                              <n.icon className={`w-3.5 h-3.5 ${n.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p
                                  className={`text-xs font-bold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                  {n.title}
                                </p>
                                {!n.read && (
                                  <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                {n.body}
                              </p>
                              <p className="text-[9px] text-muted-foreground/60 mt-1 font-semibold">
                                {n.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 border-t border-border/30 text-center">
                        <Link
                          to="/organiser/notifications"
                          onClick={() => setNotifOpen(false)}
                          className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          View all in Notifications →
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setNotifOpen(false);
                }}
                className="flex flex-col items-center justify-center cursor-pointer group select-none"
              >
                <img
                  src="/avatar.png"
                  className="h-9 w-9 rounded-full border border-border/40 object-cover hover:scale-105 transition-transform shadow-sm"
                  alt="Avatar"
                />
                <span className="text-[9px] text-muted-foreground font-bold mt-0.5 group-hover:text-primary transition-colors">
                  Organiser
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl glass-strong border border-border/40 shadow-elegant z-50 py-1.5 p-2 text-sm"
                    >
                      <div className="flex flex-col items-center justify-center py-3 border-b border-border/30 mb-2">
                        <img
                          src="/avatar.png"
                          className="h-12 w-12 rounded-full border border-primary/30 object-cover mb-1.5 shadow"
                          alt="Avatar"
                        />
                        <span className="font-bold text-foreground text-xs">Vikram Dev</span>
                        <span className="text-[9px] uppercase font-bold text-primary tracking-widest mt-0.5">
                          Organiser
                        </span>
                      </div>

                      <Link
                        to="/organiser/settings"
                        search={{ tab: "profile" }}
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 hover:bg-secondary/60 rounded-xl font-semibold text-xs text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-muted-foreground" /> Profile
                      </Link>
                      <Link
                        to="/organiser/settings"
                        search={{ tab: "settings" }}
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 hover:bg-secondary/60 rounded-xl font-semibold text-xs text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-muted-foreground" /> Settings
                      </Link>
                      <Link
                        to="/organiser/notifications"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 hover:bg-secondary/60 rounded-xl font-semibold text-xs text-foreground flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5 text-muted-foreground" /> Notifications
                      </Link>
                      <hr className="my-1.5 border-border/30" />
                      <Link
                        to="/"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 hover:bg-destructive/10 text-destructive rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Global Search Modal ─────────────────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
                onClick={() => setSearchOpen(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
              >
                <div className="rounded-2xl glass-strong border border-border/40 shadow-elegant overflow-hidden">
                  {/* Search input row */}
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30">
                    <Search className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses, students, batches, assessments…"
                      className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                    />
                    <div className="flex items-center gap-1.5">
                      <kbd className="hidden sm:block text-[9px] font-bold px-1.5 py-0.5 rounded border border-border/50 text-muted-foreground bg-secondary/50">
                        ESC
                      </kbd>
                      <button onClick={() => setSearchOpen(false)} className="cursor-pointer">
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="max-h-72 overflow-y-auto py-2">
                    {filteredResults.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-8">
                        No results found for "
                        <span className="font-semibold text-foreground">{searchQuery}</span>"
                      </p>
                    ) : (
                      filteredResults.map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/40 cursor-pointer transition-colors group"
                        >
                          <div
                            className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold ${TYPE_COLORS[item.type]}`}
                          >
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}
                          >
                            {item.type}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2 border-t border-border/20 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-secondary/50 font-bold">
                        ↑↓
                      </kbd>{" "}
                      navigate
                      <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-secondary/50 font-bold">
                        ↵
                      </kbd>{" "}
                      open
                      <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-secondary/50 font-bold">
                        Ctrl K
                      </kbd>{" "}
                      toggle
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Page Content ─────────────────────────────────────────────────── */}
        <main
          className="flex-1 overflow-auto relative p-4 sm:p-6 min-h-[calc(100vh-4rem)]"
          style={{ background: "var(--color-background)" }}
        >
          {/* Light mode base wash */}
          <div
            className="absolute inset-0 pointer-events-none dark:opacity-0 transition-opacity duration-500 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 20% 0%, oklch(0.92 0.06 320 / 0.45) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.9 0.07 200 / 0.35) 0%, transparent 60%)",
            }}
          />
          {/* Dark mode deep space wash */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 10% 0%, oklch(0.22 0.08 310 / 0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, oklch(0.2 0.07 200 / 0.4) 0%, transparent 60%)",
            }}
          />
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-blob pointer-events-none -z-10" />
          <div
            className="absolute bottom-10 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] animate-blob pointer-events-none -z-10"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full pointer-events-none -z-10 animate-blob"
            style={{
              background: "oklch(0.76 0.14 165 / 0.07)",
              filter: "blur(90px)",
              animationDelay: "8s",
            }}
          />
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
