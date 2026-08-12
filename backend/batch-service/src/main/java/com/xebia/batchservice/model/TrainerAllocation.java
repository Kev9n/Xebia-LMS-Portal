package com.xebia.batchservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trainer_allocations", indexes = {
    @Index(name = "idx_allocation_trainer", columnList = "trainerId"),
    @Index(name = "idx_allocation_batch", columnList = "batchId"),
    @Index(name = "idx_allocation_course", columnList = "courseId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String trainerId;

    @Column(nullable = false)
    private String batchId;

    @Column(nullable = false)
    private String courseId;

    @Column(nullable = false)
    private String academicSession;

    @Column(nullable = false)
    private String status; // active, completed, cancelled

    private String startDate;
    private String endDate;
    private String assignedBy;
    
    @Column(nullable = false)
    private String assignedAt;

    private String notes;
}
