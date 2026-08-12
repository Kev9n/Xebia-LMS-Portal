package com.xebia.lms.course.controller;

import com.xebia.lms.course.dto.ProgressSummaryResponse;
import com.xebia.lms.course.dto.UpdateAccessRequest;
import com.xebia.lms.course.service.ProgressTrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressTrackingService progressService;

    public ProgressController(ProgressTrackingService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/course/{courseId}/submodule/{submoduleId}/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markSubmoduleComplete(
            @PathVariable("courseId") UUID courseId,
            @PathVariable("submoduleId") UUID submoduleId,
            @RequestHeader(value = "X-User-Id") String studentId) {
        progressService.markSubmoduleComplete(courseId, submoduleId, studentId);
    }

    @PostMapping("/course/{courseId}/access")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateAccess(
            @PathVariable("courseId") UUID courseId,
            @RequestBody UpdateAccessRequest request,
            @RequestHeader(value = "X-User-Id") String studentId) {
        progressService.updateLastAccessed(courseId, request.getSubmoduleId(), request.getContentId(), studentId);
    }

    @GetMapping("/course/{courseId}")
    public ProgressSummaryResponse getCourseProgress(
            @PathVariable("courseId") UUID courseId,
            @RequestHeader(value = "X-User-Id") String studentId) {
        return progressService.getCourseProgress(courseId, studentId);
    }
}
