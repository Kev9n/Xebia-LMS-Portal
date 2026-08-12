import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/manager/sidebar/manager-sidebar";

export function DashboardShell({ children }) {
  return _jsxs(SidebarProvider, {
    defaultOpen: true,
    children: [
      _jsx(ManagerSidebar, {}),
      _jsxs(SidebarInset, {
        className: "bg-[#F7F7F8]",
        children: [
          /* Persistent sticky top bar with sidebar trigger */
          _jsx("div", {
            className:
              "sticky top-0 z-30 flex h-16 w-full shrink-0 items-center bg-[#F7F7F8]/80 px-4 backdrop-blur-md sm:px-6 lg:px-8",
            children: _jsx(SidebarTrigger, {
              className:
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#6C1D5F] shadow-sm border border-[#EDEDED] transition-all hover:bg-[#6C1D5F]/5 hover:text-[#4A1E47]",
            }),
          }),
          /* Main content area */
          _jsx("div", {
            className: "mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8 pt-2 sm:pt-2 lg:pt-2",
            children,
          }),
        ],
      }),
    ],
  });
}
