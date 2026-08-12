# Batch Management & Trainer Allocation Module — Implementation Plan

---

## 1. New Backend Entities

### 1.1 TrainerAllocation (New Table)

**Service:** batch-service (co-located with Batch for same-DB joins)  
**Table:** `trainer_allocations`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | String (UUID) | PK | Allocation ID |
| `trainer_id` | String | NOT NULL | FK → User.id (logical, cross-service) |
| `batch_id` | String | NOT NULL | FK → Batch.id |
| `course_id` | String | NOT NULL | Logical FK → Course.id (cross-service) |
| `university` | String | NOT NULL | University/tenant name |
| `academic_session` | String | NOT NULL | e.g. "2025-26", "Fall 2025" |
| `status` | String | DEFAULT 'ACTIVE' | ACTIVE / COMPLETED / CANCELLED |
| `assigned_at` | Instant | NOT NULL | Creation timestamp |
| `updated_at` | Instant | NOT NULL | Last modified |
| `notes` | String | | Optional admin notes |

**Unique constraint:** `(trainer_id, batch_id, course_id)` — prevents duplicate allocation of same trainer+batch+course.

**Rationale:** This is a many-to-many bridge table with payload. A trainer can be allocated to multiple batches, each batch can have multiple trainers, and each course within a batch can have a different trainer. The `university` and `academic_session` fields enable multi-tenant allocation without a separate tenant service.

### 1.2 BatchSchedule (New Table)

**Service:** batch-service  
**Table:** `batch_schedules`

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | String (UUID) | PK | Schedule ID |
| `batch_id` | String | NOT NULL | FK → Batch.id |
| `start_date` | LocalDate | NOT NULL | Batch start date |
| `end_date` | LocalDate | | Batch end date (nullable for ongoing) |
| `session_days` | String | | e.g. "MON,WED,FRI" |
| `session_time` | LocalTime | | Daily session time |
| `timezone` | String | DEFAULT 'UTC' | Timezone identifier |
| `created_at` | Instant | NOT NULL | |
| `updated_at` | Instant | NOT NULL | |

**Relationship:** One-to-one with Batch. Separated into its own table to keep Batch entity slim and allow schedule to be optional.

---

## 2. Modified Entities

### 2.1 Batch Entity — Add Fields

**File:** `backend/batch-service/src/main/java/com/xbatchservice/model/Batch.java`

Add the following fields directly to the existing Batch entity:

| Field | Type | Constraints | Description |
|---|---|---|---|
| `course_id` | String | | Logical FK to Course.id (replaces/parallels free-text `course`) |
| `university` | String | | University/tenant name |
| `academic_session` | String | | e.g. "2025-26" |
| `trainer_id` | String | | Primary trainer (denormalized for quick access) |
| `max_students` | Integer | DEFAULT 50 | Capacity limit |
| `description` | String | | Batch description |

**Migration strategy:** Add nullable columns. The existing `course` free-text field is kept for backward compatibility but `course_id` becomes the source of truth going forward. A data migration script populates `course_id` from `course` where possible.

### 2.2 User Entity — Add Trainer-Specific Fields

**File:** `backend/user-service/src/main/java/com/xbia/userservice/model/User.java`

| Field | Type | Description |
|---|---|---|
| `specialization` | String | Primary subject area |
| `max_workload` | Integer | Max concurrent batches (default 10) |

These are lightweight additions. The user-service remains unchanged structurally.

---

## 3. Database ER Diagram

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│     batches       │       │  trainer_allocations  │       │     courses      │
├──────────────────┤       ├──────────────────────┤       ├──────────────────┤
│ id (PK)          │──┐    │ id (PK)              │    ┌──│ id (PK, UUID)    │
│ name             │  │    │ trainer_id            │    │  │ title            │
│ course           │  │    │ batch_id (FK)         │────┘  │ categoryId       │
│ course_id        │  └────│ course_id             │───────│ published        │
│ student_count    │       │ university            │       │ difficulty_level │
│ status           │       │ academic_session      │       │ language         │
│ university       │       │ status                │       │ duration_hours   │
│ academic_session │       │ assigned_at           │       └──────────────────┘
│ trainer_id       │       │ updated_at            │
│ max_students     │       │ notes                 │       ┌──────────────────┐
│ description      │       └──────────────────────┘       │     users        │
│ icon             │              │                        ├──────────────────┤
│ created_at       │              │ trainer_id             │ id (PK)          │
│ students[]       │              └────────────────────────│ name             │
└──────┬───────────┘                                      │ email            │
       │                                                   │ role             │
       │ 1:1                                               │ department       │
       ▼                                                   │ avatar           │
