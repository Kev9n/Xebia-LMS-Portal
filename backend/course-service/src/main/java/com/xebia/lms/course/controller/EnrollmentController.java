package com.xebia.lms.course.controller;

import com.xebia.lms.course.dto.EnrollmentStatusResponse;
import com.xebia.lms.course.entity.Course;
import com.xebia.lms.course.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * ENROLLMENT IDENTITY STRATEGY:
 * The X-User-Id header is a temporary development mechanism.
 * Authentication is intentionally NOT implemented in the Course Service.
 * The future API Gateway/IAM service will validate JWTs and populate this header.
 * No backend refactoring will be required when IAM is integrated.
 */
@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/{courseId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void enroll(
            @PathVariable("courseId") UUID courseId,
            @RequestHeader(value = "X-User-Id") String studentId) {
        enrollmentService.enrollStudent(courseId, studentId);
    }

    @DeleteMapping("/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unenroll(
            @PathVariable("courseId") UUID courseId,
            @RequestHeader(value = "X-User-Id") String studentId) {
        enrollmentService.unenrollStudent(courseId, studentId);
    }

    @GetMapping("/{courseId}/status")
    public EnrollmentStatusResponse getStatus(
            @PathVariable("courseId") UUID courseId,
            @RequestHeader(value = "X-User-Id") String studentId) {
        boolean isEnrolled = enrollmentService.isEnrolled(courseId, studentId);
        return new EnrollmentStatusResponse(isEnrolled);
    }

    @GetMapping("/my-courses")
    public List<Course> getMyCourses(
            @RequestHeader(value = "X-User-Id") String studentId) {
        return enrollmentService.getMyEnrolledCourses(studentId);
    }
}
