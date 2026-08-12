import React, { createContext, useContext, useState, useMemo } from "react";

const AnalyticsFilterContext = createContext();

export function AnalyticsFilterProvider({ children }) {
  const [filters, setFilters] = useState({
    time: {
      type: "Year", // Year, Quarter, Half-Year, Month, Custom
      value: new Date().getFullYear().toString(),
      dateRange: { start: null, end: null },
    },
    organization: {
      region: "All",
      location: "All",
      businessUnit: "All",
      department: "All",
      project: "All",
      practice: "All",
      employeeGrade: "All",
      employee: "All",
    },
  });

  const updateTimeFilter = (updates) => {
    setFilters((prev) => ({
      ...prev,
      time: { ...prev.time, ...updates },
    }));
  };

  const updateOrgFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      organization: { ...prev.organization, [key]: value },
    }));
  };

  const resetFilters = () => {
    setFilters({
      time: {
        type: "Year",
        value: new Date().getFullYear().toString(),
        dateRange: { start: null, end: null },
      },
      organization: {
        region: "All",
        location: "All",
        businessUnit: "All",
        department: "All",
        project: "All",
        practice: "All",
        employeeGrade: "All",
        employee: "All",
      },
    });
  };

  const contextValue = useMemo(
    () => ({
      filters,
      updateTimeFilter,
      updateOrgFilter,
      resetFilters,
    }),
    [filters],
  );

  return (
    <AnalyticsFilterContext.Provider value={contextValue}>
      {children}
    </AnalyticsFilterContext.Provider>
  );
}

export function useAnalyticsFilters() {
  const context = useContext(AnalyticsFilterContext);
  if (!context) {
    throw new Error("useAnalyticsFilters must be used within an AnalyticsFilterProvider");
  }
  return context;
}
