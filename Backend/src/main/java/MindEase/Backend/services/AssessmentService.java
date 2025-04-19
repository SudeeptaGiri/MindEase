package MindEase.Backend.services;

import MindEase.Backend.dto.AssessmentRequest;
import MindEase.Backend.entity.Assessment;
import MindEase.Backend.entity.User;
import MindEase.Backend.repositories.AssessmentRepository;
import MindEase.Backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public AssessmentService(AssessmentRepository assessmentRepository, UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
    }
    public List<Assessment> getAssessmentsByUserId(Long userId) {
        return assessmentRepository.findByUser_Id(userId);
    }
    

    public Assessment saveAssessment(AssessmentRequest dto) {
        if (dto == null || dto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
    
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    
        Assessment assessment = new Assessment();
        assessment.setAssessmentType(dto.getAssessmentType());
        assessment.setScore(dto.getScore());
        assessment.setRiskLevel(dto.getRiskLevel());
        assessment.setFollowUpDate(LocalDate.parse(dto.getFollowUpDate()).toString());
        assessment.setSuggestions(dto.getSuggestions());
        assessment.setUser(user);
    
        return assessmentRepository.save(assessment);
    }
}