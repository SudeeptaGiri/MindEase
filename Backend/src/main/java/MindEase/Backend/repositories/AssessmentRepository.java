package MindEase.Backend.repositories;

import MindEase.Backend.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    // Find by user.id instead of userId
    @Query("SELECT a FROM Assessment a WHERE a.user.id = :userId ORDER BY a.followUpDate DESC")
    List<Assessment> findAllByUserIdOrdered(@Param("userId") Long userId);
    
    // Find latest assessment
    @Query("SELECT a FROM Assessment a WHERE a.user.id = :userId ORDER BY a.followUpDate DESC")
    Optional<Assessment> findLatestByUserId(@Param("userId") Long userId);
    
    // Check if exists using user.id
    @Query("SELECT COUNT(a) > 0 FROM Assessment a WHERE a.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);

    // If you need to find by user id directly
    List<Assessment> findByUser_Id(Long userId);
}