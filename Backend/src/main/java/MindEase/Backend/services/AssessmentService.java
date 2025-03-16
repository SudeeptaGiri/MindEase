package MindEase.Backend.services;

import MindEase.Backend.entity.Assessment;
import MindEase.Backend.entity.User;
import MindEase.Backend.repositories.AssessmentRepository;
import MindEase.Backend.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssessmentService {
    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Assessment saveAssessment(Assessment assessment, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        assessment.setUser(user);
        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getAssessmentsByUserId(Long userId) {
        return assessmentRepository.findByUserId(userId);
    }
}
