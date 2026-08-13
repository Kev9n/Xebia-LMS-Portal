import {
  DEMO_CATEGORIES,
  DEMO_COURSES,
  DEMO_TENANT_ID,
  getReactCourseHierarchy,
} from "@/lib/demo-seed-data";
import { DEMO_TEACHERS, DEMO_STUDENTS } from "@/lib/demo-users";

const STORAGE_KEY = "lms_admin_catalog";

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          categories: [],
          courses: [],
          hierarchies: {},
          allocations: [],
          batches: [],
          enrollments: [],
          deletedCategoryIds: [],
          deletedCourseIds: [],
        };
  } catch {
    return {
      categories: [],
      courses: [],
      hierarchies: {},
      allocations: [],
      batches: [],
      enrollments: [],
      deletedCategoryIds: [],
      deletedCourseIds: [],
    };
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mergeById(baseList, localList, deletedIds = []) {
  const deleted = new Set(deletedIds.map(String));
  const map = new Map();
  (baseList || []).forEach((item) => {
    if (!deleted.has(String(item.id))) map.set(String(item.id), item);
  });
  (localList || []).forEach((item) => {
    if (!deleted.has(String(item.id))) map.set(String(item.id), { ...item, _local: true });
  });
  return Array.from(map.values());
}

export function isAdminOfflineMode() {
  return localStorage.getItem("lms_admin_offline") === "true";
}

export function setAdminOfflineMode(value) {
  localStorage.setItem("lms_admin_offline", value ? "true" : "false");
}

export function getMergedCategories(apiCategories) {
  const store = readStore();
  const base =
    Array.isArray(apiCategories) && apiCategories.length > 0 ? apiCategories : DEMO_CATEGORIES;
  return mergeById(base, store.categories, store.deletedCategoryIds);
}

export function getMergedCourses(apiCourses) {
  const store = readStore();
  const base = Array.isArray(apiCourses) && apiCourses.length > 0 ? apiCourses : DEMO_COURSES;
  return mergeById(base, store.courses, store.deletedCourseIds);
}

export function getLocalCategory(id) {
  return getMergedCategories([]).find((c) => String(c.id) === String(id)) || null;
}

export function getLocalCategoryBySlug(slug) {
  return (
    getMergedCategories([]).find(
      (c) =>
        c.slug === slug ||
        slugify(c.name) === slug ||
        slugify(c.name) === slugify(slug),
    ) || null
  );
}

export function getLocalCourse(id) {
  return getMergedCourses([]).find((c) => String(c.id) === String(id)) || null;
}

export function getLocalCourseBySlug(slug) {
  return (
    getMergedCourses([]).find(
      (c) =>
        c.slug === slug ||
        slugify(c.title) === slug ||
        slugify(c.title) === slugify(slug),
    ) || null
  );
}

export function createCategoryLocal(data) {
  const store = readStore();
  const category = {
    id: newId(),
    tenantId: DEMO_TENANT_ID,
    name: data.name,
    slug: data.slug || slugify(data.name),
    description: data.description || "",
    color: data.color || "#6C1D5F",
    icon: data.icon,
    active: data.isActive !== false,
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
    _local: true,
  };
  store.categories.push(category);
  writeStore(store);
  setAdminOfflineMode(true);
  return category;
}

export function updateCategoryLocal(id, data) {
  const store = readStore();
  const merged = getMergedCategories([]);
  const existing = merged.find((c) => String(c.id) === String(id));
  if (!existing) throw new Error("Category not found");

  const updated = {
    ...existing,
    ...data,
    slug: data.slug || slugify(data.name || existing.name),
    active: data.isActive !== undefined ? data.isActive : existing.active,
    isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
    _local: true,
  };

  const idx = store.categories.findIndex((c) => String(c.id) === String(id));
  if (idx >= 0) store.categories[idx] = updated;
  else store.categories.push(updated);
  writeStore(store);
  setAdminOfflineMode(true);
  return updated;
}

export function deleteCategoryLocal(id) {
  const store = readStore();
  store.categories = store.categories.filter((c) => String(c.id) !== String(id));
  if (!store.deletedCategoryIds.includes(String(id))) {
    store.deletedCategoryIds.push(String(id));
  }
  writeStore(store);
  setAdminOfflineMode(true);
  return true;
}

export function createCourseLocal(data) {
  const store = readStore();
  const course = {
    id: newId(),
    tenantId: DEMO_TENANT_ID,
    title: data.title,
    slug: slugify(data.title),
    courseCode: data.courseCode || slugify(data.title),
    description: data.description || "",
    shortDescription: data.shortDescription || "",
    categoryId: data.categoryId,
    level: data.level || "Beginner",
    difficultyLevel: data.level || "Beginner",
    language: data.language || "English",
    durationHours: data.durationHours || 0,
    durationMinutes: data.durationMinutes || 0,
    published: data.published !== false,
    isPublished: data.published !== false,
    active: data.active !== false,
    isActive: data.active !== false,
    isFeatured: data.isFeatured || false,
    allowEnrolling: data.allowEnrolling !== false,
    learningOutcomes: data.learningOutcomes || [],
    prerequisites: data.prerequisites || [],
    modulesCount: 0,
    studentsCount: 0,
    createdAt: new Date().toISOString(),
    _local: true,
  };
  store.courses.push(course);
  store.hierarchies[course.id] = { ...course, modules: [] };
  writeStore(store);
  setAdminOfflineMode(true);
  return course;
}

export function updateCourseLocal(id, data) {
  const store = readStore();
  const existing = getLocalCourse(id);
  if (!existing) throw new Error("Course not found");

  const updated = {
    ...existing,
    ...data,
    slug: slugify(data.title || existing.title),
    difficultyLevel: data.level || existing.level,
    isPublished: data.published !== undefined ? data.published : existing.published,
    isActive: data.active !== undefined ? data.active : existing.active,
    _local: true,
  };

  const idx = store.courses.findIndex((c) => String(c.id) === String(id));
  if (idx >= 0) store.courses[idx] = updated;
  else store.courses.push(updated);

  if (store.hierarchies[id]) {
    store.hierarchies[id] = { ...store.hierarchies[id], ...updated };
  }
  writeStore(store);
  setAdminOfflineMode(true);
  return updated;
}

export function deleteCourseLocal(id) {
  const store = readStore();
  store.courses = store.courses.filter((c) => String(c.id) !== String(id));
  delete store.hierarchies[id];
  if (!store.deletedCourseIds.includes(String(id))) {
    store.deletedCourseIds.push(String(id));
  }
  writeStore(store);
  setAdminOfflineMode(true);
  return true;
}

function ensureHierarchy(store, courseId) {
  if (!store.hierarchies[courseId]) {
    if (String(courseId) === "50000000-0000-0000-0000-000000000002") {
      store.hierarchies[courseId] = getReactCourseHierarchy();
    } else {
      const course = getLocalCourse(courseId);
      store.hierarchies[courseId] = {
        ...(course || { id: courseId, title: "Course" }),
        modules: [],
        modulesCount: 0,
      };
    }
  }
  return store.hierarchies[courseId];
}

export function getLocalHierarchy(courseId) {
  const store = readStore();
  if (store.hierarchies[courseId]) {
    return normalizeHierarchy(store.hierarchies[courseId]);
  }
  if (String(courseId) === "50000000-0000-0000-0000-000000000002") {
    return getReactCourseHierarchy();
  }
  const course = getLocalCourse(courseId);
  return course ? { ...course, modules: [], modulesCount: 0 } : null;
}

function normalizeHierarchy(hierarchy) {
  const modules = (hierarchy.modules || []).map((m, mi) => ({
    ...m,
    position: m.position ?? mi + 1,
    submodules: (m.submodules || []).map((s, si) => ({
      ...s,
      position: s.position ?? si + 1,
      contentBlocks: s.contentBlocks || [],
    })),
  }));
  return {
    ...hierarchy,
    modules,
    modulesCount: modules.length,
    submodulesCount: modules.reduce((acc, m) => acc + (m.submodules?.length || 0), 0),
  };
}

export function saveLocalHierarchy(courseId, hierarchy) {
  const store = readStore();
  store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
  writeStore(store);
  setAdminOfflineMode(true);
  return store.hierarchies[courseId];
}

export function addModuleLocal(courseId, data) {
  const store = readStore();
  const hierarchy = ensureHierarchy(store, courseId);
  const mod = {
    id: newId(),
    courseId,
    title: data.title,
    description: data.description || "",
    position: data.position ?? data.orderIndex ?? hierarchy.modules.length + 1,
    isActive: data.isActive !== false,
    submodules: [],
    _local: true,
  };
  hierarchy.modules.push(mod);
  store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
  writeStore(store);
  setAdminOfflineMode(true);
  return mod;
}

export function updateModuleLocal(moduleId, data) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    const idx = hierarchy.modules?.findIndex((m) => String(m.id) === String(moduleId));
    if (idx >= 0) {
      hierarchy.modules[idx] = { ...hierarchy.modules[idx], ...data, _local: true };
      store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
      writeStore(store);
      setAdminOfflineMode(true);
      return hierarchy.modules[idx];
    }
  }
  throw new Error("Module not found");
}

