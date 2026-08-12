# System Architecture

This document outlines the architecture for the simplified Course Management System (CMS).

---

## 1. Backend Architecture

The backend consists of Spring Boot microservices orchestrating behind an API Gateway.

### Remaining Microservices
* **`api-gateway`**: Spring Cloud Gateway. Serves as the single entry point, handles rate limiting, session management, and routes requests to the course-service.
* **`course-service`**: Core business logic service handling all CMS operations.
* **`common-lib`**: Shared library containing security filters, tenant extraction logic, and common utilities.

### Controllers
* `CategoryController`: Handles REST requests for Category CRUD.
* `CourseController`: Handles REST requests for Course CRUD, Modules, Submodules, Content Items, and retrieving the full curriculum hierarchy.

### Services
* `CategoryService`: Contains business rules and transaction boundaries for managing categories.
* `CourseService`: Contains business rules for courses and the entire curriculum builder structure. Ensures tenant isolation and ownership before mutating data.

### Repositories
Spring Data JPA Repositories that interface directly with PostgreSQL:
* `CategoryRepository`
* `CourseRepository`
* `CourseModuleRepository`
* `SubModuleRepository`
* `ContentItemRepository`

### Entities
* `Category`: Represents a high-level course categorization.
* `Course`: Represents a specific learning course, associated with a Category.
* `CourseModule`: A high-level section within a Course.
* `SubModule`: A nested section within a CourseModule.
* `ContentItem`: An actual piece of content (Video, Text, Link, Document) belonging to either a Module or a Submodule.

### DTOs
* Request DTOs: `CategoryRequest`, `CourseRequest`, `ModuleRequest`, `ContentItemRequest` (Used for incoming mutations).
* Response DTOs: `CourseHierarchyDTO`, `ModuleHierarchyDTO`, `SubModuleHierarchyDTO`, `ContentItemDTO` (Used for structuring the complex curriculum JSON).

---

## 2. Frontend Architecture

The frontend is a React application built with Vite and TailwindCSS.

### Routing Hierarchy
```text
/                      -> Redirects to /categories
/categories            -> Category listing and management
/courses               -> Course listing and management
/courses/:slug         -> Detailed view of a single course
/courses/:id/builder   -> Interactive Curriculum Builder
```

### Components
* **Layouts**: 
  * `AdminLayout`: Main layout wrapper containing the Sidebar and top navigation.
* **Shared Components**: 
  * `Sidebar`: Filtered strictly down to "Categories" and "Courses" links.

### API Layer
* **`services/api.js`**: Contains a centralized wrapper (`fetchApi`) for handling JWT authorization headers, JSON parsing, and error interception. Exposes specific service objects:
  * `CategoryService`: API bindings for category endpoints.
  * `CourseService`: API bindings for all course and curriculum endpoints.

### State Management
* Uses **Zustand** (or equivalent lightweight store if applicable) combined with React Context and standard Hooks (`useState`, `useEffect`) for managing local UI state (e.g., modals, form data, drag-and-drop hierarchy).

---

## 3. Database Architecture

The PostgreSQL database is organized relationally using Foreign Keys with `ON DELETE CASCADE` behaviors.

### Hierarchy & Relationships
```text
Category (1:N) Course
Course (1:N) CourseModule
CourseModule (1:N) SubModule
CourseModule (1:N) ContentItem
SubModule (1:N) ContentItem
```

### Cascade Behaviour
- Deleting a Category **fails** if courses are still attached (or orphans them, depending on strict JPA config).
- Deleting a Course **cascades** down, deleting all Modules, Submodules, and ContentItems recursively.
- Deleting a Module **cascades** down, deleting its Submodules and ContentItems.
- Deleting a Submodule **cascades** down, deleting its ContentItems.

---

## 4. Docker Architecture

The infrastructure relies on Docker Compose.

### Startup Order & Dependencies
1. **`postgres`** (Port 5432): Starts first. Monitored by a `pg_isready` healthcheck.
2. **`redis`** (Port 6379): Starts alongside Postgres. Monitored by a `redis-cli ping` healthcheck.
3. **`course-service`** (Port 8084): Depends on `postgres` being healthy.
4. **`api-gateway`** (Port 8080): Depends on `redis` being healthy.

---

## 5. Remaining Technical Debt

The application has been radically simplified, but some areas for future improvement remain:
* **Validation**: Input validation in the frontend forms could be stricter (e.g., restricting file types or max lengths).
* **Logging**: Backend logging is currently basic console output. Slf4j could be wired to a centralized aggregator.
* **Security**: The backend assumes a static JWT admin token for requests. A real OAuth2/OIDC integration should be implemented for production.
* **Performance**: The `getCourseHierarchy` endpoint currently fetches the tree in multiple database queries. This could be optimized using a single JOIN query or caching via Redis.
* **Testing**: While E2E manual testing passes, the repository lacks automated JUnit test suites or Cypress frontend tests.
* **Code Organization**: `CourseService.java` is becoming slightly bloated as it handles Courses, Modules, Submodules, and Content. Splitting it into `CurriculumService` and `CourseService` would improve cohesion.
