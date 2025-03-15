package MindEase.Backend.services;

import MindEase.Backend.entity.Assessment;
import MindEase.Backend.repositories.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {
    @Autowired
    private AssessmentRepository assessmentRepository;

    public Assessment saveAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getAssessmentsByUserId(Long userId) {
        return assessmentRepository.findByUserId(userId);
    }
}
