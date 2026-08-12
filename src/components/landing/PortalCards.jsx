import { Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const portals = [
  {
    id: "student",
    title: "Student Portal",
    description:
      "Access your courses, track progress, attend assessments, earn certifications, and enhance your skills.",
    icon: GraduationCap,
    bgClass: "bg-[#6C1D5F] dark:bg-[#FFACE8]",
    hoverBgClass: "hover:bg-[#6C1D5F] dark:hover:bg-[#FFACE8]",
    textClass: "text-[#6C1D5F] dark:text-[#FFACE8]",
    buttonTextClass: "text-white dark:text-gray-900",
    hoverClass: "hover:border-[#6C1D5F]/50 dark:hover:border-[#FFACE8]/50 shadow-[#6C1D5F]/10",
    features: [
      "My Learning Dashboard",
      "Courses & Curriculum",
      "Assessments & Quizzes",
      "Certifications",
      "Progress & Feedback",
    ],
    link: "/student",
    buttonText: "Student Portal",
  },
  {
    id: "admin",
    title: "Admin Portal",
    description:
      "The central hub for architects and executives. Generate courses via AI, manage complex curriculums, and analyze predictive workforce data.",
    icon: ShieldCheck,
    bgClass: "bg-[#01AC9F]",
    hoverBgClass: "hover:bg-[#01AC9F]",
    textClass: "text-[#01AC9F]",
    buttonTextClass: "text-white",
    hoverClass: "hover:border-[#01AC9F]/50 shadow-[#01AC9F]/10",
    features: [
      "AI-Powered Content Generation",
      "4-Level Curriculum Hierarchy Builder",
      "15-Page Predictive Analytics Suite",
      "Skill Gap & Recommendation Engine",
      "Enterprise User Management",
    ],
    link: "/admin",
    buttonText: "Admin Portal",
  },
  {
    id: "trainer",
    title: "Trainer Portal",
    description:
      "Manage your batches, create assessments, evaluate submissions, and track student performance.",
    icon: BookOpen,
    bgClass: "bg-[#FF6200]",
    hoverBgClass: "hover:bg-[#FF6200]",
    textClass: "text-[#FF6200]",
    buttonTextClass: "text-white",
    hoverClass: "hover:border-[#FF6200]/50 shadow-[#FF6200]/10",
    features: [
      "Batch Management",
      "Assessment Builder",
      "Submission Evaluation",
      "Performance Reports",
      "Leaderboard",
    ],
    link: "/trainer",
    buttonText: "Trainer Portal",
  },
];

export function PortalCards() {
  return (
    <section id="portals" className="py-24 bg-gray-50 dark:bg-black/20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Explore Our Portals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Select the portal that best fits your role and access personalized features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className={`flex flex-col bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-100 dark:border-white/5 p-6 sm:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-2 ${portal.hoverClass}`}
            >
              <div className="mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${portal.bgClass} text-white`}
                >
                  <portal.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 text-gray-900 dark:text-white tracking-tight">
                  {portal.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed min-h-[60px] font-medium">
                  {portal.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {portal.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${portal.textClass}`} />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={portal.link} className="w-full">
                <Button
                  className={`w-full border-none ${portal.bgClass} ${portal.hoverBgClass} hover:opacity-90 ${portal.buttonTextClass} rounded-2xl py-7 h-auto text-base font-bold flex items-center justify-center gap-2 transition-all shadow-md`}
                >
                  {portal.buttonText} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
