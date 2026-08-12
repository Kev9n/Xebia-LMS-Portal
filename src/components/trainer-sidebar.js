import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  MessageSquare,
  Bell,
  BarChart2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const navItems = [
  {
    name: "Dashboard",
    href: "/trainer",
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    href: "/trainer/courses",
    icon: BookOpen,
  },
  {
    name: "Batches",
    href: "/trainer/batches",
    icon: Calendar,
  },
  {
    name: "Students",
    href: "/trainer/students",
    icon: Users,
  },
  {
    name: "Assessments",
    href: "/trainer/assessments",
    icon: ClipboardList,
  },
  {
    name: "Discussions",
    href: "/trainer/discussions",
    icon: MessageSquare,
  },
  {
    name: "Notifications",
    href: "/trainer/notifications",
    icon: Bell,
  },
  {
    name: "Reports",
    href: "/trainer/reports",
    icon: BarChart2,
  },
];
export function TrainerSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return /*#__PURE__*/ _jsxDEV(
    Sidebar,
    {
      variant: "inset",
      children: /*#__PURE__*/ _jsxDEV(
        SidebarContent,
        {
          children: /*#__PURE__*/ _jsxDEV(
            SidebarGroup,
            {
              children: [
                /*#__PURE__*/ _jsxDEV(
                  SidebarGroupLabel,
                  {
                    children: "Trainer Portal",
                  },
                  void 0,
                  false,
                ),
                /*#__PURE__*/ _jsxDEV(
                  SidebarGroupContent,
                  {
                    children: /*#__PURE__*/ _jsxDEV(
                      SidebarMenu,
                      {
                        children: navItems.map((item) => {
                          const isActive =
                            currentPath === item.href ||
                            (item.href !== "/trainer" && currentPath.startsWith(item.href));
                          return /*#__PURE__*/ _jsxDEV(
                            SidebarMenuItem,
                            {
                              children: /*#__PURE__*/ _jsxDEV(
                                SidebarMenuButton,
                                {
                                  asChild: true,
                                  isActive: isActive,
                                  tooltip: item.name,
                                  children: /*#__PURE__*/ _jsxDEV(
                                    Link,
                                    {
                                      to: item.href,
                                      children: [
                                        /*#__PURE__*/ _jsxDEV(item.icon, {}, void 0, false),
                                        /*#__PURE__*/ _jsxDEV(
                                          "span",
                                          {
                                            children: item.name,
                                          },
                                          void 0,
                                          false,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                  ),
                                },
                                void 0,
                                false,
                              ),
                            },
                            item.name,
                            false,
                          );
                        }),
                      },
                      void 0,
                      false,
                    ),
                  },
                  void 0,
                  false,
                ),
              ],
            },
            void 0,
            true,
          ),
        },
        void 0,
        false,
      ),
    },
    void 0,
    false,
  );
}
