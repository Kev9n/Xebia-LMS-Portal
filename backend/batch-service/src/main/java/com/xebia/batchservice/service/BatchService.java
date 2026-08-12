package com.xebia.batchservice.service;

import com.xebia.batchservice.model.Batch;
import com.xebia.batchservice.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BatchService {
    @Autowired
    private BatchRepository batchRepository;

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Optional<Batch> getBatchById(String id) {
        return batchRepository.findById(id);
    }

    public Batch createBatch(Batch batch) {
        return batchRepository.save(batch);
    }

    public Batch updateBatch(String id, Batch updated) {
        Optional<Batch> existing = batchRepository.findById(id);
        if (existing.isPresent()) {
            Batch batch = existing.get();
            if (updated.getName() != null) batch.setName(updated.getName());
            if (updated.getCourse() != null) batch.setCourse(updated.getCourse());
            if (updated.getStatus() != null) batch.setStatus(updated.getStatus());
            if (updated.getStudentCount() != null) batch.setStudentCount(updated.getStudentCount());
            if (updated.getIcon() != null) batch.setIcon(updated.getIcon());
            if (updated.getStudents() != null) batch.setStudents(updated.getStudents());
            return batchRepository.save(batch);
        }
        return batchRepository.save(updated);
    }

    public void updateBatchFields(String batchId, String trainerId, String courseId,
                                   String academicSession, String startDate, String endDate) {
        Optional<Batch> existing = batchRepository.findById(batchId);
        if (existing.isPresent()) {
            Batch batch = existing.get();
            if (trainerId != null) batch.setTrainerId(trainerId);
            if (courseId != null) batch.setCourseId(courseId);
            if (academicSession != null) batch.setAcademicSession(academicSession);
            if (startDate != null) batch.setStartDate(startDate);
            if (endDate != null) batch.setEndDate(endDate);
            batchRepository.save(batch);
        }
    }

    public void deleteBatch(String id) {
        batchRepository.deleteById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public int deleteBatchesByCreatedBy(String createdBy) {
        java.util.List<Batch> batches = batchRepository.findByCreatedBy(createdBy);
        int count = batches.size();
        batchRepository.deleteByCreatedBy(createdBy);
        return count;
    }

    public Batch addStudentToBatch(String batchId, String studentId) {
        Optional<Batch> existing = batchRepository.findById(batchId);
        if (existing.isPresent()) {
            Batch batch = existing.get();
            if (batch.getStudents() == null) {
                batch.setStudents(new java.util.ArrayList<>());
            }
            if (!batch.getStudents().contains(studentId)) {
                batch.getStudents().add(studentId);
                batch.setStudentCount(batch.getStudents().size());
                return batchRepository.save(batch);
            }
        }
        return existing.orElse(null);
    }

    public Batch removeStudentFromBatch(String batchId, String studentId) {
        Optional<Batch> existing = batchRepository.findById(batchId);
        if (existing.isPresent()) {
            Batch batch = existing.get();
            if (batch.getStudents() != null && batch.getStudents().contains(studentId)) {
                batch.getStudents().remove(studentId);
                batch.setStudentCount(batch.getStudents().size());
                return batchRepository.save(batch);
            }
        }
        return existing.orElse(null);
    }
}
