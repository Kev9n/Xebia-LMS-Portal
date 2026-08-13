/** Demo users for login quick-access when backend is unavailable or empty. */
import { DEMO_IDS } from "./demo-seed-data";

export const DEMO_TEACHERS = [
  {
    id: DEMO_IDS.teacherKevin,
    name: "Kevin",
    email: "kevin@xebia.com",
    role: "teacher",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=kevin-xebia",
  },
  {
    id: DEMO_IDS.teacherNikhil,
    name: "Nikhil",
    email: "nikhil@xebia.com",
    role: "teacher",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=nikhil-xebia",
  },
];

export const DEMO_STUDENTS = [
  {
    id: DEMO_IDS.studentAbhinay,
    name: "Abhinay",
    email: "abhinay@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: [DEMO_IDS.batchFrontend],
    averageScore: 80,
    assessmentsCompleted: 1,
    avatar: "https://i.pravatar.cc/150?u=abhinay-xebia",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Khanoj",
    email: "khanoj@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: [DEMO_IDS.batchFrontend],
    avatar: "https://i.pravatar.cc/150?u=khanoj-xebia",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Revanth",
    email: "revanth@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: [DEMO_IDS.batchFrontend],
    avatar: "https://i.pravatar.cc/150?u=revanth-xebia",
  },
];

const LEGACY_EMAIL_UPDATES = {
  "mritunjai@xebia.com": { name: "Kevin", email: "kevin@xebia.com" },
  "manish@xebia.com": { name: "Nikhil", email: "nikhil@xebia.com" },
  "vijay@xebia.com": { name: "Abhinay", email: "abhinay@xebia.com" },
  "abhijeet@xebia.com": { name: "Khanoj", email: "khanoj@xebia.com" },
  "vinit@xebia.com": { name: "Revanth", email: "revanth@xebia.com" },
};

export function normalizeDemoUsers(users) {
  return users.map((user) => {
    const update = LEGACY_EMAIL_UPDATES[user.email?.toLowerCase()];
    return update ? { ...user, ...update } : user;
  });
}

export function resolveTeachers(users) {
  const teachers = normalizeDemoUsers(users.filter((user) => user.role === "teacher"));
  return teachers.length > 0 ? teachers : DEMO_TEACHERS;
}

export function resolveStudents(users) {
  const students = normalizeDemoUsers(users.filter((user) => user.role === "student"));
  return students.length > 0 ? students : DEMO_STUDENTS;
}
