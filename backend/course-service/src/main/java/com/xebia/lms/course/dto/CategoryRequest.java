package com.xebia.lms.course.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
    @NotBlank String name,
    @NotBlank String slug,
    String icon,
    String description,
    String color,
    boolean isActive
) {}
