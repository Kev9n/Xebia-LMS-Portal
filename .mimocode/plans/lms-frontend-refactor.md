# LMS Frontend Refactoring Plan

## Overview
Three observations to address: API layer unification, admin integration, and analytics real data. All changes preserve UI structure, route organization, and the shadcn/ui component library.

---

## Phase 1: API Unification (Observation #2)

**Goal**: Merge `src/api/client.js` methods into `src/services/api.js`, update all consumers, delete `client.js`.

### Step 1.1: Add new services to `src/services/api.js`

Add these new service objects using the existing `fetchApi` wrapper:

```js
// Add to src/services/api.js (after existing services)

export const UserService = {
  getUsers: (role) => fetchApi(`/users${role ? `?role=${role}` : ""}`),
  createUser: (data) => fetchApi("/users", { method: "POST", body: JSON.stringify(data) }),
};

export const AssessmentService = {
  getAssessments: () => fetchApi("/assessments"),
  createAssessment: (data) => fetchApi("/assessments", { method: "POST", body: JSON.stringify(data) }),
  updateAssessment: (id, data) => fetchApi(`/assessments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAssessment: (id) => fetchApi(`/assessments/${id}`, { method: "DELETE" }),
};

export const SubmissionService = {
  getSubmissions: async (studentId) => {
    const data = await fetchApi(`/submissions${studentId ? `?studentId=${studentId}` : ""}`);
    return data.map((sub) => ({
      ...sub,
      answers: sub.answers?.map((a) => {
        let parsed = a.answer;
        try {
          if (parsed && typeof parsed === "string" && (parsed.startsWith("[") || parsed.startsWith("{"))) {
            parsed = JSON.parse(parsed);
          }
        } catch (e) {}
        return { ...a, answer: parsed };
      }),
    }));
  },
  createSubmission: (data) => {
    const payload = {
      ...data,
      answers: data.answers?.map((a) => ({
        ...a,
        answer: typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer || ""),
      })),
    };
    return fetchApi("/submissions", { method: "POST", body: JSON.stringify(payload) });
  },
  updateSubmission: (id, data) => {
    const payload = {
      ...data,
      answers: data.answers?.map((a) => ({
        ...a,
        answer: typeof a.answer === "object" ? JSON.stringify(a.answer) : String(a.answer || ""),
      })),
    };
    return fetchApi(`/submissions/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
};

export const DraftService = {
  saveDraft: (studentId, assessmentId, draftData) =>
    fetchApi(`/assessments/drafts/${studentId}/${assessmentId}`, { method: "POST", body: JSON.stringify(draftData) }),
  getDraft: async (studentId, assessmentId) => {
    try {
      return await fetchApi(`/assessments/drafts/${studentId}/${assessmentId}`);
    } catch {
      return null;
    }
  },
};

export const AIService = {
  generateDescription: (topic) =>
    fetchApi("/assessments/ai/generate-description", { method: "POST", body: JSON.stringify({ topic }) }),
};
```

### Step 1.2: Extend BatchService with missing methods

The existing `BatchService` only has `getBatches`, `createBatch`, `enrolStudent`. Add the missing methods from `client.js`:

```js
// Add to existing BatchService in src/services/api.js
export const BatchService = {
  getBatches: () => fetchApi("/batches"),
  createBatch: (data) => fetchApi("/batches", { method: "POST", body: JSON.stringify(data) }),
  updateBatch: (id, data) => fetchApi(`/batches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBatch: (id) => fetchApi(`/batches/${id}`, { method: "DELETE" }),
  enrolStudent: (batchId, data) => fetchApi(`/batches/${batchId}/students`, { method: "POST", body: JSON.stringify(data) }),
};
```

### Step 1.3: Update `src/context/LMSContext.jsx`

**File**: `src/context/LMSContext.jsx`
**Changes**:
- Remove `import { apiClient } from "../api/client";`
- Add: `import { UserService, BatchService, AssessmentService, SubmissionService, DraftService } from "../services/api";`
- Replace all `apiClient.*` calls:
  - `apiClient.getUsers()` → `UserService.getUsers()`
  - `apiClient.getBatches()` → `BatchService.getBatches()`
  - `apiClient.createBatch(...)` → `BatchService.createBatch(...)`
  - `apiClient.updateBatch(...)` → `BatchService.updateBatch(...)`
  - `apiClient.deleteBatch(...)` → `BatchService.deleteBatch(...)`
  - `apiClient.getAssessments()` → `AssessmentService.getAssessments()`
  - `apiClient.createAssessment(...)` → `AssessmentService.createAssessment(...)`
  - `apiClient.updateAssessment(...)` → `AssessmentService.updateAssessment(...)`
  - `apiClient.deleteAssessment(...)` → `AssessmentService.deleteAssessment(...)`
  - `apiClient.getSubmissions(...)` → `SubmissionService.getSubmissions(...)`
  - `apiClient.createSubmission(...)` → `SubmissionService.createSubmission(...)`
  - `apiClient.updateSubmission(...)` → `SubmissionService.updateSubmission(...)`
  - `apiClient.saveDraft(...)` → `DraftService.saveDraft(...)`
  - `apiClient.getDraft(...)` → `DraftService.getDraft(...)`

### Step 1.4: Delete `src/api/client.js`

**File**: `src/api/client.js` — DELETE
**File**: `src/api/` directory — DELETE if empty after removal

### Step 1.5: Search for any other imports of client.js

Already verified: only `LMSContext.jsx` imports from `client.js`. No other files need updating.

---

## Phase 2: Admin Integration (Observation #3)

**Goal**: Replace admin mock API with real API calls, remove duplicate unused files, keep admin page structure.

### Step 2.1: Replace `src/admin/services/api.js` with real API calls

**File**: `src/admin/services/api.js`
**Changes**: Replace the entire mock-based `api` object with one that calls real APIs:

```js
import { CourseService, CategoryService, UserService } from "../../services/api";

export const api = {
  dashboard: {
    getOverview: async () => {
      // Compute real KPIs from available data
      const [courses, categories, users] = await Promise.all([
        CourseService.getCourses().catch(() => []),
        CategoryService.getCategories().catch(() => []),
        UserService.getUsers().catch(() => []),
      ]);
      const teachers = users.filter(u => u.role === "teacher");
      const students = users.filter(u => u.role === "student");
      return {
        kpi: {
          orgs: { total: categories.length || 0, change: 0 },
          users: { total: users.length || 0, change: 0 },
          trainers: { total: teachers.length || 0, change: 0 },
          courses: { total: courses.length || 0, change: 0 },
          batches: { total: 0, change: 0 },
          approvals: { total: 0, change: 0 },
          students: { total: students.length || 0, change: 0 },
          assessments: { total: 0, change: 0 },
        },
        recentOrgs: categories.slice(0, 4).map(c => ({
          id: c.id,
          name: c.name || "Unknown",
          domain: "example.com",
          type: "Category",
          status: "Active",
          abbr: (c.name || "?").substring(0, 2).toUpperCase(),
          color: "#6C1D5F",
        })),
        approvals: [],
      };
    },
  },
  organizations: {
    list: async () => {
      const categories = await CategoryService.getCategories().catch(() => []);
      return categories.map(c => ({
        id: c.id,
        name: c.name || "Unknown",
        domain: "example.com",
        type: "Category",
        status: "Active",
        abbr: (c.name || "?").substring(0, 2).toUpperCase(),
        color: "#6C1D5F",
      }));
    },
    create: async (org) => {
      const result = await CategoryService.createCategory({ name: org.name });
      return {
        id: result.id,
        name: org.name,
        domain: org.domain || "example.com",
        type: org.type || "Category",
        status: "Active",
        abbr: org.name.substring(0, 2).toUpperCase(),
        color: "#6C1D5F",
      };
    },
  },
  users: {
    list: async () => {
      const users = await UserService.getUsers().catch(() => []);
      return users.map(u => ({
        ...u,
        tenant: "Global",
        lastLogin: "Never",
        avatarColor: "#6C1D5F",
      }));
    },
    create: async (user) => {
      return UserService.createUser(user);
    },
  },
  approvals: {
    process: async () => true,
  },
};
```

### Step 2.2: Delete unused duplicate Detail files

**File**: `src/admin/pages/Courses/Detail.jsx` — DELETE (unused; routes import `CourseDetail.jsx`)
**File**: `src/admin/pages/Categories/Detail.jsx` — DELETE (unused; routes import `CategoryDetail.jsx`)

Verified via grep: no files import from `Courses/Detail` or `Categories/Detail`.

---

## Phase 3: Analytics Real Data (Observation #5)

**Goal**: Replace hardcoded mock data in analytics components with computed values from LMSContext. Keep all visual structures identical.

### Strategy

The 16 analytics route files under `src/routes/admin/analytics/` fall into two categories:
1. **Components with dedicated files** in `src/components/analytics/` (executive, coverage, hours pages) — modify those components to accept props or use `useLMS()`.
2. **Inline route files** (pillars, ai, certifications, effectiveness, predictive, skill-gap, recommendations, programs, trends, champions, investment, apprentice) — modify the route files directly to compute real data.

The reference pattern is `src/admin/pages/Analytics/index.jsx` (lines 31-69): it uses `useEffect` + `CourseService`/`CategoryService` to load data, then computes metrics inline.

### Step 3.1: Create shared analytics helper

**File**: `src/lib/analytics-helpers.js` — NEW

```js
// Pure functions that compute analytics metrics from LMSContext data
export function computeAnalyticsMetrics(teachers, students, batches, assessments, submissions) {
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalBatches = batches.length;
  const totalAssessments = assessments.length;
  const totalSubmissions = submissions.length;

  const submittedSubs = submissions.filter(s => s.status === "submitted" || s.isEvaluated);
  const avgPercentage = submittedSubs.length > 0
    ? Math.round(submittedSubs.reduce((sum, s) => sum + (s.percentage || 0), 0) / submittedSubs.length)
    : 0;

  const completionRate = totalAssessments > 0 && totalStudents > 0
    ? Math.round((submittedSubs.length / (totalAssessments * totalStudents)) * 100)
    : 0;

  // Score distribution for charts
  const scoreRanges = { "0-25": 0, "26-50": 0, "51-75": 0, "76-100": 0 };
  submittedSubs.forEach(s => {
    const p = s.percentage || 0;
    if (p <= 25) scoreRanges["0-25"]++;
    else if (p <= 50) scoreRanges["26-50"]++;
    else if (p <= 75) scoreRanges["51-75"]++;
    else scoreRanges["76-100"]++;
  });

  const scoreDistributionData = Object.entries(scoreRanges).map(([range, count]) => ({
    name: range + "%",
    value: count,
  }));

  // Assessment status breakdown
  const assessmentStatuses = { published: 0, draft: 0, archived: 0 };
  assessments.forEach(a => {
    const status = a.status || "draft";
    assessmentStatuses[status] = (assessmentStatuses[status] || 0) + 1;
  });

  const assessmentStatusData = Object.entries(assessmentStatuses).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  // Submission timeline (group by date)
  const timelineMap = {};
  submittedSubs.forEach(s => {
    const date = s.submittedAt || s.startedAt;
    if (date) {
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      timelineMap[key] = (timelineMap[key] || 0) + 1;
    }
  });
  const submissionTimeline = Object.entries(timelineMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, submissions: count }));

  return {
    totalStudents,
    totalTeachers,
    totalBatches,
    totalAssessments,
    totalSubmissions,
    avgPercentage,
    completionRate,
    scoreDistributionData,
    assessmentStatusData,
    submissionTimeline,
    submittedCount: submittedSubs.length,
  };
}
```

### Step 3.2: Refactor `ExecutiveKPIs.jsx`

**File**: `src/components/analytics/ExecutiveKPIs.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Add `import { computeAnalyticsMetrics } from "@/lib/analytics-helpers";`
- Inside `ExecutiveKPIs()`: destructure LMSContext data and compute metrics
- Replace hardcoded values with computed ones:
  - `"82.4%"` → computed `completionRate` or `"0%"` if no data
  - `"142.5K"` → `totalSubmissions` count or `"0"`
  - `"3,482"` → `totalAssessments` count or `"0"`
  - `"2,450"` → `totalStudents` count or `"0"`
  - `"4.8/5"` → computed `avgPercentage` formatted or `"0/100"`