┌──────────────────┐                                       │ specialization   │
│ batch_schedules   │                                       │ max_workload     │
├──────────────────┤                                       └──────────────────┘
│ id (PK)          │
│ batch_id (FK)    │       ┌──────────────────┐
│ start_date       │       │   assessments     │
│ end_date         │       ├──────────────────┤
│ session_days     │       │ id (PK)          │
│ session_time     │       │ title            │
│ timezone         │       │ batches[] ──────────────── (ElementCollection of batch IDs)
└──────────────────┘       └──────────────────┘
```

**Key relationships:**
- `trainer_allocations` links batch ↔ trainer ↔ course (many-to-many bridge)
- `batch_schedules` is 1:1 with batch
- `batches.course_id` is a logical FK (no JPA constraint, validated in service layer)
- `assessments.batches` is already an ElementCollection of batch ID strings

---

## 4. New API Endpoints

### 4.1 Trainer Allocations (`/api/v1/allocations`)

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/api/v1/allocations` | List all allocations | `?trainerId=&batchId=&courseId=&university=&academicSession=&status=&page=&size=` |
| `POST` | `/api/v1/allocations` | Create allocation | Body: `{ trainerId, batchId, courseId, university, academicSession, notes }` |
| `PUT` | `/api/v1/allocations/{id}` | Update allocation | Body: partial update |
| `DELETE` | `/api/v1/allocations/{id}` | Remove allocation | |
| `POST` | `/api/v1/allocations/bulk` | Bulk create allocations | Body: `{ allocations: [...], overwrite: boolean }` |
| `GET` | `/api/v1/allocations/trainer/{trainerId}` | Allocations for a trainer | `?status=` |
| `GET` | `/api/v1/allocations/batch/{batchId}` | Allocations for a batch | |
| `GET` | `/api/v1/allocations/trainer/{trainerId}/workload` | Trainer workload summary | `?academicSession=` |

### 4.2 Batch Schedules (`/api/v1/batches` — extend existing)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/batches/{id}/schedule` | Get batch schedule |
| `PUT` | `/api/v1/batches/{id}/schedule` | Update batch schedule |

### 4.3 Batch Analytics (`/api/v1/batches/analytics`)

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/api/v1/batches/analytics/dashboard` | KPI summary | `?academicSession=&university=` |
| `GET` | `/api/v1/batches/analytics/trainer-workload` | Trainer workload data | `?academicSession=&university=` |
| `GET` | `/api/v1/batches/analytics/course-distribution` | Course allocation stats | `?academicSession=&university=` |
| `GET` | `/api/v1/batches/analytics/university-distribution` | University batch stats | `?academicSession=` |
| `GET` | `/api/v1/batches/analytics/allocation-timeline` | Allocation over time | `?university=&months=12` |
| `GET` | `/api/v1/batches/analytics/batch-status` | Batch status breakdown | `?academicSession=&university=` |
| `GET` | `/api/v1/batches/analytics/allocation-matrix` | Enterprise data grid | `?page=&size=&search=&sort=&university=&trainer=&course=&status=&academicSession=` |

### 4.4 User-Service Proxy (optional, for trainer lookup)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/batches/trainers` | List all users with role=teacher | `?search=&university=` |

This endpoint queries the batch-service's own knowledge (from allocations) to avoid cross-service calls. For the initial user list, the frontend calls user-service directly via the existing gateway route.

### 4.5 Response DTOs

