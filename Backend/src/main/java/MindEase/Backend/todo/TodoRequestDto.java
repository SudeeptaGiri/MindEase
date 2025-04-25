package MindEase.Backend.todo;



import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Data
public class TodoRequestDto {
    private Long userId;
    private Map<String, CategoryTasks> categories;

    @Data
    public static class CategoryTasks {
        private String title;
        private List<String> tasks;
    }
}
