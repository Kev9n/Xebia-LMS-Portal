# BRD Backend Coverage Checklist

Status values:

- DONE: implemented with a module, API surface, and supporting configuration/schema where applicable.
- PARTIAL: module or structure exists, but important BRD behavior remains incomplete.
- MISSING: not yet implemented.

| BRD requirement | Status | Current implementation | What needs to be fixed next |
| --- | --- | --- | --- |
| API Gateway using Spring Cloud Gateway | DONE | `api-gateway`, `RouteConfig`, `JwtGatewayFilter`, `api-gateway/pom.xml` | Add production rate-limit policy and centralized gateway error response body. |
| IAM login, JWT, dynamic roles, permissions, modules, user-role mapping, tenant-scoped access | DONE | `iam-service`, auth/role/permission/module/user-access controllers, Redis cache clear on access changes, `V1__iam_schema.sql`, `V2__iam_seed_reference_data.sql` | Add permission override APIs, Kafka cache-invalidation consumers, and stronger method-level permission checks. |
| Organisation/Tenant Service for universities, colleges, organisations, official contacts, tenant isolation | DONE | `organisation-service`, university/organisation/trainer-assignment controllers, official-contact endpoint, `V1__organisation_schema.sql` | Add update/delete APIs and richer tenant administration workflows. |
| User Management Service for Admin, Manager, Trainer, Organiser, Student provisioning | PARTIAL | `user-management-service`, explicit manager/trainer/organiser/student endpoints, activation/deactivation, Kafka user event publisher | Integrate IAM identity creation directly and add compensation logic. |
| Course Service for courses, modules, submodules, notes, PDF, PPT, comparison tables, video references | DONE | `course-service`, course/module/submodule/content/assignment APIs, `ContentType`, `V1__course_schema.sql` | Add reorder APIs, object-storage metadata validation, and assignment authorization. |
| Batch and Enrolment Service for batches, schedules, student enrolment | DONE | `batch-enrolment-service`, batch and enrolment APIs, schedule fields, `V1__batch_enrolment_schema.sql` | Add batch student list APIs and university validation. |
| Assessment Service for theoretical, practical, theory-based assessments, submissions, marks | PARTIAL | `assessment-service`, assessment API placeholder, assessment/submission schema added in this pass | Add full JPA repositories, CRUD APIs, submission upload/evaluation, and result visibility rules. |
| Engagement Service for comments, threaded replies, trainer feedback | PARTIAL | `engagement-service` API placeholder | Add persistent comment/reply/feedback entities, migrations, Kafka notifications, and manager routing. |
| Approval Service for approval-gated deletes and configurable approval policy | PARTIAL | `approval-service`, `ApprovalRequestEntity`, `ApprovalPolicy`, pending request APIs, approve -> `EXECUTED`, reject -> `REJECTED` | Add owning-service execution callbacks, restore behavior, and policy evaluation helper APIs. |
| Notification Service for Email, WhatsApp, SMS adapter structure, retries, delivery tracking | PARTIAL | `notification-service`, adapters, Kafka listener for `lms.notification.requested`, notification and delivery attempt tables, retry backoff metadata | Add DLQ publishing, scheduled retry worker, and provider implementations. |
| Media/Streaming Service for video metadata, HLS structure, signed URLs, progress tracking | PARTIAL | `media-streaming-service` signed URL placeholder API | Add media database schema, S3/MinIO integration, HLS manifest/segment metadata, and progress persistence. |
| Document/JasperReports support for PDF/XLSX/DOCX generation | PARTIAL | `document-service`, JasperReports dependency, generation placeholder API | Add templates, storage metadata, actual Jasper export implementations, and notification attachments. |
| Audit/Reporting support for sensitive actions and activity reports | PARTIAL | `audit-reporting-service` placeholder APIs, audit log schema added in this pass | Add Kafka audit consumer, immutable audit persistence, report filters, and governance dashboards. |
| PostgreSQL database per service | PARTIAL | PostgreSQL schemas for phase-one services plus assessment and audit schemas | Add persistent schemas for media, engagement, and document in the next phase. |
| Redis cache | PARTIAL | Redis in Compose, IAM effective permission cache, clear-on-change invalidation | Add Kafka-driven cache invalidation consumers and use Redis for gateway rate limiting. |
| Kafka events | PARTIAL | Kafka in Compose using `apache/kafka:3.7.0`; event publishers in IAM, organisation, users, course, batch, approval; notification consumer | Add DLQs, retry topics, additional consumers, and transactional outbox. |
| Docker Compose local setup | DONE | `docker-compose.yml` starts PostgreSQL, Redis, Kafka, MinIO, gateway, and all backend services; PostgreSQL/Redis healthchecks are configured | Add application-level healthchecks and stricter service readiness gating. |
| Swagger/OpenAPI for each service | DONE | Springdoc dependencies in each service module | Aggregate OpenAPI through gateway if desired. |
| Backend-only architecture | DONE | `backend` contains only Java/Spring Boot backend modules; `frontend` is empty | No frontend work needed in this phase. |
