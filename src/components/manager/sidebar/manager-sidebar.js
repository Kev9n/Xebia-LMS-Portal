import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  MessageSquareText,
  BarChart3,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/manager" },
  { title: "Users", icon: Users, href: "/manager/users" },
  { title: "Approvals", icon: ShieldCheck, href: "/manager/approvals" },
  { title: "Feedback", icon: MessageSquareText, href: "/manager/feedback" },
  { title: "Analytics", icon: BarChart3, href: "/manager/analytics" },
];

export function ManagerSidebar() {
  const matchRoute = useMatchRoute();
  const { toggleSidebar } = useSidebar();

  return _jsxs(Sidebar, {
    collapsible: "offcanvas",
    className:
      "border-r border-[#6C1D5F]/10 shadow-lg [&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-[#5B1850] [&_[data-sidebar=sidebar]]:to-[#6C1D5F]",
    children: [
      /* ── Header / Logo ── */
      _jsx(SidebarHeader, {
        className: "px-6 pb-4 pt-6 border-b border-white/10",
        children: _jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            _jsx(Link, {
              to: "/manager",
              className: "flex items-center gap-3 transition-opacity hover:opacity-80",
              children: _jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  _jsx("img", {
                    src: "/logo-white.png",
                    alt: "Xebia LMS",
                    className: "h-8 w-8 shrink-0 object-contain drop-shadow-md",
                  }),
                  _jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      _jsx("span", {
                        className: "text-sm font-bold tracking-wide text-white drop-shadow-sm",
                        children: "Xebia LMS",
                      }),
                      _jsx("span", {
                        className:
                          "text-[10px] font-medium uppercase tracking-widest text-white/50",
                        children: "Manager Portal",
                      }),
                    ],
                  }),
                ],
              }),
            }),
            _jsx("button", {
              onClick: toggleSidebar,
              className:
                "hidden rounded-md p-1.5 text-white/40 transition-colors hover:!bg-white/10 hover:!text-white md:block",
              "aria-label": "Toggle sidebar",
              children: _jsx(PanelLeftClose, { className: "h-4 w-4" }),
            }),
          ],
        }),
      }),

      /* ── Navigation ── */
      _jsx(SidebarContent, {
        className: "px-4 pt-4",
        children: _jsxs(SidebarGroup, {
          children: [
            _jsx(SidebarGroupLabel, {
              className:
                "mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40",
              children: "Navigation",
            }),
            _jsx(SidebarGroupContent, {
              children: _jsx(SidebarMenu, {
                className: "space-y-1.5",
                children: navItems.map((item) => {
                  const isActive =
                    item.href === "/manager"
                      ? matchRoute({ to: "/manager", fuzzy: false })
                      : matchRoute({ to: item.href, fuzzy: true });

                  return _jsx(
                    SidebarMenuItem,
                    {
                      children: _jsx(SidebarMenuButton, {
                        asChild: true,
                        isActive: !!isActive,
                        tooltip: item.title,
                        size: "lg",
                        className: `
                          relative rounded-xl font-medium transition-all duration-300
                          !text-white/70 hover:!bg-white/10 hover:!text-white
                          data-[active=true]:!bg-white/10 data-[active=true]:!text-white
                          data-[active=true]:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)]
                          data-[active=true]:ring-1 data-[active=true]:ring-white/10
                        `,
                        children: _jsxs(Link, {
                          to: item.href,
                          className: "flex items-center gap-3.5 px-1 py-0.5",
                          children: [
                            _jsx(item.icon, {
                              className: `h-[18px] w-[18px] shrink-0 transition-colors duration-300 ${
                                isActive
                                  ? "!text-[#00A99D] drop-shadow-[0_0_8px_rgba(0,169,157,0.5)]"
                                  : ""
                              }`,
                            }),
                            _jsx("span", {
                              className: `text-[14px] ${isActive ? "font-semibold" : ""}`,
                              children: item.title,
                            }),
                          ],
                        }),
                      }),
                    },
                    item.href,
                  );
                }),
              }),
            }),
          ],
        }),
      }),

      /* ── Footer / Profile ── */
      _jsx(SidebarFooter, {
        className: "px-4 pb-6 pt-4 border-t border-white/10",
        children: _jsxs("div", {
          className:
            "flex items-center gap-3 rounded-xl bg-black/10 p-3 ring-1 ring-white/5 transition-colors hover:bg-black/20",
          children: [
            _jsx(Avatar, {
              className: "h-9 w-9 shrink-0 ring-2 ring-white/10",
              children: _jsx(AvatarFallback, {
                className:
                  "bg-gradient-to-br from-[#8A177D] to-[#4A1E47] text-xs font-semibold text-white",
                children: "RM",
              }),
            }),
            _jsxs("div", {
              className: "flex flex-1 flex-col overflow-hidden",
              children: [
                _jsx("span", {
                  className: "truncate text-sm font-semibold text-white/90",
                  children: "Rajesh Manager",
                }),
                _jsx("span", {
                  className: "truncate text-[11px] font-medium text-white/50",
                  children: "rajesh@xebia.com",
                }),
              ],
            }),
            _jsx("button", {
              className:
                "shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:!bg-white/10 hover:!text-white",
              "aria-label": "Sign out",
              children: _jsx(LogOut, { className: "h-[18px] w-[18px]" }),
            }),
          ],
        }),
      }),
    ],
  });
}