```
AllocationDTO {
  id, trainerId, trainerName, trainerAvatar,
  batchId, batchName,
  courseId, courseTitle,
  university, academicSession,
  status, assignedAt, notes
}

TrainerWorkloadDTO {
  trainerId, trainerName, trainerAvatar,
  activeBatches, totalAllocations,
  maxWorkload, utilizationPercent,
  recentAllocations[]
}

BatchDashboardDTO {
  totalBatches, activeBatches, completedBatches,
  totalTrainers, totalAllocations,
  batchesThisMonth, trendPercent
}

AllocationMatrixRowDTO {
  allocationId,
  trainerName, trainerAvatar,
  batchName, batchStatus,
  courseTitle,
  university, academicSession,
  assignedAt, status
}
```

---

## 5. Gateway Routes

**File:** `backend/api-gateway/src/main/java/com/xbia/lms/gateway/config/RouteConfig.java`

Add to existing `RouteConfig`:

```java
.route("allocations", r -> r
    .path("/api/v1/allocations/**")
    .filters(f -> f.stripPrefix(0))
    .uri(batchServiceUrl))

.route("batch-analytics", r -> r
    .path("/api/v1/batches/analytics/**")
    .filters(f -> f.stripPrefix(0))
    .uri(batchServiceUrl))
```

The batch-schedule and batch-trainer endpoints fall under the existing `/api/v1/batches/**` route already configured, so no change needed for those.

---

## 6. Frontend Routes

**Base:** All new routes are children of `src/routes/admin.jsx` (which renders `UnifiedLayout portalType="admin"`).

| Route File | Path | Description |
|---|---|---|
| `src/routes/admin/batches/index.jsx` | `/admin/batches` | Allocation Matrix (main page) |
| `src/routes/admin/batches/dashboard.jsx` | `/admin/batches/dashboard` | KPI Dashboard Overview |
| `src/routes/admin/batches/analytics.jsx` | `/admin/batches/analytics` | Enterprise Analytics |
| `src/routes/admin/batches/wizard.jsx` | `/admin/batches/wizard` | Course Allocation Wizard |
| `src/routes/admin/batches/$batchId.jsx` | `/admin/batches/:batchId` | Batch Details |
| `src/routes/admin/batches/trainer/$trainerId.jsx` | `/admin/batches/trainer/:trainerId` | Trainer Profile |

---

## 7. Sidebar Navigation

**File:** `src/components/layout/unified-sidebar.jsx`  
**Location:** `navConfig.admin` array (line 61-83)

Add a new collapsible section after "Curriculum" and before "Analytics Hub":

```javascript
{
  label: "Batch Management",
  icon: "Users",  // or Layers
  collapsible: true,
  defaultOpen: true,
  children: [
    { label: "Dashboard", path: "/admin/batches/dashboard", icon: "LayoutDashboard" },
    { label: "Allocation Matrix", path: "/admin/batches", icon: "Grid3X3" },
    { label: "Analytics", path: "/admin/batches/analytics", icon: "BarChart3" },
    { label: "Allocation Wizard", path: "/admin/batches/wizard", icon: "Wand2" },
  ]
}
```

This keeps the existing "Analytics Hub" section untouched and adds a clearly scoped module. The `collapsible: true` pattern matches the existing "Analytics Hub" section.

---

## 8. New Pages — Components Breakdown

### 8.1 Dashboard Overview (`/admin/batches/dashboard`)

| Component | Source | Purpose |
|---|---|---|
| `MetricCard` | Reuse from `admin/features/analytics/components/metrics/MetricCard.jsx` | 4 KPI cards: Total Batches, Active Trainers, Allocation Rate, Avg Workload |
| `TrendChart` | Reuse | Allocation trend over last 6 months |
| `DonutChart` | Reuse | Batch status distribution (active/completed/pending) |
| `ComparisonChart` | Reuse | Top 5 trainers by workload |
| `AnimatedCounter` | Reuse (inside MetricCard) | Animated number transitions |
| `PremiumPageHeader` | Reuse from analytics layout | Page header with title + subtitle |
| New: `QuickAllocationsList` | Build new | Recent allocations table (5 rows, "View All" link) |

**Data source:** `GET /api/v1/batches/analytics/dashboard`

### 8.2 Enterprise Analytics (`/admin/batches/analytics`)

