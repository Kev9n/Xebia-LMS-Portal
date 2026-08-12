import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDarkMode } from "@/features/student/hooks/use-dark-mode";

/**
 * Horizontal bar chart showing course completion progress.
 * @param {{ data: Array<{title: string, progress: number}> }} props
 */
export function CourseProgressChart({ data }) {
  const isDark = useDarkMode();

  return (
    <ResponsiveContainer width="100%" height="100%" key={isDark ? "dark" : "light"}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.15}
          stroke={isDark ? "#ffffff20" : "#00000015"}
          horizontal={true}
          vertical={false}
        />
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          dataKey="title"
          type="category"
          width={100}
          tick={{ fill: "currentColor", opacity: 0.7, fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "8px",
          }}
          itemStyle={{ color: "var(--foreground)" }}
          formatter={(value) => [`${value}%`, "Progress"]}
        />
        <Bar dataKey="progress" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
