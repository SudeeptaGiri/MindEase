package MindEase.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
public class AnxietyAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="score")
    private int score;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name="Date")
    private String followUpDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
