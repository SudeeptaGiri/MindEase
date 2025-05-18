package MindEase.Backend.controllers;

import MindEase.Backend.dto.LoginRequest;
import MindEase.Backend.dto.UserResponse;
import MindEase.Backend.entity.User;
import MindEase.Backend.exception.AuthenticationException;
import MindEase.Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        try {
            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username and password are required"));
            }

            User user = userService.loginUser(username, password);

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername()
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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            if (user == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User data is required"));
            }
            
            User registeredUser = userService.registerUser(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "user", Map.of(
                    "id", registeredUser.getId(),
                    "username", registeredUser.getUsername()
                )
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Add this new method to get all users
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            
            // Convert to a simplified response format to avoid circular references
            List<Map<String, Object>> userResponses = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
                    
                    // Add location data if available
                    if (user.getLatitude() != null && user.getLongitude() != null) {
                        userMap.put("latitude", user.getLatitude());
                        userMap.put("longitude", user.getLongitude());
                    }
                    
                    // Add assessment count
                    userMap.put("assessmentCount", user.getAssessments() != null ? user.getAssessments().size() : 0);
                    
                    // Add todo task count
                    userMap.put("todoTaskCount", user.getTodoTasks() != null ? user.getTodoTasks().size() : 0);
                    
                    return userMap;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(userResponses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to fetch users: " + e.getMessage()));
        }
    }

    // Add this method to get a specific user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("username", user.getUsername());
            userResponse.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
            
            // Add location data if available
            if (user.getLatitude() != null && user.getLongitude() != null) {
                userResponse.put("latitude", user.getLatitude());
                userResponse.put("longitude", user.getLongitude());
            }
            
            // Add assessment count
            userResponse.put("assessmentCount", user.getAssessments() != null ? user.getAssessments().size() : 0);
            
            // Add todo task count
            userResponse.put("todoTaskCount", user.getTodoTasks() != null ? user.getTodoTasks().size() : 0);
            
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to fetch user: " + e.getMessage()));
        }
    }
}