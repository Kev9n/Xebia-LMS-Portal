package com.xebia.batchservice.repository;

import com.xebia.batchservice.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, String> {
    List<Batch> findByCreatedBy(String createdBy);

    @Modifying
    @Query("DELETE FROM Batch b WHERE b.createdBy = :createdBy")
    void deleteByCreatedBy(@Param("createdBy") String createdBy);
}
