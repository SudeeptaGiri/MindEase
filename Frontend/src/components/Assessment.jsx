import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Assessment = () => {
  const [assessmentType, setAssessmentType] = useState('');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  // Check authentication on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.id) {
      navigate('/login', { state: { from: '/assessment' } });
      return;
    }

    // Load saved progress if any
    const savedType = localStorage.getItem('assessmentType');
    const savedAnswers = JSON.parse(localStorage.getItem('answers'));

    if (savedType) setAssessmentType(savedType);
    if (savedAnswers) setAnswers(savedAnswers);
  }, [navigate]);

  const handleAssessmentTypeChange = (e) => {
    const type = e.target.value;
    setAssessmentType(type);
    setAnswers({});
    localStorage.setItem('assessmentType', type);
    localStorage.removeItem('answers');
  };

  const handleAnswer = (questionId, value) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    localStorage.setItem('answers', JSON.stringify(updatedAnswers));
  };

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

  const generateSuggestions = (type, score) => {
    if (type === 'PHQ-9') {
      if (score >= 20) return ['Seek immediate professional help', 'Practice mindfulness', 'Daily journaling'];
      if (score >= 15) return ['Consult a therapist', 'Stay active', 'Join a support group'];
      if (score >= 10) return ['Try meditation', 'Improve sleep hygiene', 'Talk to close ones'];
      if (score >= 5) return ['Engage in hobbies', 'Stay socially connected'];
      return ['Keep up the good work!', 'Maintain healthy habits'];
    }
    if (type === 'GAD-7') {
      if (score >= 15) return ['Seek professional therapy', 'Practice deep breathing', 'Use relaxation apps'];
      if (score >= 10) return ['Regular exercise', 'Limit caffeine', 'Try yoga'];
      if (score >= 5) return ['Listen to calming music', 'Maintain a routine'];
      return ['Continue doing what helps you stay calm'];
    }
    return [];
  };

  const calculateScore = async () => {
    setLoading(true);
    setError('');
  
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('Please log in to save your assessment');
      }
  
      const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
      const riskLevel = determineRiskLevel(totalScore);
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 14);
  
      const assessmentData = {
        assessmentType: assessmentType,
        score: totalScore,
        riskLevel: riskLevel,
        followUpDate: followUpDate.toISOString().split('T')[0],
        suggestions: generateSuggestions(assessmentType, totalScore).join(', '),
        userId: user.id
      };
  
      console.log('Sending assessment data:', assessmentData);
  
      const response = await axios.post(
        'http://localhost:8080/api/assessments',
        assessmentData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Response:', response.data);
  
      localStorage.removeItem('assessmentType');
      localStorage.removeItem('answers');
  
      navigate('/results', {
        state: {
          ...assessmentData,
          id: response.data.id
        }
      });
  
    } catch (error) {
      console.error('Full error:', error);
      setError(error.response?.data?.message || 'Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isComplete = assessmentType && questions[assessmentType]?.length === Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mental Health Assessment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a moment to assess your mental well-being. Your responses are confidential and will help us provide personalized recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Assessment Type Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Assessment Type:
          </label>
          <select
            value={assessmentType}
            onChange={handleAssessmentTypeChange}
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md shadow-sm"
          >
            <option value="">Select an assessment type</option>
            <option value="PHQ-9">PHQ-9 (Depression Screening)</option>
            <option value="GAD-7">GAD-7 (Anxiety Screening)</option>
          </select>
        </div>

        {/* Questions Section */}
        {assessmentType && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {assessmentType} Assessment
              </h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-teal-600">
                      {Math.round((Object.keys(answers).length / questions[assessmentType].length) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                  <div
                    style={{ width: `${(Object.keys(answers).length / questions[assessmentType].length) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions[assessmentType].map((question, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg"
              >
                <p className="text-lg text-gray-900 mb-4">
                  <span className="font-semibold text-teal-600">Q{index + 1}:</span> {question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((val) => (
                    <label
                      key={val}
                      className={`relative flex items-center p-4 rounded-lg cursor-pointer ${
                        answers[`q${index}`] === val
                          ? 'bg-teal-50 border-2 border-teal-500'
                          : 'bg-gray-50 border-2 border-gray-200'
                      } hover:bg-teal-50 transition-all duration-200`}
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        checked={answers[`q${index}`] === val}
                        onChange={() => handleAnswer(`q${index}`, val)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'][val]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-center pt-6 pb-12">
              <button
                onClick={calculateScore}
                disabled={!isComplete || loading}
                className={`
                  inline-flex items-center px-6 py-3 border border-transparent 
                  text-base font-medium rounded-md shadow-sm text-white 
                  ${
                    isComplete && !loading
                      ? 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                      : 'bg-gray-300 cursor-not-allowed'
                  }
                  transition-all duration-200
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : !isComplete ? (
                  'Please Answer All Questions'
                ) : (
                  'Submit Assessment'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Information Cards */}
        {!assessmentType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                PHQ-9 Assessment
              </h3>
              <p className="text-gray-600">
                Screens for depression symptoms and their severity over the past two weeks.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                GAD-7 Assessment
              </h3>
              <p className="text-gray-600">
                Evaluates anxiety symptoms and their frequency over the past two weeks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;