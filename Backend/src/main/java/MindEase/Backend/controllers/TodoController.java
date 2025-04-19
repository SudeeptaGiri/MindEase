package MindEase.Backend.controllers;

import MindEase.Backend.entity.TodoTask;
import MindEase.Backend.services.TodoTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    @Autowired
    private TodoTaskService todoTaskService;

    @GetMapping("/user/{userId}/daily")
    public ResponseEntity<List<TodoTask>> getDailyTasks(@PathVariable Long userId) {
        try {
            List<TodoTask> tasks = todoTaskService.getDailyTasks(userId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<TodoTask>> getTasksByCategory(
        @PathVariable Long userId,
        @PathVariable TodoTask.TaskCategory category
    ) {
        try {
            List<TodoTask> tasks = todoTaskService.getTasksByCategory(userId, category);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/user/{userId}/assessment/{assessmentId}")
    public ResponseEntity<?> createFromAssessment(
        @PathVariable Long userId,
        @PathVariable Long assessmentId,
        @RequestBody Map<String, List<String>> categoryTasks
    ) {
        try {
            List<TodoTask> tasks = todoTaskService.createTasksFromAssessment(userId, assessmentId, categoryTasks);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<TodoTask> createTask(@RequestBody TodoTask task) {
        try {
            TodoTask savedTask = todoTaskService.createTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TodoTask> updateTask(
        @PathVariable Long taskId,
        @RequestBody Map<String, Boolean> update
    ) {
        try {
            TodoTask task = todoTaskService.updateTask(taskId, update.get("completed"));
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            todoTaskService.deleteTask(taskId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}