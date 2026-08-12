package com.xebia.batchservice.controller;

import com.xebia.batchservice.model.TrainerAllocation;
import com.xebia.batchservice.service.TrainerAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/allocations")
public class TrainerAllocationController {

    @Autowired
    private TrainerAllocationService allocationService;

    @GetMapping
    public List<TrainerAllocation> getAllocations(
            @RequestParam(required = false) String trainerId,
            @RequestParam(required = false) String batchId,
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) String status) {
        return allocationService.getAllocations(trainerId, batchId, courseId, status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerAllocation> getAllocationById(@PathVariable String id) {
        return allocationService.getAllocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TrainerAllocation createAllocation(@RequestBody TrainerAllocation allocation) {
        return allocationService.createAllocation(allocation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerAllocation> updateAllocation(@PathVariable String id, 
                                                              @RequestBody TrainerAllocation allocation) {
        TrainerAllocation updated = allocationService.updateAllocation(id, allocation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllocation(@PathVariable String id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/trainer/{trainerId}")
    public ResponseEntity<Map<String, Object>> deleteAllocationsByTrainer(@PathVariable String trainerId) {
        int deleted = allocationService.deleteAllocationsByTrainerId(trainerId);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }

    @DeleteMapping("/batch/{batchId}")
    public ResponseEntity<Map<String, Object>> deleteAllocationsByBatch(@PathVariable String batchId) {
        int deleted = allocationService.deleteAllocationsByBatchId(batchId);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }

    @PostMapping("/bulk")
    public List<TrainerAllocation> createBulkAllocations(@RequestBody List<TrainerAllocation> allocations) {
        return allocationService.createBulkAllocations(allocations);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {
        return allocationService.getDashboardSummary();
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        return allocationService.getAnalytics();
    }

    @GetMapping("/trainer/{trainerId}")
    public List<TrainerAllocation> getTrainerAllocations(@PathVariable String trainerId) {
        return allocationService.getAllocations(trainerId, null, null, null);
    }

    @GetMapping("/batch/{batchId}")
    public List<TrainerAllocation> getBatchAllocations(@PathVariable String batchId) {
        return allocationService.getAllocations(null, batchId, null, null);
    }

    @GetMapping("/course/{courseId}")
    public List<TrainerAllocation> getCourseAllocations(@PathVariable String courseId) {
        return allocationService.getAllocations(null, null, courseId, null);
    }
}
