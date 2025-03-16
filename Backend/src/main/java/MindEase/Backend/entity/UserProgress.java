package MindEase.Backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "depression_id", nullable = true)
    private Assessment assessment;

    @ManyToOne
    @JoinColumn(name = "anxiety_id", nullable = true)
    private AnxietyAssessment anxietyAssessment ;

    @Column(name = "anxiety_prev_score")
    int anxietyPreviousScore;

    @Column(name = "anxiety_current_score")
    int anxietyCurrentScore;

    @Column(name = "depression_prev_score")
    int depressionPreviousScore;

    @Column(name = "anxiety_prev_score")
    int depressionCurrentScore;

    @Column(name = "status")
    String status;

    @Column(name = "created_at")
    Date createdAt;

    @Column(name = "follow_up")
    Date followUp;



}
