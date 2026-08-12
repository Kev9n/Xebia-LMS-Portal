# Enterprise LMS Service Communication Plan

## Synchronous REST

Use REST only for request-time queries or commands where the caller needs an immediate response.

| Caller | Target | Purpose |
| --- | --- | --- |
| Client | API Gateway | All external API access |
| API Gateway | Services | Route validated requests |
| Services | IAM | Optional effective permission checks and identity lookups |
| User Management | IAM | Provision identity and assign initial roles |
| Course | Batch and Enrolment | Validate assignment target when needed |
| Approval | Owning services | Execute approved action command |

## Asynchronous Kafka Topics

| Topic | Producer | Consumers | Purpose |
| --- | --- | --- | --- |
| `lms.user.created` | User Management, IAM | Notification, Audit | User provisioning notification and audit |
| `lms.role.changed` | IAM | IAM cache invalidator, Audit | Invalidate effective permission cache |
| `lms.permission.changed` | IAM | IAM cache invalidator, Audit | Invalidate effective permission cache |
| `lms.university.created` | Organisation | Document, Notification, Audit | Generate onboarding documents and notify official contact |
| `lms.course.assigned` | Course | Notification, Audit | Inform learner or batch about assigned course |
| `lms.enrolment.created` | Batch and Enrolment | Notification, Audit | Inform student about enrolment |
| `lms.approval.requested` | Approval | Notification, Audit | Notify approvers |
| `lms.approval.decided` | Approval | Owning service, Notification, Audit | Execute or discard governed action |
| `lms.notification.requested` | Any service | Notification | Delivery request |
| `lms.audit.recorded` | Any service | Audit Reporting | Sensitive action trail |

## Event Contract Guidelines

- Every event includes `eventId`, `eventType`, `occurredAt`, `tenantId`, `actorUserId`, `sourceService`, and `payload`.
- Consumers deduplicate by `eventId`.
- Events must carry enough data for the consumer or a stable resource reference for enrichment.
- Commands that need exactly-once side effects should use transactional outbox in a hardening phase.

## Failure Handling

- Kafka consumers retry transient failures with backoff.
- Poison messages go to dead-letter topics.
- Notification delivery has per-channel retry state and provider response tracking.
- Cross-service workflows use saga compensation instead of distributed transactions.