- Keep all KPI card structure, icons, colors, gradients unchanged
- For metrics arrays, use computed values (e.g., "Total Employees" → `totalStudents`, "Total Sessions" → `totalSubmissions`)

### Step 3.3: Refactor `ExecutiveCharts.jsx`

**File**: `src/components/analytics/ExecutiveCharts.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Add `import { computeAnalyticsMetrics } from "@/lib/analytics-helpers";`
- Replace hardcoded `donutData` with `assessmentStatusData` from computed metrics
- Replace hardcoded `barData` with computed batch performance data (e.g., batches as "regions")
- Replace hardcoded `areaData` with `submissionTimeline`
- Keep all chart structure, colors, filters, gradients unchanged

### Step 3.4: Refactor `ExecutiveInsights.jsx`

**File**: `src/components/analytics/ExecutiveInsights.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Replace hardcoded insight text with computed insights:
  - "Growth Exceeds Target" → compute from actual completion rate vs baseline
  - "Risk Indicator" → check if any batch has low completion
  - "Recommendation" → based on actual avg feedback score
- Replace hardcoded leaderboard data with computed batch rankings
- Keep all visual structure (Badges, icons, colors) unchanged

### Step 3.5: Refactor `CoverageKPIs.jsx`

**File**: `src/components/analytics/CoverageKPIs.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Compute coverage KPIs from real data:
  - "Coverage by Region" → totalStudents > 0 ? computed percentage : "0%"
  - "Coverage by Location" → batches with students / total batches
  - "Coverage by Project" → assessments with submissions / total assessments
  - "Coverage by BU" → teachers with assigned batches / total teachers
  - "Coverage by Grade" → completion rate from submissions
- Keep all KPI card structure unchanged

### Step 3.6: Refactor `CoverageCharts.jsx`

**File**: `src/components/analytics/CoverageCharts.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Replace hardcoded `heatmapData` with computed batch×assessment matrix
- Replace hardcoded `regionCoverageData` with batch-level coverage percentages
- Replace hardcoded `projectData` with assessment-level completion data
- Replace hardcoded `trendData` with submission timeline data
- Keep all chart structures unchanged

