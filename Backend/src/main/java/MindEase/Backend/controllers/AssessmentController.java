// controllers/AssessmentController.java
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
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentController {
    private static final Logger logger = LoggerFactory.getLogger(AssessmentController.class);

    @Autowired
    private AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<?> saveAssessment(@RequestBody AssessmentRequest dto) {
        try {
            Assessment savedAssessment = assessmentService.saveAssessment(dto);
            return ResponseEntity.ok(savedAssessment);
        } catch (Exception e) {
            logger.error("Error saving assessment", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAssessmentsByUserId(@PathVariable Long userId) {
        try {
            List<Assessment> assessments = assessmentService.getAssessmentsByUserId(userId);
            return ResponseEntity.ok(assessments);
        } catch (Exception e) {
            logger.error("Error fetching assessments for user " + userId, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Failed to fetch assessments"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessment(@PathVariable Long id) {
        try {
            Assessment assessment = assessmentService.getAssessmentById(id);
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            logger.error("Error fetching assessment with id: " + id, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Failed to fetch assessment"));
        }
    }
}