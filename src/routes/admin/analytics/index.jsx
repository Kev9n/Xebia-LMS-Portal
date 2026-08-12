import { createFileRoute, Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Target,
  Clock,
  Building2,
  Sparkles,
  Trophy,
  Flag,
  TrendingUp,
  ShieldCheck,
  Crown,
  Briefcase,
  BarChart3,
  ChevronRight,
  Users,
  Users2,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { MetricCard } from "@/admin/features/analytics/components/metrics/MetricCard";

export const Route = createFileRoute("/admin/analytics/")({
  component: AnalyticsIndex,
});

function AnalyticsIndex() {
  const dashboards = [
    {
      title: "Executive Overview",
      description: "High-level snapshot of platform engagement, user growth, and catalog health.",
      icon: Activity,
      path: "/analytics/executive",
      color: "from-[#01AC9F] to-[#007D73]", // Emerald
      iconColor: "#01AC9F",
      status: "Live Data",
    },
    {
      title: "Learning Coverage",
      description: "Analyze content distribution and identify skill gaps across enterprise roles.",
      icon: Target,
      path: "/analytics/coverage",
      color: "from-[#6C1D5F] to-[#4A1E47]", // Velvet
      iconColor: "#6C1D5F",
      status: "Updated",
    },
    {
      title: "Learning Hours",
      description: "Deep dive into learner engagement, time spent, and seasonal learning patterns.",
      icon: Clock,
      path: "/analytics/hours",
      color: "from-[#FF6200] to-[#CC4E00]", // Orange
      iconColor: "#FF6200",
      status: "Live Data",
    },
    {
      title: "Learning Pillars",
      description: "Track strategic capabilities like Technical Engineering and Agile delivery.",
      icon: Building2,
      path: "/analytics/pillars",
      color: "from-[#5C4F61] to-[#4A1E47]", // Chart Palette
      iconColor: "#5C4F61",
      status: "Active",
    },
    {
      title: "AI Transformation",
      description: "Monitor enterprise adoption of GenAI, Copilot, and intelligent workflows.",
      icon: Sparkles,
      path: "/analytics/ai-transformation",
      color: "from-[#84117C] to-[#6C1D5F]", // Bright Velvet
      iconColor: "#84117C",
      status: "Trending",
    },
    {
      title: "Certifications",
      description: "Enterprise credential tracking and external vendor certification metrics.",
      icon: Trophy,
      path: "/analytics/certifications",
      color: "from-[#01AC9F] to-[#6C1D5F]", // Emerald to Velvet
      iconColor: "#01AC9F",
      status: "Active",
    },
    {
      title: "Flagship Programs",
      description: "Strategic academies, bootcamps, and executive-sponsored learning tracks.",
      icon: Flag,
      path: "/analytics/flagship-programs",
      color: "from-[#FF6200] to-[#84117C]", // Orange to Bright Velvet
      iconColor: "#FF6200",
      status: "Strategic",
    },
    {
      title: "Learning Trends",
      description: "Historical catalog momentum and emerging technology focus areas.",
      icon: TrendingUp,
      path: "/analytics/learning-trends",
      color: "from-[#855889] to-[#533754]", // Chart Palette
      iconColor: "#855889",
      status: "Live Data",
    },
    {
      title: "Training Effectiveness",
      description: "Quality assurance metrics, content richness, and catalog health indicators.",
      icon: ShieldCheck,
      path: "/analytics/training-effectiveness",
      color: "from-[#01AC9F] to-[#007D73]", // Emerald
      iconColor: "#01AC9F",
      status: "Quality",
    },
    {
      title: "Learning Champions",
      description: "Enterprise recognition, gamification engine, and learner achievements.",
      icon: Crown,
      path: "/analytics/learning-champions",
      color: "from-[#FF6200] to-[#CC4E00]", // Orange
      iconColor: "#FF6200",
      status: "Social",
    },
    {
      title: "Project Investment",
      description: "Strategic workforce transformation and bench management.",
      icon: Briefcase,
      path: "/analytics/project-investment",
      color: "from-[#6C1D5F] to-[#4A1E47]", // Velvet
      iconColor: "#6C1D5F",
      status: "Strategic",
    },
    {
      title: "Fresher Journey",
      description: "Track the lifecycle of new campus hires from onboarding to project deployment.",
      icon: Users,
      path: "/analytics/fresher-journey",
      color: "from-[#84117C] to-[#6C1D5F]", // Bright Velvet
      iconColor: "#84117C",
      status: "Pipeline",
    },
  ];

  return (
    <div className="space-y-10 pb-12 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C1D5F]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#01AC9F]/10 rounded-full blur-[100px] pointer-events-none -z-10 animation-delay-2000" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-brand tracking-tight mb-2">
            Analytics Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl">
            Enterprise-grade insights, reporting, and learning performance. Monitor workforce
            capabilities globally.
          </p>
        </div>
      </div>

      {/* Enterprise KPI Summary (Using the updated MetricCard with Sparklines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Active Learners"
          value="24,592"
          icon={Users2}
          trend="up"
          trendValue="+12% YoY"
          description="Global workforce engagement"
          sparkline={[30, 40, 35, 50, 45, 60, 70, 80, 75, 90, 85, 100]}
        />
        <MetricCard
          title="Avg. Learning Hours"
          value="42.5h"
          icon={Clock}
          trend="up"
          trendValue="+5.2% YoY"
          description="Per employee annually"
          sparkline={[40, 45, 42, 50, 55, 52, 60, 58, 65, 70, 68, 75]}
        />
        <MetricCard
          title="Enterprise Certifications"
          value="8,405"
          icon={Trophy}
          trend="up"
          trendValue="+24% YoY"
          description="Cloud & Engineering certs"
          sparkline={[20, 25, 30, 28, 35, 40, 45, 42, 50, 60, 75, 85]}
        />
        <MetricCard
          title="Active Courses"
          value="1,204"
          icon={BookOpen}
          trend="neutral"
          trendValue="Stable"
          description="Across 15 main categories"
          sparkline={[80, 82, 81, 85, 84, 86, 85, 88, 87, 89, 90, 91]}
        />
      </div>

      {/* Grid of Dashboards (Premium Glassmorphism) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {dashboards.map((dashboard, index) => {
              const Icon = dashboard.icon;
              return (
                <motion.div
                  key={dashboard.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative h-full focus:outline-none block"
                >
                  <Link
                    to={dashboard.path}
                    className="flex flex-col h-full h-full glass-strong rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Top Accent Gradient */}
                    <div
                      className={clsx(
                        "absolute top-0 left-0 w-full h-2 bg-gradient-to-r opacity-90",
                        dashboard.color,
                      )}
                    />

                    {/* Top Icon Area */}
                    <div className="p-6 pb-2 flex items-center justify-between relative z-10">
                      <div
                        className={clsx(
                          "w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-black/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-white/10 group-hover:rotate-3 transition-transform duration-500",
                        )}
                      >
                        <Icon className="w-7 h-7" style={{ color: dashboard.iconColor }} />
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm bg-white dark:bg-[#15151f] text-gray-700 dark:text-gray-300 ring-1 ring-black/5 dark:ring-white/10 uppercase tracking-widest">
                          {dashboard.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col p-6 pt-4 relative z-10">
                      <div className="mb-auto">
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight block mb-2">
                          {dashboard.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {dashboard.description}
                        </p>
                      </div>

                      {/* Interactive Footer */}
                      <div className="flex items-center justify-between pt-5 border-t border-gray-200/50 dark:border-gray-700/50 mt-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-glow">
                          <BarChart3 className="w-4 h-4" />
                          <span>Open Dashboard</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-[#252535] shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 ring-1 ring-black/5 dark:ring-white/5">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Blob inside card */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
