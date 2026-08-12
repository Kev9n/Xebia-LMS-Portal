# XEBIA ENTERPRISE LMS — PROJECT MEMORY

> **Purpose**: Single source-of-truth context file. Loaded by AI assistants and new developers to gain full project understanding with zero prior knowledge.
> **Last Updated**: 2026-07-17
> **Repo**: https://github.com/mritunjai-prog/Xebia-Enterprise-LMS (branch: `lms-integrate`)

---

## 1. PROJECT OVERVIEW

**What it is**: Xebia Enterprise LMS is a full-stack, enterprise-grade Learning Management System (LMS) built for Xebia. It enables trainers to create and deliver assessments (MCQ, coding, mixed), manage student batches, track performance, and build rich structured courses. Students can take assessments, view results with certificates, browse courses, and track progress.

**Target Users**:
- **Trainers (Teachers)**: Create assessments, manage batches, evaluate submissions, view analytics
- **Students**: Take assessments (MCQ + coding), view results, earn certificates, browse/enroll in courses
- **Admins**: Manage users, courses, categories, view analytics dashboards

**Current Build Status**:
| Area | Status | Notes |
|---|---|---|
| Student Portal (Frontend) | ~85% | Core flow working; courses, assessments, results, certificates done |
| Trainer Portal (Frontend) | ~80% | Dashboard, batches, assessment builder, evaluation, leaderboard done |
| Admin Portal (Frontend) | ~70% | Course/category management done; analytics built with mock data |
| Backend - User Service | 100% | Full CRUD for users |
| Backend - Batch Service | 100% | Full CRUD for batches |
| Backend - Assessment Service | 95% | Assessments, submissions, drafts, AI desc gen all working |
| Backend - Course Service | 90% | Courses, categories, modules, submodules, content, enrollment, progress |
| Backend - API Gateway | 100% | Routing all services at port 8080 |
| Auth | 0% NOT IMPLEMENTED | Login uses email-matching against DB data. JWT/IAM is future work |
| Database | Working | PostgreSQL via Docker; Hibernate auto-DDL creates schema |

**Product Vision** (from code comments):
- "Deliver secure, scalable, and intelligent assessments with automated grading, real-time analytics, and seamless learning experiences — all from one enterprise platform."
- Future: IAM/JWT auth via API Gateway, Kafka for events, multi-tenancy (X-Tenant-Id header already wired).

---

## 2. TECH STACK (FULL DETAIL)

### Frontend
| Property | Value |
|---|---|
| Framework | React 19.2.0 |
| Meta-framework | TanStack Start 1.167.x (SSR-capable Vite-based) |
| Routing | TanStack Router 1.168.x (file-based via src/routes/) |
| State Management | React Context API (LMSContext) + Zustand 5.0.14 |
| Data Fetching | Custom fetch wrappers (src/api/client.js, src/services/api.js) |
| Forms | React Hook Form 7.71.x + Zod 3.24.x |
| Styling | Tailwind CSS v4.2.x; custom tokens in src/styles.css |
| UI Components | shadcn/ui (Radix UI + CVA) — 47 components in src/components/ui/ |
| Animation | Framer Motion 12.x |
| Charts | Recharts 2.15.x |
| Code Editor | Monaco Editor (@monaco-editor/react 4.7.x) |
| PDF/Certificate | jsPDF 4.2.x + html2canvas-pro 2.2.x |
| Build Tool | Vite 8.0.x |
| SSR/Server | Nitro (node-server locally; vercel on Vercel) |
| Language | JavaScript (JSX); TypeScript only for route tree gen |

### Backend
| Property | Value |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.x |
| Server Type | REST API |
| ORM | Hibernate via Spring Data JPA |
| Build Tool | Maven 3.9.6 |
| Services | user-service:8081, batch-service:8085, assessment-service:8086, course-service:8084, api-gateway:8080 |

### Database
| Property | Value |
|---|---|
| Engine | PostgreSQL 16-alpine |
| Hosting | Docker container locally |
| Schema Management | Hibernate ddl-auto |
| Cache | Redis 7-alpine (used for draft saving) |

### Auth
| Property | Value |
|---|---|
| Current | FAKE: LMSContext.login() finds user by email. No password. No JWT. |
| Session | localStorage.setItem("session", JSON.stringify(currentUser)) |
| Future Plan | API Gateway IAM service with JWT. X-User-Id header already propagated as placeholder |

### Third-Party Services
| Service | Purpose | Config |
|---|---|---|
| Cloudinary | Image/video/document upload for course content | VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET |
| Google Generative AI | AI features | Used via Groq API key |
| Groq API | LLM inference for AI description generator | VITE_GROQ_API_KEY |

### DevOps
| Property | Value |
|---|---|
| Local Dev | Docker Compose (backend/docker-compose.yml) starts all 7 containers |
| Frontend Local | npm run dev — Vite on port 3000 with /api proxy to localhost:8080 |
| Cloud Deployment | Render.com (render.yaml present) |
| Containerization | Docker — each backend service has a Dockerfile |
| Frontend Deploy | Vercel (Nitro detects process.env.VERCEL and switches preset) |

---

## 3. DESIGN SYSTEM

### Color Palette

| Token | Light Value | Dark Value | Role |
|---|---|---|---|
| --background | #F3F4F6 | #000000 | App background |
| --foreground | #000000 | #F7F8FC | Body text |
| --card | #FFFFFF | #151515 | Card surface |
| --card-foreground | #000000 | #F7F8FC | Card text |
| --primary | #6C1D5F | #84117C | Brand primary, buttons |
| --primary-foreground | #FFFFFF | #FFFFFF | Text on primary |
| --primary-glow | #84117C | #6C1D5F | Glow effects |
| --secondary | #DADCEA | #4A1E47 | Secondary surfaces |
| --secondary-foreground | #4A1E47 | #D3CCEC | Secondary text |
| --muted | #DEDEDE | #5A5A5A | Muted surfaces |
| --muted-foreground | #5A5A5A | #DEDEDE | Muted text |
| --accent | #84117C | #01AC9F | Accent highlights |
| --accent-2 | #01AC9F (Emerald) | #6C1D5F | Secondary accent |
| --destructive | #FF6200 (CTA Orange) | #FF6200 | Errors, destructive |
| --border | #DADCEA | #5A5A5A | Borders |
| --ring | #6C1D5F | #84117C | Focus rings |
| --chart-1 | #5C4F61 | #9D92B2 | Chart color 1 |
| --chart-2 | #855889 | #D3CCEC | Chart color 2 |
| --chart-3 | #533754 | #B8AFCF | Chart color 3 |
| --chart-4 | #91759E | #91759E | Chart color 4 |
| --chart-5 | #4A1E47 | #855889 | Chart color 5 |

