// MindEase.Backend.services.VolunteerService.java
package MindEase.Backend.services;

import MindEase.Backend.entity.Volunteer;
import MindEase.Backend.exception.AuthenticationException;
import MindEase.Backend.repositories.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public VolunteerService(VolunteerRepository volunteerRepository, PasswordEncoder passwordEncoder) {
        this.volunteerRepository = volunteerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Volunteer registerVolunteer(Volunteer volunteer) {
        if (volunteer == null) {
            throw new IllegalArgumentException("Volunteer data cannot be null");
        }

        // Validate required fields
        if (volunteer.getUsername() == null || volunteer.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }

        if (volunteer.getPassword() == null || volunteer.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        if (volunteer.getEmail() == null || volunteer.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (volunteer.getFullName() == null || volunteer.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        // Check for existing username or email
        if (volunteerRepository.existsByUsername(volunteer.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        if (volunteerRepository.existsByEmail(volunteer.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Encode password
        volunteer.setPassword(passwordEncoder.encode(volunteer.getPassword()));
        
        // Set default values
        volunteer.setApproved(false);
        volunteer.setActive(false);

        // Save volunteer
        return volunteerRepository.save(volunteer);
    }

    public Volunteer loginVolunteer(String username, String password) {
        return volunteerRepository.findByUsername(username)
            .filter(volunteer -> passwordEncoder.matches(password, volunteer.getPassword()))
            .filter(Volunteer::getApproved)
            .filter(Volunteer::getActive)
            .orElseThrow(() -> new AuthenticationException("Invalid username or password, or account not approved yet"));
    }

    public List<Volunteer> getPendingVolunteers() {
        return volunteerRepository.findPendingVolunteers();
    }

    public List<Volunteer> getApprovedVolunteers() {
        return volunteerRepository.findByApprovedAndActive(true, true);
    }

    public Volunteer approveVolunteer(Long id) {
        Volunteer volunteer = volunteerRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Volunteer not found"));
        
        volunteer.setApproved(true);
        volunteer.setActive(true);
        volunteer.setRejectionReason(null);
        
        return volunteerRepository.save(volunteer);
    }

    public Volunteer rejectVolunteer(Long id, String reason) {
        Volunteer volunteer = volunteerRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Volunteer not found"));
        
        volunteer.setApproved(false);
        volunteer.setActive(false);
        volunteer.setRejectionReason(reason);
        
        return volunteerRepository.save(volunteer);
    }
    
    public void deleteVolunteer(Long id) {
        volunteerRepository.deleteById(id);
    }
    
    public Volunteer getVolunteerById(Long id) {
        return volunteerRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Volunteer not found"));
    }
}