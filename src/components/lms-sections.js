import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Building2,
  UserCog,
  GitBranch,
  BookOpen,
  Users,
  ClipboardCheck,
  PlayCircle,
  Bell,
  BarChart3,
  Settings2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  UserCircle2,
  Calendar,
  Award,
  FileText,
  Video,
  MessageSquare,
  Mail,
  Smartphone,
  FileCheck,
  Workflow,
  Database,
  Network,
  Cloud,
  Zap,
  Lock,
  Globe2,
  ChevronDown,
  Star,
  Quote,
  Play,
  Download,
  Server,
  Cpu,
} from "lucide-react";
import { Globe as Linkedin, Code as Github, Play as Youtube, Hash as Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
/* ---------------- Hero ---------------- */
export function Hero() {
  return _jsxs("section", {
    className: "relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28",
    children: [
      _jsx("div", { className: "absolute inset-0 bg-mesh -z-10" }),
      _jsx("div", {
        className:
          "absolute -z-10 top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob",
      }),
      _jsx("div", {
        className:
          "absolute -z-10 bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-blob",
        style: { animationDelay: "4s" },
      }),
      _jsx("div", {
        className: "mx-auto max-w-7xl px-4",
        children: _jsxs("div", {
          className: "grid lg:grid-cols-2 gap-12 items-center",
          children: [
            _jsxs(motion.div, {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7 },
              children: [
                _jsxs("div", {
                  className:
                    "inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium mb-6",
                  children: [
                    _jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
                    "Multi-tenant \u2022 Enterprise grade \u2022 Event driven",
                  ],
                }),
                _jsxs("h1", {
                  className:
                    "font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight",
                  children: [
                    "One Platform for ",
                    _jsx("span", {
                      className: "text-gradient",
                      children: "Universities, Organisations",
                    }),
                    " and Enterprise Learning",
                  ],
                }),
                _jsx("p", {
                  className: "mt-6 text-base sm:text-lg text-muted-foreground max-w-xl",
                  children:
                    "Manage identity, courses, assessments, video learning, notifications and reporting on a single multi-tenant platform built for scale.",
                }),
                _jsxs("div", {
                  className: "mt-8 flex flex-wrap gap-3",
                  children: [
                    _jsxs("a", {
                      href: "#cta",
                      className:
                        "ring-focus btn-hero inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold",
                      children: ["Start Learning ", _jsx(ArrowRight, { className: "h-4 w-4" })],
                    }),
                    _jsxs("a", {
                      href: "#cta",
                      className:
                        "ring-focus glass inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold hover:scale-[1.02] transition",
                      children: [_jsx(Play, { className: "h-4 w-4" }), " Book Demo"],
                    }),
                    _jsx("a", {
                      href: "#features",
                      className:
                        "ring-focus inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold border hover:bg-secondary transition",
                      children: "Explore Platform",
                    }),
                  ],
                }),
                _jsx("div", {
                  className:
                    "mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground",
                  children: ["SOC2 Ready", "WCAG AA", "99.5% Uptime", "GDPR Compliant"].map((t) =>
                    _jsxs(
                      "div",
                      {
                        className: "flex items-center gap-1.5",
                        children: [
                          _jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-primary" }),
                          " ",
                          t,
                        ],
                      },
                      t,
                    ),
                  ),
                }),
              ],
            }),
            _jsx(HeroDashboard, {}),
          ],
        }),
      }),
    ],
  });
}
function HeroDashboard() {
  const roles = [
    { label: "Admin", icon: Shield },
    { label: "Manager", icon: Briefcase },
    { label: "Trainer", icon: GraduationCap },
    { label: "Organiser", icon: Calendar },
    { label: "Student", icon: UserCircle2 },
  ];
  const tiles = [
    { label: "Courses", icon: BookOpen, hue: "from-primary to-primary-glow" },
    { label: "Assessments", icon: ClipboardCheck, hue: "from-accent to-accent-2" },
    { label: "Video", icon: PlayCircle, hue: "from-primary-glow to-accent" },
    { label: "Notifications", icon: Bell, hue: "from-accent-2 to-primary" },
    { label: "Reports", icon: BarChart3, hue: "from-primary to-accent" },
    { label: "Analytics", icon: Cpu, hue: "from-accent to-primary-glow" },
  ];
  return _jsx(motion.div, {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, delay: 0.2 },
    className: "relative",
    children: _jsxs("div", {
      className: "glass-strong rounded-3xl p-5 sm:p-6 shadow-[var(--shadow-elegant)]",
      children: [
        _jsxs("div", {
          className: "flex items-center justify-between mb-4",
          children: [
            _jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                _jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-destructive/60" }),
                _jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-amber-400/70" }),
                _jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-400/70" }),
              ],
            }),
            _jsx("span", {
              className: "text-[10px] font-mono text-muted-foreground",
              children: "lms.xebia.app/dashboard",
            }),
          ],
        }),
        _jsx("div", {
          className: "grid grid-cols-5 gap-2 mb-4",
          children: roles.map((r) =>
            _jsxs(
              "div",
              {
                className: "glass rounded-xl p-2 grid place-items-center text-center",
                children: [
                  _jsx(r.icon, { className: "h-4 w-4 text-primary mb-1" }),
                  _jsx("span", {
                    className: "text-[10px] font-medium truncate w-full",
                    children: r.label,
                  }),
                ],
              },
              r.label,
            ),
          ),
        }),
        _jsx("div", {
          className: "grid grid-cols-3 gap-3",
          children: tiles.map((t, i) =>
            _jsxs(
              motion.div,
              {
                animate: { y: [0, -6, 0] },
                transition: { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                className: "glass rounded-2xl p-3 sm:p-4",
                children: [
                  _jsx("div", {
                    className: `h-9 w-9 rounded-xl bg-gradient-to-br ${t.hue} grid place-items-center mb-3 shadow-[var(--shadow-glow)]`,
                    children: _jsx(t.icon, { className: "h-4 w-4 text-primary-foreground" }),
                  }),
                  _jsx("div", { className: "text-xs font-semibold", children: t.label }),
                  _jsx("div", {
                    className: "mt-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden",
                    children: _jsx("div", {
                      className: "h-full bg-gradient-to-r from-primary to-accent",
                      style: { width: `${40 + i * 9}%` },
                    }),
                  }),
                ],
              },
              t.label,
            ),
          ),
        }),
        _jsxs("div", {
          className: "mt-4 glass rounded-2xl p-4 flex items-center justify-between",
          children: [
            _jsxs("div", {
              children: [
                _jsx("div", {
                  className: "text-[10px] uppercase tracking-wider text-muted-foreground",
                  children: "This week",
                }),
                _jsx("div", {
                  className: "font-display font-bold text-xl",
                  children: "12,480 sessions",
                }),
              ],
            }),
            _jsx(Sparkline, {}),
          ],
        }),
      ],
    }),
  });
}
function Sparkline() {
  const pts = [8, 14, 10, 18, 16, 24, 22, 30, 28, 36];
  const max = Math.max(...pts);
  const d = pts.map((p, i) => `${(i / (pts.length - 1)) * 160},${40 - (p / max) * 36}`).join(" ");
  return _jsxs("svg", {
    viewBox: "0 0 160 40",
    className: "h-10 w-40",
    children: [
      _jsx("defs", {
        children: _jsxs("linearGradient", {
          id: "sp",
          x1: "0",
          x2: "1",
          children: [
            _jsx("stop", { offset: "0%", stopColor: "oklch(0.55 0.22 320)" }),
            _jsx("stop", { offset: "100%", stopColor: "oklch(0.78 0.14 200)" }),
          ],
        }),
      }),
      _jsx("polyline", {
        fill: "none",
        stroke: "url(#sp)",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        points: d,
      }),
    ],
  });
}
/* ---------------- Stats ---------------- */
const STATS = [
  { value: 500, suffix: "+", label: "Universities" },
  { value: 1000, suffix: "+", label: "Trainers" },
  { value: 100, suffix: "K+", label: "Students" },
  { value: 1, suffix: "M+", label: "Learning Sessions" },
  { value: 99.5, suffix: "%", label: "Availability" },
  { value: 50, suffix: "+", label: "Enterprise Clients" },
];
function Counter({ to, suffix }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          setN(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  const display = to % 1 === 0 ? Math.round(n).toLocaleString() : n.toFixed(1);
  return _jsxs("div", {
    ref: ref,
    className: "font-display font-bold text-3xl sm:text-4xl text-gradient",
    children: [display, suffix],
  });
}
export function Stats() {
  return _jsx("section", {
    className: "py-16 sm:py-24",
    children: _jsx("div", {
      className: "mx-auto max-w-7xl px-4",
      children: _jsx("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4",
        children: STATS.map((s) =>
          _jsxs(
            "div",
            {
              className: "glass rounded-2xl p-5 text-center hover:-translate-y-1 transition",
              children: [
                _jsx(Counter, { to: s.value, suffix: s.suffix }),
                _jsx("div", {
                  className: "mt-1 text-xs sm:text-sm text-muted-foreground font-medium",
                  children: s.label,
                }),
              ],
            },
            s.label,
          ),
        ),
      }),
    }),
  });
}
/* ---------------- Section heading ---------------- */
function Heading({ eyebrow, title, sub }) {
  return _jsxs("div", {
    className: "max-w-2xl mx-auto text-center mb-12 sm:mb-16",
    children: [
      _jsxs("div", {
        className:
          "inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary",
        children: [_jsx(Sparkles, { className: "h-3 w-3" }), " ", eyebrow],
      }),
      _jsx("h2", {
        className: "mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
        children: title,
      }),
      sub && _jsx("p", { className: "mt-4 text-muted-foreground", children: sub }),
    ],
  });
}
/* ---------------- Features ---------------- */
const FEATURES = [
  {
    icon: Shield,
    t: "Dynamic RBAC",
    d: "Granular permissions assignable per tenant, role and module.",
  },
  {
    icon: Layers,
    t: "Multi-Tenant Architecture",
    d: "Isolated data planes with shared services for scale.",
  },
  {
    icon: Building2,
    t: "Organisation Management",
    d: "Hierarchies, departments, cohorts and policies.",
  },
  { icon: UserCog, t: "User Provisioning", d: "SCIM, SSO and bulk lifecycle automation." },
  { icon: GitBranch, t: "Governance Workflow", d: "Multi-step approvals with audit trails." },
  { icon: BookOpen, t: "Course Management", d: "Versioned content, prerequisites and outcomes." },
  { icon: Users, t: "Batch Management", d: "Cohorts, schedules and enrolments at scale." },
  { icon: ClipboardCheck, t: "Assessments", d: "Theory, practical and online evaluations." },
  {
    icon: PlayCircle,
    t: "Adaptive Video",
    d: "HLS streaming with signed URLs and continue-watching.",
  },
  { icon: Bell, t: "Notifications", d: "Email, SMS, WhatsApp and documents with retry." },
  {
    icon: BarChart3,
    t: "Analytics & Reporting",
    d: "Cohort, course and learner insight dashboards.",
  },
  { icon: Settings2, t: "Administration", d: "Per-tenant configuration and feature flags." },
];
export function Features() {
  return _jsx("section", {
    id: "features",
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Core features",
          title: "Everything you need to run learning at scale",
          sub: "Twelve enterprise capabilities, deeply integrated and configurable per tenant.",
        }),
        _jsx("div", {
          className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5",
          children: FEATURES.map((f, i) =>
            _jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-80px" },
                transition: { duration: 0.5, delay: (i % 3) * 0.08 },
                whileHover: { y: -6 },
                className: "group glass rounded-2xl p-6 relative overflow-hidden",
                children: [
                  _jsx("div", {
                    className:
                      "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity",
                  }),
                  _jsxs("div", {
                    className: "relative",
                    children: [
                      _jsx("div", {
                        className: "h-11 w-11 rounded-xl glass grid place-items-center mb-4",
                        children: _jsx(f.icon, { className: "h-5 w-5 text-primary" }),
                      }),
                      _jsx("h3", {
                        className: "font-display font-semibold text-lg",
                        children: f.t,
                      }),
                      _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.d }),
                      _jsxs("a", {
                        href: "#",
                        className:
                          "mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary ring-focus rounded-md",
                        children: [
                          "Learn more ",
                          _jsx(ArrowRight, {
                            className: "h-3.5 w-3.5 transition group-hover:translate-x-0.5",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              },
              f.t,
            ),
          ),
        }),
      ],
    }),
  });
}
/* ---------------- Roles ---------------- */
const ROLES = [
  {
    name: "Admin",
    icon: Shield,
    color: "from-primary to-primary-glow",
    resp: "Platform configuration, tenants, policies",
    perms: ["Full access", "Manage tenants", "Audit logs"],
    modules: ["IAM", "All Modules"],
    actions: ["Approve users", "Configure SSO"],
  },
  {
    name: "Manager",
    icon: Briefcase,
    color: "from-primary-glow to-accent",
    resp: "Department learning programs",
    perms: ["Approve requests", "Assign cohorts"],
    modules: ["Org", "Reports"],
    actions: ["Approve enrolment", "Review reports"],
  },
  {
    name: "Trainer",
    icon: GraduationCap,
    color: "from-accent to-accent-2",
    resp: "Course delivery and evaluation",
    perms: ["Create content", "Grade"],
    modules: ["Courses", "Assessments"],
    actions: ["Publish course", "Grade exam"],
  },
  {
    name: "Organiser",
    icon: Calendar,
    color: "from-accent-2 to-primary",
    resp: "Batch scheduling and operations",
    perms: ["Manage batches", "Notify"],
    modules: ["Batches", "Notifications"],
    actions: ["Create batch", "Send notice"],
  },
  {
    name: "Student",
    icon: UserCircle2,
    color: "from-primary to-accent",
    resp: "Learning, assessment, certification",
    perms: ["Enrol", "Submit"],
    modules: ["Courses", "Video", "Tests"],
    actions: ["Resume video", "Take quiz"],
  },
];
export function Roles() {
  const [active, setActive] = useState(0);
  const r = ROLES[active];
  return _jsx("section", {
    id: "solutions",
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Role based platform",
          title: "Tailored experiences for every persona",
        }),
        _jsxs("div", {
          className: "grid lg:grid-cols-[1fr_1.4fr] gap-6",
          children: [
            _jsx("div", {
              className: "grid sm:grid-cols-2 lg:grid-cols-1 gap-3",
              children: ROLES.map((rr, i) =>
                _jsxs(
                  "button",
                  {
                    onClick: () => setActive(i),
                    className: `ring-focus text-left glass rounded-2xl p-4 flex items-center gap-3 transition ${active === i ? "ring-2 ring-primary shadow-[var(--shadow-glow)]" : "hover:-translate-y-0.5"}`,
                    children: [
                      _jsx("div", {
                        className: `h-10 w-10 rounded-xl bg-gradient-to-br ${rr.color} grid place-items-center shrink-0`,
                        children: _jsx(rr.icon, { className: "h-5 w-5 text-primary-foreground" }),
                      }),
                      _jsxs("div", {
                        className: "min-w-0",
                        children: [
                          _jsx("div", { className: "font-semibold truncate", children: rr.name }),
                          _jsx("div", {
                            className: "text-xs text-muted-foreground truncate",
                            children: rr.resp,
                          }),
                        ],
                      }),
                    ],
                  },
                  rr.name,
                ),
              ),
            }),
            _jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4 },
                className: "glass-strong rounded-3xl p-6 sm:p-8",
                children: [
                  _jsxs("div", {
                    className: "flex items-center gap-3 mb-6",
                    children: [
                      _jsx("div", {
                        className: `h-12 w-12 rounded-2xl bg-gradient-to-br ${r.color} grid place-items-center`,
                        children: _jsx(r.icon, { className: "h-6 w-6 text-primary-foreground" }),
                      }),
                      _jsxs("div", {
                        children: [
                          _jsx("div", {
                            className: "font-display text-2xl font-bold",
                            children: r.name,
                          }),
                          _jsx("div", {
                            className: "text-sm text-muted-foreground",
                            children: r.resp,
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "grid sm:grid-cols-3 gap-4",
                    children: [
                      _jsx(RoleBlock, { title: "Permissions", items: r.perms }),
                      _jsx(RoleBlock, { title: "Modules", items: r.modules }),
                      _jsx(RoleBlock, { title: "Quick actions", items: r.actions }),
                    ],
                  }),
                ],
              },
              r.name,
            ),
          ],
        }),
      ],
    }),
  });
}
function RoleBlock({ title, items }) {
  return _jsxs("div", {
    className: "glass rounded-2xl p-4",
    children: [
      _jsx("div", {
        className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2",
        children: title,
      }),
      _jsx("ul", {
        className: "space-y-1.5",
        children: items.map((i) =>
          _jsxs(
            "li",
            {
              className: "text-sm flex items-center gap-2",
              children: [_jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-primary shrink-0" }), i],
            },
            i,
          ),
        ),
      }),
    ],
  });
}
/* ---------------- Modules ---------------- */
const MODULES = [
  { t: "Identity & Access", icon: Lock, p: 92, badge: "Live" },
  { t: "Organisation", icon: Building2, p: 88, badge: "Live" },
  { t: "Courses & Content", icon: BookOpen, p: 95, badge: "Live" },
  { t: "Batches & Enrolments", icon: Users, p: 90, badge: "Live" },
  { t: "Assessments", icon: ClipboardCheck, p: 84, badge: "Live" },
  { t: "Video Learning", icon: Video, p: 78, badge: "Beta" },
  { t: "Engagement", icon: MessageSquare, p: 70, badge: "Live" },
  { t: "Notifications", icon: Bell, p: 96, badge: "Live" },
  { t: "Reporting", icon: BarChart3, p: 82, badge: "Live" },
  { t: "Administration", icon: Settings2, p: 89, badge: "Live" },
];
export function Modules() {
  return _jsxs("section", {
    id: "modules",
    className: "py-20 sm:py-28 relative",
    children: [
      _jsx("div", { className: "absolute inset-0 bg-mesh opacity-60 -z-10" }),
      _jsxs("div", {
        className: "mx-auto max-w-7xl px-4",
        children: [
          _jsx(Heading, { eyebrow: "LMS Modules", title: "Ten composable modules. One platform." }),
          _jsx("div", {
            className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-4",
            children: MODULES.map((m, i) =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-60px" },
                  transition: { duration: 0.4, delay: (i % 5) * 0.05 },
                  className: "glass rounded-2xl p-4 hover:-translate-y-1 transition",
                  children: [
                    _jsxs("div", {
                      className: "flex items-center justify-between mb-3",
                      children: [
                        _jsx("div", {
                          className:
                            "h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center",
                          children: _jsx(m.icon, { className: "h-4 w-4 text-primary-foreground" }),
                        }),
                        _jsx("span", {
                          className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.badge === "Beta" ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"}`,
                          children: m.badge,
                        }),
                      ],
                    }),
                    _jsx("div", { className: "font-semibold text-sm", children: m.t }),
                    _jsx("div", {
                      className: "mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden",
                      children: _jsx(motion.div, {
                        initial: { width: 0 },
                        whileInView: { width: `${m.p}%` },
                        viewport: { once: true },
                        transition: { duration: 1.1 },
                        className: "h-full bg-gradient-to-r from-primary to-accent",
                      }),
                    }),
                    _jsxs("div", {
                      className: "mt-1 text-[10px] text-muted-foreground",
                      children: [m.p, "% adoption"],
                    }),
                  ],
                },
                m.t,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
/* ---------------- Content Showcase ---------------- */
const CONTENT = [
  { t: "Notes", icon: FileText },
  { t: "PDFs", icon: FileText },
  { t: "PPT", icon: FileText },
  { t: "Comparison Tables", icon: Layers },
  { t: "Videos", icon: Video },
  { t: "Assignments", icon: ClipboardCheck },
  { t: "Tests", icon: ClipboardCheck },
  { t: "Certificates", icon: Award },
];
export function ContentShowcase() {
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Content support",
          title: "Every format your educators teach with",
        }),
        _jsx("div", {
          className: "-mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide",
          children: _jsx("div", {
            className: "flex gap-4 min-w-max",
            children: CONTENT.map((c) =>
              _jsxs(
                "div",
                {
                  className: "glass rounded-2xl p-5 w-44 shrink-0 hover:-translate-y-1 transition",
                  children: [
                    _jsx("div", {
                      className:
                        "h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-3",
                      children: _jsx(c.icon, { className: "h-5 w-5 text-primary-foreground" }),
                    }),
                    _jsx("div", { className: "font-semibold", children: c.t }),
                    _jsx("div", {
                      className: "text-xs text-muted-foreground mt-1",
                      children: "Native support",
                    }),
                  ],
                },
                c.t,
              ),
            ),
          }),
        }),
      ],
    }),
  });
}
/* ---------------- Assessments ---------------- */
export function Assessments() {
  const cards = [
    { t: "Theoretical", icon: BookOpen, m: "84%" },
    { t: "Practical", icon: Workflow, m: "78%" },
    { t: "Theory Based", icon: FileText, m: "91%" },
    { t: "Online Evaluation", icon: ClipboardCheck, m: "96%" },
    { t: "Marks & Results", icon: BarChart3, m: "Live" },
  ];
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, { eyebrow: "Assessment", title: "Evaluate with confidence" }),
        _jsxs("div", {
          className: "grid lg:grid-cols-[1.2fr_1fr] gap-6",
          children: [
            _jsx("div", {
              className: "grid sm:grid-cols-2 gap-4",
              children: cards.map((c) =>
                _jsxs(
                  "div",
                  {
                    className: "glass rounded-2xl p-5 flex items-center gap-4",
                    children: [
                      _jsx(ProgressRing, { value: parseFloat(c.m) || 70 }),
                      _jsxs("div", {
                        children: [
                          _jsx("div", {
                            className: "text-sm text-muted-foreground",
                            children: c.t,
                          }),
                          _jsx("div", {
                            className: "font-display text-xl font-bold",
                            children: c.m,
                          }),
                        ],
                      }),
                    ],
                  },
                  c.t,
                ),
              ),
            }),
            _jsxs("div", {
              className: "glass-strong rounded-3xl p-6",
              children: [
                _jsx("div", {
                  className: "text-sm text-muted-foreground mb-1",
                  children: "Cohort performance",
                }),
                _jsx("div", {
                  className: "font-display text-2xl font-bold mb-4",
                  children: "Spring 2026 \u2014 CS401",
                }),
                _jsx(BarsChart, {}),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function ProgressRing({ value }) {
  const r = 22,
    c = 2 * Math.PI * r;
  return _jsxs("svg", {
    viewBox: "0 0 60 60",
    className: "h-14 w-14 -rotate-90",
    children: [
      _jsx("circle", {
        cx: "30",
        cy: "30",
        r: r,
        stroke: "var(--color-border)",
        strokeWidth: "6",
        fill: "none",
      }),
      _jsx(motion.circle, {
        cx: "30",
        cy: "30",
        r: r,
        stroke: "url(#pg)",
        strokeWidth: "6",
        fill: "none",
        strokeLinecap: "round",
        strokeDasharray: c,
        initial: { strokeDashoffset: c },
        whileInView: { strokeDashoffset: c - (c * value) / 100 },
        viewport: { once: true },
        transition: { duration: 1.2 },
      }),
      _jsx("defs", {
        children: _jsxs("linearGradient", {
          id: "pg",
          x1: "0",
          x2: "1",
          children: [
            _jsx("stop", { offset: "0%", stopColor: "oklch(0.55 0.22 320)" }),
            _jsx("stop", { offset: "100%", stopColor: "oklch(0.78 0.14 200)" }),
          ],
        }),
      }),
    ],
  });
}
function BarsChart() {
  const data = [62, 78, 54, 88, 73, 92, 67, 81];
  const max = 100;
  return _jsx("div", {
    className: "flex items-end gap-2 h-44",
    children: data.map((v, i) =>
      _jsx(
        motion.div,
        {
          initial: { height: 0 },
          whileInView: { height: `${(v / max) * 100}%` },
          viewport: { once: true },
          transition: { duration: 0.7, delay: i * 0.05 },
          className: "flex-1 rounded-t-md bg-gradient-to-t from-primary to-accent",
        },
        i,
      ),
    ),
  });
}
/* ---------------- Video Learning ---------------- */
export function VideoLearning() {
  const items = [
    "Calculus II",
    "Distributed Systems",
    "Product Strategy",
    "ML Foundations",
    "UX Research",
    "Cloud Native",
  ];
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Video learning",
          title: "Streaming built for serious learners",
          sub: "HLS adaptive quality, signed URLs and seamless continue-watching.",
        }),
        _jsx("div", {
          className: "-mx-4 px-4 overflow-x-auto pb-4 scrollbar-hide",
          children: _jsx("div", {
            className: "flex gap-4 min-w-max",
            children: items.map((title, i) =>
              _jsxs(
                "div",
                {
                  className:
                    "glass rounded-2xl overflow-hidden w-64 shrink-0 group hover:-translate-y-1 transition",
                  children: [
                    _jsxs("div", {
                      className:
                        "relative h-36 bg-gradient-to-br from-primary via-primary-glow to-accent",
                      children: [
                        _jsx("div", {
                          className: "absolute inset-0 grid place-items-center",
                          children: _jsx("div", {
                            className:
                              "h-12 w-12 rounded-full glass grid place-items-center group-hover:scale-110 transition",
                            children: _jsx(Play, {
                              className: "h-5 w-5 text-primary-foreground",
                              fill: "currentColor",
                            }),
                          }),
                        }),
                        _jsx("div", {
                          className:
                            "absolute bottom-2 left-2 right-2 h-1 rounded-full bg-white/30 overflow-hidden",
                          children: _jsx("div", {
                            className: "h-full bg-white",
                            style: { width: `${20 + i * 12}%` },
                          }),
                        }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "p-4",
                      children: [
                        _jsx("div", {
                          className: "text-[10px] uppercase tracking-wider text-muted-foreground",
                          children: "Continue watching",
                        }),
                        _jsx("div", { className: "font-semibold", children: title }),
                      ],
                    }),
                  ],
                },
                title,
              ),
            ),
          }),
        }),
      ],
    }),
  });
}
/* ---------------- Notifications ---------------- */
export function Notifications() {
  const channels = [
    { icon: Mail, t: "Email", d: "Templated, branded" },
    { icon: MessageSquare, t: "WhatsApp", d: "Verified templates" },
    { icon: Smartphone, t: "SMS", d: "DLT compliant" },
    { icon: FileCheck, t: "Documents", d: "Signed delivery" },
  ];
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, { eyebrow: "Notifications", title: "Reach every learner on every channel" }),
        _jsxs("div", {
          className: "grid lg:grid-cols-2 gap-6",
          children: [
            _jsx("div", {
              className: "grid sm:grid-cols-2 gap-4",
              children: channels.map((c, i) =>
                _jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -20 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true },
                    transition: { delay: i * 0.08 },
                    className: "glass rounded-2xl p-5",
                    children: [
                      _jsx("div", {
                        className:
                          "h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-3",
                        children: _jsx(c.icon, { className: "h-4 w-4 text-primary-foreground" }),
                      }),
                      _jsx("div", { className: "font-semibold", children: c.t }),
                      _jsx("div", { className: "text-xs text-muted-foreground", children: c.d }),
                      _jsxs("div", {
                        className:
                          "mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400",
                        children: [
                          _jsx("span", {
                            className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse",
                          }),
                          " Delivered",
                        ],
                      }),
                    ],
                  },
                  c.t,
                ),
              ),
            }),
            _jsxs("div", {
              className: "glass-strong rounded-3xl p-6",
              children: [
                _jsx("div", {
                  className: "font-display font-bold text-xl mb-4",
                  children: "Delivery audit",
                }),
                _jsx("ul", {
                  className: "space-y-3",
                  children: [
                    { t: "Welcome email queued", s: "queued" },
                    { t: "WhatsApp template approved", s: "ok" },
                    { t: "SMS retry (1/3)", s: "warn" },
                    { t: "Certificate signed", s: "ok" },
                  ].map((l) =>
                    _jsxs(
                      "li",
                      {
                        className: "glass rounded-xl p-3 flex items-center justify-between",
                        children: [
                          _jsx("span", { className: "text-sm", children: l.t }),
                          _jsx("span", {
                            className: `text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                              l.s === "ok"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : l.s === "warn"
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : "bg-primary/15 text-primary"
                            }`,
                            children: l.s,
                          }),
                        ],
                      },
                      l.t,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
/* ---------------- Governance Workflow ---------------- */
const WF = [
  "Manager Request",
  "Pending Approval",
  "Admin Review",
  "Approve / Reject",
  "Audit Trail",
];
export function Governance() {
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, { eyebrow: "Governance", title: "Approval workflow with a paper trail" }),
        _jsx("div", {
          className: "glass-strong rounded-3xl p-6 sm:p-10",
          children: _jsx("ol", {
            className: "grid md:grid-cols-5 gap-4 relative",
            children: WF.map((step, i) =>
              _jsxs(
                motion.li,
                {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: i * 0.1 },
                  className: "relative",
                  children: [
                    _jsxs("div", {
                      className: "glass rounded-2xl p-5 text-center",
                      children: [
                        _jsx("div", {
                          className:
                            "mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-bold text-sm mb-2 shadow-[var(--shadow-glow)]",
                          children: i + 1,
                        }),
                        _jsx("div", { className: "font-semibold text-sm", children: step }),
                      ],
                    }),
                    i < WF.length - 1 &&
                      _jsx("div", {
                        className:
                          "hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-primary to-accent",
                      }),
                  ],
                },
                step,
              ),
            ),
          }),
        }),
      ],
    }),
  });
}
/* ---------------- Architecture ---------------- */
const ARCH = [
  { t: "Next.js Frontend", icon: Globe2 },
  { t: "Spring Cloud Gateway", icon: Network },
  { t: "Spring Boot Services", icon: Server },
  { t: "Apache Kafka", icon: Zap },
  { t: "IAM Service", icon: Lock },
  { t: "Course Service", icon: BookOpen },
  { t: "Assessment Service", icon: ClipboardCheck },
  { t: "Notification Service", icon: Bell },
  { t: "Media Service", icon: Video },
  { t: "Approval Service", icon: GitBranch },
  { t: "Reporting Service", icon: BarChart3 },
  { t: "Data & Storage", icon: Database },
];
export function Architecture() {
  return _jsx("section", {
    id: "architecture",
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Architecture",
          title: "Event-driven microservices on a modern stack",
        }),
        _jsx("div", {
          className: "glass-strong rounded-3xl p-6 sm:p-10",
          children: _jsx("div", {
            className: "grid sm:grid-cols-3 lg:grid-cols-4 gap-3",
            children: ARCH.map((a, i) =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  whileInView: { opacity: 1, scale: 1 },
                  viewport: { once: true },
                  transition: { delay: i * 0.04 },
                  className:
                    "glass rounded-xl p-4 flex items-center gap-3 hover:-translate-y-0.5 transition",
                  children: [
                    _jsx("div", {
                      className:
                        "h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0",
                      children: _jsx(a.icon, { className: "h-4 w-4 text-primary-foreground" }),
                    }),
                    _jsx("span", { className: "text-sm font-semibold truncate", children: a.t }),
                  ],
                },
                a.t,
              ),
            ),
          }),
        }),
      ],
    }),
  });
}
/* ---------------- Why Choose ---------------- */
const WHY = [
  { t: "Secure", icon: Lock },
  { t: "Scalable", icon: Zap },
  { t: "Configurable", icon: Settings2 },
  { t: "Multi-Tenant", icon: Layers },
  { t: "Responsive", icon: Smartphone },
  { t: "Extensible", icon: GitBranch },
  { t: "Event Driven", icon: Network },
  { t: "Enterprise Ready", icon: Shield },
];
export function WhyChoose() {
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Why our LMS",
          title: "Built for the enterprise. Loved by learners.",
        }),
        _jsx("div", {
          className: "grid grid-cols-2 md:grid-cols-4 gap-4",
          children: WHY.map((w) =>
            _jsxs(
              "div",
              {
                className: "glass rounded-2xl p-6 text-center hover:-translate-y-1 transition",
                children: [
                  _jsx("div", {
                    className:
                      "mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-3",
                    children: _jsx(w.icon, { className: "h-5 w-5 text-primary-foreground" }),
                  }),
                  _jsx("div", { className: "font-semibold", children: w.t }),
                ],
              },
              w.t,
            ),
          ),
        }),
      ],
    }),
  });
}
/* ---------------- Testimonials ---------------- */
const TESTIMONIALS = [
  {
    name: "Dr. Priya Menon",
    role: "Dean, Indus University",
    q: "Xebia LMS helped us onboard 30,000 students across 12 departments in a single semester. The multi-tenant architecture is exceptional.",
  },
  {
    name: "Rahul Verma",
    role: "L&D Director, FinCorp",
    q: "We replaced three tools with one. Governance approvals are now traceable end-to-end, and our compliance team finally sleeps at night.",
  },
  {
    name: "Anika Shah",
    role: "Senior Trainer",
    q: "Authoring once and delivering everywhere — including signed PDFs and WhatsApp — has been a game changer for our training programs.",
  },
  {
    name: "Daniel Okafor",
    role: "Computer Science Student",
    q: "Continue-watching, mobile video, instant marks. Studying actually feels modern for the first time.",
  },
];
export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return _jsx("section", {
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-4xl px-4",
      children: [
        _jsx(Heading, {
          eyebrow: "Testimonials",
          title: "Trusted across universities and enterprises",
        }),
        _jsx("div", {
          className: "relative h-64 sm:h-56",
          children: TESTIMONIALS.map((t, idx) =>
            _jsxs(
              motion.div,
              {
                animate: { opacity: idx === i ? 1 : 0, y: idx === i ? 0 : 10 },
                transition: { duration: 0.5 },
                className: `absolute inset-0 glass-strong rounded-3xl p-8 ${idx === i ? "pointer-events-auto" : "pointer-events-none"}`,
                children: [
                  _jsx(Quote, { className: "h-8 w-8 text-primary/40 mb-3" }),
                  _jsx("p", {
                    className: "text-lg sm:text-xl font-medium leading-relaxed",
                    children: t.q,
                  }),
                  _jsxs("div", {
                    className: "mt-6 flex items-center gap-3",
                    children: [
                      _jsx("div", {
                        className:
                          "h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-bold",
                        children: t.name[0],
                      }),
                      _jsxs("div", {
                        children: [
                          _jsx("div", { className: "font-semibold text-sm", children: t.name }),
                          _jsx("div", {
                            className: "text-xs text-muted-foreground",
                            children: t.role,
                          }),
                        ],
                      }),
                      _jsx("div", {
                        className: "ml-auto flex",
                        children: [...Array(5)].map((_, s) =>
                          _jsx(Star, { className: "h-4 w-4 fill-primary text-primary" }, s),
                        ),
                      }),
                    ],
                  }),
                ],
              },
              t.name,
            ),
          ),
        }),
        _jsx("div", {
          className: "flex justify-center gap-2 mt-4",
          children: TESTIMONIALS.map((_, idx) =>
            _jsx(
              "button",
              {
                onClick: () => setI(idx),
                "aria-label": `Show testimonial ${idx + 1}`,
                className: `h-2 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-2 bg-border"}`,
              },
              idx,
            ),
          ),
        }),
      ],
    }),
  });
}
/* ---------------- Pricing ---------------- */
const PLANS = [
  {
    name: "Starter",
    price: "$0",
    desc: "For pilots & evaluation",
    features: ["Up to 100 learners", "Core LMS modules", "Email support"],
    cta: "Start free",
  },
  {
    name: "Professional",
    price: "$499",
    desc: "For growing institutions",
    features: ["Up to 10K learners", "All modules", "SSO + RBAC", "Priority support"],
    cta: "Start trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For universities & enterprises",
    features: ["Unlimited learners", "Dedicated tenancy", "SLA 99.9%", "24/7 white-glove"],
    cta: "Contact sales",
  },
];
export function Pricing() {
  return _jsx("section", {
    id: "pricing",
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsx(Heading, { eyebrow: "Pricing", title: "Plans that scale with your programs" }),
        _jsx("div", {
          className: "grid md:grid-cols-3 gap-5",
          children: PLANS.map((p) =>
            _jsxs(
              "div",
              {
                className: `relative rounded-3xl p-8 ${p.featured ? "glass-strong ring-2 ring-primary shadow-[var(--shadow-glow)]" : "glass"}`,
                children: [
                  p.featured &&
                    _jsx("div", {
                      className:
                        "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold uppercase tracking-wider",
                      children: "Most popular",
                    }),
                  _jsx("div", { className: "font-display font-bold text-xl", children: p.name }),
                  _jsx("div", {
                    className: "mt-2 text-sm text-muted-foreground",
                    children: p.desc,
                  }),
                  _jsxs("div", {
                    className: "mt-6 flex items-baseline gap-1",
                    children: [
                      _jsx("span", {
                        className: "font-display font-bold text-4xl",
                        children: p.price,
                      }),
                      p.price !== "Custom" &&
                        _jsx("span", {
                          className: "text-sm text-muted-foreground",
                          children: "/mo",
                        }),
                    ],
                  }),
                  _jsx("ul", {
                    className: "mt-6 space-y-2",
                    children: p.features.map((f) =>
                      _jsxs(
                        "li",
                        {
                          className: "text-sm flex items-center gap-2",
                          children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-primary" }), f],
                        },
                        f,
                      ),
                    ),
                  }),
                  _jsx("a", {
                    href: "#cta",
                    className: `mt-8 inline-flex w-full h-11 items-center justify-center rounded-full font-semibold ring-focus ${p.featured ? "btn-hero" : "border hover:bg-secondary"}`,
                    children: p.cta,
                  }),
                ],
              },
              p.name,
            ),
          ),
        }),
      ],
    }),
  });
}
/* ---------------- FAQ ---------------- */
const FAQS = [
  {
    q: "How dynamic are roles and permissions?",
    a: "Roles are fully configurable per tenant. Admins can define permissions across every module, with inheritance and overrides.",
  },
  {
    q: "What assessment formats are supported?",
    a: "Theoretical, practical, and theory-based assessments with online evaluation, automated grading and manual review.",
  },
  {
    q: "How does video streaming work?",
    a: "Adaptive HLS with signed URLs, encrypted segments, progress tracking and continue-watching across devices.",
  },
  {
    q: "Which notification channels are supported?",
    a: "Email, SMS, WhatsApp and official document delivery with retries, audit logs and delivery analytics.",
  },
  {
    q: "What reports are available?",
    a: "Cohort, course, learner and tenant-level dashboards with export to CSV, PDF and BI tools.",
  },
  {
    q: "How do integrations work?",
    a: "REST APIs, webhooks, SCIM provisioning, SSO via OIDC/SAML, and Kafka event streaming.",
  },
  {
    q: "Is the platform secure?",
    a: "Encrypted at rest and in transit, role-based access control, audit logs, and SOC2-ready posture.",
  },
  {
    q: "How does multi-tenancy work?",
    a: "Logical isolation per tenant with separate configurations, branding, RBAC and reporting.",
  },
];
export function FAQ() {
  const [open, setOpen] = useState(0);
  return _jsx("section", {
    id: "resources",
    className: "py-20 sm:py-28",
    children: _jsxs("div", {
      className: "mx-auto max-w-3xl px-4",
      children: [
        _jsx(Heading, { eyebrow: "FAQ", title: "Answers to common questions" }),
        _jsx("div", {
          className: "space-y-3",
          children: FAQS.map((f, i) =>
            _jsxs(
              "div",
              {
                className: "glass rounded-2xl overflow-hidden",
                children: [
                  _jsxs("button", {
                    onClick: () => setOpen(open === i ? null : i),
                    "aria-expanded": open === i,
                    className:
                      "ring-focus w-full flex items-center justify-between gap-4 p-5 text-left",
                    children: [
                      _jsx("span", { className: "font-semibold", children: f.q }),
                      _jsx(ChevronDown, {
                        className: `h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`,
                      }),
                    ],
                  }),
                  _jsx(motion.div, {
                    initial: false,
                    animate: { height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 },
                    className: "overflow-hidden",
                    children: _jsx("div", {
                      className: "px-5 pb-5 text-sm text-muted-foreground",
                      children: f.a,
                    }),
                  }),
                ],
              },
              f.q,
            ),
          ),
        }),
      ],
    }),
  });
}
/* ---------------- CTA ---------------- */
export function CTA() {
  return _jsx("section", {
    id: "cta",
    className: "py-20 sm:py-28",
    children: _jsx("div", {
      className: "mx-auto max-w-6xl px-4",
      children: _jsxs("div", {
        className: "relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center glass-strong",
        children: [
          _jsx("div", { className: "absolute -z-10 inset-0 bg-mesh opacity-90" }),
          _jsx("div", {
            className:
              "absolute -z-10 -top-20 left-1/2 -translate-x-1/2 h-80 w-[640px] bg-gradient-to-r from-primary via-primary-glow to-accent opacity-30 blur-3xl rounded-full",
          }),
          _jsxs("h2", {
            className: "font-display text-3xl sm:text-5xl font-bold tracking-tight",
            children: [
              "Ready to ",
              _jsx("span", { className: "text-gradient", children: "transform" }),
              " learning management?",
            ],
          }),
          _jsx("p", {
            className: "mt-4 text-muted-foreground max-w-xl mx-auto",
            children:
              "Bring identity, content, video, assessments and reporting together on one trusted platform.",
          }),
          _jsxs("div", {
            className: "mt-8 flex flex-wrap justify-center gap-3",
            children: [
              _jsxs("a", {
                href: "#",
                className:
                  "ring-focus btn-hero inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold",
                children: ["Book Demo ", _jsx(ArrowRight, { className: "h-4 w-4" })],
              }),
              _jsx("a", {
                href: "#",
                className:
                  "ring-focus inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold glass",
                children: "Start Free Trial",
              }),
              _jsx("a", {
                href: "#",
                className:
                  "ring-focus inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold border hover:bg-secondary transition",
                children: "Contact Sales",
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
/* ---------------- Footer ---------------- */
const FOOTER = {
  Company: ["About", "Customers", "Careers", "Press"],
  Features: ["RBAC", "Courses", "Video", "Notifications"],
  Solutions: ["Universities", "Enterprises", "Trainers"],
  Resources: ["Docs", "Blog", "Guides", "Webinars"],
  Developers: ["API", "SDK", "Webhooks", "Status"],
  Legal: ["Privacy", "Terms", "Security", "DPA"],
};
export function Footer() {
  return _jsx("footer", {
    id: "contact",
    className: "pt-20 pb-10",
    children: _jsx("div", {
      className: "mx-auto max-w-7xl px-4",
      children: _jsxs("div", {
        className: "glass-strong rounded-3xl p-8 sm:p-12",
        children: [
          _jsxs("div", {
            className: "grid lg:grid-cols-[1.5fr_3fr] gap-10",
            children: [
              _jsxs("div", {
                children: [
                  _jsxs("div", {
                    className: "flex items-center gap-3 mb-4",
                    children: [
                      _jsx("div", {
                        className:
                          "h-10 w-10 rounded-full bg-primary grid place-items-center text-primary-foreground font-display font-bold",
                        children: "X",
                      }),
                      _jsxs("div", {
                        children: [
                          _jsx("div", { className: "font-display font-bold", children: "Xebia" }),
                          _jsx("div", {
                            className: "text-xs text-muted-foreground",
                            children: "Enterprise LMS",
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsx("p", {
                    className: "text-sm text-muted-foreground max-w-sm",
                    children:
                      "One multi-tenant platform for learning identity, content, video, assessments and analytics.",
                  }),
                  _jsxs("form", {
                    className: "mt-5 flex gap-2 max-w-sm",
                    onSubmit: (e) => e.preventDefault(),
                    children: [
                      _jsx("input", {
                        type: "email",
                        required: true,
                        "aria-label": "Email address",
                        placeholder: "you@company.com",
                        className:
                          "ring-focus flex-1 h-11 rounded-full px-4 bg-background border text-sm",
                      }),
                      _jsx("button", {
                        className:
                          "ring-focus btn-hero h-11 px-5 rounded-full font-semibold text-sm",
                        type: "submit",
                        children: "Subscribe",
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "mt-5 flex gap-2",
                    children: [Linkedin, Github, Twitter, Youtube].map((I, i) =>
                      _jsx(
                        "a",
                        {
                          href: "#",
                          "aria-label": "social",
                          className:
                            "ring-focus h-10 w-10 grid place-items-center rounded-full glass hover:scale-110 transition",
                          children: _jsx(I, { className: "h-4 w-4" }),
                        },
                        i,
                      ),
                    ),
                  }),
                ],
              }),
              _jsx("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6",
                children: Object.entries(FOOTER).map(([k, v]) =>
                  _jsxs(
                    "div",
                    {
                      children: [
                        _jsx("div", {
                          className:
                            "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3",
                          children: k,
                        }),
                        _jsx("ul", {
                          className: "space-y-2",
                          children: v.map((l) =>
                            _jsx(
                              "li",
                              {
                                children: _jsx("a", {
                                  href: "#",
                                  className: "text-sm hover:text-primary",
                                  children: l,
                                }),
                              },
                              l,
                            ),
                          ),
                        }),
                      ],
                    },
                    k,
                  ),
                ),
              }),
            ],
          }),
          _jsxs("div", {
            className:
              "mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground",
            children: [
              _jsxs("div", {
                children: ["\u00A9 ", new Date().getFullYear(), " Xebia. All rights reserved."],
              }),
              _jsxs("div", {
                className: "flex items-center gap-4",
                children: [
                  _jsxs("span", {
                    className: "inline-flex items-center gap-1",
                    children: [_jsx(Cloud, { className: "h-3.5 w-3.5" }), " Status: Operational"],
                  }),
                  _jsx("a", { href: "#", className: "hover:text-primary", children: "Cookies" }),
                  _jsxs("a", {
                    href: "#",
                    className: "hover:text-primary",
                    children: [
                      _jsx(Download, { className: "inline h-3.5 w-3.5 mr-1" }),
                      "Brochure",
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
