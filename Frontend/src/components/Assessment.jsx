// src/components/Assessment.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const Assessment = () => {
  const [assessmentType, setAssessmentType] = useState('');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const progressBarRef = useRef(null);
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

  const assessmentInfo = {
    'PHQ-9': {
      title: 'Depression Screening (PHQ-9)',
      description: 'The Patient Health Questionnaire (PHQ-9) is a validated tool that screens for depression symptoms and their severity over the past two weeks.',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: 'indigo',
    },
    'GAD-7': {
      title: 'Anxiety Screening (GAD-7)',
      description: 'The Generalized Anxiety Disorder scale (GAD-7) is a validated tool that evaluates anxiety symptoms and their frequency over the past two weeks.',
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      color: 'teal',
    },
  };

  const responseLabels = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.id) {
      navigate('/login', { state: { from: '/assessment' } });
      return;
    }

    const savedType = localStorage.getItem('assessmentType');
    const savedAnswers = JSON.parse(localStorage.getItem('answers'));

    if (savedType) setAssessmentType(savedType);
    if (savedAnswers) setAnswers(savedAnswers);
  }, [navigate]);

  // Animation for progress bar
  useEffect(() => {
    if (assessmentType && progressBarRef.current) {
      const progress = Object.keys(answers).length / questions[assessmentType].length;
      gsap.to(progressBarRef.current, {
        width: `${progress * 100}%`,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [answers, assessmentType]);

  const handleAssessmentTypeChange = (type) => {
    setAssessmentType(type);
    setAnswers({});
    setCurrentQuestionIndex(0);
    localStorage.setItem('assessmentType', type);
    localStorage.removeItem('answers');
  };

  const handleAnswer = (questionId, value) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    
    // Auto-advance to next question with a slight delay
    setTimeout(() => {
      if (currentQuestionIndex < questions[assessmentType].length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions[assessmentType].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
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

  const calculateScore = async () => {
    setLoading(true);
    setGeneratingSuggestions(true);
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

      // Generate AI suggestions
      const API_KEY = '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';
      const prompt = `You are a mental health professional creating a wellness plan.
       Based on a ${assessmentType} assessment with a score of ${totalScore} indicating ${riskLevel}, create a structured wellness plan.
        Respond with ONLY a JSON object in this exact format, without any markdown or additional text:
      {
        "categories": {
          "daily": {
            "title": "Daily Tasks",
            "tasks": ["task1", "task2", "task3"]
          },
          "weekly": {
            "title": "Weekly Goals",
            "tasks": ["task1", "task2", "task3"]
          },
          "social": {
            "title": "Social Connections",
            "tasks": ["task1", "task2", "task3"]
          },
          "selfCare": {
            "title": "Self-Care Activities",
            "tasks": ["task1", "task2", "task3"]
          },
          "professional": {
            "title": "Professional Support",
            "tasks": ["task1", "task2", "task3"]
          }
        }
      }`;

      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Mental Health Assistant',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('Failed to generate suggestions');
      }
      console.log('AI response:', aiResponse);
      const aiData = await aiResponse.json();
      let suggestions;
      console.log('AI data:', aiData);
      try {
        const content = aiData.choices[0].message.content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        suggestions = JSON.parse(content);

        if (!suggestions.categories ||
            !suggestions.categories.daily ||
            !suggestions.categories.weekly ||
            !suggestions.categories.social ||
            !suggestions.categories.selfCare ||
            !suggestions.categories.professional) {
          throw new Error('Invalid suggestion structure');
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
        throw new Error('Invalid suggestions format received');
      }

      const assessmentData = {
        assessmentType: assessmentType,
        score: totalScore,
        riskLevel: riskLevel,
        followUpDate: followUpDate.toISOString().split('T')[0],
        suggestions: JSON.stringify(suggestions),
        userId: user.id
      };

      const response = await axios.post(
        'http://localhost:8080/api/assessments',
        assessmentData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.removeItem('assessmentType');
      localStorage.removeItem('answers');
      
      // Show completion animation before navigating
      setShowConfetti(true);
      setTimeout(() => {
        navigate('/results', {
          state: {
            ...assessmentData,
            suggestions: suggestions,
            id: response.data.id
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Full error:', error);
      setError(error.response?.data?.message || 'Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
      setGeneratingSuggestions(false);
    }
  };

  const isComplete = assessmentType && questions[assessmentType]?.length === Object.keys(answers).length;
  const currentColor = assessmentType ? assessmentInfo[assessmentType].color : 'teal';
  const colorClasses = {
    teal: {
      primary: 'bg-teal-600',
      light: 'bg-teal-50',
      hover: 'hover:bg-teal-700',
      border: 'border-teal-500',
      text: 'text-teal-600',
      progress: 'bg-teal-500',
      progressBg: 'bg-teal-100',
    },
    indigo: {
      primary: 'bg-indigo-600',
      light: 'bg-indigo-50',
      hover: 'hover:bg-indigo-700',
      border: 'border-indigo-500',
      text: 'text-indigo-600',
      progress: 'bg-indigo-500',
      progressBg: 'bg-indigo-100',
    }
  };

  // Confetti component for completion
  const Confetti = () => {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div className="relative w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const color = ['bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 'bg-blue-400', 'bg-green-400'][Math.floor(Math.random() * 5)];
            
            return (
              <div 
                key={i}
                className={`absolute ${color} rounded-full opacity-70`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-20px',
                  animation: `fall ${animationDuration}s ease-in ${delay}s forwards`
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-teal-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
          <div className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        </div>
      </div>
      
      {/* Confetti animation on completion */}
      {showConfetti && <Confetti />}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Mental Health Assessment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a moment to assess your mental well-being. Your responses are confidential and will help us provide personalized recommendations.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl shadow-sm"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {!assessmentType ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Select an Assessment Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(assessmentInfo).map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAssessmentTypeChange(type)}
                  className={`cursor-pointer bg-white border-2 ${
                    assessmentType === type 
                      ? `${colorClasses[assessmentInfo[type].color].border} ${colorClasses[assessmentInfo[type].color].light}` 
                      : 'border-gray-200 hover:border-gray-300'
                  } rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${colorClasses[assessmentInfo[type].color].light} mr-4`}>
                      {assessmentInfo[type].icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {assessmentInfo[type].title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {assessmentInfo[type].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${colorClasses[currentColor].light} mr-3`}>
                    {assessmentInfo[assessmentType].icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {assessmentInfo[assessmentType].title}
                  </h3>
                </div>
                <button 
                  onClick={() => setAssessmentType('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${colorClasses[currentColor].text}`}>
                    Question {currentQuestionIndex + 1} of {questions[assessmentType].length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((Object.keys(answers).length / questions[assessmentType].length) * 100)}% Complete
                  </span>
                </div>
                <div className={`h-2 rounded-full ${colorClasses[currentColor].progressBg} overflow-hidden`}>
                  <div 
                    ref={progressBarRef}
                    className={`h-full ${colorClasses[currentColor].progress}`}
                    style={{ width: `${(Object.keys(answers).length / questions[assessmentType].length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {questions[assessmentType][currentQuestionIndex]}
                    </h4>
                    
                    <div className="space-y-3">
                      {responseLabels.map((label, val) => (
                        <motion.div
                          key={val}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                            answers[`q${currentQuestionIndex}`] === val
                              ? `${colorClasses[currentColor].light} border-2 ${colorClasses[currentColor].border}`
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAnswer(`q${currentQuestionIndex}`, val)}
                        >
                          <div className="p-4 flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              answers[`q${currentQuestionIndex}`] === val
                                ? `${colorClasses[currentColor].border} ${colorClasses[currentColor].light}`
                                : 'border-gray-300 bg-white'
                            } flex items-center justify-center mr-4`}>
                              {answers[`q${currentQuestionIndex}`] === val && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-3 h-3 rounded-full ${colorClasses[currentColor].primary}`}
                                />
                              )}
                            </div>
                            <span className="text-gray-800 font-medium">{label}</span>
                          </div>
                          
                          {answers[`q${currentQuestionIndex}`] === val && (
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              className={`absolute bottom-0 h-1 ${colorClasses[currentColor].primary}`}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentQuestionIndex === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    {currentQuestionIndex < questions[assessmentType].length - 1 ? (
                      <button
                        onClick={goToNextQuestion}
                        disabled={!answers[`q${currentQuestionIndex}`] !== undefined}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          answers[`q${currentQuestionIndex}`] !== undefined
                            ? `text-${currentColor}-600 hover:bg-${currentColor}-50`
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Next
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={calculateScore}
                        disabled={!isComplete || loading}
                        className={`px-6 py-2 rounded-lg flex items-center ${
                          isComplete && !loading
                            ? `${colorClasses[currentColor].primary} ${colorClasses[currentColor].hover} text-white`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {generatingSuggestions ? 'Creating Your Plan...' : 'Processing...'}
                          </>
                        ) : (
                          <>
                            Submit Assessment
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Question navigation dots */}
            <div className="flex justify-center space-x-2 py-4">
              {questions[assessmentType].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentQuestionIndex === idx
                      ? `${colorClasses[currentColor].primary}`
                      : answers[`q${idx}`] !== undefined
                      ? `${colorClasses[currentColor].light} border border-${currentColor}-300`
                      : 'bg-gray-200'
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                />
              ))}
            </div>
            
            {/* Helpful tips */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Helpful Tip</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Answer based on how you've felt over the past two weeks. Your honest responses will help us provide the most appropriate recommendations.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Add global styles for confetti animation */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Assessment;