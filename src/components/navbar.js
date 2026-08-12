import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Bell, Globe } from "lucide-react";
const logoPurple = "/logo-purple.png";
const logoWhite = "/logo-white.png";
import { ThemeToggle } from "./theme-toggle";
const NAV = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Modules", href: "#modules" },
  { label: "Architecture", href: "#architecture" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return _jsx("header", {
    className: `fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`,
    children: _jsxs("div", {
      className: "mx-auto max-w-7xl px-4",
      children: [
        _jsxs("nav", {
          className: `glass rounded-2xl flex items-center gap-3 px-3 sm:px-4 py-2.5 ${scrolled ? "shadow-lg" : ""}`,
          "aria-label": "Primary",
          children: [
            _jsxs(Link, {
              to: "/",
              className: "flex items-center gap-2 shrink-0",
              children: [
                _jsx("img", {
                  suppressHydrationWarning: true,
                  src: logoPurple,
                  alt: "Xebia",
                  className: "h-9 w-9 rounded-full dark:brightness-0 dark:invert",
                }),
                _jsxs("span", {
                  className: "hidden sm:block font-display font-bold text-sm leading-tight",
                  children: [
                    "Xebia",
                    _jsx("br", {}),
                    _jsx("span", {
                      className: "text-[10px] font-medium text-muted-foreground",
                      children: "Enterprise LMS",
                    }),
                  ],
                }),
              ],
            }),
            _jsx("ul", {
              className: "hidden lg:flex items-center gap-1 ml-4",
              children: NAV.map((n) =>
                _jsx(
                  "li",
                  {
                    children: _jsx("a", {
                      href: n.href,
                      className:
                        "ring-focus rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition",
                      children: n.label,
                    }),
                  },
                  n.label,
                ),
              ),
            }),
            _jsxs("div", {
              className: "ml-auto flex items-center gap-1.5",
              children: [
                _jsx("button", {
                  "aria-label": "Search",
                  className:
                    "ring-focus hidden sm:grid h-10 w-10 place-items-center rounded-full hover:bg-secondary transition",
                  children: _jsx(Search, { className: "h-4 w-4" }),
                }),
                _jsx("button", {
                  "aria-label": "Language",
                  className:
                    "ring-focus hidden md:grid h-10 w-10 place-items-center rounded-full hover:bg-secondary transition",
                  children: _jsx(Globe, { className: "h-4 w-4" }),
                }),
                _jsxs("button", {
                  "aria-label": "Notifications",
                  className:
                    "ring-focus hidden md:grid h-10 w-10 place-items-center rounded-full hover:bg-secondary transition relative",
                  children: [
                    _jsx(Bell, { className: "h-4 w-4" }),
                    _jsx("span", {
                      className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-glow",
                    }),
                  ],
                }),
                _jsx(ThemeToggle, {}),
                _jsx(Link, {
                  to: "/",
                  className:
                    "ring-focus hidden md:inline-flex h-10 items-center rounded-full px-4 text-sm font-medium hover:bg-secondary transition",
                  children: "Sign In",
                }),
                _jsx("a", {
                  href: "#cta",
                  className:
                    "ring-focus btn-hero hidden sm:inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold",
                  children: "Get Started",
                }),
                _jsx("button", {
                  "aria-label": open ? "Close menu" : "Open menu",
                  onClick: () => setOpen(!open),
                  className:
                    "ring-focus lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-secondary",
                  children: open
                    ? _jsx(X, { className: "h-5 w-5" })
                    : _jsx(Menu, { className: "h-5 w-5" }),
                }),
              ],
            }),
          ],
        }),
        _jsx(AnimatePresence, {
          children:
            open &&
            _jsx(motion.div, {
              initial: { opacity: 0, y: -8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              className: "lg:hidden mt-2 glass rounded-2xl p-3",
              children: _jsxs("ul", {
                className: "grid gap-1",
                children: [
                  NAV.map((n) =>
                    _jsx(
                      "li",
                      {
                        children: _jsx("a", {
                          onClick: () => setOpen(false),
                          href: n.href,
                          className: "block rounded-xl px-4 py-3 font-medium hover:bg-secondary",
                          children: n.label,
                        }),
                      },
                      n.label,
                    ),
                  ),
                  _jsxs("li", {
                    className: "grid grid-cols-2 gap-2 pt-2",
                    children: [
                      _jsx(Link, {
                        to: "/",
                        className:
                          "ring-focus h-11 grid place-items-center rounded-xl border font-medium",
                        children: "Sign In",
                      }),
                      _jsx("a", {
                        href: "#cta",
                        className:
                          "ring-focus btn-hero h-11 grid place-items-center rounded-xl font-semibold",
                        children: "Get Started",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        }),
      ],
    }),
  });
}
