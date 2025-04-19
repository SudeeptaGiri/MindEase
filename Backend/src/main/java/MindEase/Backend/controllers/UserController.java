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
import java.util.Map;

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
}