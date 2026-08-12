import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TrainerSidebar } from "@/components/trainer-sidebar";
import { Bell, Search } from "lucide-react";
export const Route = createFileRoute("/admin/trainer")({
  component: TrainerLayout,
});
function TrainerLayout() {
  return _jsx(SidebarProvider, {
    children: [
      _jsx(TrainerSidebar, {}),
      _jsxs(SidebarInset, {
        children: [
          _jsxs("header", {
            className: "flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background",
            children: [
              _jsx(SidebarTrigger, {
                className: "-ml-1",
              }),
              _jsxs("div", {
                className: "w-full flex justify-between items-center ml-2",
                children: [
                  _jsxs("div", {
                    className: "flex items-center gap-2 font-bold text-xl text-primary",
                    children: [
                      _jsx("span", {
                        children: "Xebia",
                      }),
                      _jsx("span", {
                        className: "text-sm font-medium text-muted-foreground mt-1 hidden sm:block",
                        children: "Enterprise LMS",
                      }),
                    ],
                  }),
                  _jsxs("div", {
                    className: "flex items-center gap-2 sm:gap-4",
                    children: [
                      _jsxs("div", {
                        className:
                          "hidden md:flex items-center gap-2 text-sm border rounded-full px-3 py-1.5 bg-secondary/50",
                        children: [
                          _jsx("span", {
                            className: "text-muted-foreground",
                            children: "Scope:",
                          }),
                          _jsxs("select", {
                            className:
                              "bg-transparent border-none outline-none font-medium text-foreground cursor-pointer",
                            children: [
                              _jsx("option", {
                                children: "University of Technology",
                              }),
                              _jsx("option", {
                                children: "Corporate Training Corp",
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsx("button", {
                        className:
                          "h-9 w-9 rounded-full hover:bg-secondary grid place-items-center",
                        children: _jsx(Search, {
                          className: "h-4 w-4 text-muted-foreground",
                        }),
                      }),
                      _jsxs("button", {
                        className:
                          "h-9 w-9 rounded-full hover:bg-secondary grid place-items-center relative",
                        children: [
                          _jsx(Bell, {
                            className: "h-4 w-4 text-muted-foreground",
                          }),
                          _jsx("span", {
                            className: "absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500",
                          }),
                        ],
                      }),
                      _jsx("div", {
                        className:
                          "h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary",
                        children: "TR",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsx("main", {
            className: "flex-1 overflow-auto bg-background p-4 sm:p-6",
            children: _jsx(Outlet, {}),
          }),
        ],
      }),
    ],
  });
}
