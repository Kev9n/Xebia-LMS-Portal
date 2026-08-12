package com.xebia.lms.course.dto;

import java.util.List;
import java.util.UUID;

public class ProgressSummaryResponse {
    private int completedLessons;
    private int totalLessons;
    private int progressPercentage;
    private UUID lastAccessedSubmoduleId;
    private UUID lastAccessedContentId;
    private List<UUID> completedContentIds;
    private List<UUID> completedSubmoduleIds;

    public ProgressSummaryResponse() {}

    public int getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(int completedLessons) { this.completedLessons = completedLessons; }

    public int getTotalLessons() { return totalLessons; }
    public void setTotalLessons(int totalLessons) { this.totalLessons = totalLessons; }

    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }

    public UUID getLastAccessedSubmoduleId() { return lastAccessedSubmoduleId; }
    public void setLastAccessedSubmoduleId(UUID lastAccessedSubmoduleId) { this.lastAccessedSubmoduleId = lastAccessedSubmoduleId; }

    public UUID getLastAccessedContentId() { return lastAccessedContentId; }
    public void setLastAccessedContentId(UUID lastAccessedContentId) { this.lastAccessedContentId = lastAccessedContentId; }

    public List<UUID> getCompletedContentIds() { return completedContentIds; }
    public void setCompletedContentIds(List<UUID> completedContentIds) { this.completedContentIds = completedContentIds; }

    public List<UUID> getCompletedSubmoduleIds() { return completedSubmoduleIds; }
    public void setCompletedSubmoduleIds(List<UUID> completedSubmoduleIds) { this.completedSubmoduleIds = completedSubmoduleIds; }
}
