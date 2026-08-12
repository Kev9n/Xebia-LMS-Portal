package com.xebia.assessmentservice.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private List<Map<String, Object>> creationTrend;
    private List<Map<String, Object>> typeDistribution;
    private List<Map<String, Object>> courseWise;
    private List<Map<String, Object>> trainerWise;
    private List<Map<String, Object>> scoreDistribution;
    private Map<String, Long> passVsFail;
    private List<Map<String, Object>> difficultyDistribution;
    private List<Map<String, Object>> monthlyGrowth;
    private List<Map<String, Object>> statusDistribution;
}
