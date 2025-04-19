package MindEase.Backend.controllers;

import MindEase.Backend.dto.AssessmentRequest;
import MindEase.Backend.entity.Assessment;
import MindEase.Backend.services.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private static final Logger logger = LoggerFactory.getLogger(AssessmentController.class);

    @Autowired
    private AssessmentService assessmentService;

    // ✅ POST - Save new assessment
    @PostMapping
    public ResponseEntity<?> saveAssessment(@RequestBody AssessmentRequest dto) {
        try {
            logger.info("Received assessment DTO: {}", dto);
            Assessment savedAssessment = assessmentService.saveAssessment(dto);
            return ResponseEntity.ok(savedAssessment);
        } catch (Exception e) {
            logger.error("Error saving assessment", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ GET - Get assessments by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAssessmentsByUserId(@PathVariable Long userId) {
        try {
            logger.info("Fetching assessments for userId: {}", userId);
            List<Assessment> assessments = assessmentService.getAssessmentsByUserId(userId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            logger.error("Error fetching assessments for userId " + userId, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Failed to fetch assessments"));
        }
    }
}
