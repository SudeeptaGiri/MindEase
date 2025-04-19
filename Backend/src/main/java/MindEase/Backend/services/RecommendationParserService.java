package MindEase.Backend.services;

import MindEase.Backend.entity.TodoTask;
import MindEase.Backend.entity.User;
import MindEase.Backend.repositories.TodoTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class RecommendationParserService {

    private final TodoTaskRepository todoTaskRepository;

    public RecommendationParserService(TodoTaskRepository todoTaskRepository) {
        this.todoTaskRepository = todoTaskRepository;
    }

    public void parseAndGenerateTasks(User user) {
        String recommendations = user.getRecommendations();
        if (recommendations == null || recommendations.isEmpty()) return;

        List<TodoTask> tasks = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Define simple patterns
        tasks.addAll(extractTasks("Daily Practices", recommendations, TodoTask.TaskCategory.DAILY, today));
        tasks.addAll(extractTasks("Weekly Practices", recommendations, TodoTask.TaskCategory.WEEKLY, today.plusDays(7)));
        tasks.addAll(extractTasks("Monthly Check-Ins", recommendations, TodoTask.TaskCategory.MONTHLY, today.plusDays(30)));
        tasks.addAll(extractTasks("Quarterly Goals", recommendations, TodoTask.TaskCategory.QUARTERLY, today.plusDays(90)));

        for (TodoTask task : tasks) {
            task.setUser(user);
        }

        todoTaskRepository.saveAll(tasks);
    }

    private List<TodoTask> extractTasks(String sectionTitle, String fullText, TodoTask.TaskCategory category, LocalDate date) {
        List<TodoTask> tasks = new ArrayList<>();
        int start = fullText.indexOf("### **" + sectionTitle + "**");
        if (start == -1) return tasks;

        int nextSection = fullText.indexOf("### **", start + 1);
        String sectionContent = (nextSection != -1)
                ? fullText.substring(start, nextSection)
                : fullText.substring(start);

        // Split lines and grab numbered or bulleted tasks
        String[] lines = sectionContent.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("- ") || line.matches("^\\d+\\.\\s+.*")) {
                String cleanTask = line.replaceFirst("^-\\s+", "").replaceFirst("^\\d+\\.\\s+", "").trim();
                if (!cleanTask.isEmpty()) {
                    TodoTask task = TodoTask.builder()  // Using Lombok builder
                            .task(cleanTask)
                            .category(category)
                            .scheduledDate(date.atTime(9, 0)) // Setting default time to 9:00 AM
                            .completed(false)
                            .build();
                    tasks.add(task);
                }
            }
        }

        return tasks;
    }

    // Helper method to convert String category to enum
    private TodoTask.TaskCategory parseCategory(String category) {
        try {
            return TodoTask.TaskCategory.valueOf(category);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid task category: " + category);
        }
    }
}