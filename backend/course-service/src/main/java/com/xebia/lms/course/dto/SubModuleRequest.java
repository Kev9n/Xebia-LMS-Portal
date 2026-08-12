package com.xebia.lms.course.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SubModuleRequest(
    @NotBlank String title, 
    @Min(0) int position,
    String description,
    boolean isActive,
    String slug,
    String metaTitle,
    String canonicalUrl,
    String metaDescription,
    String ogTitle,
    String ogImageUrl
) {}
