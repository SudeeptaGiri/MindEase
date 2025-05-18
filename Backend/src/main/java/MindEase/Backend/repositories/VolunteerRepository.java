// MindEase.Backend.repositories.VolunteerRepository.java
package MindEase.Backend.repositories;

import MindEase.Backend.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    
    Optional<Volunteer> findByUsername(String username);
    
    Optional<Volunteer> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<Volunteer> findByApproved(Boolean approved);
    
    List<Volunteer> findByApprovedAndActive(Boolean approved, Boolean active);
    
    @Query("SELECT v FROM Volunteer v WHERE v.approved = false ORDER BY v.createdAt DESC")
    List<Volunteer> findPendingVolunteers();
}