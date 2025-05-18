package MindEase.Backend.todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo_Task, Long> {
    List<Todo_Task> findByUserId(Long userId);

    @Query("SELECT t FROM Todo_Task  t WHERE t.userId = :userId AND t.category = :category")
    List<Todo_Task> findByUserIdAndCategory(Long userId, String category);

}
