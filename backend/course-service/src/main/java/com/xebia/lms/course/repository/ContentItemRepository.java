package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.ContentItem;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentItemRepository extends JpaRepository<ContentItem, UUID> {
    List<ContentItem> findBySubModuleIdOrderByPositionAsc(UUID subModuleId);
}