export function deleteModuleLocal(moduleId) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    const next = hierarchy.modules?.filter((m) => String(m.id) !== String(moduleId));
    if (next && next.length !== hierarchy.modules.length) {
      hierarchy.modules = next;
      store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
      writeStore(store);
      setAdminOfflineMode(true);
      return true;
    }
  }
  throw new Error("Module not found");
}

export function addSubmoduleLocal(courseId, moduleId, data) {
  const store = readStore();
  const hierarchy = ensureHierarchy(store, courseId);
  const mod = hierarchy.modules.find((m) => String(m.id) === String(moduleId));
  if (!mod) throw new Error("Module not found");
  const sub = {
    id: newId(),
    moduleId,
    title: data.title,
    description: data.description || "",
    position: data.position ?? mod.submodules.length + 1,
    isActive: data.isActive !== false,
    contentBlocks: [],
    _local: true,
  };
  mod.submodules.push(sub);
  store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
  writeStore(store);
  setAdminOfflineMode(true);
  return sub;
}

export function updateSubmoduleLocal(submoduleId, data) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    for (const mod of hierarchy.modules || []) {
      const idx = mod.submodules?.findIndex((s) => String(s.id) === String(submoduleId));
      if (idx >= 0) {
        mod.submodules[idx] = { ...mod.submodules[idx], ...data, _local: true };
        store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
        writeStore(store);
        setAdminOfflineMode(true);
        return mod.submodules[idx];
      }
    }
  }
  throw new Error("Submodule not found");
}

