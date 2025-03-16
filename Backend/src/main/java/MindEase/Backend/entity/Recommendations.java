package MindEase.Backend.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Recommendations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "depression_id", nullable = true)
    private Assessment assessment;

    @ManyToOne
    @JoinColumn(name = "anxiety_id", nullable = true)
    private AnxietyAssessment anxietyAssessment ;

    @Column(name = "creation_date")
    Date creationDate ;

    @Column(name="recommendation_text")
    String recommendationText;

    @Column(name="follow_up_date")
    Date followUp;





}
