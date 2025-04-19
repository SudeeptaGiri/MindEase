package MindEase.Backend.services;

import MindEase.Backend.entity.TodoTask;
import MindEase.Backend.entity.User;
import MindEase.Backend.repositories.TodoTaskRepository;
import MindEase.Backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
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

    public List<TodoTask> createTasksFromAssessment(Long userId, Long assessmentId, Map<String, List<String>> categoryTasks) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<TodoTask> tasks = new ArrayList<>();

        categoryTasks.forEach((category, tasksList) -> {
            tasksList.forEach(taskText -> {
                TodoTask task = new TodoTask();
                task.setTask(taskText);
                try {
                    task.setCategory(TodoTask.TaskCategory.valueOf(category));
                } catch (IllegalArgumentException e) {
                    // Handle invalid category
                    task.setCategory(TodoTask.TaskCategory.DAILY);
                }
                task.setCompleted(false);
                task.setUser(user);
                task.setSourceAssessmentId(assessmentId);
                task.setScheduledDate(LocalDateTime.now());

                // Set recurrence based on category
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
            case QUARTERLY:
                task.setRecurring(true);
                task.setRecurrencePattern("QUARTERLY");
                break;
            case SOCIAL:
                task.setRecurring(true);
                task.setRecurrencePattern("WEEKLY");
                break;
            case SELF_CARE:
                task.setRecurring(true);
                task.setRecurrencePattern("DAILY");
                break;
            case PROFESSIONAL:
                task.setRecurring(false);
                break;
            default:
                task.setRecurring(false);
        }
    }

    private void processRecurringTasks(List<TodoTask> recurringTasks, Long userId, List<TodoTask> allTasks) {
        LocalDate today = LocalDate.now();
        
        recurringTasks.forEach(task -> {
            if (shouldCreateNewInstance(task)) {
                TodoTask newInstance = createNewTaskInstance(task);
                allTasks.add(todoTaskRepository.save(newInstance));
            }
        });
    }

    private boolean shouldCreateNewInstance(TodoTask task) {
        if (!task.isRecurring()) return false;
        
        LocalDateTime lastScheduled = task.getScheduledDate();
        LocalDateTime now = LocalDateTime.now();
        
        switch (task.getRecurrencePattern()) {
            case "DAILY":
                return lastScheduled.toLocalDate().isBefore(now.toLocalDate());
            case "WEEKLY":
                return lastScheduled.toLocalDate().plusWeeks(1).isBefore(now.toLocalDate());
            default:
                return false;
        }
    }

    private TodoTask createNewTaskInstance(TodoTask template) {
        TodoTask newTask = new TodoTask();
        newTask.setTask(template.getTask());
        newTask.setCategory(template.getCategory());
        newTask.setUser(template.getUser());
        newTask.setScheduledDate(LocalDateTime.now());
        newTask.setRecurring(template.isRecurring());
        newTask.setRecurrencePattern(template.getRecurrencePattern());
        newTask.setSourceAssessmentId(template.getSourceAssessmentId());
        return newTask;
    }

    public TodoTask createTask(TodoTask task) {
        User user = userRepository.findById(task.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setUser(user);
        task.setScheduledDate(LocalDateTime.now());
        setRecurrencePattern(task);
        
        return todoTaskRepository.save(task);
    }

    public TodoTask updateTask(Long taskId, boolean completed) {
        TodoTask task = todoTaskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(completed);
        return todoTaskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        todoTaskRepository.deleteById(taskId);
    }

    public List<TodoTask> getTasksByCategory(Long userId, TodoTask.TaskCategory category) {
        return todoTaskRepository.findByUserIdAndCategory(userId, category);
    }

    public List<TodoTask> getDailyTasks(Long userId) {
        return todoTaskRepository.findByUserIdAndScheduledDateBetweenOrderByScheduledDateAsc(userId, LocalDateTime.now(), LocalDateTime.now().plusDays(1));
    }
}