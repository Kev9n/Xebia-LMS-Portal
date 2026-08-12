# Goal Description

Simplify the Enterprise LMS Backend to exclusively act as a Course Management System, removing all unrelated microservices, frontend features, configuration, and infrastructure.

## Proposed Changes

### 1. Backend Microservices Removal
The following Spring Boot services will be completely deleted from the `backend/` directory:
- `iam-service`
- `organisation-service`
- `user-management-service`
- `batch-enrolment-service`
- `approval-service`
- `notification-service`
- `assessment-service`
- `media-streaming-service`
- `engagement-service`
- `document-service`
- `audit-reporting-service`

### 2. Root Maven Configuration (`backend/pom.xml`)
- Remove the deleted services from the `<modules>` list.

### 3. API Gateway Configuration (`backend/api-gateway/src/main/java/com/xebia/lms/gateway/config/RouteConfig.java`)
- Remove routing configuration for all deleted services.
- Retain only `course-service` and `category-service` routes.

### 4. Docker Infrastructure (`backend/docker-compose.yml`)
- Remove containers for deleted services.
- Remove `minio` (Only used by deleted media/document services).
- Remove `kafka` (We will delete the `CourseAssignment` feature from `course-service`, removing the need for Kafka).
- Retain `postgres`, `redis` (required by API gateway), `api-gateway`, and `course-service`.

### 5. Course Service Cleanup (`backend/course-service/`)
- **Remove Feature**: `CourseAssignment`
  - Delete `CourseAssignment.java`
  - Delete `CourseAssignmentRepository.java`
  - Delete `CourseAssignmentRequest.java`
  - Delete `CourseEventPublisher.java`
- **Modify**: `CourseService.java` & `CourseController.java` to remove the `assign` methods.
- **Modify**: `application.yml` and `pom.xml` to remove `spring-kafka` dependencies.

### 6. Frontend Cleanup (`src/services/api.js` and other files)
- Delete unused methods in `api.js` (e.g. `BatchService`, `AuthService`).
- Although the UI was already trimmed in Phase 1, we will remove any lingering imports/files for unused domains if encountered.

## Verification Plan
### Automated Tests
1. Stop all current Docker containers (`docker compose down -v`).
2. Run `mvn clean package` on the root `backend/pom.xml` to verify the streamlined system builds.
3. Build new docker images (`docker compose build`) and start the simplified system (`docker compose up -d`).
4. Execute `node test_api.js` to run the comprehensive CRUD tests ensuring Category, Course, Module, Submodule, and Content remain perfectly functional without the other microservices.
5. Compile frontend `npm run build` to verify no dangling UI references.
