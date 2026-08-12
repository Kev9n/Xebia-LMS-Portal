import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { UnifiedSidebar } from "./unified-sidebar";
import { StudentNavbar } from "./student-navbar";
import { Header as AdminHeader } from "@/admin/components/layout/Header";
import { useAppStore } from "@/admin/store/useAppStore";

export function UnifiedLayout({ portalType = "student" }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="shell x-shell">
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-150"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <UnifiedSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        portalType={portalType}
      />

      <div className="main flex min-w-0 flex-1 flex-col">
        {portalType === "student" || portalType === "trainer" ? (
          <StudentNavbar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        ) : (
          <AdminHeader setIsMobileOpen={setIsMobileOpen} />
        )}
        <div className="content flex-1 overflow-y-auto">
          {portalType === "student" || portalType === "trainer" ? (
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          ) : (
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
