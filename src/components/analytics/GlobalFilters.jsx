import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Calendar as CalendarIcon,
  MapPin,
  Building2,
  Briefcase,
  Users,
  Layers,
  Award,
  FolderKanban,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FilterDropdown = ({ icon: Icon, placeholder, options }) => (
  <Select>
    <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 focus:ring-0 focus:ring-offset-0 transition-colors hover:border-gray-300 dark:hover:border-white/30 dark:hover:bg-[#252525]">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#6C1D5F] dark:text-[#FFACE8]" />}
        <SelectValue placeholder={placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent>
      {options.map((opt, i) => (
        <SelectItem
          key={i}
          value={opt.toLowerCase().replace(/\s+/g, "-")}
          className="text-xs focus:bg-[#6C1D5F]/10 dark:focus:bg-[#FFACE8]/20 focus:text-gray-900 dark:focus:text-white"
        >
          {opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function GlobalFilters() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Filter className="w-4 h-4 text-[#6C1D5F] dark:text-[#FFACE8]" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Global Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <FilterDropdown
          icon={CalendarIcon}
          placeholder="Time Period"
          options={["Year-wise", "Quarter-wise", "Half-Yearly", "Monthly", "Custom Date Range"]}
        />
        <FilterDropdown
          icon={MapPin}
          placeholder="Region"
          options={["Global", "North America", "Europe", "APAC", "Middle East"]}
        />
        <FilterDropdown
          icon={Building2}
          placeholder="Location"
          options={["All Locations", "New York", "London", "Amsterdam", "Dubai", "Pune"]}
        />
        <FilterDropdown
          icon={Briefcase}
          placeholder="Business Unit"
          options={["All BUs", "Engineering", "Consulting", "Sales", "Operations"]}
        />
        <FilterDropdown
          icon={Users}
          placeholder="Department"
          options={["All Departments", "Frontend", "Backend", "DevOps", "HR"]}
        />
        <FilterDropdown
          icon={FolderKanban}
          placeholder="Project"
          options={["All Projects", "Alpha", "Beta", "Gamma", "Delta"]}
        />
        <FilterDropdown
          icon={Layers}
          placeholder="Practice"
          options={["All Practices", "Cloud", "Data & AI", "Agile", "Software Dev"]}
        />
        <FilterDropdown
          icon={Award}
          placeholder="Employee Grade"
          options={["All Grades", "Junior", "Mid-Level", "Senior", "Lead", "Principal"]}
        />
        <FilterDropdown
          icon={User}
          placeholder="Individual Employee"
          options={["All Employees", "John Doe", "Jane Smith", "Alice Jones"]}
        />

        <div className="flex gap-2 lg:col-span-3 xl:col-span-1 justify-end">
          <Button
            variant="outline"
            className="h-9 text-xs bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:border-white/30 dark:hover:text-white"
          >
            Clear
          </Button>
          <Button className="h-9 text-xs bg-[#6C1D5F] hover:bg-[#4A1E47] text-white">Apply</Button>
        </div>
      </div>
    </div>
  );
}
