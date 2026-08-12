import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLMS } from "../context/LMSContext";
import { toast } from "../components/Toast";
import {
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Moon,
  Sun,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/brand/wordmark";
import { PageEntrance, PageEntranceItem } from "@/components/ui/page-entrance";

const PORTALS = [
  { id: "teacher", label: "Trainer", icon: ShieldCheck },
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "admin", label: "Admin", icon: Layers },
];

export const Login = () => {
  const { login, teachers, students, theme, toggleTheme } = useLMS();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.add("Please enter your email address", "warning");
      return;
    }

    if (role === "admin") {
      toast.add("Login Successful! Welcome back.", "success");
      navigate({ to: "/admin" });
      return;
    }

    const success = login(email, role);
    if (success) {
      toast.add("Login Successful! Welcome back.", "success");
      navigate({ to: role === "teacher" ? "/trainer" : "/student" });
    } else {
      toast.add(
        `Could not find a ${role} with that email. Try using the quick accounts selector.`,
        "error",
      );
    }
  };

  const handleQuickLogin = (quickEmail, quickRole) => {
    setEmail(quickEmail);
    setRole(quickRole);
    if (quickRole === "admin") {
      toast.add("Logged in successfully!", "success");
      navigate({ to: "/admin" });
      return;
    }
    const success = login(quickEmail, quickRole);
    if (success) {
      toast.add("Logged in successfully!", "success");
      navigate({ to: quickRole === "teacher" ? "/trainer" : "/student" });
    }
  };

  const demoTeachers = teachers.slice(0, 3);
  const demoStudents = students.slice(0, 3);

  const emailPlaceholder =
    role === "teacher"
      ? "evelyn.stone@xebia-academy.com"
      : role === "admin"
        ? "admin@xebia.com"
        : "student.name@xebia-student.com";

  return (
    <div className={`x-shell relative min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      {/* Top-left wordmark */}
      <header className="absolute top-0 left-0 z-20 p-6 lg:p-8">
        <Wordmark variant={theme === "dark" ? "light" : "dark"} className="lg:hidden" />
        <Wordmark variant="light" className="hidden lg:flex" />
      </header>

      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-[var(--radius-soft)] border border-border bg-card text-foreground shadow-[0_8px_24px_-16px_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px"
        title="Toggle Theme"
        type="button"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.span key="sun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Sun className="h-4 w-4 text-destructive" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Moon className="h-4 w-4 text-primary" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Asymmetric split layout */}
      <div className="x-split-shell">
        {/* Branded panel */}
        <aside className="x-split-brand hidden lg:flex">
          <PageEntrance className="relative z-10 flex h-full flex-col justify-between py-16">
            <div aria-hidden="true" className="h-8" />

            <div className="space-y-6">
              <PageEntranceItem>
                <p className="x-micro-copy text-primary-foreground/80">Enterprise Learning Platform</p>
              </PageEntranceItem>
              <PageEntranceItem>
                <h1 className="x-hero-title text-primary-foreground">
                  Evaluate. Learn.{" "}
                  <span className="text-accent-2">Excel.</span>
                </h1>
              </PageEntranceItem>
              <PageEntranceItem>
                <p className="x-hero-copy text-primary-foreground/90">
                  Deliver secure, scalable assessments with automated grading, real-time analytics,
                  and seamless learning experiences — from one enterprise platform.
                </p>
              </PageEntranceItem>
            </div>

            <PageEntranceItem>
              <div className="grid grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-8">
                {[
                  { value: "10K+", label: "Learners" },
                  { value: "500+", label: "Courses" },
                  { value: "99.9%", label: "Uptime" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-xl font-bold text-primary-foreground">{stat.value}</p>
                    <p className="x-micro-copy mt-1 text-primary-foreground/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </PageEntranceItem>
          </PageEntrance>
        </aside>

        {/* Auth form panel */}
        <main className="x-split-form flex min-h-screen items-center">
          <PageEntrance className="mx-auto w-full max-w-md space-y-8 py-24 lg:py-16">
            <PageEntranceItem className="lg:hidden">
              <Wordmark variant="dark" />
            </PageEntranceItem>

            <PageEntranceItem className="space-y-2">
              <h2 className="font-display text-[var(--text-xl)] font-bold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="text-sm font-normal text-muted-foreground">
                Select your portal and sign in to continue.
              </p>
            </PageEntranceItem>

            <PageEntranceItem>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Portal selector */}
                <div className="x-segmented" role="tablist" aria-label="Portal selection">
                  {PORTALS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={role === id}
                      className={role === id ? "active" : ""}
                      onClick={() => setRole(id)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Institutional Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    className="x-input"
                  />
                </div>

                <button type="submit" className="x-btn x-btn-primary flex w-full items-center justify-center gap-2 py-3.5 font-semibold">
                  Access Portal
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </PageEntranceItem>

            {/* Quick access */}
            <PageEntranceItem className="space-y-4 border-t border-border pt-6">
              <p className="x-micro-copy text-center text-muted-foreground">Quick Access</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <QuickAccessColumn
                  title="Trainers"
                  items={demoTeachers.map((t) => ({
                    id: t.id,
                    name: t.name.split(" ")[1] || t.name.split(" ")[0],
                    sub: "Trainer",
                    avatar: t.avatar,
                    onClick: () => handleQuickLogin(t.email, "teacher"),
                  }))}
                />
                <QuickAccessColumn
                  title="Students"
                  items={demoStudents.map((s) => ({
                    id: s.id,
                    name: s.name.split(" ")[0],
                    sub: `Batch ${(s.batches && s.batches[0]) || "B1"}`,
                    avatar: s.avatar,
                    onClick: () => handleQuickLogin(s.email, "student"),
                  }))}
                />
                <QuickAccessColumn
                  title="Admins"
                  items={[
                    {
                      id: "admin",
                      name: "Admin User",
                      sub: "System Admin",
                      initials: "A",
                      onClick: () => handleQuickLogin("admin@xebia.com", "admin"),
                    },
                  ]}
                />
              </div>
            </PageEntranceItem>
          </PageEntrance>
        </main>
      </div>
    </div>
  );
};

function QuickAccessColumn({ title, items }) {
  return (
    <div className="space-y-2">
      <p className="x-micro-copy text-muted-foreground">{title}</p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className="x-card flex w-full cursor-pointer items-center gap-3 p-2.5 text-left active:scale-[0.98]"
        >
          {item.avatar ? (
            <img
              src={item.avatar}
              className="h-8 w-8 rounded-full border border-border object-cover"
              alt=""
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {item.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">{item.name}</p>
            <p className="truncate text-[10px] font-normal text-muted-foreground">{item.sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
