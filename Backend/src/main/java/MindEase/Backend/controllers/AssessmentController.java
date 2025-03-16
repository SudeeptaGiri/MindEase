package MindEase.Backend.controllers;

import MindEase.Backend.entity.Assessment;
import MindEase.Backend.services.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // ✅ Ensure CORS is enabled
@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    @Autowired
    private AssessmentService assessmentService;

    // ✅ Accept userId as a query parameter
    @PostMapping
    public ResponseEntity<?> saveAssessment(@RequestBody Assessment assessment, @RequestParam Long userId) {
        try {
            Assessment savedAssessment = assessmentService.saveAssessment(assessment, userId);
            return ResponseEntity.ok(savedAssessment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Assessment>> getAssessmentsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByUserId(userId));
    }
}
