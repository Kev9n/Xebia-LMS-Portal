package com.xebia.lms.course.service;

import com.xebia.lms.common.security.PermissionGuard;
import com.xebia.lms.common.security.TenantContext;
import com.xebia.lms.course.dto.ContentItemRequest;
import com.xebia.lms.course.dto.CourseRequest;
import com.xebia.lms.course.dto.ModuleRequest;
import com.xebia.lms.course.dto.SubModuleRequest;
import com.xebia.lms.course.entity.ContentItem;
import com.xebia.lms.course.entity.Course;
import com.xebia.lms.course.entity.CourseModule;
import com.xebia.lms.course.entity.SubModule;

import com.xebia.lms.course.repository.ContentItemRepository;
import com.xebia.lms.course.repository.CourseModuleRepository;
import com.xebia.lms.course.repository.CourseRepository;
import com.xebia.lms.course.repository.SubModuleRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {
    private final CourseRepository courses;
    private final CourseModuleRepository modules;
    private final SubModuleRepository subModules;
    private final ContentItemRepository contentItems;

    private final PermissionGuard guard;
    public CourseService(CourseRepository courses, CourseModuleRepository modules, SubModuleRepository subModules, ContentItemRepository contentItems, PermissionGuard guard) {
        this.courses = courses; this.modules = modules; this.subModules = subModules; this.contentItems = contentItems; this.guard = guard;
    }

    public List<Course> list() { guard.requireTenant(); return courses.findByTenantId(TenantContext.tenantId()); }

    @Transactional
    public Course create(CourseRequest request) {
        guard.requireTenant();
        Course course = new Course();
        course.setTenantId(TenantContext.tenantId());
        
        mapToEntity(request, course);

        return courses.save(course);
    }

    @Transactional
    public Course update(UUID courseId, CourseRequest request) {
        guard.requireTenant();
        Course course = courses.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
            
        mapToEntity(request, course);

        return courses.save(course);
    }

    @Transactional
    public void delete(UUID courseId) {
        guard.requireTenant();
        Course course = courses.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        courses.delete(course);
    }

    private void mapToEntity(CourseRequest request, Course course) {
        course.setTitle(request.title());
        course.setCourseCode(request.courseCode());
        course.setDescription(request.description());
        course.setPublished(request.published());
        course.setCategoryId(request.categoryId());
        course.setSubtitle(request.shortDescription());
        course.setIcon(request.icon());
        course.setThumbnailImageUrl(request.thumbnail());
        course.setBannerImage(request.bannerImage());
        course.setPreviewVideoUrl(request.previewVideoUrl());
        course.setDurationHours(request.durationHours());
        course.setDurationMinutes(request.durationMinutes());
        course.setDifficultyLevel(request.level());
        course.setLanguage(request.language());
        course.setVisibility(request.visibility());
        course.setActive(request.isActive());
        course.setFeatured(request.isFeatured());
        course.setAllowEnrolling(request.allowEnrolling());
        
        course.setLearningOutcomes(request.learningOutcomes());
        course.setPrerequisites(request.prerequisites());
        course.setTargetAudience(request.targetAudience());
        course.setHighlights(request.highlights());
        course.setCareerOpportunities(request.careerOpportunities());
        
        course.setMetaTitle(request.seoTitle());
        course.setMetaDescription(request.seoDescription());
        course.setCanonicalUrl(request.canonicalUrl());
        course.setRobots(request.robots());
        course.setAuthor(request.author());
        course.setSeoCategory(request.seoCategory());
        course.setMetaKeywords(request.metaKeywords());
        course.setSeoTags(request.seoTags());
        
        course.setPrimaryKeyword(request.primaryKeyword());
        course.setSecondaryKeywords(request.secondaryKeywords());
        course.setSemanticKeywords(request.semanticKeywords());
        course.setSearchIntent(request.searchIntent());
        course.setFocusKeywords(request.focusKeywords());
        course.setSearchSynonyms(request.searchSynonyms());
        course.setRelatedTopics(request.relatedTopics());
        
        course.setOgTitle(request.ogTitle());
        course.setOgType(request.ogType());
        course.setOgDescription(request.ogDescription());
        course.setOgImage(request.ogImage());
        course.setOgUrl(request.ogUrl());
        
        course.setTwitterTitle(request.twitterTitle());
        course.setTwitterCard(request.twitterCard());
        course.setTwitterDescription(request.twitterDescription());
        course.setTwitterImage(request.twitterImage());
        
        course.setSchemaMarkup(request.schemaMarkup());
        course.setFaqSchema(request.faqSchema());
        course.setBreadcrumbSchema(request.breadcrumbSchema());
        course.setFaqContent(request.faqContent());
        
        course.setCustomHeadScript(request.customHeadScript());
        course.setCustomBodyScript(request.customBodyScript());
        
        if (request.totalViews() != null) course.setTotalViews(request.totalViews().longValue());
        if (request.totalClicks() != null) course.setTotalClicks(request.totalClicks().longValue());
        if (request.ctr() != null) course.setCtr(request.ctr());
        if (request.seoScore() != null) course.setSeoScore(request.seoScore());
    }

    @Transactional
    public CourseModule addModule(UUID courseId, ModuleRequest request) {
        CourseModule module = new CourseModule();
        module.setTenantId(TenantContext.tenantId());
        module.setCourseId(courseId);
        module.setTitle(request.title());
        module.setPosition(request.position());
        module.setDescription(request.description());
        module.setActive(request.isActive());
        return modules.save(module);
    }

    @Transactional
    public CourseModule updateModule(UUID moduleId, ModuleRequest request) {
        CourseModule module = modules.findById(moduleId)
            .orElseThrow(() -> new RuntimeException("Module not found"));
        module.setTitle(request.title());
        module.setPosition(request.position());
        module.setDescription(request.description());
        module.setActive(request.isActive());
        return modules.save(module);
    }

    @Transactional
    public void deleteModule(UUID moduleId) {
        // Delete all content items in all submodules first
        List<SubModule> subs = subModules.findByModuleIdOrderByPositionAsc(moduleId);
        subs.forEach(sub -> {
            contentItems.findBySubModuleIdOrderByPositionAsc(sub.getId()).forEach(contentItems::delete);
            subModules.delete(sub);
        });
        modules.deleteById(moduleId);
    }

    @Transactional
    public SubModule addSubModule(UUID moduleId, SubModuleRequest request) {
        SubModule subModule = new SubModule();
        subModule.setTenantId(TenantContext.tenantId());
        subModule.setModuleId(moduleId);
        subModule.setTitle(request.title());
        subModule.setPosition(request.position());
        subModule.setDescription(request.description());
        subModule.setActive(request.isActive());
        subModule.setSlug(request.slug());
        subModule.setMetaTitle(request.metaTitle());
        subModule.setCanonicalUrl(request.canonicalUrl());
        subModule.setMetaDescription(request.metaDescription());
        subModule.setOgTitle(request.ogTitle());
        subModule.setOgImageUrl(request.ogImageUrl());
        return subModules.save(subModule);
    }

    @Transactional
    public SubModule updateSubModule(UUID subModuleId, SubModuleRequest request) {
        SubModule subModule = subModules.findById(subModuleId)
            .orElseThrow(() -> new RuntimeException("SubModule not found"));
        subModule.setTitle(request.title());
        subModule.setPosition(request.position());
        subModule.setDescription(request.description());
        subModule.setActive(request.isActive());
        subModule.setSlug(request.slug());
        subModule.setMetaTitle(request.metaTitle());
        subModule.setCanonicalUrl(request.canonicalUrl());
        subModule.setMetaDescription(request.metaDescription());
        subModule.setOgTitle(request.ogTitle());
        subModule.setOgImageUrl(request.ogImageUrl());
        return subModules.save(subModule);
    }

    @Transactional
    public void deleteSubModule(UUID subModuleId) {
        SubModule subModule = subModules.findById(subModuleId)
            .orElseThrow(() -> new RuntimeException("SubModule not found"));
        contentItems.findBySubModuleIdOrderByPositionAsc(subModuleId).forEach(contentItems::delete);
        subModules.delete(subModule);
    }

    @Transactional
    public ContentItem addContent(UUID courseId, ContentItemRequest request) {
        ContentItem item = new ContentItem();
        item.setTenantId(TenantContext.tenantId());
        item.setCourseId(courseId);
        item.setModuleId(request.moduleId());
        item.setSubModuleId(request.subModuleId());
        item.setTitle(request.title());
        item.setType(request.type());
        item.setStorageRef(request.storageRef());
        item.setPosition(request.position());
        return contentItems.save(item);
    }

    @Transactional
    public ContentItem updateContent(UUID contentId, ContentItemRequest request) {
        ContentItem item = contentItems.findById(contentId)
            .orElseThrow(() -> new RuntimeException("Content not found"));
        item.setTitle(request.title());
        item.setType(request.type());
        item.setStorageRef(request.storageRef());
        item.setPosition(request.position());
        return contentItems.save(item);
    }

    @Transactional
    public void deleteContent(UUID contentId) {
        ContentItem item = contentItems.findById(contentId)
            .orElseThrow(() -> new RuntimeException("Content not found"));
        contentItems.delete(item);
    }

    public com.xebia.lms.course.dto.CourseHierarchyDto getHierarchy(UUID courseId) {
        guard.requireTenant();
        Course course = courses.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        List<CourseModule> courseModules = modules.findByCourseIdOrderByPositionAsc(courseId);
        List<com.xebia.lms.course.dto.CourseHierarchyDto.ModuleDto> moduleDtos = courseModules.stream().map(module -> {
            List<SubModule> subMods = subModules.findByModuleIdOrderByPositionAsc(module.getId());
            List<com.xebia.lms.course.dto.CourseHierarchyDto.SubModuleDto> subModDtos = subMods.stream().map(sub -> {
                List<ContentItem> items = contentItems.findBySubModuleIdOrderByPositionAsc(sub.getId());
                return new com.xebia.lms.course.dto.CourseHierarchyDto.SubModuleDto(sub, items);
            }).toList();
            return new com.xebia.lms.course.dto.CourseHierarchyDto.ModuleDto(module, subModDtos);
        }).toList();
        
        return new com.xebia.lms.course.dto.CourseHierarchyDto(course, moduleDtos);
    }

    public boolean courseExists(UUID courseId) {
        return courses.existsById(courseId);
    }
}
