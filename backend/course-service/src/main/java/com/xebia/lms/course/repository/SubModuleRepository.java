package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.SubModule;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubModuleRepository extends JpaRepository<SubModule, UUID> {
    List<SubModule> findByModuleIdOrderByPositionAsc(UUID moduleId);
}
