package com.xebia.lms.course.dto;

import com.xebia.lms.course.entity.ContentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ContentItemRequest(UUID moduleId, UUID subModuleId, @NotBlank String title, @NotNull ContentType type, String storageRef, @Min(0) int position) {
}
