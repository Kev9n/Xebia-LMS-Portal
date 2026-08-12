package com.xebia.batchservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    private String course;
    private Integer studentCount;
    private String status; // active, completed
    private String createdAt;
    @Column(columnDefinition = "TEXT")
    private String icon;
    
    @ElementCollection
    private List<String> students;

    // Allocation fields
    private String trainerId;
    private String courseId;
    private String academicSession;
    private String startDate;
    private String endDate;
    private Integer maxStudents;

    // Creator tracking
    private String createdBy;
    private String createdByName;
}
