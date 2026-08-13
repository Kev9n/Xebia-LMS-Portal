import { getCourseProgressPercent } from "@/lib/course-progress-store";

/** Shared tenant + entity IDs for demo workflow (aligned with backend Flyway V15). */
export const DEMO_TENANT_ID = "11111111-1111-1111-1111-111111111111";

export const DEMO_IDS = {
  studentAbhinay: "00000000-0000-0000-0000-000000000001",
  teacherKevin: "00000000-0000-0000-0000-000000000010",
  teacherNikhil: "00000000-0000-0000-0000-000000000011",
  categoryFrontend: "40000000-0000-0000-0000-000000000001",
  categoryBackend: "40000000-0000-0000-0000-000000000002",
  categoryCloud: "40000000-0000-0000-0000-000000000003",
  courseReact: "50000000-0000-0000-0000-000000000002",
  batchFrontend: "60000000-0000-0000-0000-000000000001",
  assessmentReactMod1: "70000000-0000-0000-0000-000000000001",
  submissionReactMod1: "80000000-0000-0000-0000-000000000001",
};

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const startDate = fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
const endDate = fmt(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()));

export const DEMO_CATEGORIES = [
  {
    id: DEMO_IDS.categoryFrontend,
    name: "Frontend Development",
    slug: "frontend-development",
    description: "React, UI engineering, and modern web interfaces.",
    active: true,
    isActive: true,
    color: "#6C1D5F",
  },
  {
    id: DEMO_IDS.categoryBackend,
    name: "Backend Engineering",
    slug: "backend-engineering",
    description: "Java, Spring Boot, APIs, and microservices.",
    active: true,
    isActive: true,
    color: "#01AC9F",
  },
  {
    id: DEMO_IDS.categoryCloud,
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Kubernetes, CI/CD, and platform engineering.",
    active: true,
    isActive: true,
    color: "#84117C",
  },
];

export const DEMO_COURSES = [
  {
    id: DEMO_IDS.courseReact,
    title: "React.js Complete Guide",
    slug: "react-js-complete-guide",
    description:
      "Master React fundamentals through hooks, state management, and a capstone project.",
    shortDescription: "End-to-end React learning path for enterprise frontend engineers.",
    published: true,
    isPublished: true,
    categoryId: DEMO_IDS.categoryFrontend,
    categoryName: "Frontend Development",
    level: "Beginner",
    difficultyLevel: "Beginner",
    language: "English",
    durationHours: 40,
    durationMinutes: 0,
    modulesCount: 8,
    studentsCount: 1,
  },
  {
    id: "50000000-0000-0000-0000-000000000001",
    title: "Enterprise Java Microservices",
    slug: "enterprise-java-microservices",
    description: "Sample LMS course for Spring Boot microservice learning paths.",
    published: true,
    isPublished: true,
    categoryId: DEMO_IDS.categoryBackend,
    categoryName: "Backend Engineering",
    level: "Intermediate",
    language: "English",
    durationHours: 35,
    durationMinutes: 0,
    modulesCount: 2,
    studentsCount: 0,
  },
];

const REACT_MODULE_TITLES = [
  "Introduction",
  "Setup Environment",
  "Components",
  "Props & State",
  "Events",
  "Life Cycle",
  "Hooks",
  "Project",
];

export function getReactCourseHierarchy() {
  const modules = REACT_MODULE_TITLES.map((title, index) => ({
    id: `50000000-0000-0000-0000-0000000002${String(index + 1).padStart(2, "0")}`,
    title,
    position: index + 1,
    submodules: [
      {
        id: `50000000-0000-0000-0000-0000000003${String(index + 1).padStart(2, "0")}`,
        title: `${title} — Lesson`,
        position: 1,
        contentBlocks: [
          {
            id: `50000000-0000-0000-0000-0000000004${String(index + 1).padStart(2, "0")}`,
            title: index === 0 ? "Introduction to React" : `${title} Overview`,
            type: "VIDEO_REFERENCE",
            storageRef: JSON.stringify({
              uiType: "VIDEO_REFERENCE",
              text: index === 0 ? "Introduction to React" : `${title} walkthrough`,
            }),
            position: 1,
          },
        ],
      },
    ],
  }));

  return {
    ...DEMO_COURSES[0],
    modules,
    modulesCount: modules.length,
    submodulesCount: modules.length,
  };
}

