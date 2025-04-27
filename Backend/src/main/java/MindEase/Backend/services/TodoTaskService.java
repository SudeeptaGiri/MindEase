// services/TodoTaskService.java
package MindEase.Backend.services;

import MindEase.Backend.entity.TodoTask;
import MindEase.Backend.entity.User;
import MindEase.Backend.repositories.TodoTaskRepository;
import MindEase.Backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
@Transactional
public class TodoTaskService {
    private final TodoTaskRepository todoTaskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TodoTaskService(TodoTaskRepository todoTaskRepository, UserRepository userRepository) {
        this.todoTaskRepository = todoTaskRepository;
        this.userRepository = userRepository;
    }

    public List<TodoTask> getDailyTasks(Long userId) {
        LocalDateTime start = LocalDateTime.now().withHour(0).withMinute(0);
        LocalDateTime end = start.plusDays(1);
        
        List<TodoTask> tasks = new ArrayList<>();
        
        // Get regular tasks
        tasks.addAll(todoTaskRepository.findByUserIdAndScheduledDateBetweenOrderByScheduledDateAsc(
            userId, start, end));
        
        // Process recurring tasks
        List<TodoTask> recurringTasks = todoTaskRepository.findRecurringTasksByUserId(userId);
        processRecurringTasks(recurringTasks, userId, tasks);
        
        return tasks;
    }

    public List<TodoTask> getTasksByCategory(Long userId, TodoTask.TaskCategory category) {
        return todoTaskRepository.findByUserIdAndCategory(userId, category);
    }

    public TodoTask createTask(TodoTask task) {
        User user = userRepository.findById(task.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setUser(user);
        if (task.getScheduledDate() == null) {
            task.setScheduledDate(LocalDateTime.now());
        }
        
        return todoTaskRepository.save(task);
    }

    public List<TodoTask> createTasksFromAssessment(
        Long userId, 
        Long assessmentId, 
        Map<String, List<String>> categoryTasks
    ) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<TodoTask> tasks = new ArrayList<>();

        categoryTasks.forEach((category, tasksList) -> {
            tasksList.forEach(taskText -> {
                TodoTask task = TodoTask.builder()
                    .task(taskText)
                    .category(TodoTask.TaskCategory.valueOf(category))
                    .completed(false)
                    .user(user)
                    .sourceAssessmentId(assessmentId)
                    .scheduledDate(LocalDateTime.now())
                    .build();

                setRecurrencePattern(task);
                tasks.add(task);
            });
        });

        return todoTaskRepository.saveAll(tasks);
    }

    private void setRecurrencePattern(TodoTask task) {
        switch (task.getCategory()) {
            case DAILY:
                task.setRecurring(true);
                task.setRecurrencePattern("DAILY");
                break;
            case WEEKLY:
                task.setRecurring(true);
                task.setRecurrencePattern("WEEKLY");
                break;
            case MONTHLY:
                task.setRecurring(true);
                task.setRecurrencePattern("MONTHLY");
                break;
            case SOCIAL:
                task.setRecurring(true);
                task.setRecurrencePattern("WEEKLY");
                break;
            case SELF_CARE:
                task.setRecurring(true);
                task.setRecurrencePattern("DAILY");
                break;
            default:
                task.setRecurring(false);
        }
    }

    private void processRecurringTasks(List<TodoTask> recurringTasks, Long userId, List<TodoTask> allTasks) {
        LocalDateTime now = LocalDateTime.now();
        
        recurringTasks.forEach(task -> {
            if (shouldCreateNewInstance(task, now)) {
                TodoTask newInstance = createNewTaskInstance(task);
                allTasks.add(todoTaskRepository.save(newInstance));
            }
        });
    }

    private boolean shouldCreateNewInstance(TodoTask task, LocalDateTime now) {
        if (!task.isRecurring() || task.getScheduledDate() == null) return false;
        
        LocalDateTime lastScheduled = task.getScheduledDate();
        
        switch (task.getRecurrencePattern()) {
            case "DAILY":
                return lastScheduled.toLocalDate().isBefore(now.toLocalDate());
            case "WEEKLY":
                return lastScheduled.plusWeeks(1).isBefore(now);
            case "MONTHLY":
                return lastScheduled.plusMonths(1).isBefore(now);
            default:
                return false;
        }
    }

    private TodoTask createNewTaskInstance(TodoTask template) {
        return TodoTask.builder()
            .task(template.getTask())
            .category(template.getCategory())
            .user(template.getUser())
            .scheduledDate(LocalDateTime.now())
            .recurring(template.isRecurring())
            .recurrencePattern(template.getRecurrencePattern())
            .sourceAssessmentId(template.getSourceAssessmentId())
            .completed(false)
            .build();
    }

    public TodoTask updateTask(Long taskId, boolean completed) {
        TodoTask task = todoTaskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
            
        task.setCompleted(completed);
        
        // If task is recurring and completed, create next instance
        if (completed && task.isRecurring()) {
            createNewTaskInstance(task);
        }
        
        return todoTaskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        todoTaskRepository.deleteById(taskId);
    }
}