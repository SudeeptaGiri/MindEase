package MindEase.Backend.controllers;

import MindEase.Backend.entity.Admin;
import MindEase.Backend.exception.AuthenticationException;
import MindEase.Backend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username and password are required"));
            }

            Admin admin = adminService.loginAdmin(username, password);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "admin", Map.of(
                            "id", admin.getId(),
                            "username", admin.getUsername(),
                            "email", admin.getEmail(),
                            "role", "ADMIN")));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    // For development/initialization purposes only
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            System.out.println("Admin Payload: " + admin); // debug log
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.ok(Map.of(
                    "message", "Admin created successfully",
                    "admin", Map.of(
                            "id", createdAdmin.getId(),
                            "username", createdAdmin.getUsername())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

}