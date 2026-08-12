/** Demo users for login quick-access when backend is unavailable or empty. */
export const DEMO_TEACHERS = [
  {
    id: "demo-teacher-kevin",
    name: "Kevin",
    email: "kevin@xebia.com",
    role: "teacher",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=kevin-xebia",
  },
  {
    id: "demo-teacher-nikhil",
    name: "Nikhil",
    email: "nikhil@xebia.com",
    role: "teacher",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?u=nikhil-xebia",
  },
];

export const DEMO_STUDENTS = [
  {
    id: "demo-student-abhinay",
    name: "Abhinay",
    email: "abhinay@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: ["B1"],
    avatar: "https://i.pravatar.cc/150?u=abhinay-xebia",
  },
  {
    id: "demo-student-khanoj",
    name: "Khanoj",
    email: "khanoj@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: ["B1"],
    avatar: "https://i.pravatar.cc/150?u=khanoj-xebia",
  },
  {
    id: "demo-student-revanth",
    name: "Revanth",
    email: "revanth@xebia.com",
    role: "student",
    department: "Computer Science",
    batches: ["B1"],
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
