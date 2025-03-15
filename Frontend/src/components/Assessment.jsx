import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const Assessment = () => {
  const [assessmentType, setAssessmentType] = useState('');
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // Questions for PHQ-9 and GAD-7
  const questions = {
    'PHQ-9': [
      'Little interest or pleasure in doing things?',
      'Feeling down, depressed, or hopeless?',
      'Trouble falling or staying asleep, or sleeping too much?',
      'Feeling tired or having little energy?',
      'Poor appetite or overeating?',
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
      'Trouble concentrating on things, such as reading the newspaper or watching television?',
      'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?',
      'Thoughts that you would be better off dead or of hurting yourself in some way?',
    ],
    'GAD-7': [
      'Feeling nervous, anxious, or on edge?',
      'Not being able to stop or control worrying?',
      'Worrying too much about different things?',
      'Trouble relaxing?',
      'Being so restless that it is hard to sit still?',
      'Becoming easily annoyed or irritable?',
      'Feeling afraid as if something awful might happen?',
    ],
  };

  // Handle assessment type selection
  const handleAssessmentTypeChange = (e) => {
    setAssessmentType(e.target.value);
    setAnswers({}); // Reset answers
  };

  // Handle answer selection
  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Calculate total score and redirect to results page
  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const riskLevel = determineRiskLevel(totalScore);
    const followUpDate = scheduleFollowUp();

    // Redirect to results page with data
    navigate('/results', {
      state: {
        score: totalScore,
        riskLevel,
        assessmentType,
        followUpDate,
      },
    });
  };

  // Determine risk level based on score
  const determineRiskLevel = (totalScore) => {
    if (assessmentType === 'PHQ-9') {
      if (totalScore >= 20) return 'Severe Depression';
      else if (totalScore >= 15) return 'Moderately Severe Depression';
      else if (totalScore >= 10) return 'Moderate Depression';
      else if (totalScore >= 5) return 'Mild Depression';
      else return 'Minimal or No Depression';
    } else if (assessmentType === 'GAD-7') {
      if (totalScore >= 15) return 'Severe Anxiety';
      else if (totalScore >= 10) return 'Moderate Anxiety';
      else if (totalScore >= 5) return 'Mild Anxiety';
      else return 'Minimal or No Anxiety';
    }
  };

  // Schedule follow-up in 2 weeks
  const scheduleFollowUp = () => {
    const today = new Date();
    const followUp = new Date(today.setDate(today.getDate() + 14)); // 2 weeks later
    return followUp.toDateString();
  };

  return (
    <div>
      <h2>Mental Health Assessment</h2>
      <div>
        <label>Choose Assessment Type: </label>
        <select value={assessmentType} onChange={handleAssessmentTypeChange}>
          <option value="">Select</option>
          <option value="PHQ-9">PHQ-9 (Depression)</option>
          <option value="GAD-7">GAD-7 (Anxiety)</option>
        </select>
      </div>

      {assessmentType && (
        <div>
          <h3>{assessmentType} Questions</h3>
          {questions[assessmentType].map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <input type="radio" name={`q${index}`} onChange={() => handleAnswer(`q${index}`, 0)} /> Not at all<br />
              <input type="radio" name={`q${index}`} onChange={() => handleAnswer(`q${index}`, 1)} /> Several days<br />
              <input type="radio" name={`q${index}`} onChange={() => handleAnswer(`q${index}`, 2)} /> More than half the days<br />
              <input type="radio" name={`q${index}`} onChange={() => handleAnswer(`q${index}`, 3)} /> Nearly every day<br />
            </div>
          ))}
          <button onClick={calculateScore}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Assessment;