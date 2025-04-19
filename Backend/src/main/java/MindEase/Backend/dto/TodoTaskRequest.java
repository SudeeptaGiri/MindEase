package MindEase.Backend.dto;

import lombok.Data;
@Data
public class TodoTaskRequest {
    private String task;
    private String category;
    private Long userId;
}