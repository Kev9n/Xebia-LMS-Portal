# Enterprise LMS Backend Architecture Plan

## Goals

Build a backend-only, multi-tenant Enterprise LMS using Java 21 and Spring Boot 3.x. The architecture is service-oriented, stateless behind an API gateway, and designed so each business capability owns its data and can scale independently.

## Services

| Service | Responsibility | Database Ownership |
| --- | --- | --- |
| API Gateway | JWT validation, request routing, rate-limit hooks, common edge error handling | None |
| IAM Service | Authentication, JWT issuing, users, roles, permissions, modules, permission overrides, permission cache invalidation | `iam` schema |
| Organisation Service | Universities, organisations, official contacts, trainer-subject affiliations, tenant isolation | `organisation` schema |
| User Management Service | Provision users, trainers, students, role requests, activation/deactivation | `user_management` schema |
| Course Service | Courses, modules, submodules, content items, course assignments | `course` schema |
| Batch and Enrolment Service | Batches, schedules, student-to-batch enrolment, course enrolment | `batch_enrolment` schema |
| Approval Service | Approval-gated delete/deactivate workflows and role-action policies | `approval` schema |
| Notification Service | Event-driven email/WhatsApp/SMS delivery structure, retry, idempotency, delivery status | `notification` schema |
| Assessment Service | Assessment definitions, submissions, marks, results | `assessment` schema |
| Media Streaming Service | Video metadata, object references, HLS manifests, signed URLs, progress | `media` schema |
| Engagement Service | Comments, threaded replies, trainer responses, feedback routing | `engagement` schema |
| Document Service | JasperReports document generation metadata and notification attachments | `document` schema |
| Audit Reporting Service | Audit logs and reporting endpoints for sensitive actions and governance | `audit_reporting` schema |

## Runtime Architecture

- Clients call the API Gateway only.
- The gateway validates JWT signature and forwards `X-User-Id`, `X-Tenant-Id`, and `X-Roles` headers to trusted internal services.
- Services enforce method/request authorization using dynamic permissions, not static enum-only roles.
- IAM is the source of truth for roles, permissions, modules, and effective permission resolution.
- Redis stores effective permission cache entries and rate-limiting state.
- Kafka carries cross-service events such as user created, university created, role changed, approval requested, approval decided, notification requested, and audit events.
- PostgreSQL is shared for local development, but each service owns a separate schema and must not query another service's tables.
- Object storage is abstracted for S3/MinIO to support documents, media, and HLS assets.

## Security Model

- JWT contains subject, tenant id, and role names only.
- Permissions are resolved at request time from IAM data and cached in Redis.
- Role/permission/module changes publish invalidation events so effective permissions update within seconds.
- Tenant-scoped data includes `tenant_id`; repository queries and service checks prevent cross-tenant access.
- Built-in system roles are protected from deletion and lockout changes.
- Sensitive operations publish audit events.
- Secrets are read from environment variables and never hardcoded.

## Resilience And Operations

- All services expose actuator health endpoints.
- OpenAPI is enabled per service.
- Kafka consumers are expected to be idempotent by event id.
- Notification delivery has retry/backoff and dead-letter structure.
- Request-time inter-service calls should be limited and protected with timeout/retry/circuit-breaker settings.
- Docker Compose provides PostgreSQL, Redis, Kafka, MinIO, and service containers for local development.

## Implementation Phases

1. Phase 1: API Gateway, IAM, Organisation, User Management, Course, Batch and Enrolment, Approval, Notification.
2. Phase 2: Assessment, Media Streaming, Engagement, Document, Audit Reporting.
3. Hardening: observability, service discovery/config server, transactional outbox, complete S3/HLS/Jasper implementations, provider-specific notification adapters.
