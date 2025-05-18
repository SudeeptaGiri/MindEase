package MindEase.Backend.services;

import MindEase.Backend.entity.Admin;
import MindEase.Backend.exception.AuthenticationException;
import MindEase.Backend.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin loginAdmin(String username, String password) {
        return adminRepository.findByUsername(username)
            .filter(admin -> passwordEncoder.matches(password, admin.getPassword()))
            .orElseThrow(() -> new AuthenticationException("Invalid username or password"));
    }

    // Method to create an admin (typically used for initialization)
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }
}