package MindEase.Backend.dto;
import lombok.Data;

@Data
public class AssessmentRequest {
    private String assessmentType;
    private Integer score;
    private String riskLevel;
    private String followUpDate;
    private String suggestions;
    private Long userId;
}
