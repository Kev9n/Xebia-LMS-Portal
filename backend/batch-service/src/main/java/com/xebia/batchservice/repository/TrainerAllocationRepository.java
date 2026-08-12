package com.xebia.batchservice.repository;

import com.xebia.batchservice.model.TrainerAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerAllocationRepository extends JpaRepository<TrainerAllocation, String> {

    List<TrainerAllocation> findByTrainerId(String trainerId);

    List<TrainerAllocation> findByBatchId(String batchId);

    List<TrainerAllocation> findByCourseId(String courseId);

    List<TrainerAllocation> findByStatus(String status);

    List<TrainerAllocation> findByTrainerIdAndStatus(String trainerId, String status);

    List<TrainerAllocation> findByBatchIdAndStatus(String batchId, String status);

    boolean existsByBatchIdAndCourseIdAndStatus(String batchId, String courseId, String status);

    @Query("SELECT COUNT(a) FROM TrainerAllocation a WHERE a.status = :status")
    long countByStatus(@Param("status") String status);

    @Query("SELECT COUNT(DISTINCT a.trainerId) FROM TrainerAllocation a WHERE a.status = 'active'")
    long countActiveTrainers();

    @Query("SELECT COUNT(DISTINCT a.courseId) FROM TrainerAllocation a WHERE a.status = 'active'")
    long countAssignedCourses();

    @Query("SELECT a.academicSession, COUNT(a) FROM TrainerAllocation a WHERE a.status = 'active' GROUP BY a.academicSession")
    List<Object[]> countBySessionGrouped();

    @Modifying
    @Query("DELETE FROM TrainerAllocation a WHERE a.trainerId = :trainerId")
    void deleteByTrainerId(@Param("trainerId") String trainerId);

    @Modifying
    @Query("DELETE FROM TrainerAllocation a WHERE a.batchId = :batchId")
    void deleteByBatchId(@Param("batchId") String batchId);
}
