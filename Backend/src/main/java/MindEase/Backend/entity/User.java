package MindEase.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Lob
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Assessment> assessments = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<TodoTask> todoTasks = new ArrayList<>();

    // Helper methods
    public void addAssessment(Assessment assessment) {
        assessments.add(assessment);
        assessment.setUser(this);
    }

    public void removeAssessment(Assessment assessment) {
        assessments.remove(assessment);
        assessment.setUser(null);
    }

    public void addTodoTask(TodoTask task) {
        todoTasks.add(task);
        task.setUser(this);
    }

    public void removeTodoTask(TodoTask task) {
        todoTasks.remove(task);
        task.setUser(null);
    }
}