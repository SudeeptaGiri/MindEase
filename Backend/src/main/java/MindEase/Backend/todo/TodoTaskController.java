package MindEase.Backend.todo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo-tasks")
public class TodoTaskController {

    private static final Logger logger = LoggerFactory.getLogger(TodoTaskController.class);

    @Autowired
    private TodoService todoTaskService;

    @PostMapping("/save")
    public ResponseEntity<List<Todo_Task>> saveTodoTasks(@RequestBody TodoRequestDto taskRequest) {
        logger.info("Received request to save todo tasks for user: {}", taskRequest.getUserId());
        List<Todo_Task> savedTasks = todoTaskService.saveTodoTasks(taskRequest);
        logger.info("Successfully saved {} todo tasks for user: {}", savedTasks.size(), taskRequest.getUserId());
        return ResponseEntity.ok(savedTasks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Todo_Task>> getTodoTasksByUser(@PathVariable Long userId) {
        logger.info("Fetching todo tasks for user: {}", userId);
        List<Todo_Task> tasks = todoTaskService.getTodoTasksByUser(userId);
        logger.info("Retrieved {} todo tasks for user: {}", tasks.size(), userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<Todo_Task>> getTodoTasksByUserAndCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        logger.info("Fetching todo tasks for user: {} in category: {}", userId, category);
        List<Todo_Task> tasks = todoTaskService.getTodoTasksByUserAndCategory(userId, category);
        logger.info("Retrieved {} todo tasks for user: {} in category: {}", tasks.size(), userId, category);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Todo_Task> updateTodoTaskStatus(
            @PathVariable Long taskId,
            @RequestParam boolean done) {
        logger.info("Updating status of todo task: {} to done: {}", taskId, done);
        Todo_Task updatedTask = todoTaskService.updateTodoTaskStatus(taskId, done);
        logger.info("Successfully updated status of todo task: {}", taskId);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTodoTask(@PathVariable Long taskId) {
        logger.info("Deleting todo task: {}", taskId);
        todoTaskService.deleteTodoTask(taskId);
        logger.info("Successfully deleted todo task: {}", taskId);
        return ResponseEntity.noContent().build();
    }
}