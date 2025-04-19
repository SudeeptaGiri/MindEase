package MindEase.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
@Data
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String assessmentType;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Transient
    private String followUpDateStr;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Automatically sets createdAt before persisting
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void setFollowUpDate(String date) {
        this.followUpDateStr = date;
        this.followUpDate = LocalDate.parse(date);
    }
}
