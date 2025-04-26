package MindEase.Backend.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoTaskRepository;

    public List<Todo_Task> saveTodoTasks(TodoRequestDto taskRequest) {
        List<Todo_Task> tasks = new ArrayList<>();

        for (Map.Entry<String, TodoRequestDto.CategoryTasks> entry : taskRequest.getCategories().entrySet()) {
            String category = entry.getKey();
            TodoRequestDto.CategoryTasks categoryTasks = entry.getValue();

            for (String taskText : categoryTasks.getTasks()) {
                Todo_Task task = new Todo_Task();
                task.setUserId(taskRequest.getUserId());
                task.setCategory(category);
                task.setText(taskText);
                task.setDone(false);
                tasks.add(task);
            }
        }

        return todoTaskRepository.saveAll(tasks);
    }

    public List<Todo_Task> getTodoTasksByUser(Long userId) {
        return todoTaskRepository.findByUserId(userId);
    }

    public List<Todo_Task> getTodoTasksByUserAndCategory(Long userId, String category) {
        return todoTaskRepository.findByUserIdAndCategory(userId, category);
    }

    public Todo_Task updateTodoTaskStatus(Long taskId, boolean done) {
        Todo_Task task = todoTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setDone(done);
        return todoTaskRepository.save(task);
    }

    public void deleteTodoTask(Long taskId) {
        todoTaskRepository.deleteById(taskId);
    }
}
