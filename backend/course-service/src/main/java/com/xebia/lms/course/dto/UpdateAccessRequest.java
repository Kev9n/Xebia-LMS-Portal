package com.xebia.lms.course.dto;

import java.util.UUID;

public class UpdateAccessRequest {
    private UUID submoduleId;
    private UUID contentId;

    public UUID getSubmoduleId() { return submoduleId; }
    public void setSubmoduleId(UUID submoduleId) { this.submoduleId = submoduleId; }

    public UUID getContentId() { return contentId; }
    public void setContentId(UUID contentId) { this.contentId = contentId; }
}
