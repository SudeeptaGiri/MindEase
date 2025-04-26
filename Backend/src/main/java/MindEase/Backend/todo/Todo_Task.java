package MindEase.Backend.todo;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "todo_task_list")
public class Todo_Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, length = 500)
    private String text;

    @Column(nullable = false)
    private boolean done;
}
