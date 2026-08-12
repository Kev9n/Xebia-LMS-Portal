# Admin Assessment Management Module — Complete Architecture & Design Plan

**Goal**: Create a brand-new Admin Assessment Management Module that allows admins to monitor, analyze, and manage every assessment across the LMS. Admin is read-only — no creation, only monitoring, analytics, reporting, and exports.

**Priority**: This is the single most important analytics page in the entire LMS.

---

## PHASE 1: EXISTING SYSTEM ANALYSIS (Complete)

### Current Assessment Architecture

| Layer | Status | Gap |
|---|---|---|
| **Backend Entities** | Assessment, Question, Submission, Answer | No analytics/reporting entities |
| **Backend Services** | AssessmentService, SubmissionService, AIService | No analytics service, no DTOs |
| **Backend Controllers** | 9 endpoints (CRUD only) | No analytics/reporting/export endpoints |
| **Frontend (Trainer)** | AssessmentBuilder, Evaluation, Leaderboard, Reports | No admin assessment view |
| **Frontend (Student)** | TakeQuiz, TakeCoding, Results, StudentAssessments | Complete |
| **Frontend (Admin)** | NO assessment pages exist | Major gap |

### Key Architectural Facts

- **Database**: PostgreSQL 16, single `lms` database, `ddl-auto: update`
- **Assessment IDs**: String (UUID auto-generated)
- **Submission IDs**: String (manually set, format `SUB-{timestamp}`)
- **No DTOs in assessment-service**: Raw entities exposed directly
- **No JPA relationship between Submission and Assessment**: Linked via String `assessmentId`
- **Batch.students**: List<String> of student IDs (ElementCollection)
- **Batch.course**: Free-text string (not FK to Course entity)
- **Assessment.batches**: List<String> of batch IDs (ElementCollection)
- **State Management**: LMSContext (React Context) + Zustand for admin store
- **Design System**: Tailwind v4, brand colors (#6C1D5F, #84117C, #01AC9F, #FF6200), framer-motion, Recharts, shadcn/ui

---

## PHASE 2: DATABASE DESIGN

### No New Entities Required

The existing entities are sufficient. Admin analytics will be computed from:
- `assessments` table (all assessment metadata)
- `submissions` table (all student attempts, scores, timing)
- `batches` table (batch-student mappings)
- `users` table (student/trainer info)

### New Fields to Add to Submission Entity

| Column | Type | Purpose |
|---|---|---|
| `batch_id` | String | Denormalized for faster admin queries (currently must cross-reference) |

**Why**: Admin reports need to filter submissions by batch. Currently this requires looking up which batch a student belongs to, then matching against assessment.batches. Adding batch_id to Submission enables direct queries.

---

## PHASE 3: API DESIGN

### New Endpoints (assessment-service)

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/api/v1/assessments/dashboard` | Admin dashboard KPIs (total, active, scheduled, completed, expired, avg score, pass rate, etc.) |
| 2 | GET | `/api/v1/assessments/analytics` | Rich analytics data (creation trends, type distribution, course-wise, trainer-wise, score distributions) |
| 3 | GET | `/api/v1/assessments/{id}/details` | Full assessment details with computed stats |
| 4 | GET | `/api/v1/assessments/{id}/report` | Student-level report for a specific assessment |
| 5 | GET | `/api/v1/assessments/{id}/export` | CSV export of all students (attempted, absent, not attempted) |
| 6 | GET | `/api/v1/assessments/trainer-performance` | Trainer-wise assessment stats |
| 7 | GET | `/api/v1/assessments/batch-performance` | Batch-wise assessment stats |

### Gateway Route

```java
.route("assessment-service-admin", route -> route
    .path("/api/v1/assessments/dashboard", "/api/v1/assessments/analytics",
          "/api/v1/assessments/trainer-performance", "/api/v1/assessments/batch-performance")
    .filters(filter -> filter.stripPrefix(0))
    .uri(serviceUrl("assessment", "http://assessment-service:8086")))
```

### API Response Shapes

#### Dashboard KPIs (`GET /api/v1/assessments/dashboard`)
```json
{
  "totalAssessments": 45,
  "activeAssessments": 12,
  "scheduledAssessments": 5,
  "completedAssessments": 20,
  "expiredAssessments": 8,
  "draftAssessments": 3,
  "totalSubmissions": 890,
  "averageScore": 72.5,
  "averagePassRate": 68.2,
  "averageAttendance": 85.0,
  "totalStudents": 250,
  "studentsAttempted": 200,
  "studentsNotAttempted": 50,
  "totalTrainers": 8,
  "totalCourses": 12,
  "totalBatches": 15,
  "averageDuration": 45,
  "mcqAssessments": 20,
  "codingAssessments": 10,
  "assignmentAssessments": 8,
  "recentlyCreated": 5,
  "weeklyTrend": [{"week": "W1", "count": 3}, ...]
}
```

#### Analytics Data (`GET /api/v1/assessments/analytics`)
```json
{
  "creationTrend": [{"month": "Jan", "count": 5}, ...],
  "typeDistribution": [{"type": "mcq", "count": 20}, ...],
  "courseWise": [{"course": "Java", "count": 8}, ...],
  "trainerWise": [{"trainer": "Evelyn", "count": 12, "avgScore": 75}, ...],
  "scoreDistribution": [{"range": "90-100", "count": 15}, ...],
  "passVsFail": {"passed": 150, "failed": 50},
  "difficultyDistribution": [{"level": "Easy", "count": 10}, ...],
  "monthlyGrowth": [{"month": "Jan", "count": 5}, ...],
  "statusDistribution": [{"status": "published", "count": 20}, ...]
}
```

#### Student Report (`GET /api/v1/assessments/{id}/report`)
```json
{
  "assessment": { ... },
  "summary": {
    "totalAssigned": 50,
    "attempted": 40,
    "notAttempted": 8,
    "absent": 2,
    "passed": 30,
    "failed": 10,
    "averageScore": 72.5,
    "highestScore": 98,
    "lowestScore": 35,
    "medianScore": 74,
    "averageTimeTaken": 2400,
    "submissionRate": 80.0,
    "lateSubmissions": 3
  },
  "students": [
    {
      "studentId": "...",
      "studentName": "...",
      "email": "...",
      "batch": "...",
      "course": "...",
      "score": 85,
      "percentage": 85,
      "passFail": "Pass",
      "attemptStatus": "Attempted",
      "startTime": "...",
      "endTime": "...",
      "timeTaken": 1800,
      "submissionStatus": "Submitted",
      "remarks": "..."
    }
  ]
}
```

---

## PHASE 4: BACKEND IMPLEMENTATION

### Files to Create/Modify

| # | File | Action | Description |
|---|---|---|---|
| 1 | `assessment-service/.../controller/AdminAssessmentController.java` | CREATE | New controller for all admin endpoints |
| 2 | `assessment-service/.../service/AdminAssessmentService.java` | CREATE | Business logic for dashboard, analytics, reports |
| 3 | `assessment-service/.../dto/AdminDashboardDto.java` | CREATE | Dashboard KPI response DTO |
| 4 | `assessment-service/.../dto/AdminAnalyticsDto.java` | CREATE | Analytics data response DTO |
| 5 | `assessment-service/.../dto/AssessmentReportDto.java` | CREATE | Student report response DTO |
| 6 | `assessment-service/.../dto/StudentReportRowDto.java` | CREATE | Individual student row in report |
| 7 | `assessment-service/.../model/Submission.java` | MODIFY | Add `batchId` field |
| 8 | `api-gateway/.../config/RouteConfig.java` | MODIFY | Add admin assessment routes |

### Service Method Signatures

```java
@Service
public class AdminAssessmentService {

    public AdminDashboardDto getDashboard() { ... }
    public AdminAnalyticsDto getAnalytics() { ... }
    public AssessmentReportDto getAssessmentReport(String assessmentId) { ... }
    public List<Assessment> getAllAssessmentsForAdmin() { ... } // includes computed stats
    public byte[] exportCsv(String assessmentId) { ... }
    public Map<String, Object> getTrainerPerformance() { ... }
    public Map<String, Object> getBatchPerformance() { ... }
}
```

### Computation Logic

**Dashboard KPIs** computed by:
- `totalAssessments` = `assessmentRepository.count()`
- `activeAssessments` = assessments where `startDate <= now <= endDate` and `status == "published"`
- `scheduledAssessments` = assessments where `startDate > now` and `status == "published"`
- `completedAssessments` = assessments where `endDate < now` and `status == "published"`
- `averageScore` = `AVG(submission.percentage)` where `isEvaluated == true`
- `averagePassRate` = `(count where percentage >= passingMarks) / totalEvaluated * 100`
- `studentsAttempted` = `COUNT(DISTINCT submission.studentId)` where `status == "submitted"`

**Student Report** computed by:
- Get all students from `batch.students` (List<String>) for the assessment's assigned batches
- Get all submissions for the assessment
- Left-join: every assigned student appears even if no submission exists
- For students with submissions: compute score, percentage, pass/fail, timeTaken
- For students without submissions: status = "Not Attempted"
- For students who started but didn't submit: status = "Absent" (started but no submission found)

---

## PHASE 5: FRONTEND ARCHITECTURE

### New Routes

| Route Path | Component | Purpose |
|---|---|---|
| `/admin/assessments` | `AssessmentsOverview` | Dashboard with KPIs + Assessment cards |
| `/admin/assessments/analytics` | `AssessmentsAnalytics` | Rich analytics charts |
| `/admin/assessments/$assessmentId` | `AssessmentDetailAdmin` | Single assessment analytics + student report |

### Sidebar Navigation

Add new section to `unified-sidebar.jsx` admin navConfig:

```
Assessment Management (NEW - collapsible)
├── Overview (KPIs + Assessment Cards)
├── Analytics (Charts + Trends)
```

Assessment cards on Overview page link to `/admin/assessments/$assessmentId`.

### New Files

| File | Purpose |
|---|---|
| `src/routes/admin/assessments.jsx` | Layout route |
| `src/routes/admin/assessments/index.jsx` | Overview page route |
| `src/routes/admin/assessments/analytics.jsx` | Analytics page route |
| `src/routes/admin/assessments/$assessmentId.jsx` | Detail page route |
| `src/admin/pages/Assessments/Overview.jsx` | Dashboard + Assessment cards |
| `src/admin/pages/Assessments/Analytics.jsx` | Rich analytics charts |
| `src/admin/pages/Assessments/AssessmentDetailAdmin.jsx` | Single assessment detail + student report |
| `src/services/api.js` | Add `AdminAssessmentService` |

---

## PHASE 6: FRONTEND PAGES DESIGN

### Page 1: Assessment Overview (`/admin/assessments`)

**Layout**: Full-width page matching existing admin style (white bg, rounded-2xl cards, brand shadows)

**Section 1: Page Header**
- Title: "Assessment Management"
- Subtitle: "Monitor and analyze all assessments across the LMS"
- Gradient accent bar (brand gradient)

**Section 2: KPI Cards Row (6-8 cards)**
Using existing `MetricCard` component from `src/admin/features/analytics/components/charts/MetricCard.jsx`:

| KPI | Value Source | Trend | Icon |
|---|---|---|---|
| Total Assessments | count | vs last month | FileText |
| Active Now | activeCount | current | Play |
| Avg Score | avgScore | trend | TrendingUp |
| Pass Rate | passRate | trend | CheckCircle |
| Students Attempted | attempted | vs total | Users |
| Total Submissions | submissionCount | trend | Send |

**Section 3: Assessment Cards Grid**
Each assessment as a premium card showing:
- Assessment title (bold)
- Type badge (MCQ/Coding/Assignment) - color coded
- Status badge (Draft/Scheduled/Live/Completed/Expired) - color coded
- Course name
- Trainer name
- Batch name
- Duration + Marks
- Students: attempted / assigned (with progress ring)
- Average score (with mini trend)
- Created date
- Quick action: View Details → navigates to `/admin/assessments/$assessmentId`

**Section 4: Filters Bar**
Using existing `FilterBar` pattern:
- Search by assessment name
- Filter by: Type, Status, Course, Trainer, Batch, Difficulty, Date Range
- Sort: Newest, Oldest, Most Attempted, Highest Score

### Page 2: Assessment Analytics (`/admin/assessments/analytics`)

**Layout**: Full-width analytics grid using existing chart components

**Row 1: KPI Cards (4)**
- Assessment Creation Trend (this month vs last)
- Average Score Trend
- Pass Rate Trend
- Submission Rate

**Row 2: Charts Grid (2x2)**
Using existing `DonutChart`, `TrendChart`, `ComparisonChart`:

| Chart | Component | Data |
|---|---|---|
| Assessment Type Distribution | DonutChart | MCQ, Coding, Assignment, etc. |
| Course-wise Assessment Count | ComparisonChart (Bar) | Course name vs count |
| Monthly Assessment Growth | TrendChart (Area) | Month vs count |
| Pass vs Fail Distribution | DonutChart | Passed, Failed, Pending |

**Row 3: Charts Grid (2x2)**

| Chart | Component | Data |
|---|---|---|
| Trainer-wise Assessment Count | ComparisonChart (Stacked Bar) | Trainer vs count by type |
| Score Distribution | ComparisonChart (Bar) | Score ranges (0-20, 20-40, etc.) |
| Difficulty Distribution | DonutChart | Easy, Medium, Hard |
| Student Participation Trend | TrendChart (Line) | Month vs students attempted |

**Row 4: Leaderboard**
Top Performing Courses (horizontal bar) + Top Performing Trainers (table with rank)

### Page 3: Assessment Detail (`/admin/assessments/$assessmentId`)

**Layout**: Full-width with tab-based navigation

**Tab 1: Overview**
- Assessment info card (all metadata)
- KPIs: Assigned, Attempted, Passed, Failed, Avg Score, Highest, Lowest, Median
- Pass/Fail donut chart
- Score distribution bar chart

**Tab 2: Student Report**
- Enterprise data table with all columns specified in requirements
- Search, filters, pagination
- Export CSV button
- Every assigned student appears (attempted, absent, not attempted)

**Tab 3: Question Analytics**
- Per-question analytics: attempts, correct %, avg marks
- Question difficulty analysis

---

## PHASE 7: COMPONENT HIERARCHY

```
src/admin/pages/Assessments/
├── Overview.jsx
│   ├── KPI Cards (MetricCard x6)
│   ├── Assessment Grid (AssessmentCard x N)
│   └── Filter Bar
├── Analytics.jsx
│   ├── KPI Cards (MetricCard x4)
│   ├── Chart Grid 1 (DonutChart, ComparisonChart x2, TrendChart)
│   ├── Chart Grid 2 (ComparisonChart x2, DonutChart, TrendChart)
│   └── Leaderboard Section
└── AssessmentDetailAdmin.jsx
    ├── Assessment Info Card
    ├── KPI Cards
    ├── Charts (DonutChart, ComparisonChart)
    ├── Student Report Table (enterprise)
    └── Export Button

src/components/assessment-admin/
├── AssessmentCard.jsx          (reusable assessment card)
├── StudentReportTable.jsx      (enterprise data table)
├── AssessmentOverviewStats.jsx (KPI + chart summary)
└── AssessmentFilters.jsx       (filter bar component)
```

---

## PHASE 8: IMPLEMENTATION ROADMAP

### Phase 8.1: Backend (Assessment Service)
1. Create DTOs (AdminDashboardDto, AdminAnalyticsDto, AssessmentReportDto, StudentReportRowDto)
2. Create AdminAssessmentService with all computation methods
3. Create AdminAssessmentController with all endpoints
4. Add batchId to Submission entity
5. Update gateway routes

### Phase 8.2: Frontend - API Layer
1. Add AdminAssessmentService to src/services/api.js
2. Test all endpoints

### Phase 8.3: Frontend - Sidebar + Routes
1. Add Assessment Management section to unified-sidebar.jsx
2. Create route files for 3 new pages
3. Create page shells

### Phase 8.4: Frontend - Overview Page
1. Build AssessmentCard component
2. Build Overview page with KPI cards and assessment grid
3. Implement filters and search

### Phase 8.5: Frontend - Analytics Page
1. Build Analytics page with all charts
2. Integrate real data from analytics endpoint

### Phase 8.6: Frontend - Detail Page
1. Build AssessmentDetailAdmin page
2. Build StudentReportTable component
3. Implement CSV export
4. End-to-end testing

---

## PHASE 9: VERIFICATION

After implementation:
1. `npx vite build` — must succeed
2. Backend: All new endpoints respond correctly
3. Overview page: KPIs show real data, assessment cards display correctly
4. Analytics page: All charts render with real data
5. Detail page: Student report shows all assigned students (attempted + not attempted)
6. Export: CSV contains all students with correct data
7. Existing admin/trainer/student pages still work unchanged
8. Dark mode works correctly
9. Responsive layout works on mobile/tablet

---

## PHASE 10: CRITICAL FILES TO MODIFY/CREATE

### Backend (7 files)
| File | Action |
|---|---|
| `assessment-service/.../dto/AdminDashboardDto.java` | CREATE |
| `assessment-service/.../dto/AdminAnalyticsDto.java` | CREATE |
| `assessment-service/.../dto/AssessmentReportDto.java` | CREATE |
| `assessment-service/.../dto/StudentReportRowDto.java` | CREATE |
| `assessment-service/.../service/AdminAssessmentService.java` | CREATE |
| `assessment-service/.../controller/AdminAssessmentController.java` | CREATE |
| `assessment-service/.../model/Submission.java` | ADD batchId field |
| `api-gateway/.../config/RouteConfig.java` | ADD admin routes |

### Frontend (10 files)
| File | Action |
|---|---|
| `src/routes/admin/assessments.jsx` | CREATE - layout route |
| `src/routes/admin/assessments/index.jsx` | CREATE - overview route |
| `src/routes/admin/assessments/analytics.jsx` | CREATE - analytics route |
| `src/routes/admin/assessments/$assessmentId.jsx` | CREATE - detail route |
| `src/admin/pages/Assessments/Overview.jsx` | CREATE - dashboard + cards |
| `src/admin/pages/Assessments/Analytics.jsx` | CREATE - charts page |
| `src/admin/pages/Assessments/AssessmentDetailAdmin.jsx` | CREATE - detail + report |
| `src/components/assessment-admin/AssessmentCard.jsx` | CREATE - reusable card |
| `src/components/assessment-admin/StudentReportTable.jsx` | CREATE - enterprise table |
| `src/services/api.js` | ADD AdminAssessmentService |
| `src/components/layout/unified-sidebar.jsx` | ADD Assessment Management nav section |
