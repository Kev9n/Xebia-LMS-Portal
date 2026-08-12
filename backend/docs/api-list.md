# Enterprise LMS API List

All routes are exposed through the API Gateway under `/api/**`. Service-local OpenAPI docs are available under `/v3/api-docs` and `/swagger-ui.html`.

## IAM Service

- `POST /api/iam/auth/login`
- `POST /api/iam/auth/refresh`
- `GET /api/iam/me`
- `GET /api/iam/me/permissions`
- `POST /api/iam/roles`
- `GET /api/iam/roles`
- `PUT /api/iam/roles/{roleId}`
- `DELETE /api/iam/roles/{roleId}`
- `POST /api/iam/roles/{roleId}/permissions`
- `POST /api/iam/roles/{roleId}/modules`
- `POST /api/iam/users/{userId}/roles`
- `POST /api/iam/users/{userId}/permission-overrides`

## Organisation Service

- `POST /api/organisations/universities`
- `GET /api/organisations/universities`
- `GET /api/organisations/universities/{universityId}`
- `PATCH /api/organisations/universities/{universityId}`
- `POST /api/organisations`
- `GET /api/organisations`
- `POST /api/organisations/trainer-assignments`
- `GET /api/organisations/trainer-assignments`

## User Management Service

- `POST /api/users`
- `POST /api/users/trainers`
- `POST /api/users/students`
- `PATCH /api/users/{userId}/activate`
- `PATCH /api/users/{userId}/deactivate`
- `POST /api/users/{userId}/roles`

## Course Service

- `POST /api/courses`
- `GET /api/courses`
- `GET /api/courses/{courseId}`
- `POST /api/courses/{courseId}/modules`
- `POST /api/courses/{courseId}/modules/{moduleId}/submodules`
- `POST /api/courses/{courseId}/content-items`
- `POST /api/courses/{courseId}/assignments`

## Batch And Enrolment Service

- `POST /api/batches`
- `GET /api/batches`
- `GET /api/batches/{batchId}`
- `POST /api/batches/{batchId}/students`
- `POST /api/enrolments`
- `GET /api/enrolments`

## Approval Service

- `POST /api/approvals/requests`
- `GET /api/approvals/requests`
- `POST /api/approvals/requests/{requestId}/approve`
- `POST /api/approvals/requests/{requestId}/reject`
- `POST /api/approvals/policies`
- `GET /api/approvals/policies`

## Notification Service

- `POST /api/notifications`
- `GET /api/notifications`
- `GET /api/notifications/{notificationId}`
- `POST /api/notifications/{notificationId}/retry`

## Phase 2 Services

- Assessment: `/api/assessments`, `/api/submissions`, `/api/results`
- Media: `/api/media/videos`, `/api/media/videos/{id}/signed-url`, `/api/media/progress`
- Engagement: `/api/engagement/comments`, `/api/engagement/feedback`
- Document: `/api/documents/generate`, `/api/documents/{id}/signed-url`
- Audit Reporting: `/api/audit-logs`, `/api/reports/activity`, `/api/reports/governance`
