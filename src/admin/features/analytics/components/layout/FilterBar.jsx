import React from "react";
import { useAnalyticsFilters } from "../../context/AnalyticsFilterContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FilterBar() {
  const { filters, updateTimeFilter, updateOrgFilter } = useAnalyticsFilters();

  const handleTimeTypeChange = (val) => {
    updateTimeFilter({ type: val });
  };

  const handleOrgChange = (key, val) => {
    updateOrgFilter(key, val);
  };

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between w-full mb-8 relative z-20 gap-4">
      <div className="hidden sm:block">
        {/* Optional placeholder for left side, like breadcrumbs or context if needed */}
      </div>

      <div className="flex items-center gap-1.5 bg-white dark:bg-[#15151f] p-1.5 rounded-xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm">
        {/* Time Filter */}
        <div className="flex items-center">
          <Select value={filters.time.type} onValueChange={handleTimeTypeChange}>
            <SelectTrigger className="w-[130px] h-8 text-xs font-bold bg-transparent border-none focus:ring-0 shadow-none hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Year" className="text-xs font-medium">
                Year-wise
              </SelectItem>
              <SelectItem value="Quarter" className="text-xs font-medium">
                Quarter-wise
              </SelectItem>
              <SelectItem value="Half-Year" className="text-xs font-medium">
                Half-Yearly
              </SelectItem>
              <SelectItem value="Month" className="text-xs font-medium">
                Monthly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-[#2e2e3e]" />

        {/* Region Filter */}
        <div className="flex items-center">
          <Select
            value={filters.organization.region}
            onValueChange={(val) => handleOrgChange("region", val)}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs font-bold bg-transparent border-none focus:ring-0 shadow-none hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs font-medium">
                All Regions
              </SelectItem>
              <SelectItem value="NA" className="text-xs font-medium">
                North America
              </SelectItem>
              <SelectItem value="EMEA" className="text-xs font-medium">
                EMEA
              </SelectItem>
              <SelectItem value="APAC" className="text-xs font-medium">
                APAC
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-[#2e2e3e]" />

        {/* Department Filter */}
        <div className="flex items-center">
          <Select
            value={filters.organization.department}
            onValueChange={(val) => handleOrgChange("department", val)}
          >
            <SelectTrigger className="w-[130px] h-8 text-xs font-bold bg-transparent border-none focus:ring-0 shadow-none hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs font-medium">
                All Departments
              </SelectItem>
              <SelectItem value="Engineering" className="text-xs font-medium">
                Engineering
              </SelectItem>
              <SelectItem value="Sales" className="text-xs font-medium">
                Sales
              </SelectItem>
              <SelectItem value="HR" className="text-xs font-medium">
                HR
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
