import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function LearningActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
        <p className="text-sm font-medium">No learning activity yet.</p>
        <p className="text-xs mt-1">Enroll in a course to see your progress here.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C1D5F" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#6C1D5F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          className="opacity-10 dark:opacity-20"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "currentColor", opacity: 0.5, fontSize: 11 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "currentColor", opacity: 0.5, fontSize: 11 }}
          dx={-10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "1rem",
            boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.2)",
            color: "#111827",
            backdropFilter: "blur(16px)",
          }}
          itemStyle={{ fontSize: "13px", fontWeight: "800" }}
          labelStyle={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#6b7280",
            marginBottom: "4px",
          }}
        />
        <Area
          type="monotone"
          dataKey="progress"
          name="Progress %"
          stroke="#6C1D5F"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorProgress)"
          activeDot={{ r: 6, strokeWidth: 2, fill: "#6C1D5F", stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