export const DEMO_BATCHES = [
  {
    id: DEMO_IDS.batchFrontend,
    name: "Batch 2026 - Frontend Engineering",
    courseId: DEMO_IDS.courseReact,
    studentCount: 3,
    students: [
      DEMO_IDS.studentAbhinay,
      "00000000-0000-0000-0000-000000000002",
      "00000000-0000-0000-0000-000000000003",
    ],
    createdBy: DEMO_IDS.teacherKevin,
    status: "active",
    startDate,
    endDate,
  },
];

export const DEMO_ASSESSMENTS = [
  {
    id: DEMO_IDS.assessmentReactMod1,
    title: "React.js - Module 1 Assessment",
    slug: "react-js-module-1-assessment",
    status: "published",
    type: "quiz",
    batches: [DEMO_IDS.batchFrontend],
    startDate,
    endDate,
    duration: 30,
    marks: 10,
    passingMarks: 6,
    manualGrade: false,
    createdBy: DEMO_IDS.teacherKevin,
    questions: [
      {
        id: "q-react-hooks-1",
        type: "mcq",
        question: "Which hook is used to manage state in a functional component?",
        options: ["useEffect()", "useState()", "useContext()", "useReducer()"],
        correctAnswer: "useState()",
        marks: 2,
      },
      {
        id: "q-react-components-2",
        type: "mcq",
        question: "What is the primary building block of a React UI?",
        options: ["Modules", "Components", "Controllers", "Services"],
        correctAnswer: "Components",
        marks: 2,
      },
    ],
  },
];

export const DEMO_SUBMISSIONS = [
  {
    id: DEMO_IDS.submissionReactMod1,
    assessmentId: DEMO_IDS.assessmentReactMod1,
    studentId: DEMO_IDS.studentAbhinay,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    score: 8,
    percentage: 80,
    isEvaluated: true,
    answers: [
      { questionId: "q-react-hooks-1", answer: "1", marksAwarded: 2 },
      { questionId: "q-react-components-2", answer: "1", marksAwarded: 2 },
    ],
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Welcome to Xebia LMS",
    message: "You are enrolled in React.js Complete Guide.",
    isRead: false,
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    title: "Assessment Available",
    message: "React.js - Module 1 Assessment is now open.",
    isRead: false,
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_ENROLLMENTS = [
  {
    id: "enroll-react-abhinay",
    courseId: DEMO_IDS.courseReact,
    studentId: DEMO_IDS.studentAbhinay,
    status: "ACTIVE",
    progress: 35,
  },
];

export function getDemoEnrolledCourses() {
  return DEMO_ENROLLMENTS.map((enrollment) => {
    const course = DEMO_COURSES.find((c) => c.id === enrollment.courseId);
    const localProgress = getCourseProgressPercent(enrollment.courseId);
    return {
      ...(course || {}),
      id: enrollment.courseId,
      progress: Math.max(enrollment.progress ?? 0, localProgress),
      isEnrolled: true,
    };
  });
}

export function mergeCategories(apiCategories) {
  if (Array.isArray(apiCategories) && apiCategories.length > 0) return apiCategories;
  return DEMO_CATEGORIES;
}

export function mergeCourses(apiCourses) {
  if (Array.isArray(apiCourses) && apiCourses.length > 0) return apiCourses;
  return DEMO_COURSES;
}

export function attachWorkflowToStudent(user) {
  if (!user || user.role !== "student") return user;
  if (user.email?.toLowerCase() === "abhinay@xebia.com") {
    return {
      ...user,
      id: DEMO_IDS.studentAbhinay,
      name: "Abhinay",
      batches: [DEMO_IDS.batchFrontend],
      averageScore: 80,
      assessmentsCompleted: 1,
    };
  }
  return user;
}

export function getWorkflowSeed() {
  return {
    categories: DEMO_CATEGORIES,
    courses: DEMO_COURSES,
    batches: DEMO_BATCHES,
    assessments: DEMO_ASSESSMENTS,
    submissions: DEMO_SUBMISSIONS,
    notifications: DEMO_NOTIFICATIONS,
    enrollments: DEMO_ENROLLMENTS,
  };
}
