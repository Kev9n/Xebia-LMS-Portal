import { DEMO_IDS } from "@/lib/demo-seed-data";

export const studentProfile = {
  name: "Abhinay",
  avatar: "https://i.pravatar.cc/150?u=abhinay-xebia",
  role: "Student",
  university: "Xebia University",
  batch: "Batch 2026 - Frontend Engineering",
  email: "abhinay@xebia.com",
  id: DEMO_IDS.studentAbhinay,
  phone: "+91-9876543210",
  enrollmentDate: "2026-01-10",
};

export const enrolledCourses = [
  {
    id: DEMO_IDS.courseReact,
    title: "React.js Complete Guide",
    trainer: "Kevin",
    duration: "40 Hours",
    progress: 35,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    modulesCompleted: 3,
    totalModules: 8,
    lastWatched: "Introduction to React",
  },
];

export const upcomingAssessments = [
  {
    id: DEMO_IDS.assessmentReactMod1,
    name: "React.js - Module 1 Assessment",
    course: "React.js Complete Guide",
    date: "2026-08-20",
    time: "10:00 AM",
    status: "Upcoming",
  },
];

export const assessmentResults = [
  {
    id: DEMO_IDS.submissionReactMod1,
    assessmentName: "React.js - Module 1 Assessment",
    course: "React.js Complete Guide",
    marks: 8,
    maxMarks: 10,
    percentage: 80,
    grade: "B+",
    date: "2026-08-12",
  },
];

export const notifications = [
  {
    id: "n1",
    title: "Welcome to Xebia LMS",
    message: "You are enrolled in React.js Complete Guide.",
    timestamp: "2 hours ago",
    read: false,
    type: "course",
  },
  {
    id: "n2",
    title: "Assessment Available",
    message: "React.js - Module 1 Assessment is now open.",
    timestamp: "5 hours ago",
    read: false,
    type: "assessment",
  },
  {
    id: "n3",
    title: "Result Published",
    message: "Your Module 1 assessment results are available.",
    timestamp: "1 day ago",
    read: true,
    type: "result",
  },
];

export const batchInfo = {
  batchName: "Batch 2026 - Frontend Engineering",
  startDate: "2026-01-10",
  endDate: "2026-12-15",
  trainer: "Kevin",
  university: "Xebia University",
  schedule: "Mon - Fri, 09:00 AM - 05:00 PM",
  description:
    "An intensive frontend engineering program focusing on React, component architecture, and enterprise UI patterns.",
};

export const chartData = {
  courseProgress: [
    { name: "Jan", progress: 10 },
    { name: "Feb", progress: 25 },
    { name: "Mar", progress: 35 },
    { name: "Apr", progress: 35 },
  ],
  subjectPerformance: [
    { subject: "React Basics", score: 80 },
    { subject: "Components", score: 75 },
    { subject: "Hooks", score: 85 },
  ],
};

export const commentsData = [
  {
    id: "c1",
    author: "Kevin",
    avatar: "https://i.pravatar.cc/150?u=kevin-xebia",
    text: "Great progress on the Introduction module!",
    timestamp: "1 hour ago",
  },
];
