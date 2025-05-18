// repositories/AssessmentRepository.java
package MindEase.Backend.repositories;

import MindEase.Backend.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUser_Id(Long userId);
    
    @Query("SELECT a FROM Assessment a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    List<Assessment> findAllByUserIdOrdered(@Param("userId") Long userId);
}