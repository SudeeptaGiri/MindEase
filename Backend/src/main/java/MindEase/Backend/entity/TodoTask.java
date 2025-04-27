// entity/TodoTask.java
package MindEase.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "todo_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Task description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String task;

    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskCategory category;

    @Column(nullable = false)
    private boolean completed = false;

    @NotNull(message = "Scheduled date is required")
    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "source_assessment_id")
    private Long sourceAssessmentId;

    @Column(name = "recurring")
    private boolean recurring = false;

    @Column(name = "recurrence_pattern")
    private String recurrencePattern;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum TaskCategory {
        DAILY("Daily Tasks"),
        WEEKLY("Weekly Goals"),
        MONTHLY("Monthly Goals"),
        SOCIAL("Social Connections"),
        SELF_CARE("Self-Care Activities"),
        PROFESSIONAL("Professional Support");

        private final String display;

        TaskCategory(String display) {
            this.display = display;
        }

        public String getDisplay() {
            return display;
        }
    }
}