| Component | Source | Purpose |
|---|---|---|
| `ComparisonChart` | Reuse | Trainer workload horizontal bar chart |
| `DonutChart` | Reuse | Course distribution pie chart |
| `ComparisonChart` | Reuse | University distribution bar chart |
| `TrendChart` | Reuse | Allocation timeline area chart |
| `DonutChart` | Reuse | Batch status donut |
| `FilterBar` | Reuse from analytics layout | Academic session + university filters |
| `PremiumPageHeader` | Reuse | Page header |

**Data source:** Multiple endpoints from `GET /api/v1/batches/analytics/*`

### 8.3 Allocation Matrix (`/admin/batches` — index)

| Component | Source | Purpose |
|---|---|---|
| New: `AllocationDataTable` | Build new | Enterprise data grid with search, filters, sort, pagination |
| New: `AllocationFilters` | Build new | Filter bar: university, trainer, course, status, session |
| New: `AllocationRow` | Build new | Row component with inline actions |
| New: `BulkActionsBar` | Build new | Appears on selection: bulk delete, bulk status change, export |
| New: `AllocationSidePanel` | Build new | Slide-in panel for Trainer Profile on row click |
| `PremiumPageHeader` | Reuse | Page header + "New Allocation" button linking to wizard |

**Data source:** `GET /api/v1/batches/analytics/allocation-matrix`

### 8.4 Course Allocation Wizard (`/admin/batches/wizard`)

| Component | Source | Purpose |
|---|---|---|
| New: `WizardStepper` | Build new | Multi-step indicator (6 steps) |
| New: `StepUniversity` | Build new | University/tenant selector |
| New: `StepBatch` | Build new | Batch selector (filtered by university) |
| New: `StepTrainer` | Build new | Trainer selector with workload indicators |
| New: `StepCourse` | Build new | Course selector with multi-select |
| New: `StepReview` | Build new | Review + confirm allocation |
| New: `StepComplete` | Build new | Success confirmation with summary |
| `SectionCard` | Reuse (inline pattern) | Step containers with accent colors |

**Flow:** `WizardStepper` → `StepUniversity` → `StepBatch` → `StepTrainer` → `StepCourse` → `StepReview` → `StepComplete`

**Data source:** `POST /api/v1/allocations/bulk` on final submit. Steps fetch data via existing GET endpoints.

### 8.5 Trainer Profile (`/admin/batches/trainer/:trainerId`)

| Component | Source | Purpose |
|---|---|---|
| New: `TrainerHeader` | Build new | Avatar, name, department, utilization gauge |
| New: `TrainerWorkloadChart` | Build new | Weekly/monthly hours chart (TrendChart variant) |
| New: `TrainerAllocationsList` | Build new | Table of current allocations |
| New: `TrainerCourseDistribution` | Build new | DonutChart of courses taught |
| New: `TrainerBatchTimeline` | Build new | Timeline of batch assignments |
| `MetricCard` | Reuse | Active Batches, Courses Taught, Total Hours |

**Data source:** `GET /api/v1/allocations/trainer/{id}` + `GET /api/v1/allocations/trainer/{id}/workload`

### 8.6 Batch Details (`/admin/batches/:batchId`)

| Component | Source | Purpose |
|---|---|---|
| New: `BatchHeader` | Build new | Name, status badge, university, session |
| New: `BatchTrainerList` | Build new | Cards for each allocated trainer |
| New: `BatchCourseList` | Build new | Courses in this batch with progress |
| New: `BatchStudentList` | Build new | Student roster with enrollment status |
| New: `BatchTimeline` | Build new | Timeline of events (allocations, status changes) |
| New: `BatchScheduleCard` | Build new | Schedule display with edit capability |
| `MetricCard` | Reuse | Students, Trainers, Courses, Progress % |

**Data source:** `GET /api/v1/batches/{id}` + `GET /api/v1/allocations/batch/{id}` + `GET /api/v1/batches/{id}/schedule`

---

## 9. New Reusable Components

All new components go in `src/admin/features/batches/components/`:

