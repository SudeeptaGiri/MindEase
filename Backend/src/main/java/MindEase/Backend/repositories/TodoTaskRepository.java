package MindEase.Backend.repositories;

import MindEase.Backend.entity.TodoTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TodoTaskRepository extends JpaRepository<TodoTask, Long> {
    List<TodoTask> findByUserIdAndScheduledDateBetweenOrderByScheduledDateAsc(
        Long userId, LocalDateTime start, LocalDateTime end);
    
//    @Query("SELECT t FROM Todo_Task t WHERE t.user.id = :userId AND t.recurring = true")
//    List<TodoTask> findRecurringTasksByUserId(@Param("userId") Long userId);
//
    List<TodoTask> findByUserIdAndCategory(Long userId, TodoTask.TaskCategory category);
    
    List<TodoTask> findByUserIdAndSourceAssessmentId(Long userId, Long assessmentId);
}