# REST API Documentation

This document outlines the exposed REST endpoints for the Course Management System. All requests are routed through the API Gateway at `http://localhost:8080`.

**Note**: All endpoints require a valid JWT Bearer token in the `Authorization` header.

---

## 1. Categories

### Get All Categories
* **Method**: `GET`
* **URL**: `/api/categories`
* **Purpose**: Retrieves a list of all course categories.
* **Response Body**: Array of `Category` objects.

### Create Category
* **Method**: `POST`
* **URL**: `/api/categories`
* **Purpose**: Creates a new category.
* **Request Body**: `CategoryRequest` `{ "name": "String", "description": "String" }`
* **Response Body**: Created `Category` object.

### Update Category
* **Method**: `PUT`
* **URL**: `/api/categories/{categoryId}`
* **Purpose**: Updates an existing category.
* **Request Body**: `CategoryRequest`
* **Response Body**: Updated `Category` object.

### Delete Category
* **Method**: `DELETE`
* **URL**: `/api/categories/{categoryId}`
* **Purpose**: Deletes a category by UUID.

---

## 2. Courses

### Get All Courses
* **Method**: `GET`
* **URL**: `/api/courses`
* **Purpose**: Retrieves a list of all courses.
* **Response Body**: Array of `Course` objects.

### Get Course By ID
* **Method**: `GET`
* **URL**: `/api/courses/{courseId}`
* **Purpose**: Retrieves a specific course by UUID.
* **Response Body**: `Course` object.

### Get Course By Slug
* **Method**: `GET`
* **URL**: `/api/courses/slug/{slug}`
* **Purpose**: Retrieves a specific course by its URL slug.
* **Response Body**: `Course` object.

### Create Course
* **Method**: `POST`
* **URL**: `/api/courses`
* **Purpose**: Creates a new course.
* **Request Body**: `CourseRequest` containing all metadata, SEO, and categorization fields.
* **Response Body**: Created `Course` object.

### Update Course
* **Method**: `PUT`
* **URL**: `/api/courses/{courseId}`
* **Purpose**: Updates course details.
* **Request Body**: `CourseRequest`
* **Response Body**: Updated `Course` object.

### Delete Course
* **Method**: `DELETE`
* **URL**: `/api/courses/{courseId}`
* **Purpose**: Deletes a course and cascades deletion to all curriculum hierarchy items.

### Get Curriculum Hierarchy
* **Method**: `GET`
* **URL**: `/api/courses/{courseId}/hierarchy`
* **Purpose**: Retrieves the full, deeply nested JSON tree of the course curriculum (Modules -> Submodules -> Content Items).
* **Response Body**: `CourseHierarchyDTO`

---

## 3. Modules

### Create Module
* **Method**: `POST`
* **URL**: `/api/courses/{courseId}/modules`
* **Purpose**: Adds a high-level module to a course.
* **Request Body**: `ModuleRequest` `{ "title": "String", "position": Number }`
* **Response Body**: Created `CourseModule`.

### Update Module
* **Method**: `PUT`
* **URL**: `/api/courses/modules/{moduleId}`
* **Purpose**: Updates module title or position.
* **Request Body**: `ModuleRequest`
* **Response Body**: Updated `CourseModule`.

### Delete Module
* **Method**: `DELETE`
* **URL**: `/api/courses/modules/{moduleId}`
* **Purpose**: Deletes a module and its nested submodules/content.

---

## 4. Submodules

### Create Submodule
* **Method**: `POST`
* **URL**: `/api/courses/{courseId}/modules/{moduleId}/submodules`
* **Purpose**: Adds a nested submodule under a specific module.
* **Request Body**: `ModuleRequest` `{ "title": "String", "position": Number }`
* **Response Body**: Created `SubModule`.

### Update Submodule
* **Method**: `PUT`
* **URL**: `/api/courses/submodules/{subModuleId}`
* **Purpose**: Updates submodule title or position.
* **Request Body**: `ModuleRequest`
* **Response Body**: Updated `SubModule`.

### Delete Submodule
* **Method**: `DELETE`
* **URL**: `/api/courses/submodules/{subModuleId}`
* **Purpose**: Deletes a submodule and its nested content.

---

## 5. Content Items

### Create Content Item
* **Method**: `POST`
* **URL**: `/api/courses/{courseId}/content-items`
* **Purpose**: Adds a content asset to a module or submodule.
* **Request Body**: `ContentItemRequest` `{ "moduleId": "UUID", "subModuleId": "UUID", "title": "String", "type": "VIDEO|TEXT|LINK|PDF", "storageRef": "String", "position": Number }`
* **Response Body**: Created `ContentItem`.

### Update Content Item
* **Method**: `PUT`
* **URL**: `/api/courses/content-items/{contentId}`
* **Purpose**: Updates content item details.
* **Request Body**: `ContentItemRequest`
* **Response Body**: Updated `ContentItem`.

### Delete Content Item
* **Method**: `DELETE`
* **URL**: `/api/courses/content-items/{contentId}`
* **Purpose**: Removes a content item.