### Step 3.7: Refactor `HoursKPIs.jsx`

**File**: `src/components/analytics/HoursKPIs.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Compute from real data:
  - "Total Learning Hours" → derived from submission `timeTaken` totals
  - "Avg. Hours / Employee" → total time / total students
  - "Required vs Elective" → assessment counts by type
  - "Top Region" → batch with most submissions
  - "Learner Engagement" → percentage of students who submitted at least once
- Keep all KPI card structure unchanged

### Step 3.8: Refactor `HoursCharts.jsx`

**File**: `src/components/analytics/HoursCharts.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Replace hardcoded `trendData` with submission timeline (grouped by month)
- Replace hardcoded `regionData` with batch-level hour averages
- Replace hardcoded `projectData` with assessment-level hour averages
- Keep all chart structures unchanged

### Step 3.9: Refactor `ActivityTimeline.jsx`

**File**: `src/components/analytics/ActivityTimeline.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Replace hardcoded `activities` with computed recent events from submissions:
  - Recent submissions → "New Submission" type
  - Low scores → "Low Performance Alert"
  - New assessments → "New Assessment Published"
  - High scores → "High Performance"
- Keep all visual structure (timeline, icons, colors) unchanged

### Step 3.10: Refactor inline analytics route files

For route files that have their own inline data (not using `src/components/analytics/`):

**Files to modify** (each follows the same pattern):
- `src/routes/admin/analytics/pillars.jsx`
- `src/routes/admin/analytics/ai.jsx`
- `src/routes/admin/analytics/certifications.jsx`
- `src/routes/admin/analytics/effectiveness.jsx`
- `src/routes/admin/analytics/predictive.jsx`
- `src/routes/admin/analytics/skill-gap.jsx`
- `src/routes/admin/analytics/recommendations.jsx`
- `src/routes/admin/analytics/programs.jsx`
- `src/routes/admin/analytics/trends.jsx`
- `src/routes/admin/analytics/champions.jsx`
- `src/routes/admin/analytics/investment.jsx`
- `src/routes/admin/analytics/apprentice.jsx`

**Pattern for each**:
1. Add `import { useLMS } from "@/context/LMSContext";`
2. Add `import { computeAnalyticsMetrics } from "@/lib/analytics-helpers";`
3. Inside the component function, destructure context and compute metrics
4. Replace hardcoded KPI values with computed ones
5. Replace hardcoded chart data with computed data
6. Keep ALL JSX structure, styling, and layout exactly the same

**Example for pillars.jsx**: Replace `kpiData[0].value = "342"` with computed `totalAssessments`, `kpiData[1].value = "12,450"` with computed `totalStudents`, etc. Replace `hoursTrendData` with submission timeline. Replace `leaderboardData` with batch rankings.

**Note**: Some data (regions, BUs, certifications, AI readiness) has no direct LMSContext equivalent. For these, use computed proxies:
- Map batches to "regions"
- Map assessment types to "pillars"
- Use submission scores as "effectiveness" indicators
- Use teacher count as "trainer" metrics

### Step 3.11: Update analytics index page

**File**: `src/routes/admin/analytics/index.jsx`
**Changes**:
- Add `import { useLMS } from "@/context/LMSContext";`
- Replace hardcoded MetricCard values:
  - "Total Active Learners" = `students.length`
  - "Avg. Learning Hours" = computed from submissions
  - "Enterprise Certifications" = `assessments.length`
  - "Active Courses" = fetched from CourseService or `batches.length`
- Keep all card structure and sparkline arrays (sparklines can remain as visual indicators)

---

## Execution Order

1. **Phase 1** (API Unification) — Do first since Phase 3 components will import from `services/api.js`
   - Step 1.1 → 1.2 → 1.3 → 1.4 → 1.5

2. **Phase 2** (Admin Integration) — Independent, can run in parallel with Phase 1
   - Step 2.1 → 2.2

3. **Phase 3** (Analytics Real Data) — Do after Phase 1
   - Step 3.1 (create helper) → 3.2–3.9 (component files) → 3.10 (route files) → 3.11 (index)

## Files Modified (Summary)

### Phase 1
| File | Action |
|------|--------|
| `src/services/api.js` | Add UserService, AssessmentService, SubmissionService, DraftService, AIService; extend BatchService |
| `src/context/LMSContext.jsx` | Replace apiClient imports with new service imports |
| `src/api/client.js` | DELETE |

### Phase 2
| File | Action |
|------|--------|
| `src/admin/services/api.js` | Replace mock data with real API calls |
| `src/admin/pages/Courses/Detail.jsx` | DELETE |
| `src/admin/pages/Categories/Detail.jsx` | DELETE |

### Phase 3
| File | Action |
|------|--------|
| `src/lib/analytics-helpers.js` | NEW — shared computation functions |
| `src/components/analytics/ExecutiveKPIs.jsx` | Replace hardcoded KPIs with computed data |
| `src/components/analytics/ExecutiveCharts.jsx` | Replace hardcoded chart data |
| `src/components/analytics/ExecutiveInsights.jsx` | Replace hardcoded insights |
| `src/components/analytics/CoverageKPIs.jsx` | Replace hardcoded KPIs |
| `src/components/analytics/CoverageCharts.jsx` | Replace hardcoded chart data |
| `src/components/analytics/HoursKPIs.jsx` | Replace hardcoded KPIs |
| `src/components/analytics/HoursCharts.jsx` | Replace hardcoded chart data |
| `src/components/analytics/ActivityTimeline.jsx` | Replace hardcoded activities |
| `src/routes/admin/analytics/index.jsx` | Replace hardcoded MetricCards |
| `src/routes/admin/analytics/pillars.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/ai.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/certifications.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/effectiveness.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/predictive.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/skill-gap.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/recommendations.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/programs.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/trends.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/champions.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/investment.jsx` | Replace hardcoded data |
| `src/routes/admin/analytics/apprentice.jsx` | Replace hardcoded data |

## Risk Notes

- **`services/api.js` base URL mismatch**: `client.js` uses `/api/v1` prefix while `services/api.js` uses `http://localhost:8080/api`. The new services in `services/api.js` will use the `/api` base. If the backend has different endpoints for the two paths, the endpoint paths in the new services may need adjustment.
- **Empty state handling**: When LMSContext has no data (empty arrays), analytics pages should show meaningful zero states rather than crash. The `computeAnalyticsMetrics` helper handles this with default values.
- **Admin mock data removal**: The `useAppStore` in `src/admin/store/useAppStore.js` depends on the admin `api` object. After replacing it, the dashboard KPIs will show real data from the backend instead of localStorage-cached mocks.
