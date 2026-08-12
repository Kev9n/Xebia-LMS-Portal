import { ArrowRight, Rocket, Globe, Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logoPurple from "@/assets/logo-purple.png";
import logoWhite from "@/assets/logo-white.png";
import { useDarkMode } from "@/features/student/hooks/use-dark-mode";

export function LandingFooter() {
  const isDark = useDarkMode();

  return (
    <footer className="bg-white dark:bg-[#110515] pt-12 border-t border-gray-100 dark:border-gray-900">
      {/* CTA Banner */}
      <div className="container mx-auto px-6 max-w-7xl mb-20">
        <div className="relative bg-[#2C0B27] dark:bg-[#1A0517] rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Decorative Waves */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 100C320 200 480 0 720 100C960 200 1120 0 1440 100V200H0V100Z"
                fill="url(#paint0_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="720"
                  y1="0"
                  x2="720"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="1" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to transform your learning experience?
              </h3>
              <p className="text-white/70 text-sm md:text-base max-w-xl">
                Join thousands of organizations empowering their workforce with Xebia Enterprise
                LMS.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a href="#portals">
              <Button className="bg-white hover:bg-gray-100 text-[#2C0B27] rounded-md px-8 py-6 h-auto text-base font-bold flex items-center gap-2 transition-all shadow-lg">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 max-w-7xl pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src={isDark ? logoWhite : logoPurple}
                alt="Xebia LMS"
                className="h-8 object-contain"
              />
            </Link>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Xebia Enterprise LMS</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Empowering people. Transforming learning. Building a smarter workforce.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Integrations", "Updates"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#6C1D5F] dark:hover:text-[#FFACE8] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {["Documentation", "Guides", "Help Center", "Blog"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#6C1D5F] dark:hover:text-[#FFACE8] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Contact Us", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#6C1D5F] dark:hover:text-[#FFACE8] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              {[Globe, Mail, MessageSquare, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#6C1D5F] dark:text-[#FFACE8] hover:bg-[#6C1D5F] hover:text-white dark:hover:bg-[#FFACE8] dark:hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              © {new Date().getFullYear()} Xebia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
