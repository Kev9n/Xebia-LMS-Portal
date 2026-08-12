# Enterprise LMS Database Schema Plan

Each service owns a PostgreSQL schema. Local development uses one PostgreSQL instance with multiple schemas; production can move each schema to its own database without changing ownership boundaries.

## IAM Schema

- `users`: identity principal with email, password hash, tenant id, status, permission version.
- `roles`: dynamic role definitions, including `is_system`.
- `permissions`: fine-grained permission codes.
- `modules`: runtime configurable module visibility entries.
- `user_roles`: user-to-role assignments scoped by tenant and optional scope id.
- `role_permissions`: permissions granted to roles.
- `role_modules`: modules visible to roles.
- `permission_overrides`: user-specific allow/deny overrides.

Seed data:

- System Admin role.
- Baseline Manager, Trainer, Organiser, Student roles.
- Default permission codes for IAM, organisation, users, courses, batches, approvals, notifications, and reporting.
- Default module records aligned to the baseline LMS capabilities.

## Organisation Schema

- `universities`: tenant-scoped institutions with official contact details.
- `organisations`: tenant-scoped organisations/colleges.
- `trainer_assignments`: trainer-to-university/subject affiliation.

## User Management Schema

- `managed_users`: user provisioning records mirrored from IAM identity creation.
- `trainer_profiles`: trainer-specific profile and affiliation references.
- `student_profiles`: student-specific profile and university references.

## Course Schema

- `courses`: tenant-scoped course metadata.
- `course_modules`: ordered modules in a course.
- `sub_modules`: ordered submodules under a course module.
- `content_items`: ordered content items with content type and storage/media reference.
- `course_assignments`: course assignment to a batch or student.

## Batch And Enrolment Schema

- `batches`: tenant and university-scoped batches with schedule details.
- `enrolments`: student enrolments into batches and/or courses.

## Approval Schema

- `approval_policies`: runtime policy mapping role/action/resource to approval requirement.
- `approval_requests`: pending, approved, rejected, or executed governed actions with payload references.

## Notification Schema

- `notifications`: normalized notification requests keyed by source event id for idempotency.
- `delivery_attempts`: per-channel attempt records, retry counts, status, and provider response.

## Phase 2 Schemas

- `assessment`: assessments and submissions.
- `media`: media assets, HLS variants, signed URL grants, progress.
- `engagement`: comments, replies, trainer feedback.
- `document`: generated documents and template metadata.
- `audit_reporting`: immutable audit logs and report query projections.

## Common Columns

All tenant-owned business records include:

- `id UUID PRIMARY KEY`
- `tenant_id UUID NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `updated_at TIMESTAMPTZ`
- `created_by UUID`
- `updated_by UUID`

Soft-deletable records include:

- `status`
- `deleted_at`
- `deleted_by`
