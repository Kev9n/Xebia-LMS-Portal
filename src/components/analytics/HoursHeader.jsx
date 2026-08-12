import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCw, Maximize, Moon, Sun, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export function HoursHeader() {
  const [isDark, setIsDark] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  useEffect(() => {
    setIsDark(window.document.documentElement.classList.contains("dark"));
  }, []);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          Learning Hours Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Reporting Period: April 1 - June 30, 2026 • Last updated:{" "}
          {lastUpdated}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white shadow-sm transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
