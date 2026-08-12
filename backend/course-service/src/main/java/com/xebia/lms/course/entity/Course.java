package com.xebia.lms.course.entity;


import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "courses", schema = "course")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course extends TenantScopedEntity {

    @Column(nullable = false)
    private String title;
    
    private String description;
    
    private boolean published;

    @Column(name = "category_id")
    private UUID categoryId;

    private String subtitle;

    @Column(length = 1000)
    private String icon;

    @Column(name = "thumbnail_image_url", length = 1000)
    private String thumbnailImageUrl;

    @Column(name = "banner_image", length = 1000)
    private String bannerImage;

    @Column(name = "preview_video_url", length = 1000)
    private String previewVideoUrl;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    private String language;

    private String visibility;

    @Column(name = "is_active")
    private boolean isActive;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "learning_outcomes", columnDefinition = "text[]")
    private List<String> learningOutcomes;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "prerequisites", columnDefinition = "text[]")
    private List<String> prerequisites;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "target_audience", columnDefinition = "text[]")
    private List<String> targetAudience;

    @Column(name = "course_code")
    private String courseCode;

    // icon and bannerImage moved up

    @Column(name = "is_featured")
    private boolean isFeatured;

    @Column(name = "allow_enrolling")
    private boolean allowEnrolling = true;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "highlights", columnDefinition = "text[]")
    private List<String> highlights;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "career_opportunities", columnDefinition = "text[]")
    private List<String> careerOpportunities;

    // SEO Meta
    @Column(name = "meta_title")
    private String metaTitle;

    @Column(name = "meta_description")
    private String metaDescription;

    @Column(name = "canonical_url")
    private String canonicalUrl;

    private String robots;
    private String author;

    @Column(name = "seo_category")
    private String seoCategory;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "meta_keywords", columnDefinition = "text[]")
    private List<String> metaKeywords;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "seo_tags", columnDefinition = "text[]")
    private List<String> seoTags;

    // Advanced SEO
    @Column(name = "primary_keyword")
    private String primaryKeyword;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "secondary_keywords", columnDefinition = "text[]")
    private List<String> secondaryKeywords;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "semantic_keywords", columnDefinition = "text[]")
    private List<String> semanticKeywords;

    @Column(name = "search_intent")
    private String searchIntent;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "focus_keywords", columnDefinition = "text[]")
    private List<String> focusKeywords;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "search_synonyms", columnDefinition = "text[]")
    private List<String> searchSynonyms;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "related_topics", columnDefinition = "text[]")
    private List<String> relatedTopics;

    // Open Graph
    @Column(name = "og_title")
    private String ogTitle;

    @Column(name = "og_type")
    private String ogType;

    @Column(name = "og_description")
    private String ogDescription;

    @Column(name = "og_image")
    private String ogImage;

    @Column(name = "og_url")
    private String ogUrl;

    // Twitter
    @Column(name = "twitter_title")
    private String twitterTitle;

    @Column(name = "twitter_card")
    private String twitterCard;

    @Column(name = "twitter_description")
    private String twitterDescription;

    @Column(name = "twitter_image")
    private String twitterImage;

    // Structured Data & Scripting
    @Column(name = "schema_markup")
    private String schemaMarkup;

    @Column(name = "faq_schema")
    private String faqSchema;

    @Column(name = "breadcrumb_schema")
    private String breadcrumbSchema;

    @Column(name = "faq_content")
    private String faqContent;

    @Column(name = "custom_head_script")
    private String customHeadScript;

    @Column(name = "custom_body_script")
    private String customBodyScript;

    // Analytics
    @Column(name = "total_views")
    private Long totalViews;

    @Column(name = "total_clicks")
    private Long totalClicks;

    @Column(name = "ctr")
    private Double ctr;

    @Column(name = "seo_score")
    private Integer seoScore;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getThumbnailImageUrl() { return thumbnailImageUrl; }
    public void setThumbnailImageUrl(String thumbnailImageUrl) { this.thumbnailImageUrl = thumbnailImageUrl; }
    public String getPreviewVideoUrl() { return previewVideoUrl; }
    public void setPreviewVideoUrl(String previewVideoUrl) { this.previewVideoUrl = previewVideoUrl; }
    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public List<String> getLearningOutcomes() { return learningOutcomes; }
    public void setLearningOutcomes(List<String> learningOutcomes) { this.learningOutcomes = learningOutcomes; }
    public List<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; }
    public List<String> getTargetAudience() { return targetAudience; }
    public void setTargetAudience(List<String> targetAudience) { this.targetAudience = targetAudience; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getBannerImage() { return bannerImage; }
    public void setBannerImage(String bannerImage) { this.bannerImage = bannerImage; }
    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { this.isFeatured = featured; }
    public boolean isAllowEnrolling() { return allowEnrolling; }
    public void setAllowEnrolling(boolean allowEnrolling) { this.allowEnrolling = allowEnrolling; }
    public List<String> getHighlights() { return highlights; }
    public void setHighlights(List<String> highlights) { this.highlights = highlights; }
    public List<String> getCareerOpportunities() { return careerOpportunities; }
    public void setCareerOpportunities(List<String> careerOpportunities) { this.careerOpportunities = careerOpportunities; }

    public String getMetaTitle() { return metaTitle; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }
    public String getCanonicalUrl() { return canonicalUrl; }
    public void setCanonicalUrl(String canonicalUrl) { this.canonicalUrl = canonicalUrl; }
    public String getRobots() { return robots; }
    public void setRobots(String robots) { this.robots = robots; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getSeoCategory() { return seoCategory; }
    public void setSeoCategory(String seoCategory) { this.seoCategory = seoCategory; }
    public List<String> getMetaKeywords() { return metaKeywords; }
    public void setMetaKeywords(List<String> metaKeywords) { this.metaKeywords = metaKeywords; }
    public List<String> getSeoTags() { return seoTags; }
    public void setSeoTags(List<String> seoTags) { this.seoTags = seoTags; }

    public String getPrimaryKeyword() { return primaryKeyword; }
    public void setPrimaryKeyword(String primaryKeyword) { this.primaryKeyword = primaryKeyword; }
    public List<String> getSecondaryKeywords() { return secondaryKeywords; }
    public void setSecondaryKeywords(List<String> secondaryKeywords) { this.secondaryKeywords = secondaryKeywords; }
    public List<String> getSemanticKeywords() { return semanticKeywords; }
    public void setSemanticKeywords(List<String> semanticKeywords) { this.semanticKeywords = semanticKeywords; }
    public String getSearchIntent() { return searchIntent; }
    public void setSearchIntent(String searchIntent) { this.searchIntent = searchIntent; }
    public List<String> getFocusKeywords() { return focusKeywords; }
    public void setFocusKeywords(List<String> focusKeywords) { this.focusKeywords = focusKeywords; }
    public List<String> getSearchSynonyms() { return searchSynonyms; }
    public void setSearchSynonyms(List<String> searchSynonyms) { this.searchSynonyms = searchSynonyms; }
    public List<String> getRelatedTopics() { return relatedTopics; }
    public void setRelatedTopics(List<String> relatedTopics) { this.relatedTopics = relatedTopics; }

    public String getOgTitle() { return ogTitle; }
    public void setOgTitle(String ogTitle) { this.ogTitle = ogTitle; }
    public String getOgType() { return ogType; }
    public void setOgType(String ogType) { this.ogType = ogType; }
    public String getOgDescription() { return ogDescription; }
    public void setOgDescription(String ogDescription) { this.ogDescription = ogDescription; }
    public String getOgImage() { return ogImage; }
    public void setOgImage(String ogImage) { this.ogImage = ogImage; }
    public String getOgUrl() { return ogUrl; }
    public void setOgUrl(String ogUrl) { this.ogUrl = ogUrl; }

    public String getTwitterTitle() { return twitterTitle; }
    public void setTwitterTitle(String twitterTitle) { this.twitterTitle = twitterTitle; }
    public String getTwitterCard() { return twitterCard; }
    public void setTwitterCard(String twitterCard) { this.twitterCard = twitterCard; }
    public String getTwitterDescription() { return twitterDescription; }
    public void setTwitterDescription(String twitterDescription) { this.twitterDescription = twitterDescription; }
    public String getTwitterImage() { return twitterImage; }
    public void setTwitterImage(String twitterImage) { this.twitterImage = twitterImage; }

    public String getSchemaMarkup() { return schemaMarkup; }
    public void setSchemaMarkup(String schemaMarkup) { this.schemaMarkup = schemaMarkup; }
    public String getFaqSchema() { return faqSchema; }
    public void setFaqSchema(String faqSchema) { this.faqSchema = faqSchema; }
    public String getBreadcrumbSchema() { return breadcrumbSchema; }
    public void setBreadcrumbSchema(String breadcrumbSchema) { this.breadcrumbSchema = breadcrumbSchema; }
    public String getFaqContent() { return faqContent; }
    public void setFaqContent(String faqContent) { this.faqContent = faqContent; }
    public String getCustomHeadScript() { return customHeadScript; }
    public void setCustomHeadScript(String customHeadScript) { this.customHeadScript = customHeadScript; }
    public String getCustomBodyScript() { return customBodyScript; }
    public void setCustomBodyScript(String customBodyScript) { this.customBodyScript = customBodyScript; }

    public Long getTotalViews() { return totalViews; }
    public void setTotalViews(Long totalViews) { this.totalViews = totalViews; }
    public Long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(Long totalClicks) { this.totalClicks = totalClicks; }
    public Double getCtr() { return ctr; }
    public void setCtr(Double ctr) { this.ctr = ctr; }
    public Integer getSeoScore() { return seoScore; }
    public void setSeoScore(Integer seoScore) { this.seoScore = seoScore; }
}
