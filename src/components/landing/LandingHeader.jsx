import { Link } from "@tanstack/react-router";
import { Moon, ArrowRight, Sun } from "lucide-react";
import logoPurple from "@/assets/logo-purple.png";
import logoWhite from "@/assets/logo-white.png";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Portals", href: "#portals" },
  { name: "Features", href: "#features" },
  { name: "About Us", href: "#about" },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sections = ["home", "portals", "features", "about"];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(`#${section}`);
            break;
          }
        } else if (section === "home" && window.scrollY < 100) {
          setActiveSection("#home");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lms_theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lms_theme", "dark");
    }
  };

  const handleLinkClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.substring(1);
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
      setActiveSection(href);
    }
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3 border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          <img
            src={isDark ? logoWhite : logoPurple}
            alt="Xebia LMS"
            className="h-12 md:h-14 object-contain transition-all"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={clsx(
                "text-sm font-bold transition-colors relative tracking-wide py-2",
                activeSection === link.href
                  ? "text-[#6C1D5F] dark:text-[#FFACE8]"
                  : "text-gray-900 hover:text-[#6C1D5F] dark:text-gray-200 dark:hover:text-white",
              )}
            >
              {link.name}
              {activeSection === link.href && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6C1D5F] dark:bg-[#FFACE8] rounded-full transition-all duration-300" />
              )}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-700 hover:text-[#6C1D5F] dark:text-gray-300 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a href="#portals" onClick={(e) => handleLinkClick(e, "#portals")}>
            <Button className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white rounded-md px-6 py-2 h-auto text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
