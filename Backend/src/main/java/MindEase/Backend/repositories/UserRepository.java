package MindEase.Backend.repositories;

import MindEase.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by username
    Optional<User> findByUsername(String username);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Find users by location radius (in kilometers)
    @Query(value = "SELECT * FROM user u WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(u.latitude)) * " +
           "cos(radians(u.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(u.latitude)))) < :radius", 
           nativeQuery = true)
    List<User> findUsersWithinRadius(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radius") Double radiusInKm
    );
    
    // Find users with recent assessments
    @Query("SELECT DISTINCT u FROM User u JOIN u.assessments a WHERE a.followUpDate >= CURRENT_DATE")
    List<User> findUsersWithRecentAssessments();
    
    // Find users with pending tasks
    @Query("SELECT DISTINCT u FROM User u JOIN u.todoTasks t WHERE t.completed = false")
    List<User> findUsersWithPendingTasks();
    
    // Search users by username pattern
    List<User> findByUsernameContainingIgnoreCase(String usernamePattern);
}