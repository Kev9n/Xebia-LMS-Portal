import { TEMPORARY_STUDENT_ID } from "@/config/student-identity";
import { getSessionUserId, resolveApiBaseUrl } from "@/lib/api-config";
import {
  getProgressSummary,
  markSubmoduleComplete,
  mergeProgressSummaries,
  updateLastAccess,
  ensureCourseProgress,
  getCourseProgressPercent,
} from "@/lib/course-progress-store";
import {
  addContentItemLocal,
  addModuleLocal,
  addSubmoduleLocal,
  createBulkAllocationsLocal,
  createCategoryLocal,
  createCourseLocal,
  deleteAllocationLocal,
  deleteCategoryLocal,
  deleteContentItemLocal,
  deleteCourseLocal,
  deleteModuleLocal,
  deleteSubmoduleLocal,
  getDemoUsers,
  getLocalCategory,
  getLocalCategoryBySlug,
  getLocalCourse,
  getLocalCourseBySlug,
  getLocalHierarchy,
  getMergedAllocations,
  getMergedCategories,
  getMergedCourses,
  mergeHierarchyWithLocal,
  setAdminOfflineMode,
  updateCategoryLocal,
  updateContentItemLocal,
  updateCourseLocal,
  updateModuleLocal,
  updateSubmoduleLocal,
} from "@/lib/admin-catalog-store";
import {
  DEMO_TENANT_ID,
  DEMO_ASSESSMENTS,
  DEMO_BATCHES,
  DEMO_SUBMISSIONS,
  getDemoEnrolledCourses,
  getReactCourseHierarchy,
} from "@/lib/demo-seed-data";
import { enrollBatchStudentsInCourses, getLocalEnrollmentsForStudent } from "@/lib/admin-catalog-store";

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Standard fetch wrapper that automatically handles JSON and error states
 */
async function fetchApi(endpoint, options = {}) {
  const userId = options.userId || getSessionUserId(TEMPORARY_STUDENT_ID);
  const headers = {
    "Content-Type": "application/json",
    "X-Tenant-Id": DEMO_TENANT_ID,
    "X-User-Id": userId,
    ...options.headers,
  };

  const { userId: _omit, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "An error occurred while fetching data";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Not JSON
    }
    throw new Error(errorMsg);
  }

  // Handle empty responses (like 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const EnrollmentService = {
  enroll: (courseId, options = {}) =>
    fetchApi(`/enrollments/${courseId}`, { method: "POST", userId: options.userId }),
  unenroll: (courseId) => fetchApi(`/enrollments/${courseId}`, { method: "DELETE" }),
  getStatus: async (courseId) => {
    try {
      const status = await fetchApi(`/enrollments/${courseId}/status`);
      if (status?.isEnrolled) return status;
    } catch {
      /* fall through */
    }
    const demo = getDemoEnrolledCourses().find((c) => String(c.id) === String(courseId));
    return {
      isEnrolled: !!demo,
      progress: demo?.progress ?? getProgressSummary(courseId).progressPercentage,
    };
  },
  getMyCourses: async () => {
    const userId = getSessionUserId(TEMPORARY_STUDENT_ID);
    try {
      const data = await fetchApi("/enrollments/my-courses", { userId });
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const courseId = item.id || item.courseId;
          return {
            ...item,
            id: courseId,
            progress: Math.max(item.progress ?? 0, getCourseProgressPercent(courseId, userId)),
          };
        });
      }
    } catch {
      /* fall through */
    }

    const localEnrollments = getLocalEnrollmentsForStudent(userId);
    const demoCourses = getDemoEnrolledCourses();
    if (localEnrollments.length > 0) {
      const merged = getMergedCourses(null);
      const fromLocal = localEnrollments.map((e) => {
        const course = merged.find((c) => String(c.id) === String(e.courseId));
        return {
          ...(course || {}),
          id: e.courseId,
          progress: Math.max(e.progress ?? 0, getCourseProgressPercent(e.courseId, userId)),
          isEnrolled: true,
        };
      });
      const seen = new Set(fromLocal.map((c) => String(c.id)));
      const combined = [
        ...fromLocal,
        ...demoCourses.filter((c) => !seen.has(String(c.id))),
      ];
      return combined;
    }

    return demoCourses;
  },
};

