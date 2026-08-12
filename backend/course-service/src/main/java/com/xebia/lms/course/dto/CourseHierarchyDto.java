package com.xebia.lms.course.dto;

import com.xebia.lms.course.entity.ContentItem;
import com.xebia.lms.course.entity.Course;
import com.xebia.lms.course.entity.CourseModule;
import com.xebia.lms.course.entity.SubModule;
import java.util.List;

public record CourseHierarchyDto(
    Course course,
    List<ModuleDto> modules
) {
    public record ModuleDto(
        CourseModule module,
        List<SubModuleDto> submodules
    ) {}

    public record SubModuleDto(
        SubModule submodule,
        List<ContentItem> contentBlocks
    ) {}
}