export function deleteSubmoduleLocal(submoduleId) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    for (const mod of hierarchy.modules || []) {
      const next = mod.submodules?.filter((s) => String(s.id) !== String(submoduleId));
      if (next && next.length !== mod.submodules.length) {
        mod.submodules = next;
        store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
        writeStore(store);
        setAdminOfflineMode(true);
        return true;
      }
    }
  }
  throw new Error("Submodule not found");
}

export function addContentItemLocal(courseId, data) {
  const store = readStore();
  const hierarchy = ensureHierarchy(store, courseId);
  const mod = hierarchy.modules.find((m) => String(m.id) === String(data.moduleId));
  const sub = mod?.submodules?.find((s) => String(s.id) === String(data.subModuleId));
  if (!sub) throw new Error("Submodule not found");

  const item = {
    id: newId(),
    courseId,
    moduleId: data.moduleId,
    subModuleId: data.subModuleId,
    title: data.title,
    type: data.type || "TEXT",
    storageRef: data.storageRef || "",
    position: data.position || (sub.contentBlocks?.length || 0) + 1,
    _local: true,
  };
  sub.contentBlocks = [...(sub.contentBlocks || []), item];
  store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
  writeStore(store);
  setAdminOfflineMode(true);
  return item;
}

export function updateContentItemLocal(contentId, data) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    for (const mod of hierarchy.modules || []) {
      for (const sub of mod.submodules || []) {
        const idx = sub.contentBlocks?.findIndex((c) => String(c.id) === String(contentId));
        if (idx >= 0) {
          sub.contentBlocks[idx] = { ...sub.contentBlocks[idx], ...data, _local: true };
          store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
          writeStore(store);
          setAdminOfflineMode(true);
          return sub.contentBlocks[idx];
        }
      }
    }
  }
  throw new Error("Content item not found");
}

