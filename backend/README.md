# Enterprise LMS Backend

Backend-only Java 21 Spring Boot microservice system for the Enterprise LMS BRD.

No frontend code is required in this phase.

## Backend Working Directory

Run every backend command from:

```powershell
cd "D:\projects\LMS (Xebia)\backend"
```

## What Is Included

- Spring Cloud Gateway API gateway.
- IAM service with JWT login, roles, permissions, modules, user-role assignment, Redis-backed permission cache hook, and local seed data.
- Organisation, User Management, Course, Batch/Enrolment, Approval, and Notification phase-one services.
- Assessment and Audit/Reporting persistence foundations.
- Media, Engagement, and Document service modules with backend API placeholders for phase-two hardening.
- PostgreSQL, Redis, Kafka, and MinIO local infrastructure through Docker Compose.
- Swagger/OpenAPI per service.

## Repository Layout

```text
.
|-- api-gateway
|-- common-lib
|-- iam-service
|-- organisation-service
|-- user-management-service
|-- course-service
|-- batch-enrolment-service
|-- approval-service
|-- notification-service
|-- assessment-service
|-- media-streaming-service
|-- engagement-service
|-- document-service
|-- audit-reporting-service
|-- docs
`-- examples
```

## Prerequisites

- Java 21 JDK
- Maven 3.9+
- Docker Desktop with Docker Compose v2

Check installed tools:

```powershell
java -version
mvn -version
docker version
docker compose version
```

Expected minimum versions:

- `java -version` must report major version `21`.
- `mvn -version` must report Maven `3.9` or newer and use Java 21.
- `docker --version` and `docker compose version` must both resolve from the current PowerShell session.

If Java still resolves to an older Oracle javapath shim, update `JAVA_HOME` and put `%JAVA_HOME%\bin` before `C:\Program Files\Common Files\Oracle\Java\javapath` in `PATH`, then open a new PowerShell session.

## Local Environment

Create `.env` from the example:

```powershell
cd "D:\projects\LMS (Xebia)\backend"
Copy-Item .env.example .env
```

For local development only, `.env.example` uses:

```text
JWT_SECRET=replace-with-at-least-32-characters
ADMIN_PASSWORD=AdminChangeMe123!
```

Use a stronger secret before shared testing.

## Database Setup

Docker Compose starts PostgreSQL 16 with:

```text
Database: lms
Username: lms
Password: lms
Port: 5432
```

Flyway migrations run from each service at startup. Services use separate PostgreSQL schemas:

- `iam`
- `organisation`
- `user_management`
- `course`
- `batch_enrolment`
- `approval`
- `notification`
- `assessment`
- `audit_reporting`

Maven is configured through `.mvn/maven.config` to use `backend/.m2/repository` as the local repository, keeping dependency downloads inside the backend workspace.

## Seed Data

Local development seed data includes:

- Tenant id: `11111111-1111-1111-1111-111111111111`
- Admin user: `admin@lms.local`
- Admin password: `AdminChangeMe123!` unless `ADMIN_PASSWORD` is changed
- Roles: Admin, Manager, Trainer, Organiser, Student
- Default permissions and modules
- Role-permission mappings
- Role-module mappings
- Sample university: `Xebia University`
- Sample course: `Enterprise Java Microservices`
- Sample batch: `Enterprise Java June Batch`

The Admin user is created by `iam-service` runtime seed code so the password can come from configuration. Static roles, permissions, modules, mappings, and sample business data are provided through Flyway migrations.

## Build And Validation Commands

```powershell
cd "D:\projects\LMS (Xebia)\backend"
mvn clean validate
mvn clean compile
mvn test
mvn clean package -DskipTests
```

## Docker Commands

```powershell
cd "D:\projects\LMS (Xebia)\backend"
docker compose config
docker compose up --build -d
docker compose ps
```

Stop services:

```powershell
cd "D:\projects\LMS (Xebia)\backend"
docker compose down
```

## Service Ports

| Service | Port |
| --- | --- |
| API Gateway | 8080 |
| IAM | 8081 |
| Organisation | 8082 |
| User Management | 8083 |
| Course | 8084 |
| Batch and Enrolment | 8085 |
| Approval | 8086 |
| Notification | 8087 |
| Assessment | 8088 |
| Media Streaming | 8089 |
| Engagement | 8090 |
| Document | 8091 |
| Audit Reporting | 8092 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092 |
| MinIO API | 9000 |
| MinIO Console | 9001 |

## Swagger URLs

- Gateway: `http://localhost:8080`
- IAM: `http://localhost:8081/swagger-ui.html`
- Organisation: `http://localhost:8082/swagger-ui.html`
- User Management: `http://localhost:8083/swagger-ui.html`
- Course: `http://localhost:8084/swagger-ui.html`
- Batch and Enrolment: `http://localhost:8085/swagger-ui.html`
- Approval: `http://localhost:8086/swagger-ui.html`
- Notification: `http://localhost:8087/swagger-ui.html`
- Assessment: `http://localhost:8088/swagger-ui.html`
- Media Streaming: `http://localhost:8089/swagger-ui.html`
- Engagement: `http://localhost:8090/swagger-ui.html`
- Document: `http://localhost:8091/swagger-ui.html`
- Audit Reporting: `http://localhost:8092/swagger-ui.html`

## API Smoke Test

After the services are running:

```powershell
cd "D:\projects\LMS (Xebia)\backend"
Set-ExecutionPolicy -Scope Process Bypass
.\examples\api-smoke-tests.ps1
```

The smoke script retries login while the gateway and IAM service finish startup.

The smoke script covers:

- Login
- Create role
- Create permission
- Assign permission to role
- Assign module to role
- List effective permissions
- List visible modules
- Create university
- Update university official contact
- Create trainer
- Create course
- Create module and submodule
- Add note, PDF, PPT, comparison table, and video reference content items
- Create batch
- Enrol student placeholder into batch/course
- Assign course to batch
- Create approval request
- Approve approval request
- Create notification request

## Phase 1 API Coverage

The following Phase 1 flows are implemented as backend APIs:

- IAM: login, create role, create permission, assign permission to role, assign module to role, assign role to user with tenant scope, list effective permissions, list visible modules, Admin role delete protection, Redis permission cache with clear-on-change invalidation.
- Organisation: create/list universities, update official contact, create/list organisations, create/list trainer-subject-university assignments, tenant-scoped reads.
- User Management: create Manager, Trainer, Organiser, Student, activate/deactivate user, publish user-created Kafka event.
- Course: create course, create module, create submodule, add note/PDF/PPT/comparison table/video-reference content, assign course to batch or student.
- Batch and Enrolment: create batch with schedule, enrol student into batch and/or course.
- Approval: create pending approval request, approve to executed, reject to rejected, create/list approval policies.
- Notification: create notification record, dispatch through adapter, create delivery attempt, retry with backoff metadata, consume `lms.notification.requested`.

## Planning And Coverage Documents

- `docs/architecture-plan.md`
- `docs/database-schema-plan.md`
- `docs/service-communication-plan.md`
- `docs/api-list.md`
- `docs/brd-backend-coverage-checklist.md`

## Notes

- This is backend-only. Do not add frontend code for this phase.
- Services own their schemas and must not query another service's tables.
- Kafka events use the shared `LmsEvent` envelope from `common-lib`.
- Local Kafka runs with the official `apache/kafka:3.7.0` image in single-node KRaft mode.
- Notification provider adapters, HLS processing, JasperReports templates, audit consumers, and full assessment workflows are still phase-two implementation work.
