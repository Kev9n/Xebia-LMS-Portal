import { TEMPORARY_STUDENT_ID } from "@/config/student-identity";

const STORAGE_KEY = "lms_course_progress";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota exceeded */
  }
}

function recordKey(courseId, studentId = TEMPORARY_STUDENT_ID) {
  return `${studentId}::${courseId}`;
}

function getRecord(courseId, studentId = TEMPORARY_STUDENT_ID) {
  const all = readAll();
  return all[recordKey(courseId, studentId)] || null;
}

function saveRecord(courseId, studentId, record) {
  const all = readAll();
  all[recordKey(courseId, studentId)] = record;
  writeAll(all);
}

function buildSummary(record) {
  const total = record.totalLessons || 0;
  const completed = record.completedSubmoduleIds?.length || 0;
  const progressPercentage =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return {
    totalLessons: total,
    completedLessons: completed,
    progressPercentage,
    completedSubmoduleIds: [...(record.completedSubmoduleIds || [])],
    lastAccessedSubmoduleId: record.lastAccessedSubmoduleId || null,
  };
}

export function ensureCourseProgress(courseId, studentId, totalLessons = 0) {
  const existing = getRecord(courseId, studentId);
  const record = existing || {
    completedSubmoduleIds: [],
    totalLessons: 0,
    lastAccessedSubmoduleId: null,
  };
  if (totalLessons > record.totalLessons) {
    record.totalLessons = totalLessons;
  }
  saveRecord(courseId, studentId, record);
  return record;
}

export function getProgressSummary(courseId, studentId = TEMPORARY_STUDENT_ID) {
  const record = getRecord(courseId, studentId);
  if (!record) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      progressPercentage: 0,
      completedSubmoduleIds: [],
      lastAccessedSubmoduleId: null,
    };
  }
  return buildSummary(record);
}

export function getCourseProgressPercent(courseId, studentId = TEMPORARY_STUDENT_ID) {
  return getProgressSummary(courseId, studentId).progressPercentage;
}

export function markSubmoduleComplete(
  courseId,
  submoduleId,
  { studentId = TEMPORARY_STUDENT_ID, totalLessons = 0 } = {},
) {
  const record = ensureCourseProgress(courseId, studentId, totalLessons);
  const ids = record.completedSubmoduleIds || [];
  const normalized = String(submoduleId);
  if (!ids.some((id) => String(id) === normalized)) {
    record.completedSubmoduleIds = [...ids, submoduleId];
  }
  record.lastAccessedSubmoduleId = submoduleId;
  saveRecord(courseId, studentId, record);
  return buildSummary(record);
}

export function updateLastAccess(
  courseId,
  submoduleId,
  { studentId = TEMPORARY_STUDENT_ID, totalLessons = 0 } = {},
) {
  const record = ensureCourseProgress(courseId, studentId, totalLessons);
  record.lastAccessedSubmoduleId = submoduleId;
  saveRecord(courseId, studentId, record);
  return buildSummary(record);
}

export function isSubmoduleComplete(courseId, submoduleId, studentId = TEMPORARY_STUDENT_ID) {
  const record = getRecord(courseId, studentId);
  if (!record) return false;
  return (record.completedSubmoduleIds || []).some((id) => String(id) === String(submoduleId));
}

export function mergeProgressSummaries(remote, local) {
  if (!remote) return local;
  if (!local) return remote;

  const mergedIds = [
    ...new Set([
      ...(remote.completedSubmoduleIds || []).map(String),
      ...(local.completedSubmoduleIds || []).map(String),
    ]),
  ];

  const totalLessons = Math.max(remote.totalLessons || 0, local.totalLessons || 0);
  const progressPercentage =
    totalLessons > 0 ? Math.min(100, Math.round((mergedIds.length / totalLessons) * 100)) : 0;

  return {
    totalLessons,
    completedLessons: mergedIds.length,
    progressPercentage,
    completedSubmoduleIds: mergedIds,
    lastAccessedSubmoduleId:
      remote.lastAccessedSubmoduleId || local.lastAccessedSubmoduleId || null,
  };
}