| Component | Purpose | Reused By |
|---|---|---|
| `AllocationDataTable` | Sortable, filterable, paginated data grid | Matrix page |
| `AllocationFilters` | Filter bar with dropdowns + search | Matrix, Analytics |
| `AllocationRow` | Single row with hover actions | Matrix page |
| `BulkActionsBar` | Selection-aware action bar | Matrix page |
| `AllocationSidePanel` | Slide-in panel (framer-motion) | Matrix, Batch Details |
| `WizardStepper` | Step indicator with animations | Wizard |
| `StepCard` | Generic step container | Wizard steps |
| `TrainerWorkloadGauge` | Circular progress gauge | Trainer Profile, Dashboard |
| `BatchStatusBadge` | Colored status pill | Everywhere |
| `UniversityBadge` | University label with icon | Everywhere |
| `QuickAllocationRow` | Compact allocation row | Dashboard |
| `ExportButton` | CSV/Excel export trigger | Matrix page |

**Shared hooks:**

| Hook | Purpose |
|---|---|
| `useAllocations` | Fetch + cache allocation data (TanStack Query) |
| `useTrainerWorkload` | Trainer workload data |
| `useBatchAnalytics` | Dashboard analytics aggregation |
| `useAllocationFilters` | Filter state management |
| `useWizardState` | Multi-step wizard state machine |
| `useAllocationExport` | CSV/Excel export logic |

**Shared constants:** `src/admin/features/batches/constants.js`

```javascript
export const BATCH_STATUS = { ACTIVE: 'ACTIVE', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };
export const ALLOCATION_STATUS = { ACTIVE: 'ACTIVE', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' };
export const ACADEMIC_SESSIONS = ['2024-25', '2025-26', '2026-27', '2027-28'];
export const CHART_COLORS = ['#01AC9F', '#FF6200', '#6C1D5F', '#5C4F61', '#91759E'];
```

---

## 10. Implementation Phases

### Phase 1: Backend Foundation (3-4 days)

**Goal:** Data model + CRUD APIs working end-to-end

1. Add new fields to `Batch` entity (`course_id`, `university`, `academic_session`, `trainer_id`, `max_students`, `description`)
2. Create `TrainerAllocation` entity + repository + service + controller
3. Create `BatchSchedule` entity + repository + service + controller
4. Add batch analytics endpoints (dashboard summary, allocation matrix)
5. Update gateway routes
6. Write integration tests for all new endpoints

**Review checkpoint:** All endpoints return correct data via Postman/curl.

### Phase 2: Frontend Scaffolding (2-3 days)

**Goal:** Routes, sidebar, placeholder pages with data fetching

1. Create directory structure: `src/admin/features/batches/`
2. Create all 6 route files with placeholder pages
3. Add "Batch Management" section to admin sidebar
4. Build shared hooks (`useAllocations`, `useTrainerWorkload`, `useBatchAnalytics`)
5. Build shared constants and types
6. Connect each page to its API endpoint with loading/error states

**Review checkpoint:** All routes accessible, sidebar navigation works, pages show data.

### Phase 3: Dashboard & Analytics (3-4 days)

**Goal:** Dashboard KPIs + full analytics page

1. Build `TrainerWorkloadGauge` component
2. Build Dashboard page with 4 MetricCards, TrendChart, DonutChart, ComparisonChart
3. Build Allocation Matrix page with `AllocationDataTable`, filters, search, pagination
4. Build Analytics page with all 5 charts + FilterBar
5. Add animated counters and framer-motion entrance animations
6. Polish responsive layout

**Review checkpoint:** Dashboard shows real KPIs, analytics charts render with live data.

### Phase 4: Allocation Wizard (2-3 days)

**Goal:** Complete multi-step wizard

1. Build `WizardStepper` component
2. Build all 6 step components
3. Implement wizard state management (`useWizardState`)
4. Connect to allocation APIs (read in steps, create on submit)
5. Add validation, error handling, success confirmation
6. Add back/next navigation with step validation

**Review checkpoint:** Can complete full allocation flow end-to-end.

### Phase 5: Trainer Profile & Batch Details (3-4 days)

**Goal:** Detail views for trainers and batches

1. Build Trainer Profile page with header, charts, allocations list
2. Build Batch Details page with trainers, courses, students, schedule
3. Build `AllocationSidePanel` for quick-view from matrix
4. Connect batch schedule edit functionality
5. Add navigation links between related entities
6. Build bulk actions (delete, status change, export)

