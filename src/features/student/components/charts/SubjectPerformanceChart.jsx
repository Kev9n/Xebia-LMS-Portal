import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function SubjectPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
        <p className="text-sm font-medium">No assessments completed.</p>
        <p className="text-xs mt-1">Take an assessment to see your performance here.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#01AC9F" stopOpacity={1} />
            <stop offset="100%" stopColor="#01AC9F" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          className="opacity-10 dark:opacity-20"
        />
        <XAxis
          dataKey="subject"
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
          cursor={{ fill: "currentColor", opacity: 0.05 }}
        />
        <Bar
          dataKey="score"
          name="Score %"
          fill="url(#colorScore)"
          radius={[6, 6, 0, 0]}
          barSize={40}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
