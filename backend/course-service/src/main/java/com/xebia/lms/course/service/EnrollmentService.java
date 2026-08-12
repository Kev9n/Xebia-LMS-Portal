package com.xebia.lms.course.service;

import com.xebia.lms.common.security.TenantContext;
import com.xebia.lms.course.entity.Course;
import com.xebia.lms.course.entity.Enrollment;
import com.xebia.lms.course.repository.CourseRepository;
import com.xebia.lms.course.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public void enrollStudent(UUID courseId, String studentId) {
        UUID tenantId = TenantContext.tenantId();
        if (enrollmentRepository.existsByTenantIdAndCourse_IdAndStudentId(tenantId, courseId, studentId)) {
            return; // Already enrolled
        }
        
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found"));
            
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setStudentId(studentId);
        enrollment.setTenantId(tenantId);
        
        enrollmentRepository.save(enrollment);
    }

    @Transactional
    public void unenrollStudent(UUID courseId, String studentId) {
        UUID tenantId = TenantContext.tenantId();
        Optional<Enrollment> enrollment = enrollmentRepository.findByTenantIdAndCourse_IdAndStudentId(tenantId, courseId, studentId);
        enrollment.ifPresent(enrollmentRepository::delete);
    }

    @Transactional(readOnly = true)
    public boolean isEnrolled(UUID courseId, String studentId) {
        UUID tenantId = TenantContext.tenantId();
        return enrollmentRepository.existsByTenantIdAndCourse_IdAndStudentId(tenantId, courseId, studentId);
    }

    @Transactional(readOnly = true)
    public List<Course> getMyEnrolledCourses(String studentId) {
        UUID tenantId = TenantContext.tenantId();
        List<Enrollment> enrollments = enrollmentRepository.findByTenantIdAndStudentId(tenantId, studentId);
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());
    }
}