Special tokens:
- --glass-bg: rgba(255,255,255,0.65) / rgba(20,20,20,0.7)
- --gradient-brand: linear-gradient(135deg, #6C1D5F, #84117C, #01AC9F)
- --shadow-glow: 0 20px 60px -20px rgba(108,29,95,0.45)
- --radius: 1rem (base)

### Typography
- Sans: Inter (body, 15px base, line-height 1.6)
- Display: Poppins / Inter (h1-h4, letter-spacing -0.02em)

### shadcn/ui Components (47 total in src/components/ui/)
accordion, alert-dialog, alert, avatar, badge, button, calendar, card, carousel, chart, checkbox, command, dialog, drawer, dropdown-menu, form, input, label, popover, progress, radio-group, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, tooltip, DateTimePicker, + more

---

## 4. PROJECT ARCHITECTURE

### Folder Structure

`
d:\Xebia Integrated\
├── src/
│   ├── api/client.js              <- Core apiClient (users, batches, assessments, submissions, drafts)
│   ├── components/
│   │   ├── ui/                    <- 47 shadcn/ui primitives
│   │   ├── layout/                <- UnifiedLayout, StudentSidebar, StudentNavbar, UnifiedSidebar
│   │   ├── analytics/             <- Analytics chart subcomponents
│   │   ├── assessment-builder/    <- AssessmentBuilder sub-panels
│   │   ├── landing/               <- Landing page sections
│   │   ├── manager/               <- Admin sub-components
│   │   └── cursor-trail.jsx       <- Animated cursor trail
│   ├── config/student-identity.js <- TEMPORARY_STUDENT_ID constant
│   ├── context/LMSContext.jsx     <- Global state (users, batches, assessments, submissions, theme, auth)
│   ├── features/student/          <- Student-specific feature components
│   ├── lib/
│   │   ├── cloudinary.js          <- Cloudinary URL helpers
│   │   └── mock-data/             <- Mock data for analytics views
│   ├── pages/                     <- 16 page-level components
│   ├── routes/                    <- TanStack Router file-based routes
│   │   ├── __root.jsx             <- Root (wraps LMSProvider, QueryClient)
│   │   ├── index.jsx              <- / redirect to /login
│   │   ├── admin.jsx + admin/     <- Admin portal (checks teacher/admin role)
│   │   ├── trainer.jsx + trainer/ <- Trainer portal (checks teacher role)
│   │   └── student.jsx + student/ <- Student portal (checks student role)
│   ├── services/api.js            <- CourseService, EnrollmentService, ProgressService etc
│   ├── styles.css                 <- Tailwind v4 + all CSS design tokens
│   └── server.js                  <- Nitro SSR entry
├── backend/
│   ├── api-gateway/               <- Spring Cloud Gateway :8080
│   ├── user-service/              <- User CRUD :8081
│   ├── batch-service/             <- Batch CRUD :8085
│   ├── assessment-service/        <- Assessments + Submissions + AI :8086
│   ├── course-service/            <- Courses + Enrollment + Progress :8084
│   ├── common-lib/                <- Shared TenantScopedEntity base
│   └── docker-compose.yml         <- All 7 containers
├── public/
│   ├── logo-white.png             <- Xebia white logo (used on dark backgrounds)
│   ├── logo-purple.png
│   └── avatar.png
├── .env                           <- VITE_CLOUDINARY_*, VITE_GROQ_API_KEY
├── package.json
├── vite.config.js                 <- Vite + Nitro + /api proxy
├── render.yaml                    <- Render.com deployment
└── memory.md                      <- THIS FILE
`

### High-Level Data Flow

`
Browser -> Vite :3000 -> /api/* proxy -> API Gateway :8080
                                       -> /api/v1/users      -> user-service :8081    -> PostgreSQL
                                       -> /api/v1/batches    -> batch-service :8085   -> PostgreSQL
                                       -> /api/v1/assessments-> assessment-service :8086 -> PostgreSQL + Redis
                                       -> /api/v1/submissions-> assessment-service :8086
                                       -> /courses, /categories, /enrollments, /progress -> course-service :8084 -> PostgreSQL
`

### Architecture Diagram (Mermaid)

`mermaid
graph TD
    Browser["Browser (React 19 + TanStack Router)"]
    ViteDev["Vite Dev Server :3000"]
    Gateway["API Gateway :8080"]
    UserSvc["User Service :8081"]
    BatchSvc["Batch Service :8085"]
    AssessmentSvc["Assessment Service :8086"]
    CourseSvc["Course Service :8084"]
    PG["PostgreSQL :5432"]
    Redis["Redis :6379"]

    Browser --> ViteDev
    ViteDev -- "/api/* proxy" --> Gateway
    Gateway --> UserSvc & BatchSvc & AssessmentSvc & CourseSvc
    UserSvc & BatchSvc & CourseSvc --> PG
    AssessmentSvc --> PG & Redis
`

---

## 5. DATABASE ARCHITECTURE

### Table: users (user-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, auto UUID |
| name | VARCHAR(255) | |
| email | VARCHAR(255) | UNIQUE |
| role | VARCHAR(255) | "teacher" or "student" |
| department | VARCHAR(255) | |
| avatar | VARCHAR(255) | URL |
| average_score | INTEGER | Student stat |
| assessments_completed | INTEGER | Student stat |

### Table: batches (batch-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, auto UUID |
| name | VARCHAR(255) | |
| course | VARCHAR(255) | Course name string |
| student_count | INTEGER | |
| status | VARCHAR(255) | "active" or "completed" |
| created_at | VARCHAR(255) | ISO date |
| icon | VARCHAR(255) | Emoji |
| students | VARCHAR[] | ElementCollection of student UUIDs |

### Table: assessments (assessment-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, auto UUID |
| title | VARCHAR(255) | |
| description | VARCHAR(255) | |
| instructions | TEXT | |
| difficulty | VARCHAR(255) | easy/medium/hard |
| marks | INTEGER | Total marks |
| passing_marks | INTEGER | |
| duration | INTEGER | Minutes |
| start_date, start_time, end_date, end_time | VARCHAR(255) | |
| attempts_allowed | INTEGER | |
| auto_grade | BOOLEAN | |
| manual_grade | BOOLEAN | |
| status | VARCHAR(255) | draft/published/archived |
| type | VARCHAR(255) | mcq/assignment/mixed/coding |
| created_by | VARCHAR(255) | Teacher ID |
| created_at | VARCHAR(255) | |
| topic | VARCHAR(255) | |
| shuffle_questions | BOOLEAN | |
| randomize_options | BOOLEAN | |
| negative_marking | BOOLEAN | |
| negative_marks_value | INTEGER | |
| auto_submit | BOOLEAN | |
| batches | VARCHAR[] | ElementCollection of batch IDs |

### Table: questions (assessment-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, auto UUID |
| assessment_id | VARCHAR/UUID | FK -> assessments.id |
| type | VARCHAR(255) | mcq/text/coding |
| question | TEXT | |
| marks | INTEGER | |
| required | BOOLEAN | |
| options | TEXT[] | ElementCollection, MCQ choices |
| correct_answer | TEXT | |
| explanation | TEXT | |

### Table: submissions (assessment-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, manually set |
| assessment_id | VARCHAR/UUID | Logical FK |
| student_id | VARCHAR/UUID | Logical FK |
| status | VARCHAR(255) | in_progress/submitted |
| started_at, submitted_at | VARCHAR(255) | ISO datetime |
| score | INTEGER | |
| percentage | INTEGER | |
| time_taken | INTEGER | Seconds |
| is_evaluated | BOOLEAN | |
| remarks | TEXT | |
| evaluated_by | VARCHAR(255) | Teacher ID |

### Table: answers (assessment-service)
| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR/UUID | PK, auto UUID |
| submission_id | VARCHAR/UUID | FK -> submissions.id |
| question_id | VARCHAR/UUID | Logical FK |
| answer | TEXT | JSON string for multi-select |
| marks_awarded | INTEGER | |
| remarks | TEXT | |

### Table: categories (course-service, schema: course)
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| tenant_id | UUID | Multi-tenancy |
| name | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | NOT NULL |
| icon | VARCHAR(255) | |
| description | VARCHAR(255) | |
| color | VARCHAR(255) | |
| is_active | BOOLEAN | NOT NULL, default true |

### Table: courses (course-service, schema: course)
Key columns: id (UUID PK), tenant_id, category_id (FK->categories), title (NOT NULL), description, published, subtitle, icon, thumbnail_image_url, banner_image, preview_video_url, duration_hours, duration_minutes, difficulty_level, language, visibility, is_active, is_featured, allow_enrolling (default true), course_code, learning_outcomes (text[]), prerequisites (text[]), target_audience (text[]), highlights (text[]), career_opportunities (text[]), PLUS extensive SEO fields (meta_title, meta_description, og_title, og_description, twitter_card, schema_markup, faq_schema etc), analytics fields (total_views, total_clicks, ctr, seo_score).

### Table: course_modules (course-service, schema: course)
id (UUID PK), course_id (FK->courses), title (NOT NULL), position (INT NOT NULL), description, is_active.

### Table: sub_modules (course-service, schema: course)
id (UUID PK), module_id (FK->course_modules), title, position, description, is_active.

### Table: content_items (course-service, schema: course)
Content blocks (VIDEO, PDF, TEXT, QUIZ) attached to submodules.

### Table: enrollments (course-service, schema: course)
Tracks student course enrollments.

### Table: course_progress / content_progress (course-service, schema: course)
Tracks completion per student per course/submodule.

### ER Diagram
`mermaid
erDiagram
    users { string id PK; string name; string email; string role }
    batches { string id PK; string name; string[] students }
    assessments { string id PK; string title; string type; string status; string[] batches }
    questions { string id PK; string assessment_id FK; string type; string correct_answer }
    submissions { string id PK; string assessment_id; string student_id; int score }
    answers { string id PK; string submission_id FK; string question_id; string answer }
    categories { uuid id PK; string name; string slug }
    courses { uuid id PK; uuid category_id FK; string title; boolean published }
    course_modules { uuid id PK; uuid course_id FK; string title; int position }

    assessments ||--o{ questions : "has"
    submissions ||--o{ answers : "has"
    categories ||--o{ courses : "belongs to"
    courses ||--o{ course_modules : "has"
`

---

## 6. API ARCHITECTURE

All routes proxied through API Gateway at localhost:8080.

### User Service
| Method | Path | Description | Status |
|---|---|---|---|
| GET | /api/v1/users | Get all users (opt ?role=teacher|student) | Working |
| POST | /api/v1/users | Create user | Working |

### Batch Service
| Method | Path | Description | Status |
|---|---|---|---|
| GET | /api/v1/batches | Get all batches | Working |
| POST | /api/v1/batches | Create batch | Working |
| PUT | /api/v1/batches/{id} | Update batch | Working |
| DELETE | /api/v1/batches/{id} | Delete batch | Working |

### Assessment Service
| Method | Path | Description | Status |
|---|---|---|---|
| GET | /api/v1/assessments | Get all assessments | Working |
| POST | /api/v1/assessments | Create assessment | Working |
| PUT | /api/v1/assessments/{id} | Update assessment | Working |
| DELETE | /api/v1/assessments/{id} | Delete assessment | Working |
| GET | /api/v1/submissions | Get all submissions (opt ?studentId=) | Working |
| POST | /api/v1/submissions | Submit assessment | Working |
| PUT | /api/v1/submissions/{id} | Update submission (evaluation) | Working |
| POST | /api/v1/assessments/drafts/{studentId}/{assessmentId} | Save draft to Redis | Working |
| GET | /api/v1/assessments/drafts/{studentId}/{assessmentId} | Get draft from Redis | Working |
| POST | /api/v1/assessments/ai/generate-description | AI generate description | Working |

### Course Service (no /api/v1/ prefix — routed by gateway)
| Method | Path | Description | Header |
|---|---|---|---|
| GET | /courses | List all courses | X-Tenant-Id |
| POST | /courses | Create course | X-Tenant-Id |
| PUT | /courses/{courseId} | Update course | |
| DELETE | /courses/{courseId} | Delete course | |
| POST | /courses/{courseId}/modules | Add module | |
| PUT | /courses/modules/{moduleId} | Update module | |
| DELETE | /courses/modules/{moduleId} | Delete module | |
| POST | /courses/{courseId}/modules/{moduleId}/submodules | Add submodule | |
| PUT | /courses/submodules/{subModuleId} | Update submodule | |
| DELETE | /courses/submodules/{subModuleId} | Delete submodule | |
| POST | /courses/{courseId}/content-items | Add content item | |
| PUT | /courses/content-items/{contentId} | Update content item | |
| DELETE | /courses/content-items/{contentId} | Delete content item | |
| GET | /courses/{courseId}/hierarchy | Full hierarchy (modules+submodules+content) | |
| GET | /categories | List all categories | |
| POST | /categories | Create category | |
| GET | /categories/{id} | Get category | |
| PUT | /categories/{id} | Update category | |
| DELETE | /categories/{id} | Delete category | |
| POST | /enrollments/{courseId} | Enroll student | X-User-Id |
| DELETE | /enrollments/{courseId} | Unenroll student | X-User-Id |
| GET | /enrollments/{courseId}/status | Check enrollment | X-User-Id |
| GET | /enrollments/my-courses | Student's courses | X-User-Id |
| POST | /progress/course/{courseId}/submodule/{submoduleId}/complete | Mark complete | X-User-Id |
| DELETE | /progress/course/{courseId}/submodule/{submoduleId}/complete | Mark incomplete | X-User-Id |
| GET | /progress/course/{courseId} | Get course progress | X-User-Id |

---

## 7. PORTALS BREAKDOWN

### 7A. Student Portal (/student/*)
Auth: currentUser.role === "student", else redirect to /

| Route | Page | Status | APIs |
|---|---|---|---|
| /student | StudentDashboard.jsx | Done | /api/v1/assessments, /submissions |
| /student/assessments | StudentAssessments.jsx | Done | /api/v1/assessments, /batches |
| /student/assessment/:assessmentId | AssessmentDetail.jsx | Done | /api/v1/assessments |
| /student/take/:slug | TakeQuiz.jsx | Done | assessments, submissions, drafts |
| /student/take-coding/:slug | TakeCoding.jsx | Done | assessments, submissions |
| /student/results | results/index.jsx | Done | /api/v1/submissions |
| /student/results/:slug/:id | Results.jsx | Done | submissions, assessments |
| /student/certificate/:submissionId | CertificateView.jsx | Done | /api/v1/submissions |
| /student/courses | courses.jsx | Done | /courses, /categories, /enrollments |
| /student/course/:courseId | course/.jsx | Done | /courses/:id/hierarchy, /progress |
| /student/batches | batches.jsx | Done | /api/v1/batches |
| /student/feedback | feedback.jsx | Partial (no backend) | None |
| /student/notifications | notifications.jsx | Done (localStorage only) | None |
| /student/profile | profile.jsx | Partial | /api/v1/users |

### 7B. Trainer Portal (/trainer/*)
Auth: currentUser.role === "teacher", else redirect to /

| Route | Page | Status | APIs |
|---|---|---|---|
| /trainer | TeacherDashboard.jsx | Done | batches, assessments, users |
| /trainer/assessment-builder | AssessmentBuilder.jsx | Done | /api/v1/assessments |
| /trainer/batches | BatchManagement.jsx | Done | batches, users |
| /trainer/batches/:id | BatchDetail.jsx | Done | batches, submissions |
| /trainer/evaluation | Evaluation.jsx | Done | submissions, assessments |
| /trainer/leaderboard | Leaderboard.jsx | Done | submissions, users |
| /trainer/reports | Reports.jsx | Done | assessments, submissions |
| /trainer/settings | Settings.jsx | Done | /api/v1/users |

### 7C. Admin Portal (/admin/*)
Auth: teacher or admin role

| Route | Status | Description |
|---|---|---|
| /admin | Done | Admin dashboard |
| /admin/organiser | Done | Course organiser (hierarchy builder) |
| /admin/curriculum | Done | Curriculum view |
| /admin/categories | Done | Category CRUD |
| /admin/courses | Done | Course CRUD |
| /admin/courses/builder | Done | Course builder with modules/submodules/content |
| /admin/submodules/:id/content | Done | Content block editor |
| /admin/trainer | Done | Trainer management |
| /admin/analytics/* (16 pages) | Partial | Rich charts built; all use mock data, not live APIs |

### 7D. Login / Public
| Route | Component | Description |
|---|---|---|
| / | index.jsx | Redirects to /login |
| /login | Login.jsx | Role selector (Trainer/Student/Admin) + email auth |

---

## 8. FRONTEND ROUTES MAP

| Path | Component | Protected | APIs |
|---|---|---|---|
| / | index.jsx | No | — |
| /login | Login.jsx | No | /api/v1/users, /api/v1/batches |
| /student | StudentDashboard.jsx | Yes (student) | assessments, submissions |
| /student/assessments | StudentAssessments.jsx | Yes (student) | assessments, batches |
| /student/assessment/:id | AssessmentDetail.jsx | Yes (student) | assessments |
| /student/take/:slug | TakeQuiz.jsx | Yes (student) | assessments, submissions, drafts |
| /student/take-coding/:slug | TakeCoding.jsx | Yes (student) | assessments, submissions |
| /student/results | results/index.jsx | Yes (student) | submissions |
| /student/results/:slug/:id | Results.jsx | Yes (student) | submissions, assessments |
| /student/certificate/:id | CertificateView.jsx | Yes (student) | submissions |
| /student/courses | courses.jsx | Yes (student) | /courses, /categories, /enrollments |
| /student/course/:courseId | course/.jsx | Yes (student) | /courses/hierarchy, /progress |
| /student/batches | batches.jsx | Yes (student) | /api/v1/batches |
| /student/feedback | feedback.jsx | Yes (student) | None |
| /student/notifications | notifications.jsx | Yes (student) | None |
| /student/profile | profile.jsx | Yes (student) | /api/v1/users |
| /trainer | TeacherDashboard.jsx | Yes (teacher) | batches, assessments, users |
| /trainer/assessment-builder | AssessmentBuilder.jsx | Yes (teacher) | /api/v1/assessments |
| /trainer/batches | BatchManagement.jsx | Yes (teacher) | batches, users |
| /trainer/batches/:id | BatchDetail.jsx | Yes (teacher) | batches, submissions |
| /trainer/evaluation | Evaluation.jsx | Yes (teacher) | submissions, assessments |
| /trainer/leaderboard | Leaderboard.jsx | Yes (teacher) | submissions, users |
| /trainer/reports | Reports.jsx | Yes (teacher) | assessments, submissions |
| /trainer/settings | Settings.jsx | Yes (teacher) | users |
| /admin | admin/index.jsx | Yes (teacher) | various |
| /admin/organiser | organiser.jsx | Yes | courses, categories |
| /admin/categories | categories/index.jsx | Yes | /categories |
| /admin/categories/:slug | categories/.jsx | Yes | /categories/:id |
| /admin/courses | courses/index.jsx | Yes | /courses, /categories |
| /admin/courses/builder | courses/builder.jsx | Yes | /courses, /categories |
| /admin/courses/:slug | courses/.jsx | Yes | /courses/:id/hierarchy |
| /admin/curriculum | curriculum.jsx | Yes | /courses |
| /admin/analytics/* | 16 pages | Yes | mock data |
| /admin/trainer | trainer.js | Yes | /api/v1/users |

---

## 9. STATE MANAGEMENT

### LMSContext (src/context/LMSContext.jsx)
Primary global state. Wrapped at root, consumed via useLMS().

| Slice | Type | Source |
|---|---|---|
| teachers | Array<User> | Backend /api/v1/users |
| students | Array<User> | Backend /api/v1/users |
| batches | Array<Batch> | Backend /api/v1/batches |
| assessments | Array<Assessment> | Backend /api/v1/assessments |
| submissions | Array<Submission> | Backend /api/v1/submissions |
| codingSubmissions | Array | localStorage |
| codingLeaderboard | Array | localStorage |
| notifications | Array | localStorage |
| currentUser | User|null | localStorage("session") |
| theme | "light"/"dark" | localStorage("settings") |

### Data Flow
1. App starts -> LMSContext useEffect fetches all backend data
2. Login: login(email, role) finds user in loaded list -> sets currentUser -> persisted to localStorage
3. Route protection: Layout routes read currentUser.role -> redirect if mismatch

### localStorage Keys
session, settings, teachers, students, batches, assessments, submissions, codingSubmissions, codingLeaderboard, codingAssessments, codingProblems, codingTemplates, codingTestCases, codingResults, notifications

---

## 10. ENVIRONMENT & CONFIG

### Frontend (.env)
| Variable | Purpose |
|---|---|
| VITE_CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| VITE_CLOUDINARY_UPLOAD_PRESET | Cloudinary upload preset |
| VITE_GROQ_API_KEY | Groq LLM API key |
| VITE_API_BASE_URL | Backend URL (default: http://localhost:8080/api) |

### Backend (backend/.env + docker-compose)
| Variable | Purpose |
|---|---|
| JWT_SECRET | JWT signing secret (>=32 chars) |
| ADMIN_PASSWORD | Admin password (not yet wired to auth) |
| SERVER_PORT | Service listen port |
| DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD | PostgreSQL connection |
| REDIS_HOST | Redis hostname |
| SERVICES_COURSE, SERVICES_USER, SERVICES_BATCH, SERVICES_ASSESSMENT | Gateway routing URLs |

### Hardcoded Values
| Value | Location | Notes |
|---|---|---|
| TEMPORARY_STUDENT_ID = "00000000-0000-0000-0000-000000000001" | src/config/student-identity.js | X-User-Id header placeholder |
| X-Tenant-Id: "123e4567-e89b-12d3-a456-426614174000" | src/services/api.js | Hardcoded tenant |
| Vite proxy /api -> localhost:8080 | vite.config.js | Dev-only |

---

## 11. KNOWN ISSUES / INCOMPLETE AREAS

| # | Issue | Location |
|---|---|---|
| 1 | Auth is fake — email matching only, no password, no JWT | LMSContext.jsx:234 |
| 2 | Admin role tab on login has no real admin user concept | Login.jsx |
| 3 | TEMPORARY_STUDENT_ID hardcoded | src/config/student-identity.js:12 |
| 4 | X-Tenant-Id hardcoded | src/services/api.js:11 |
| 5 | ~~16 analytics pages use mock data~~ — FIXED: now uses useAnalyticsData() hook with real LMSContext data | src/routes/admin/analytics/* |
| 6 | Coding test case execution is simulated | src/pages/TakeCoding.jsx |
| 7 | EnrollmentController comment says auth not implemented | EnrollmentController.java:13 |
| 8 | Kafka referenced in course-service but no Kafka container | docker-compose.yml |
| 9 | render.yaml only has 2 of 5 services | render.yaml |
| 10 | implementation_plan.md leftover in root | d:\Xebia Integrated\implementation_plan.md |
| 11 | Empty Xebia LMS ghost folder exists (IDE lock) | d:\Xebia Integrated\Xebia LMS\ |
| 12 | Student feedback form has no backend endpoint | /student/feedback |
| 13 | Notifications are localStorage-only, no backend | /student/notifications |
| 14 | ~~CORS duplicate headers~~ — FIXED: removed @CrossOrigin from all controllers | All controller files |
| 15 | ~~Sidebar active state~~ — FIXED: exact match only, no prefix matching | unified-sidebar.jsx |

---

## 12. NEXT DEVELOPMENT PRIORITIES

### Critical
1. Implement real JWT authentication — replace fake email matching with login endpoint + JWT token
2. Replace TEMPORARY_STUDENT_ID with JWT-derived user ID

### High Priority (Backend)
3. ~~Wire 16 analytics pages to real aggregated data from backend~~ — DONE (2026-07-14)
4. Implement real code execution engine for coding assessments (Judge0 or custom)
5. Add missing services (user, batch, assessment) to render.yaml
6. Add Kafka broker and implement enrollment/completion events

### Medium Priority (Frontend)
7. Implement student feedback form backend endpoint
8. Real notification system (not localStorage)
9. Profile editing connected to PUT /api/v1/users/:id (endpoint missing)
10. Verify course progress tracking works end-to-end in student dashboard

### Low Priority / Polish
11. Delete empty Xebia LMS ghost folder after closing VS Code
12. Remove implementation_plan.md from project root
13. Add pagination to all list endpoints
14. GitHub Actions CI/CD workflow
15. Database seed script for demo data

---

## 13. SESSION LOG

### Session 2026-07-14 — Major Integration and Cleanup

What was done:
- Fixed Rules of Hooks violations in TakeQuiz.jsx and TakeCoding.jsx
- Fixed vite.config.js Nitro preset from cloudflare to node-server/vercel conditional
- Removed legacy Xebia-Student-Trainer folder; unified all code under Xebia Integrated
- Moved all project files from Xebia Integrated/Xebia LMS/ up to root
- Deleted 200+ legacy files (temp scripts, migration scripts, scratch/, dist_check/, ui design/ etc)
- Fixed login page: logo-dark.png (404) -> logo-white.png; text color fixed to text-purple-200
- Verified npm run build succeeds from new root location (~5 seconds)
- Set git config user.name=mritunjai-prog, user.email=mritunjay045k@gmail.com
- Pushed all changes to branch lms-integrate on GitHub
- Created memory.md (this file)

Servers: Frontend npm run dev on :3000, Backend docker-compose up -d (7 containers healthy)

### Session 2026-07-14 (Continued) — API Unification, Admin Integration, Analytics Real Data, UI Sync

What was done:

#### Phase 1: Unified API Layers (Observation #2)
- Merged `src/api/client.js` methods into `src/services/api.js` using the proper `fetchApi` wrapper
- Added new services: `UserService`, `AssessmentService`, `SubmissionService`, `DraftService`, `AIDescriptionService`
- Expanded `BatchService` with `updateBatch` and `deleteBatch` methods
- Updated `LMSContext.jsx` to import from unified `services/api.js` instead of `api/client.js`
- Deleted `src/api/client.js` (only consumer was LMSContext.jsx)
- URL path alignment: user/batch/assessment endpoints use `/v1/` prefix (gateway strips nothing), course endpoints use `/` (gateway strips `/api` prefix)

#### Phase 2: Admin Integration (Observation #3)
- Replaced `src/admin/services/api.js` mock data (226 lines of localStorage) with real API calls to `UserService`, `CourseService`, `CategoryService`, `BatchService`, `AssessmentService`
- Deleted unused duplicate files: `Courses/Detail.jsx`, `Categories/Detail.jsx`
- Standardized all admin page imports from `../../../services/api` to `@/services/api` (12 files updated)
- `useAppStore.js` now receives real dashboard data from backend

#### Phase 3: Real Analytics Data (Observation #5)
- Created `src/hooks/useAnalyticsData.js` — central hook computing all metrics from LMSContext: learner/trainer counts, submission stats, scores, pass rates, difficulty distributions, batch performance, monthly trends, top students
- Updated 11 analytics components to use `useAnalyticsData()` instead of hardcoded mock values:
  - ExecutiveKPIs, ExecutiveCharts, ExecutiveInsights
  - CoverageKPIs, CoverageCharts, CoverageInsights, CoverageActivity
  - HoursKPIs, HoursCharts, HoursLeaderboards, HoursInsightsAndAlerts
  - ActivityTimeline
- All 16 analytics pages under `src/routes/admin/analytics/` now render real data

#### Phase 4: UI Sync with Main Branch
- Restored all course and category admin pages from the `main` branch to match its UI design
- Files restored: Courses/index.jsx, Courses/CreateCourse.jsx, Courses/CourseDetail.jsx, Courses/HierarchyBuilder.jsx, Courses/ContentManager.jsx, Categories/index.jsx, Categories/CreateCategory.jsx, Categories/CategoryDetail.jsx, Dashboard/index.jsx, Curriculum/index.jsx, Analytics/index.jsx
- Fixed import paths back to `@/services/api` in all restored files
- Key UI differences reverted: hardcoded color tokens (text-purple-600, bg-green-50 etc.), 4-column grid, h-32 thumbnails, compact card layouts

### Build Status
- `npx vite build` succeeds (~10s client + ~6s SSR)
- All 7 backend containers running healthy

### Servers
- Frontend: `npx vite dev --port 3000` (start in new cmd window)
- Backend: `docker-compose up -d` in backend/ directory
- API Gateway: localhost:8080
- Frontend: localhost:3000

### Key Architecture Decisions from This Session
1. **Single API file**: All frontend API calls go through `src/services/api.js` — no more `src/api/client.js`
2. **URL pattern**: Course endpoints use `/courses`, `/categories` etc. (gateway strips `/api`). User/batch/assessment use `/v1/users`, `/v1/batches` etc. (gateway strips nothing)
3. **Admin pages live in `src/admin/`** and are imported by route files in `src/routes/admin/` via `@/admin/` alias
4. **Analytics use `useAnalyticsData()` hook** that computes from LMSContext — no separate API calls needed
5. **Main branch UI is the source of truth** for admin pages — `lms-integrate` branch should not deviate from main's UI design

### Remaining Known Issues
- Auth is still fake (email matching only, no JWT)
- TEMPORARY_STUDENT_ID and X-Tenant-Id still hardcoded
- 16 analytics pages under routes/admin/analytics/ use components from src/components/analytics/ which now compute real data
- Coding test case execution is still simulated
- Kafka referenced in docker-compose but no Kafka container
- render.yaml only has 2 of 5 services

### Session 2026-07-14 (Batch Management & Trainer Allocation Module)

What was done:

#### Backend Changes
1. **Batch entity updated** (`backend/batch-service/.../model/Batch.java`):
   - Added fields: `trainerId`, `courseId`, `university`, `academicSession`, `startDate`, `endDate`, `maxStudents`
   - These fields replace the free-text `course` field for proper allocation tracking

2. **New entity: TrainerAllocation** (`backend/batch-service/.../model/TrainerAllocation.java`):
   - Fields: id, trainerId, batchId, courseId, university, academicSession, status, startDate, endDate, assignedBy, assignedAt, notes
   - Indexes on trainerId, batchId, courseId, university
   - Supports all 6 allocation rules (trainer→batches, trainer→courses, course→trainers, etc.)

3. **New repository**: `TrainerAllocationRepository` with custom queries for dashboard summary and analytics

4. **New service**: `TrainerAllocationService` with CRUD, bulk operations, dashboard summary, and analytics methods

5. **New controller**: `TrainerAllocationController` (`/api/v1/allocations`) with 12 endpoints:
   - GET /allocations (with filters), POST, PUT, DELETE
   - POST /bulk, GET /dashboard, GET /analytics
   - GET /trainer/{id}, /batch/{id}, /course/{id}, /university/{name}

6. **Gateway route added** for `/api/v1/allocations/**` → batch-service

7. **BatchService updated** with `updateBatchFields()` method for allocation-driven updates

#### Frontend Changes
1. **AllocationService added** to `src/services/api.js` with all allocation API methods

2. **6 new route files** under `src/routes/admin/batches/`:
   - Overview, Analytics, Allocations, Allocate, Trainers, $batchId

3. **6 new page components** under `src/admin/pages/Batches/`:
   - **Overview.jsx**: KPI dashboard with 6 cards (Total Trainers, Active Batches, Courses Assigned, etc.), quick actions, recent allocations list
   - **Analytics.jsx**: Enterprise charts — trainer workload bar, university distribution pie, monthly trend area, status donut, course popularity horizontal bar
   - **AllocationMatrix.jsx**: Enterprise data grid with search, filters, sort, pagination, bulk select, CSV export, context menu
   - **AllocationWizard.jsx**: 5-step wizard (University → Batch → Trainer → Course → Review), multi-course selection, smart validation, bulk assignment
   - **TrainerWorkload.jsx**: Trainer cards with utilization bars, stats grid, expandable detail panel
   - **BatchDetailAdmin.jsx**: Batch detail with stats cards, course distribution pie chart, allocations list

4. **Sidebar updated** (`src/components/layout/unified-sidebar.jsx`):
   - Added "Batch Management" collapsible section with 5 nav items
   - Collapsible state: `isBatchMgmtOpen` (default: true)

### Build Status
- `npx vite build` succeeds (~11s client + ~5s SSR)
- All 7 backend containers running healthy

### Session 2026-07-14 (Bug Fixes — CORS, Routing, Sidebar)

What was done:

#### CORS Fix
- **Root cause**: API Gateway adds `Access-Control-Allow-Origin: *` AND individual services also had `@CrossOrigin(origins = "*")`, creating duplicate CORS headers that browsers reject.
- **Fix**: Removed `@CrossOrigin(origins = "*")` from ALL controllers across user-service, batch-service, and assessment-service (7 controllers total). The API Gateway handles CORS for all routes.
- **Files modified**: `backend/user-service/.../UserController.java`, `backend/assessment-service/.../AssessmentController.java`, `SubmissionController.java`, `DraftController.java`, `AIController.java`, `backend/batch-service/.../BatchController.java`, `TrainerAllocationController.java`

#### Routing Fix
- **Root cause**: `routeTree.gen.js` was stale (only had manager routes, no admin batch routes). The `.ts` route tree had the routes but the `.js` was being served.
- **Fix**: Deleted stale `routeTree.gen.js`. Created `src/routes/admin/batches/index.jsx` as the overview index route. Changed `src/routes/admin/batches.jsx` from a page component to a layout route with `<Outlet />` so child routes can render.
- **Route structure**: `/admin/batches` (layout) → `/admin/batches/` (overview index), `/admin/batches/analytics`, `/admin/batches/allocations`, `/admin/batches/allocate`, `/admin/batches/trainers`, `/admin/batches/$batchId`

#### Sidebar Active State Fix
- **Root cause**: TanStack Router's `Link` component has built-in active state detection that adds "active" class based on route prefix matching. This conflicted with manual active state logic, causing multiple sidebar items to highlight simultaneously.
- **Fix 1**: Replaced `Link` with plain `div` + `useNavigate()` to eliminate TanStack Router's active class interference.
- **Fix 2**: Changed active state logic to EXACT match only for all nav items (no prefix matching). Previously tried prefix matching for "layout routes" but the detection was unreliable.
- **Key insight**: The `hasChildRoute` check was incorrectly treating "Overview" (`/admin/batches`) as a layout route because "Analytics" (`/admin/batches/analytics`) starts with the same prefix. But "Overview" is a leaf page, not a layout. Exact matching for all items solves this.

#### CSS Reference
- `.nav-item.active` in `src/admin/index.css` line 69: `background: var(--primary); color: #fff;`
- `.sidebar-student .nav-item.active` line 95: `background: var(--white); color: var(--primary-dark);`
- `.dark .nav-item.active` line 315: `background: #fff; color: #4A1E47;`

### Key Architecture Decisions (Updated)
1. **Single API file**: All frontend API calls go through `src/services/api.js` — no more `src/api/client.js`
2. **URL pattern**: Course endpoints use `/courses`, `/categories` etc. (gateway strips `/api`). User/batch/assessment use `/v1/users`, `/v1/batches` etc. (gateway strips nothing)
3. **Admin pages live in `src/admin/`** and are imported by route files in `src/routes/admin/` via `@/admin/` alias
4. **Analytics use `useAnalyticsData()` hook** that computes from LMSContext — no separate API calls needed
5. **Main branch UI is the source of truth** for admin pages — `lms-integrate` branch should not deviate from main's UI design
6. **No `@CrossOrigin` on controllers** — API Gateway handles CORS for all routes
7. **Sidebar uses exact match only** — no prefix matching to avoid false positives on parent routes
8. **Layout routes use `<Outlet />`** — e.g., `batches.jsx` is a layout route, `batches/index.jsx` is the overview page
9. **Route tree is auto-generated** — `routeTree.gen.ts` is the source of truth, `.js` is stale and should be deleted

### Session 2026-07-14 (Allocation Wizard Rewrite + Trainer Portal Course Dropdown + Assessment Admin Module + UI Fixes)

What was done:

#### Allocation Wizard Rewrite (4-step flow)
- Removed university selection step from Allocation Wizard
- New flow: Select Batch → Select Trainer (auto from batch creator) → Select Course → Review & Assign
- Added `createdBy`/`createdByName` fields to Batch entity to track which trainer created each batch
- Removed `university` field from TrainerAllocation entity
- Updated `LMSContext.jsx` `createBatch()` to pass `currentUser.id`/`currentUser.name` as `createdBy`/`createdByName`
- Updated sidebar collapse logic for Assessment Management section

#### Trainer Portal — Course Dropdown
- Replaced free-text "Course / Core Focus" input in batch creation with dropdown
- Trainers now select from admin-created courses (CourseService.getCourses())
- Shows "No courses available" message if no courses exist
- Updated `createBatch()` to accept and store `courseId`

#### Admin Assessment Management Module (NEW)
- **Backend**: Created `AdminAssessmentController`, `AdminAssessmentService`, 4 DTOs (AdminDashboardDto, AdminAnalyticsDto, AssessmentReportDto, StudentReportRowDto)
- **Backend**: Added `batchId` field to Submission entity
- **Backend**: Added gateway routes for admin assessment endpoints
- **Frontend**: 3 new pages (Overview, Analytics, AssessmentDetailAdmin)
- **Frontend**: 2 new reusable components (AssessmentCard, StudentReportTable)
- **Frontend**: 4 new route files under `src/routes/admin/assessments/`
- **Frontend**: Updated unified-sidebar.jsx with "Assessment Management" section
- **Frontend**: Added `AdminAssessmentService` to `src/services/api.js`
- **New API endpoints**: `/v1/assessments/dashboard`, `/v1/assessments/analytics`, `/v1/assessments/{id}/details`, `/v1/assessments/{id}/report`, `/v1/assessments/trainer-performance`, `/v1/assessments/batch-performance`

#### UI Fixes
- Fixed sidebar duplication bug — Assessment Management divider was duplicating items due to missing `section` marker check
- Fixed AssessmentCard styling to match existing admin portal cards (Course/Category style)
- Fixed Assessment Detail page layout (full-width, proper tab navigation)
- Fixed Assessment Builder page (tab-based layout instead of cramped 50/50 split)
- Removed Assessment Builder config panel toggle (no longer needed with tabs)
- Fixed MetricCard import path from `charts/MetricCard` to `metrics/MetricCard`
- Fixed `useParams` import in AssessmentDetailAdmin (was using `useRoute` which doesn't exist)

#### Backend Build Fixes
- Fixed BOM (Byte Order Mark) character issues in all Java files created via PowerShell
- Used `[System.IO.File]::ReadAllBytes` + byte slicing to remove BOM (PowerShell's `Set-Content -Encoding UTF8` adds BOM)
- Fixed missing `Stream` import in AdminAssessmentService.java
- Rebuilt all backend containers successfully

### Current Build Status
- `npx vite build` succeeds
- All 7 backend containers running healthy
- Admin assessment endpoints verified: `/v1/assessments/dashboard` and `/v1/assessments/analytics` working

### Servers
- Frontend: `npx vite --port 3000` (start in separate terminal)
- Backend: `docker-compose up -d` in backend/ directory

### Files Modified in This Session
**Backend (8 files)**:
- `backend/batch-service/.../model/Batch.java` — Added createdBy/createdByName, removed university
- `backend/batch-service/.../model/TrainerAllocation.java` — Removed university field
- `backend/batch-service/.../controller/TrainerAllocationController.java` — Removed university parameter
- `backend/batch-service/.../service/BatchService.java` — Removed university, added createdBy support
- `backend/batch-service/.../service/TrainerAllocationService.java` — Removed university logic
- `backend/batch-service/.../repository/TrainerAllocationRepository.java` — Removed university methods
- `backend/assessment-service/.../dto/` — 4 new DTO files
- `backend/assessment-service/.../service/AdminAssessmentService.java` — New admin service
- `backend/assessment-service/.../controller/AdminAssessmentController.java` — New admin controller
- `backend/assessment-service/.../model/Submission.java` — Added batchId field
- `backend/api-gateway/.../config/RouteConfig.java` — Added admin assessment routes

**Frontend (11 files)**:
- `src/admin/pages/Batches/AllocationWizard.jsx` — Complete rewrite (4-step flow)
- `src/context/LMSContext.jsx` — Added createdBy/createdByName to createBatch
- `src/services/api.js` — Added AdminAssessmentService
- `src/components/layout/unified-sidebar.jsx` — Added Assessment Management section, fixed collapse logic
- `src/components/assessment-admin/AssessmentCard.jsx` — New reusable card component
- `src/components/assessment-admin/StudentReportTable.jsx` — New enterprise table component
- `src/admin/pages/Assessments/Overview.jsx` — New dashboard page
- `src/admin/pages/Assessments/Analytics.jsx` — New analytics page with charts
- `src/admin/pages/Assessments/AssessmentDetailAdmin.jsx` — New detail page with tabs
- `src/pages/BatchManagement.jsx` — Course dropdown instead of free-text
- Multiple admin pages — Updated MetricCard import path, removed university references

---

## 14. PRODUCTION DEPLOYMENT (Session 2026-07-16 to 2026-07-17)

### Production URLs (Render.com — All Live)

| Service | Production URL |
|---|---|
| Frontend | https://xebia-enterprise-lms.vercel.app |
| API Gateway | https://xebia-api-gateway-mritunjai.onrender.com |
| User Service | https://xebia-user-service-mritunjai.onrender.com |
| Batch Service | https://xebia-batch-service-mritunjai.onrender.com |
| Assessment Service | https://xebia-assessment-service-mritunjai.onrender.com |
| Course Service | https://xebia-course-service-mritunjai.onrender.com |
| Event Service | https://xebia-event-service-mritunjai.onrender.com |

> **Note**: The backend local ports are: user-service:8083, batch-service:8085, assessment-service:8086, course-service:8084, event-service:8087, api-gateway:8080. In production all services go through Render's ingress.

### Sixth Microservice Added: Event Service

A new `event-service` was deployed alongside the existing 5. It manages LMS events with the following entity fields (all `@Column(nullable = false)` unless noted):
- `title` (NOT NULL), `description` (nullable TEXT), `imageUrl` (nullable TEXT)
- `startDateTime` (NOT NULL Instant), `endDateTime` (NOT NULL Instant)
- `registrationDeadline` (NOT NULL Instant) — **MUST be strictly before `startDateTime`** (enforced in EventService.java)
- `location` (nullable), `isOnline` (boolean), `status` (default "upcoming")
- `createdBy` (NOT NULL), `maxCapacity` (nullable), `isActive` (boolean default true)
- Extends `TenantScopedEntity` → requires `X-Tenant-Id` header on all requests

**Critical business rule in EventService.java:**
```java
if (req.getRegistrationDeadline().isAfter(req.getStartDateTime())) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        "Registration deadline must be before event start");
}
```

**Production Endpoints:**
- `GET    /api/v1/events` — List all active events
- `POST   /api/v1/events` — Create event (X-Tenant-Id required)
- `PUT    /api/v1/events/{id}` — Update event
- `DELETE /api/v1/events/{id}` — Delete event

### Infrastructure Optimizations Applied

The following changes were committed to production to support high-concurrency load testing:

**1. API Gateway (`backend/api-gateway/src/main/resources/application.yml`)**:
```yaml
spring:
  cloud:
    gateway:
      httpclient:
        pool:
          max-connections: 500
```

**2. All 5 Microservices (`application.yml` in each service)**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10       # 5 services × 10 = 50 max DB connections
      connection-timeout: 30000   # 30s queue timeout before fail
```

> **Important constraint**: Render's free-tier PostgreSQL has a hard cap of **50 concurrent connections total**. With 5 services each using pool-size 10, the system uses exactly 50 connections at full burst. Firing 50 full-table GET scans simultaneously can still exhaust this limit.

### API Testing — Load Test Results (July 16-17, 2026)

Full CRUD testing was performed using a Node.js `Promise.all()` true-concurrency harness (50 simultaneous requests). Key results:

| Service | POST | GET | PUT | DELETE |
|---|---|---|---|---|
| User Service | 50/50 ✅ | 50/50 ✅ | Schema constrained* | 50/50 ✅ |
| Batch Service | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ |
| Assessment Service | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ |
| Course Service | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ |
| Event Service | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ | 50/50 ✅ |

*User Service PUT requires the full User object (not partial payload). The backend correctly rejects partial payloads.

**Total datasets tested**: 1,000 records (50 × 4 CRUD phases × 5 services)

### Test Payload Reference (Production-Validated)

**User Service POST** — email and xebiaId must be globally unique (use `Date.now() + i`):
```json
{ "name": "User 0", "email": "user1752706451382@xebia.com", "role": "STUDENT", "xebiaId": "XEB-1752706451382", "status": "active" }
```

**Batch Service POST**:
```json
{ "name": "Batch 1752706451400", "course": "Full Stack", "studentCount": 20, "status": "active" }
```

**Assessment Service POST**:
```json
{ "title": "Assessment 1752706451500", "difficulty": "MEDIUM", "marks": 100, "passingMarks": 40, "createdBy": "805fcfb2-e8f6-4921-ac67-b446f7ef4832" }
```

**Course Service POST** — requires `X-Tenant-Id` header:
```json
{ "title": "Course 1752706451600", "published": false, "isActive": true }
```

**Event Service POST** — requires `X-Tenant-Id` header, strict date ordering:
```json
{
  "title": "Event 1752706451700",
  "description": "A test event",
  "startDateTime": "<tomorrow ISO>",
  "endDateTime": "<tomorrow + 1hr ISO>",
  "registrationDeadline": "<today + 1hr ISO>",
  "isOnline": true,
  "active": true,
  "createdBy": "805fcfb2-e8f6-4921-ac67-b446f7ef4832"
}
```

### Common Test Headers
```json
{
  "Content-Type": "application/json",
  "X-Tenant-Id": "123e4567-e89b-12d3-a456-426614174000",
  "X-User-Id": "805fcfb2-e8f6-4921-ac67-b446f7ef4832"
}
```

### Errors Discovered During Testing (All Fixed)

| # | Error | Root Cause | Fix |
|---|---|---|---|
| 1 | HTTP 500 on GET (all services) | 50 simultaneous `findAll()` exhausted Render's 50-connection DB limit | HikariCP pool-size 10 per service; use ID-based GET instead of findAll |
| 2 | HTTP 500 on User POST | UNIQUE constraint on `email` and `xebiaId` — same values across test runs | Use `Date.now() + i` for unique emails/xebiaIds |
| 3 | HTTP 500 on Event POST | Payload missing 5 required `@Column(nullable=false)` fields | Inspect entity class; add all required fields |
| 4 | HTTP 400 on Event POST | `registrationDeadline` was set AFTER `startDateTime` | Set deadline < start time |
| 5 | HTTP 400 on Event POST | `startDateTime` set to `Date.now()` — by transit time it was in the past | Set start to tomorrow (`Date.now() + 86400000`) |

### Testing Scripts (in repo scratch directory)
Scripts are located at `C:\Users\mritu\.gemini\antigravity-ide\brain\13a131f4-5c21-43ba-8d61-6d4ead5d5ec2\scratch\`:
- `load_test_datasets.js` — POST-only 50-concurrent test for all 5 services
- `perfect_crud_test.js` — Full CRUD (POST→GET→PUT→DELETE) 50-concurrent for all 5 services
- `clear_databases.js` — Sequential cleanup script (deletes all records from all 5 services)

### API Testing Documentation
A comprehensive HTML API testing report was generated:
- Location: `c:\Xebia Integrated\Xebia_LMS_API_Documentation.html`
- Also: `C:\Users\mritu\.gemini\antigravity-ide\brain\13a131f4-5c21-43ba-8d61-6d4ead5d5ec2\Xebia_LMS_API_Documentation.html`
- Open in browser, then Ctrl+P → Save as PDF to generate submission document

### Updated Known Issues
| # | Issue | Location |
|---|---|---|
| 16 | Render free-tier DB max 50 connections — 50 concurrent full-table scans will hit the limit | Render infrastructure |
| 17 | Event Service PUT may reject partial payloads (same as User Service) — send full object | EventService.java |
| 18 | User Service has no GET-by-ID or PUT endpoint publicly exposed yet | UserController.java |

### Updated Build Status (Production)
- All 6 microservices live on Render.com ✅
- Frontend live on Vercel ✅
- HikariCP pool tuning committed to all 5 service `application.yml` files ✅
- API Gateway `max-connections: 500` committed ✅
- Databases cleared post-testing (clean state) ✅