**Review checkpoint:** Can navigate trainer → batch → course with full context.

### Phase 6: Polish & Optimization (2 days)

**Goal:** Production-ready quality

1. Add CSV/Excel export for allocation matrix
2. Optimize API calls (batch loading, caching)
3. Add skeleton loading states
4. Test responsive behavior on mobile
5. Add keyboard navigation for data grid
6. Final accessibility audit (ARIA labels, focus management)

**Review checkpoint:** No console errors, smooth animations, mobile-friendly.

---

## 11. Data Flow

### 11.1 Allocation Creation Flow

```
Admin → Wizard (frontend)
  ├── Step 1: GET /api/v1/batches?university=X → list batches
  ├── Step 2: GET /api/v1/users?role=teacher → list trainers  
  ├── Step 3: GET /api/v1/courses → list courses
  ├── Step 4: Review summary
  └── Step 5: POST /api/v1/allocations/bulk
       │
       ▼
API Gateway → batch-service:8085
  │
  ├── TrainerAllocationRepository.save(all)
  ├── Batch.trainer_id = primaryTrainer (if first allocation)
  └── Return AllocationDTO[]
```

### 11.2 Dashboard Data Flow

```
Admin → /admin/batches/dashboard (frontend)
  │
  ├── useBatchAnalytics hook
  │   └── GET /api/v1/batches/analytics/dashboard
  │       └── batch-service → SQL aggregates across batches + allocations
  │
  ├── useAllocations(recent) hook
  │   └── GET /api/v1/allocations?page=0&size=5&sort=assignedAt,desc
  │
  └── Render: MetricCards + Charts + RecentAllocations
```

### 11.3 Allocation Matrix Data Flow

```
Admin → /admin/batches (frontend)
  │
  ├── useAllocationFilters (Zustand slice)
  │   state: { search, university, trainer, course, status, session, page, size }
  │
  ├── useAllocationMatrix hook (triggered by filter changes)
  │   └── GET /api/v1/batches/analytics/allocation-matrix?{filters}
  │       └── batch-service → Dynamic SQL with WHERE clauses + pagination
  │
  ├── Render: AllocationDataTable
  │   ├── AllocationFilters (top bar)
  │   ├── BulkActionsBar (on selection)
  │   ├── AllocationRow × N (data rows)
  │   └── Pagination (bottom)
  │
  └── Row click → AllocationSidePanel (slide-in)
      └── GET /api/v1/allocations/trainer/{id}/workload
```

### 11.4 Cross-Service Data Resolution

The batch-service **never calls** course-service or user-service at runtime. Instead:

- **TrainerAllocation** stores `trainerId`, `batchId`, `courseId` as strings
- The **allocation-matrix** endpoint does a single SQL query joining `trainer_allocations` with `batches`
- **Trainer names** and **course titles** are resolved at the API layer using a lightweight in-memory cache (refreshed every 5 minutes) or by embedding them in the allocation response via a one-time lookup
- **Frontend** makes parallel calls to different services when building composite views (e.g., trainer profile page calls both allocation API and user API)

---

## 12. Scalability Considerations

### 12.1 Avoiding Hardcoded Relationships

| Problem | Solution |
|---|---|
| Batch.course is free-text | New `course_id` field on Batch + `course_id` on TrainerAllocation. Service-layer validation ensures course exists (lightweight check via cache). |
| No trainer on Batch | `trainer_id` on Batch (primary) + `TrainerAllocation` (many-to-many). Adding a trainer doesn't require Batch schema change. |
| Cross-service queries | All allocation queries use only batch-service tables. Names/titles resolved via cache or denormalization, never cross-service JOINs. |
| New entity types | Allocation model is entity-agnostic: any future entity (e.g., "Programs", "Departments") can be added as a new string field on TrainerAllocation without schema migration on existing tables. |

### 12.2 Performance Patterns

