import React from "react";
import { Filter, Calendar, MapPin, Building, Briefcase } from "lucide-react";

export function GlobalFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#15151f] p-3 rounded-xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm mb-6">
      <div className="flex items-center gap-2 px-3 border-r border-gray-100 dark:border-gray-800">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 cursor-pointer">
        <Calendar className="w-3.5 h-3.5 text-[#01AC9F]" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Quarter</span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 cursor-pointer">
        <MapPin className="w-3.5 h-3.5 text-[#6C1D5F]" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Regions</span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 cursor-pointer">
        <Building className="w-3.5 h-3.5 text-[#FF6200]" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          All Business Units
        </span>
      </div>

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/5 cursor-pointer">
        <Briefcase className="w-3.5 h-3.5 text-[#84117C]" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          All Departments
        </span>
      </div>
    </div>
  );
}
