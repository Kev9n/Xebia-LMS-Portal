import React, { Suspense } from "react";
import { AnalyticsFilterProvider } from "../../context/AnalyticsFilterContext";
import { FilterBar } from "./FilterBar";
import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

const analyticsLinks = [
  { path: "/analytics/executive", label: "Executive Summary" },
  { path: "/analytics/coverage", label: "Learning Coverage" },
  { path: "/analytics/hours", label: "Learning Hours" },
  { path: "/analytics/pillars", label: "Learning Pillars" },
  { path: "/analytics/ai-transformation", label: "AI Transformation" },
  { path: "/analytics/certifications", label: "Certifications" },
  { path: "/analytics/flagship-programs", label: "Flagship Programs" },
  { path: "/analytics/learning-trends", label: "Learning Trends" },
  { path: "/analytics/training-effectiveness", label: "Training Effectiveness" },
  { path: "/analytics/learning-champions", label: "Learning Champions" },
  { path: "/analytics/project-investment", label: "Project Investment" },
];

export function AnalyticsShell() {
  return (
    <AnalyticsFilterProvider>
      <div className="flex flex-col gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-100px)] w-full">
        {/* Main Content Area */}
        <div className="flex-1 w-full overflow-hidden flex flex-col">
          <FilterBar />

          <div className="flex-1">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm font-bold animate-pulse">Loading dashboard modules...</p>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </AnalyticsFilterProvider>
  );
}
