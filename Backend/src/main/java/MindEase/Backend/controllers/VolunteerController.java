// MindEase.Backend.controllers.VolunteerController.java
package MindEase.Backend.controllers;

import MindEase.Backend.entity.Volunteer;
import MindEase.Backend.exception.AuthenticationException;
import MindEase.Backend.services.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    private final VolunteerService volunteerService;

    @Autowired
    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerVolunteer(@Valid @RequestBody Volunteer volunteer) {
        try {
            Volunteer registeredVolunteer = volunteerService.registerVolunteer(volunteer);
            
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful. Your application is pending approval.",
                "volunteer", Map.of(
                    "id", registeredVolunteer.getId(),
                    "username", registeredVolunteer.getUsername(),
                    "email", registeredVolunteer.getEmail(),
                    "approved", registeredVolunteer.getApproved()
                )
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginVolunteer(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
            }

            Volunteer volunteer = volunteerService.loginVolunteer(username, password);

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "volunteer", Map.of(
                    "id", volunteer.getId(),
                    "username", volunteer.getUsername(),
                    "email", volunteer.getEmail(),
                    "fullName", volunteer.getFullName(),
                    "role", "VOLUNTEER"
                )
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Volunteer>> getPendingVolunteers() {
        return ResponseEntity.ok(volunteerService.getPendingVolunteers());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Volunteer>> getApprovedVolunteers() {
        return ResponseEntity.ok(volunteerService.getApprovedVolunteers());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveVolunteer(@PathVariable Long id) {
        try {
            Volunteer volunteer = volunteerService.approveVolunteer(id);
            return ResponseEntity.ok(Map.of(
                "message", "Volunteer approved successfully",
                "volunteer", volunteer
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectVolunteer(
        @PathVariable Long id,
        @RequestBody Map<String, String> request
    ) {
        try {
            String reason = request.get("reason");
            Volunteer volunteer = volunteerService.rejectVolunteer(id, reason);
            return ResponseEntity.ok(Map.of(
                "message", "Volunteer rejected",
                "volunteer", volunteer
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVolunteer(@PathVariable Long id) {
        try {
            volunteerService.deleteVolunteer(id);
            return ResponseEntity.ok(Map.of(
                "message", "Volunteer deleted successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getVolunteerById(@PathVariable Long id) {
        try {
            Volunteer volunteer = volunteerService.getVolunteerById(id);
            return ResponseEntity.ok(volunteer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}