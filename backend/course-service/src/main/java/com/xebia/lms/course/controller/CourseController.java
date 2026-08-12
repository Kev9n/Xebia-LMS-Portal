package com.xebia.lms.course.controller;

import com.xebia.lms.course.dto.ContentItemRequest;
import com.xebia.lms.course.dto.CourseRequest;
import com.xebia.lms.course.dto.ModuleRequest;
import com.xebia.lms.course.entity.ContentItem;
import com.xebia.lms.course.entity.Course;
import com.xebia.lms.course.entity.CourseModule;
import com.xebia.lms.course.entity.SubModule;
import com.xebia.lms.course.service.CourseService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseService service;
    public CourseController(CourseService service) { this.service = service; }
    @GetMapping List<Course> list() { return service.list(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) Course create(@Valid @RequestBody CourseRequest request) { return service.create(request); }
    @PutMapping("/{courseId}") Course update(@PathVariable("courseId") UUID courseId, @Valid @RequestBody CourseRequest request) { return service.update(courseId, request); }
    @DeleteMapping("/{courseId}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable("courseId") UUID courseId) { service.delete(courseId); }
    @PostMapping("/{courseId}/modules") @ResponseStatus(HttpStatus.CREATED) CourseModule module(@PathVariable("courseId") UUID courseId, @Valid @RequestBody ModuleRequest request) { return service.addModule(courseId, request); }
    @PutMapping("/modules/{moduleId}") CourseModule updateModule(@PathVariable("moduleId") UUID moduleId, @Valid @RequestBody ModuleRequest request) { return service.updateModule(moduleId, request); }
    @DeleteMapping("/modules/{moduleId}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteModule(@PathVariable("moduleId") UUID moduleId) { service.deleteModule(moduleId); }
    @PostMapping("/{courseId}/modules/{moduleId}/submodules") @ResponseStatus(HttpStatus.CREATED) SubModule subModule(@PathVariable("moduleId") UUID moduleId, @Valid @RequestBody com.xebia.lms.course.dto.SubModuleRequest request) { return service.addSubModule(moduleId, request); }
    @PutMapping("/submodules/{subModuleId}") SubModule updateSubModule(@PathVariable("subModuleId") UUID subModuleId, @Valid @RequestBody com.xebia.lms.course.dto.SubModuleRequest request) { return service.updateSubModule(subModuleId, request); }
    @DeleteMapping("/submodules/{subModuleId}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteSubModule(@PathVariable("subModuleId") UUID subModuleId) { service.deleteSubModule(subModuleId); }
    @PostMapping("/{courseId}/content-items") @ResponseStatus(HttpStatus.CREATED) ContentItem content(@PathVariable("courseId") UUID courseId, @Valid @RequestBody ContentItemRequest request) { return service.addContent(courseId, request); }
    @PutMapping("/content-items/{contentId}") ContentItem updateContent(@PathVariable("contentId") UUID contentId, @Valid @RequestBody ContentItemRequest request) { return service.updateContent(contentId, request); }
    @DeleteMapping("/content-items/{contentId}") @ResponseStatus(HttpStatus.NO_CONTENT) void deleteContent(@PathVariable("contentId") UUID contentId) { service.deleteContent(contentId); }
    @GetMapping("/{courseId}/hierarchy") com.xebia.lms.course.dto.CourseHierarchyDto getHierarchy(@PathVariable("courseId") UUID courseId) { return service.getHierarchy(courseId); }
}
