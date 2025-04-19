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
public class TodoTask extends BaseEntity {

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

    public enum TaskCategory {
        DAILY("Daily Practices"),
        WEEKLY("Weekly Practices"),
        MONTHLY("Monthly Check-Ins"),
        QUARTERLY("Quarterly Goals"),
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