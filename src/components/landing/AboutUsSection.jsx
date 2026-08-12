import { ShieldCheck, GraduationCap, BarChart2, Server, Cpu, Layers } from "lucide-react";

export function AboutUsSection() {
  return (
    <section id="about" className="py-28 bg-[#0B1527] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#6C1D5F] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#01AC9F] rounded-full blur-[120px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight">
            <span className="text-white">About </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFACE8] to-[#01AC9F]">
              Xebia Enterprise LMS
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Engineered for scale and designed for engagement, Xebia Enterprise LMS is a
            production-grade learning ecosystem. It seamlessly bridges the gap between
            organizational learning goals and continuous employee development.
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mt-6 font-normal leading-relaxed">
            Our platform supports the entire learning lifecycle—from AI-driven content generation
            and multi-tier curriculum management to immersive course playback, automated
            assessments, and a powerful predictive analytics suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-[#01AC9F] mb-6 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#01AC9F]/10 group-hover:bg-[#01AC9F]/20 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Admin Portal
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-[#01AC9F]">✦</span> AI-Powered Course Creation (Groq API)
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#01AC9F]">✦</span> Advanced 4-Level Curriculum Builder
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#01AC9F]">✦</span> Category & Content Management
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#01AC9F]">✦</span> Profile Settings & Cloudinary Uploads
              </li>
            </ul>
          </div>

          <div className="p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-[#FFACE8] mb-6 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FFACE8]/10 group-hover:bg-[#FFACE8]/20 transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              Student Portal
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-[#FFACE8]">✦</span> Personalized Learning Dashboard
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FFACE8]">✦</span> Course Catalogue & Full Playback
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FFACE8]">✦</span> Interactive Assessments & Feedback
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FFACE8]">✦</span> Notifications Centre
              </li>
            </ul>
          </div>

          <div className="p-10 rounded-[2rem] bg-white/5 border border-[#FF6200]/20 backdrop-blur-md hover:bg-white/10 hover:border-[#FF6200]/40 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-[#FF6200] mb-6 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FF6200]/10 group-hover:bg-[#FF6200]/20 transition-colors">
                <BarChart2 className="w-6 h-6" />
              </div>
              Analytics Suite
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-[#FF6200]">✦</span> 15-Page Predictive Analytics Dashboard
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6200]">✦</span> Skill Gaps & AI Transformation Readiness
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6200]">✦</span> Coverage Maps & Learning Pillars
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6200]">✦</span> Flagship Programs & Project Investments
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF6200]">✦</span> Apprentice Journey & Recommendations
              </li>
            </ul>
          </div>

          <div className="p-10 rounded-[2rem] bg-white/5 border border-accent-2/20 backdrop-blur-md hover:bg-white/10 hover:border-accent-2/40 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-accent-2 mb-6 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent-2/10 group-hover:bg-accent-2/20 transition-colors">
                <Server className="w-6 h-6" />
              </div>
              Infrastructure & Tech Stack
            </h3>
            <ul className="space-y-4 text-sm md:text-base text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <span className="font-bold text-white min-w-[90px]">Frontend:</span>
                React 19, Vite, Tailwind CSS, Zustand
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white min-w-[90px]">Backend:</span>
                Java 21, Spring Boot 3.3.6, Microservices
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white min-w-[90px]">Database:</span>
                PostgreSQL 15, Flyway, Redis Caching
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white min-w-[90px]">AI Cloud:</span>
                Groq LLaMA 3, Cloudinary Edge Network
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