export const ProgressService = {
  markComplete: async (courseId, submoduleId, options = {}) => {
    const local = markSubmoduleComplete(courseId, submoduleId, options);
    try {
      await fetchApi(`/progress/course/${courseId}/submodule/${submoduleId}/complete`, {
        method: "POST",
      });
    } catch {
      /* local progress is source of truth when API unavailable */
    }
    return local;
  },
  markIncomplete: async (courseId, submoduleId) => {
    try {
      return await fetchApi(`/progress/course/${courseId}/submodule/${submoduleId}/complete`, {
        method: "DELETE",
      });
    } catch {
      return null;
    }
  },
  updateAccess: async (courseId, submoduleId, contentId, options = {}) => {
    updateLastAccess(courseId, submoduleId, options);
    try {
      return await fetchApi(`/progress/course/${courseId}/access`, {
        method: "POST",
        body: JSON.stringify({ submoduleId, contentId }),
      });
    } catch {
      return null;
    }
  },
  getCourseProgress: async (courseId, options = {}) => {
    const studentId = options.studentId || TEMPORARY_STUDENT_ID;
    if (options.totalLessons) {
      ensureCourseProgress(courseId, studentId, options.totalLessons);
    }
    const local = getProgressSummary(courseId, studentId);
    try {
      const remote = await fetchApi(`/progress/course/${courseId}`);
      return mergeProgressSummaries(remote, local);
    } catch {
      return local;
    }
  },
};