- **Allocation matrix:** SQL-level pagination with `LIMIT/OFFSET`. Search uses `ILIKE` on denormalized fields.
- **Trainer workload cache:** In-memory `ConcurrentHashMap<String, TrainerWorkloadDTO>` refreshed on allocation create/update/delete. Avoids N+1 queries.
- **Frontend caching:** TanStack Query with `staleTime: 30_000` for analytics, `staleTime: 60_000` for allocation lists. Invalidation on mutation.
- **Bulk operations:** `POST /allocations/bulk` wraps in `@Transactional`, batch-inserts via `saveAll()`.
- **Indexing:** Add database indexes on `trainer_allocations(trainer_id)`, `trainer_allocations(batch_id)`, `trainer_allocations(course_id)`, `trainer_allocations(university, academic_session)`.

### 12.3 Multi-Tenancy

- `university` field on both `Batch` and `TrainerAllocation` acts as a tenant discriminator
- All analytics endpoints accept `?university=` filter
- Admin sees all universities; future: restrict by JWT tenant claim
- Academic sessions enable historical data without data deletion

### 12.4 Backward Compatibility

- Existing `batch.course` free-text field preserved — old frontend pages continue working
- `batch.trainer_id` is nullable — existing batches without trainers show "Unassigned"
- New fields are all nullable with sensible defaults
- No existing API contracts broken — all new endpoints are additive

---

## File Tree Summary

```
backend/
  batch-service/src/main/java/com/.../batchservice/
    model/
      Batch.java                    (MODIFY: add 6 fields)
      TrainerAllocation.java        (NEW)
      BatchSchedule.java            (NEW)
    repository/
      TrainerAllocationRepository.java  (NEW)
      BatchScheduleRepository.java      (NEW)
    service/
      TrainerAllocationService.java     (NEW)
      BatchScheduleService.java         (NEW)
      BatchAnalyticsService.java        (NEW)
    controller/
      TrainerAllocationController.java  (NEW)
      BatchScheduleController.java      (NEW)
      BatchAnalyticsController.java     (NEW)
    dto/
      AllocationDTO.java                (NEW)
      TrainerWorkloadDTO.java           (NEW)
      BatchDashboardDTO.java            (NEW)
      AllocationMatrixRowDTO.java       (NEW)
      CreateAllocationRequest.java      (NEW)

  user-service/src/main/java/com/.../userservice/
    model/
      User.java                      (MODIFY: add 2 fields)

  api-gateway/src/main/java/.../config/
    RouteConfig.java                 (MODIFY: add 2 routes)

src/
  routes/admin/batches/
    index.jsx                        (NEW: Allocation Matrix)
    dashboard.jsx                    (NEW: Dashboard Overview)
    analytics.jsx                    (NEW: Enterprise Analytics)
    wizard.jsx                       (NEW: Allocation Wizard)
    $batchId.jsx                     (NEW: Batch Details)
    trainer/
      $trainerId.jsx                 (NEW: Trainer Profile)

  admin/features/batches/
    components/
      AllocationDataTable.jsx        (NEW)
      AllocationFilters.jsx          (NEW)
      AllocationRow.jsx              (NEW)
      BulkActionsBar.jsx             (NEW)
      AllocationSidePanel.jsx        (NEW)
      WizardStepper.jsx              (NEW)
      StepCard.jsx                   (NEW)
      StepUniversity.jsx             (NEW)
      StepBatch.jsx                  (NEW)
      StepTrainer.jsx                (NEW)
      StepCourse.jsx                 (NEW)
      StepReview.jsx                 (NEW)
      StepComplete.jsx               (NEW)
      TrainerWorkloadGauge.jsx       (NEW)
      BatchStatusBadge.jsx           (NEW)
      UniversityBadge.jsx            (NEW)
      TrainerHeader.jsx              (NEW)
      TrainerAllocationsList.jsx     (NEW)
      BatchHeader.jsx                (NEW)
      BatchTrainerList.jsx           (NEW)
      BatchCourseList.jsx            (NEW)
      BatchScheduleCard.jsx          (NEW)
    hooks/
      useAllocations.js              (NEW)
      useTrainerWorkload.js          (NEW)
      useBatchAnalytics.js           (NEW)
      useAllocationFilters.js        (NEW)
      useWizardState.js              (NEW)
      useAllocationExport.js         (NEW)
    constants.js                     (NEW)
    index.js                         (NEW: barrel export)

  components/layout/
    unified-sidebar.jsx              (MODIFY: add Batch Management nav section)
```
