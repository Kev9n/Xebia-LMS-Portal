import { UserService, CourseService, CategoryService, BatchService, AssessmentService } from "@/services/api";

export const api = {
  dashboard: {
    getOverview: async () => {
      const [users, courses, categories, batches, assessments] = await Promise.all([
        UserService.getUsers().catch(() => []),
        CourseService.getCourses().catch(() => []),
        CategoryService.getCategories().catch(() => []),
        BatchService.getBatches().catch(() => []),
        AssessmentService.getAssessments().catch(() => []),
      ]);

      const teachers = users.filter((u) => u.role === "teacher");
      const students = users.filter((u) => u.role === "student");

      return {
        kpi: {
          users: { total: users.length, change: 0 },
          trainers: { total: teachers.length, change: 0 },
          courses: { total: courses.length, change: 0 },
          batches: { total: batches.length, change: 0 },
          students: { total: students.length, change: 0 },
          assessments: { total: assessments.length, change: 0 },
          approvals: { total: 0, change: 0 },
          orgs: { total: 0, change: 0 },
        },
        recentOrgs: [],
        approvals: [],
      };
    },
  },
  organizations: {
    list: async () => [],
    create: async (org) => ({
      id: Math.random().toString(),
      name: org.name || "New Org",
      domain: org.domain || "example.com",
      type: org.type || "Company",
      status: "Active",
      abbr: org.name ? org.name.substring(0, 2).toUpperCase() : "NO",
      color: "#6C1D5F",
      ...org,
    }),
  },
  users: {
    list: async () => {
      const users = await UserService.getUsers();
      return Array.isArray(users) ? users : [];
    },
    create: async (user) => UserService.createUser(user),
  },
  approvals: {
    process: async (_id, _action) => true,
  },
};