export function deleteContentItemLocal(contentId) {
  const store = readStore();
  for (const courseId of Object.keys(store.hierarchies)) {
    const hierarchy = store.hierarchies[courseId];
    for (const mod of hierarchy.modules || []) {
      for (const sub of mod.submodules || []) {
        const next = sub.contentBlocks?.filter((c) => String(c.id) !== String(contentId));
        if (next && next.length !== (sub.contentBlocks?.length || 0)) {
          sub.contentBlocks = next;
          store.hierarchies[courseId] = normalizeHierarchy(hierarchy);
          writeStore(store);
          setAdminOfflineMode(true);
          return true;
        }
      }
    }
  }
  throw new Error("Content item not found");
}

export function getMergedAllocations(apiAllocations) {
  const store = readStore();
  return mergeById(apiAllocations || [], store.allocations, []);
}

export function createBulkAllocationsLocal(allocations) {
  const store = readStore();
  const created = allocations.map((a) => ({
    id: newId(),
    ...a,
    status: a.status || "active",
    assignedAt: a.assignedAt || new Date().toISOString(),
    _local: true,
  }));
  store.allocations.push(...created);
  writeStore(store);
  setAdminOfflineMode(true);
  return created;
}

export function deleteAllocationLocal(id) {
  const store = readStore();
  store.allocations = store.allocations.filter((a) => String(a.id) !== String(id));
  writeStore(store);
  setAdminOfflineMode(true);
  return true;
}

export function getLocalEnrollmentsForStudent(studentId) {
  const store = readStore();
  return (store.enrollments || []).filter((e) => String(e.studentId) === String(studentId));
}

/** Admin allocates course to trainer+batch → enroll all batch students in those courses. */
export function enrollBatchStudentsInCourses(courseIds, studentIds) {
  const store = readStore();
  store.enrollments = store.enrollments || [];
  const created = [];

  for (const courseId of courseIds) {
    for (const studentId of studentIds) {
      const exists = store.enrollments.some(
        (e) => String(e.courseId) === String(courseId) && String(e.studentId) === String(studentId),
      );
      if (exists) continue;
      const enrollment = {
        id: newId(),
        courseId,
        studentId,
        status: "ACTIVE",
        progress: 0,
        isEnrolled: true,
        _local: true,
      };
      store.enrollments.push(enrollment);
      created.push(enrollment);
    }
  }

  writeStore(store);
  return created;
}

export function getDemoUsers(role) {
  if (role === "teacher") return DEMO_TEACHERS;
  if (role === "student") return DEMO_STUDENTS;
  return [...DEMO_TEACHERS, ...DEMO_STUDENTS];
}

export function mergeHierarchyWithLocal(courseId, apiHierarchy) {
  const store = readStore();
  const local = store.hierarchies[courseId];
  if (local?.modules?.length) {
    return normalizeHierarchy({ ...apiHierarchy, ...local, modules: local.modules });
  }
  return apiHierarchy;
}
