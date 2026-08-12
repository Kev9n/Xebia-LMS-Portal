package com.xebia.lms.course.service;

import com.xebia.lms.common.security.TenantContext;
import com.xebia.lms.course.dto.CourseHierarchyDto;
import com.xebia.lms.course.dto.ProgressSummaryResponse;
import com.xebia.lms.course.entity.ContentItem;
import com.xebia.lms.course.entity.ContentProgress;
import com.xebia.lms.course.entity.CourseProgress;
import com.xebia.lms.course.repository.ContentProgressRepository;
import com.xebia.lms.course.repository.CourseProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgressTrackingService {

    private final CourseProgressRepository courseProgressRepository;
    private final ContentProgressRepository contentProgressRepository;
    private final CourseService courseService;

    public ProgressTrackingService(CourseProgressRepository courseProgressRepository, 
                                   ContentProgressRepository contentProgressRepository,
                                   CourseService courseService) {
        this.courseProgressRepository = courseProgressRepository;
        this.contentProgressRepository = contentProgressRepository;
        this.courseService = courseService;
    }

    @Transactional
    public void markContentComplete(UUID courseId, UUID moduleId, UUID submoduleId, UUID contentId, String studentId) {
        UUID tenantId = TenantContext.tenantId();
        ContentProgress progress = contentProgressRepository
            .findByTenantIdAndStudentIdAndContentId(tenantId, studentId, contentId)
            .orElseGet(() -> {
                ContentProgress p = new ContentProgress();
                p.setTenantId(tenantId);
                p.setStudentId(studentId);
                p.setCourseId(courseId);
                p.setModuleId(moduleId);
                p.setSubmoduleId(submoduleId);
                p.setContentId(contentId);
                return p;
            });
            
        progress.setCompleted(true);
        contentProgressRepository.save(progress);
        
        updateLastAccessed(courseId, submoduleId, contentId, studentId);
    }

    @Transactional
    public void markSubmoduleComplete(UUID courseId, UUID submoduleId, String studentId) {
        // Find all content items for this submodule from CourseService hierarchy
        CourseHierarchyDto hierarchy = courseService.getHierarchy(courseId);
        
        List<ContentItem> itemsToComplete = new ArrayList<>();
        UUID moduleId = null;
        
        for (CourseHierarchyDto.ModuleDto mod : hierarchy.modules()) {
            for (CourseHierarchyDto.SubModuleDto sub : mod.submodules()) {
                if (sub.submodule().getId().equals(submoduleId)) {
                    moduleId = mod.module().getId();
                    itemsToComplete.addAll(sub.contentBlocks());
                    break;
                }
            }
        }
        
        if (moduleId != null) {
            for (ContentItem item : itemsToComplete) {
                markContentComplete(courseId, moduleId, submoduleId, item.getId(), studentId);
            }
        }
    }

    @Transactional
    public void updateLastAccessed(UUID courseId, UUID submoduleId, UUID contentId, String studentId) {
        UUID tenantId = TenantContext.tenantId();

        // Verify course exists before creating progress record
        if (!courseService.courseExists(courseId)) {
            throw new IllegalArgumentException("Course not found: " + courseId);
        }

        CourseProgress cp = courseProgressRepository
            .findByTenantIdAndStudentIdAndCourseId(tenantId, studentId, courseId)
            .orElseGet(() -> {
                CourseProgress p = new CourseProgress();
                p.setTenantId(tenantId);
                p.setStudentId(studentId);
                p.setCourseId(courseId);
                return p;
            });
            
        cp.setLastAccessedSubmoduleId(submoduleId);
        cp.setLastAccessedContentId(contentId);
        cp.setLastAccessedAt(LocalDateTime.now());
        
        courseProgressRepository.save(cp);
    }

    @Transactional(readOnly = true)
    public ProgressSummaryResponse getCourseProgress(UUID courseId, String studentId) {
        UUID tenantId = TenantContext.tenantId();
        
        List<ContentProgress> contentProgressList = contentProgressRepository.findByTenantIdAndStudentIdAndCourseId(tenantId, studentId, courseId);
        List<UUID> completedContentIds = contentProgressList.stream()
            .filter(ContentProgress::isCompleted)
            .map(ContentProgress::getContentId)
            .collect(Collectors.toList());
            
        CourseHierarchyDto hierarchy = courseService.getHierarchy(courseId);
        
        int totalSubmodules = 0;
        int completedSubmodules = 0;
        List<UUID> completedSubmoduleIds = new ArrayList<>();
        
        for (CourseHierarchyDto.ModuleDto mod : hierarchy.modules()) {
            for (CourseHierarchyDto.SubModuleDto sub : mod.submodules()) {
                totalSubmodules++;
                
                List<ContentItem> contents = sub.contentBlocks();
                if (contents == null || contents.isEmpty()) {
                    continue; // Skip empty lessons or treat as incomplete
                }
                
                boolean allCompleted = true;
                for (ContentItem item : contents) {
                    if (!completedContentIds.contains(item.getId())) {
                        allCompleted = false;
                        break;
                    }
                }
                
                if (allCompleted) {
                    completedSubmodules++;
                    completedSubmoduleIds.add(sub.submodule().getId());
                }
            }
        }
        
        int progressPercentage = totalSubmodules == 0 ? 0 : (int) Math.round((completedSubmodules / (double) totalSubmodules) * 100);
        
        ProgressSummaryResponse response = new ProgressSummaryResponse();
        response.setCompletedLessons(completedSubmodules);
        response.setTotalLessons(totalSubmodules);
        response.setProgressPercentage(progressPercentage);
        response.setCompletedContentIds(completedContentIds);
        response.setCompletedSubmoduleIds(completedSubmoduleIds);
        
        Optional<CourseProgress> cp = courseProgressRepository.findByTenantIdAndStudentIdAndCourseId(tenantId, studentId, courseId);
        if (cp.isPresent()) {
            response.setLastAccessedSubmoduleId(cp.get().getLastAccessedSubmoduleId());
            response.setLastAccessedContentId(cp.get().getLastAccessedContentId());
        }
        
        return response;
    }
}