export const CourseService = {
  getCourses: async () => {
    try {
      const data = await fetchApi("/courses", { cache: "no-store" });
      setAdminOfflineMode(false);
      return getMergedCourses(data);
    } catch {
      return getMergedCourses(null);
    }
  },
  getCourseById: async (id) => {
    try {
      const data = await fetchApi(`/courses/${id}`, { cache: "no-store" });
      setAdminOfflineMode(false);
      return data;
    } catch {
      return getLocalCourse(id);
    }
  },
  getCourseHierarchy: async (id) => {
    try {
      const dto = await fetchApi(`/courses/${id}/hierarchy`, { cache: "no-store" });
      if (!dto) throw new Error("Empty hierarchy");
      const mappedCourse = { ...dto.course };
      mappedCourse.modules = (dto.modules || []).map((mDto) => ({
        ...mDto.module,
        submodules: (mDto.submodules || []).map((sDto) => ({
          ...sDto.submodule,
          contentBlocks: sDto.contentBlocks || [],
        })),
      }));
      mappedCourse.modulesCount = mappedCourse.modules.length;
      mappedCourse.submodulesCount = mappedCourse.modules.reduce(
        (acc, m) => acc + (m.submodules?.length || 0),
        0,
      );
      setAdminOfflineMode(false);
      return mergeHierarchyWithLocal(id, mappedCourse) || mappedCourse;
    } catch {
      return getLocalHierarchy(id);
    }
  },
  getCourseBySlug: async (slug) => {
    try {
      const all = await fetchApi("/courses");
      const course = all.find(
        (c) =>
          c.slug === slug ||
          (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug),
      );
      if (course) {
        setAdminOfflineMode(false);
        return course;
      }
    } catch {
      /* fall through */
    }
    const local = getLocalCourseBySlug(slug);
    if (local) return local;
    throw new Error("Course not found");
  },
  createCourse: async (data) => {
    try {
      const result = await fetchApi("/courses", { method: "POST", body: JSON.stringify(data) });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return createCourseLocal(data);
    }
  },
  updateCourse: async (id, data) => {
    try {
      const result = await fetchApi(`/courses/${id}`, { method: "PUT", body: JSON.stringify(data) });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return updateCourseLocal(id, data);
    }
  },
  deleteCourse: async (id) => {
    try {
      await fetchApi(`/courses/${id}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteCourseLocal(id);
    }
  },
  addModule: async (courseId, data) => {
    try {
      const result = await fetchApi(`/courses/${courseId}/modules`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return addModuleLocal(courseId, data);
    }
  },
  updateModule: async (moduleId, data) => {
    try {
      const result = await fetchApi(`/courses/modules/${moduleId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return updateModuleLocal(moduleId, data);
    }
  },
  deleteModule: async (moduleId) => {
    try {
      await fetchApi(`/courses/modules/${moduleId}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteModuleLocal(moduleId);
    }
  },
  addSubmodule: async (courseId, moduleId, data) => {
    try {
      const result = await fetchApi(`/courses/${courseId}/modules/${moduleId}/submodules`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return addSubmoduleLocal(courseId, moduleId, data);
    }
  },
  updateSubmodule: async (submoduleId, data) => {
    try {
      const result = await fetchApi(`/courses/submodules/${submoduleId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return updateSubmoduleLocal(submoduleId, data);
    }
  },
  deleteSubmodule: async (submoduleId) => {
    try {
      await fetchApi(`/courses/submodules/${submoduleId}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteSubmoduleLocal(submoduleId);
    }
  },
  addContentItem: async (courseId, data) => {
    try {
      const result = await fetchApi(`/courses/${courseId}/content-items`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return addContentItemLocal(courseId, data);
    }
  },
  updateContentItem: async (contentId, data) => {
    try {
      const result = await fetchApi(`/courses/content-items/${contentId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return updateContentItemLocal(contentId, data);
    }
  },
  deleteContentItem: async (contentId) => {
    try {
      await fetchApi(`/courses/content-items/${contentId}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteContentItemLocal(contentId);
    }
  },
};

export const UserService = {
  getUsers: async (role) => {
    try {
      const data = await fetchApi(`/v1/users${role ? "?role=" + role : ""}`);
      if (Array.isArray(data) && data.length > 0) {
        setAdminOfflineMode(false);
        return data;
      }
    } catch {
      /* fall through */
    }
    return getDemoUsers(role);
  },
  createUser: (data) => fetchApi("/v1/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUser: (id) => fetchApi(`/v1/users/${id}`, { method: "DELETE" }),
};

export const TrainerCascadeService = {
  deleteBatchesByCreator: (createdBy) =>
    fetchApi(`/v1/batches/created-by/${createdBy}`, { method: "DELETE" }),
  deleteAllocationsByTrainer: (trainerId) =>
    fetchApi(`/v1/allocations/trainer/${trainerId}`, { method: "DELETE" }),
  deleteAssessmentsByCreator: (createdBy) =>
    fetchApi(`/v1/assessments/created-by/${createdBy}`, { method: "DELETE" }),
  deleteEventsByCreator: (createdBy) =>
    fetchApi(`/v1/events/created-by/${createdBy}`, { method: "DELETE" }),
};

export const BatchService = {
  getBatches: async () => {
    try {
      const data = await fetchApi("/v1/batches");
      if (Array.isArray(data) && data.length > 0) {
        setAdminOfflineMode(false);
        return data;
      }
    } catch {
      /* fall through */
    }
    return DEMO_BATCHES;
  },
  createBatch: async (data) => {
    try {
      const result = await fetchApi("/v1/batches", { method: "POST", body: JSON.stringify(data) });
      setAdminOfflineMode(false);
      return result;
    } catch {
      const batch = {
        id: crypto.randomUUID?.() || `batch-${Date.now()}`,
        ...data,
        status: data.status || "active",
        _local: true,
      };
      const store = JSON.parse(localStorage.getItem("lms_admin_catalog") || "{}");
      store.batches = [...(store.batches || []), batch];
      localStorage.setItem("lms_admin_catalog", JSON.stringify(store));
      setAdminOfflineMode(true);
      return batch;
    }
  },
  updateBatch: (id, data) =>
    fetchApi(`/v1/batches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBatch: (id) => fetchApi(`/v1/batches/${id}`, { method: "DELETE" }),
  enrolStudent: (batchId, data) =>
    fetchApi(`/v1/batches/${batchId}/students`, { method: "POST", body: JSON.stringify(data) }),
};

export const AssessmentService = {
  getAssessments: async () => {
    try {
      const data = await fetchApi("/v1/assessments");
      if (Array.isArray(data) && data.length > 0) return data;
      return DEMO_ASSESSMENTS;
    } catch {
      return DEMO_ASSESSMENTS;
    }
  },
  createAssessment: (data) =>
    fetchApi("/v1/assessments", { method: "POST", body: JSON.stringify(data) }),
  updateAssessment: (id, data) =>
    fetchApi(`/v1/assessments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAssessment: (id) => fetchApi(`/v1/assessments/${id}`, { method: "DELETE" }),
  deleteByBatch: (batchId) => fetchApi(`/v1/assessments/batch/${batchId}`, { method: "DELETE" }),
};

export const SubmissionService = {
  getSubmissions: async (studentId) => {
    try {
      const data = await fetchApi(
        `/v1/submissions${studentId ? "?studentId=" + studentId : ""}`,
      );
      const mapped = (data || []).map((sub) => ({
        ...sub,
        answers: sub.answers?.map((a) => {
          let parsed = a.answer;
          try {
            if (
              parsed &&
              typeof parsed === "string" &&
              (parsed.startsWith("[") || parsed.startsWith("{"))
            ) {
              parsed = JSON.parse(parsed);
            }
          } catch (e) {}
          return { ...a, answer: parsed };
        }),
      }));
      if (mapped.length > 0) return mapped;
      return DEMO_SUBMISSIONS;
    } catch {
      return DEMO_SUBMISSIONS;
    }
  },
  createSubmission: (data) => {
    const payload = {
      ...data,
      answers: data.answers?.map((a) => ({
        ...a,
        answer: typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer || ""),
      })),
    };
    return fetchApi("/v1/submissions", { method: "POST", body: JSON.stringify(payload) });
  },
  updateSubmission: (id, data) => {
    const payload = {
      ...data,
      answers: data.answers?.map((a) => ({
        ...a,
        answer: typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer || ""),
      })),
    };
    return fetchApi(`/v1/submissions/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
};

export const DraftService = {
  saveDraft: (studentId, assessmentId, draftData) =>
    fetchApi(`/v1/assessments/drafts/${studentId}/${assessmentId}`, {
      method: "POST",
      body: JSON.stringify(draftData),
    }),
  getDraft: (studentId, assessmentId) =>
    fetchApi(`/v1/assessments/drafts/${studentId}/${assessmentId}`).catch(() => null),
};

export const AIDescriptionService = {
  generateDescription: (topic) =>
    fetchApi("/v1/assessments/ai/generate-description", {
      method: "POST",
      body: JSON.stringify({ topic }),
    }),
};

export const AuthService = {
  login: (credentials) =>
    fetchApi("/iam/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getProfile: () => fetchApi("/iam/me"),
};

export const CategoryService = {
  getCategories: async () => {
    try {
      const data = await fetchApi("/categories");
      setAdminOfflineMode(false);
      return getMergedCategories(data);
    } catch {
      return getMergedCategories(null);
    }
  },
  getCategoryById: async (id) => {
    try {
      const all = await fetchApi("/categories");
      const cat = all.find((c) => String(c.id) === String(id));
      if (cat) {
        setAdminOfflineMode(false);
        return cat;
      }
    } catch {
      /* fall through */
    }
    const local = getLocalCategory(id);
    if (local) return local;
    throw new Error("Category not found");
  },
  getCategoryBySlug: async (slug) => {
    try {
      const all = await fetchApi("/categories");
      const cat = all.find(
        (c) =>
          c.slug === slug || (c.name && c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug),
      );
      if (cat) {
        setAdminOfflineMode(false);
        return cat;
      }
    } catch {
      /* fall through */
    }
    const local = getLocalCategoryBySlug(slug);
    if (local) return local;
    throw new Error("Category not found");
  },
  createCategory: async (data) => {
    try {
      const result = await fetchApi("/categories", { method: "POST", body: JSON.stringify(data) });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return createCategoryLocal(data);
    }
  },
  updateCategory: async (id, data) => {
    try {
      const result = await fetchApi(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return updateCategoryLocal(id, data);
    }
  },
  deleteCategory: async (id) => {
    try {
      await fetchApi(`/categories/${id}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteCategoryLocal(id);
    }
  },
};

export const AllocationService = {
  getAllocations: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.trainerId) params.append("trainerId", filters.trainerId);
      if (filters.batchId) params.append("batchId", filters.batchId);
      if (filters.courseId) params.append("courseId", filters.courseId);
      if (filters.university) params.append("university", filters.university);
      if (filters.status) params.append("status", filters.status);
      const qs = params.toString();
      const data = await fetchApi(`/v1/allocations${qs ? "?" + qs : ""}`);
      setAdminOfflineMode(false);
      return getMergedAllocations(data);
    } catch {
      const local = getMergedAllocations([]);
      if (filters.batchId) {
        return local.filter((a) => String(a.batchId) === String(filters.batchId));
      }
      if (filters.trainerId) {
        return local.filter((a) => String(a.trainerId) === String(filters.trainerId));
      }
      return local;
    }
  },
  getAllocationById: (id) => fetchApi(`/v1/allocations/${id}`),
  createAllocation: async (data) => {
    try {
      const result = await fetchApi("/v1/allocations", { method: "POST", body: JSON.stringify(data) });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return createBulkAllocationsLocal([data])[0];
    }
  },
  updateAllocation: (id, data) =>
    fetchApi(`/v1/allocations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAllocation: async (id) => {
    try {
      await fetchApi(`/v1/allocations/${id}`, { method: "DELETE" });
      setAdminOfflineMode(false);
      return true;
    } catch {
      return deleteAllocationLocal(id);
    }
  },
  deleteAllocationsByBatch: (batchId) =>
    fetchApi(`/v1/allocations/batch/${batchId}`, { method: "DELETE" }),
  createBulkAllocations: async (allocations) => {
    try {
      const result = await fetchApi("/v1/allocations/bulk", {
        method: "POST",
        body: JSON.stringify(allocations),
      });
      setAdminOfflineMode(false);
      return result;
    } catch {
      return createBulkAllocationsLocal(allocations);
    }
  },
  getDashboardSummary: () => fetchApi("/v1/allocations/dashboard"),
  getAnalytics: () => fetchApi("/v1/allocations/analytics"),
  getTrainerAllocations: (trainerId) => fetchApi(`/v1/allocations/trainer/${trainerId}`),
  getBatchAllocations: (batchId) => fetchApi(`/v1/allocations/batch/${batchId}`),
  getCourseAllocations: (courseId) => fetchApi(`/v1/allocations/course/${courseId}`),
  getUniversityAllocations: (university) => fetchApi(`/v1/allocations/university/${university}`),
};

// ============================================================
// Admin Assessment Service
// ============================================================
export const AdminAssessmentService = {
  getDashboard: () => fetchApi("/v1/assessments/dashboard"),
  getAnalytics: () => fetchApi("/v1/assessments/analytics"),
  getAssessmentDetails: (id) => fetchApi(`/v1/assessments/${id}/details`),
  getStudentReport: (id) => fetchApi(`/v1/assessments/${id}/report`),
  getTrainerPerformance: () => fetchApi("/v1/assessments/trainer-performance"),
  getBatchPerformance: () => fetchApi("/v1/assessments/batch-performance"),
};

// ============================================================
// Event Service
// ============================================================
export const EventService = {
  getEvents: () => fetchApi("/v1/events"),
  getEventById: (id) => fetchApi(`/v1/events/${id}`),
  createEvent: (data) => fetchApi("/v1/events", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id, data) => fetchApi(`/v1/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id) => fetchApi(`/v1/events/${id}`, { method: "DELETE" }),
  registerForEvent: (eventId) => fetchApi(`/v1/events/${eventId}/register`, { method: "POST" }),
  cancelRegistration: (eventId) => fetchApi(`/v1/events/${eventId}/register`, { method: "DELETE" }),
  getRegistrationStatus: (eventId) => fetchApi(`/v1/events/${eventId}/registration-status`),
  getEventRegistrants: (eventId) => fetchApi(`/v1/events/${eventId}/registrations`),
  getMyRegistrations: () => fetchApi("/v1/events/registrations/my"),
};
