package com.xebia.lms.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ModuleRequest(
    @NotBlank String title, 
    @Min(0) int position,
    String description,
    boolean isActive
) {}
