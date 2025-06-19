import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  FaCheckCircle,
  FaRegCircle,
  FaSun,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaBriefcase,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaArrowRight,
  FaExclamationTriangle,
  FaChartLine,
  FaTasks,
  FaCalendarDay,
  FaClipboardCheck,
  FaInfoCircle,
  FaLightbulb,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
  FaPlus,
  FaEllipsisH
} from 'react-icons/fa';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [taskStatus, setTaskStatus] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const chartRef = useRef(null);
  const progressRef = useRef(null);
  const confettiRef = useRef(null);
  
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      daily: FaSun,
      weekly: FaCalendarAlt,
      social: FaUsers,
      selfCare: FaHeart,
      professional: FaBriefcase,
    };
    return icons[category] || FaSun;
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel?.includes('Severe')) return FaRegFrown;
    if (riskLevel?.includes('Moderate')) return FaRegMeh;
    return FaRegSmile;
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel?.includes('Severe')) return 'text-red-500';
    if (riskLevel?.includes('Moderate')) return 'text-amber-500';
    if (riskLevel?.includes('Mild')) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBg = (riskLevel) => {
    if (riskLevel?.includes('Severe')) return 'bg-red-50';
    if (riskLevel?.includes('Moderate')) return 'bg-amber-50';
    if (riskLevel?.includes('Mild')) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.id) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/assessments/user/${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const sorted = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setAssessments(sorted);

        // Initialize task status for the latest assessment
        if (sorted.length > 0) {
          const latestSuggestions = JSON.parse(sorted[sorted.length - 1].suggestions);
          const initialStatus = {};
          let totalTasks = 0;
          let completedTasks = 0;
          
          Object.entries(latestSuggestions.categories).forEach(([category, data]) => {
            // Check if there's stored status in localStorage
            const storedStatus = localStorage.getItem(`taskStatus_${sorted[sorted.length - 1].id}_${category}`);
            
            if (storedStatus) {
              const parsedStatus = JSON.parse(storedStatus);
              initialStatus[category] = parsedStatus;
              totalTasks += parsedStatus.length;
              completedTasks += parsedStatus.filter(status => status).length;
            } else {
              initialStatus[category] = data.tasks.map(() => false);
              totalTasks += data.tasks.length;
            }
          });
          
          setTaskStatus(initialStatus);
          setTotalTasksCount(totalTasks);
          setCompletedTasksCount(completedTasks);
        }
      } catch (err) {
        console.error('Failed to fetch assessments:', err);
        setError('Failed to load assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate]);

  useEffect(() => {
    // Animate progress bar when component mounts or completedTasksCount changes
    if (progressRef.current && totalTasksCount > 0) {
      gsap.to(progressRef.current, {
        width: `${(completedTasksCount / totalTasksCount) * 100}%`,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [completedTasksCount, totalTasksCount]);

  const latestAssessment = assessments[assessments.length - 1];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTaskToggle = (category, taskIndex) => {
    setTaskStatus(prev => {
      const updatedStatus = {
        ...prev,
        [category]: prev[category].map((status, i) =>
          i === taskIndex ? !status : status
        ),
      };
      
      // Save to localStorage
      if (latestAssessment) {
        localStorage.setItem(`taskStatus_${latestAssessment.id}_${category}`, 
          JSON.stringify(updatedStatus[category]));
      }
      
      // Count completed tasks
      let completed = 0;
      Object.values(updatedStatus).forEach(categoryStatus => {
        completed += categoryStatus.filter(status => status).length;
      });
      
      setCompletedTasksCount(completed);
      
      // Show celebration when all tasks in a category are completed
      const allCategoryCompleted = updatedStatus[category].every(status => status);
      if (allCategoryCompleted) {
        setShowCelebration(true);
        if (confettiRef.current) {
          launchConfetti();
        }
      }
      
      return updatedStatus;
    });
  };
  
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']
    });
  };

  const renderSuggestionsCard = () => {
    if (!latestAssessment?.suggestions) return null;

    try {
      const suggestions = JSON.parse(latestAssessment.suggestions);
      const categories = Object.entries(suggestions.categories);
      const categoriesToShow = showAllCategories ? categories : categories.filter(([key]) => key === 'daily');

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg mr-3">
                <FaTasks className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Wellness Tasks</h2>
            </div>
            {categories.length > 1 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-teal-600 hover:text-teal-700 flex items-center px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors"
              >
                {showAllCategories ? (
                  <>Show Less <FaChevronUp className="ml-1" /></>
                ) : (
                  <>View More <FaChevronDown className="ml-1" /></>
                )}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Task Completion</span>
              <span className="text-sm font-medium text-teal-600">
                {completedTasksCount}/{totalTasksCount} Tasks
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                ref={progressRef}
                className="h-full bg-teal-500"
                style={{ width: `${totalTasksCount ? (completedTasksCount / totalTasksCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {categoriesToShow.map(([key, category]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  {React.createElement(getCategoryIcon(key), {
                    className: "h-5 w-5 mr-2 text-teal-500",
                  })}
                  {category.title}
                </h4>
                <div className="space-y-3">
                  {category.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-start p-4 rounded-lg transition-all duration-200 ${
                        taskStatus[key]?.[index] 
                          ? "bg-green-50 border border-green-100" 
                          : "bg-gray-50 border border-gray-100"
                      } hover:shadow-sm`}
                    >
                      <button
                        onClick={() => handleTaskToggle(key, index)}
                        className="flex-shrink-0 mt-0.5 focus:outline-none"
                        aria-label={taskStatus[key]?.[index] ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          {taskStatus[key]?.[index] ? (
                            <FaCheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                          )}
                        </motion.div>
                      </button>
                      <span
                        className={`ml-3 text-gray-700 ${
                          taskStatus[key]?.[index] ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return null;
    }
  };

  const calculateScoreTrend = () => {
    if (assessments.length < 2) return null;
    
    const latest = assessments[assessments.length - 1];
    const previous = assessments[assessments.length - 2];
    
    const difference = latest.score - previous.score;
    const percentChange = ((difference / previous.score) * 100).toFixed(1);
    
    return {
      difference,
      percentChange,
      improved: difference < 0 // Lower score is better for mental health assessments
    };
  };

  const scoreTrend = calculateScoreTrend();

  const getAssessmentInsight = (assessment) => {
    if (!assessment) return null;
    
    const { assessmentType, score, riskLevel } = assessment;
    
    // Basic insights based on assessment type and risk level
    if (assessmentType === 'PHQ-9') {
      if (riskLevel.includes('Severe')) {
        return "Your depression symptoms are currently severe. Please consider reaching out to a mental health professional as soon as possible.";
      } else if (riskLevel.includes('Moderate')) {
        return "You're experiencing moderate depression symptoms. Regular self-care and professional support can help improve your mood.";
      } else {
        return "You're showing mild or minimal depression symptoms. Continue practicing self-care activities to maintain your mental well-being.";
      }
    } else if (assessmentType === 'GAD-7') {
      if (riskLevel.includes('Severe')) {
        return "Your anxiety levels are currently severe. Professional support can provide strategies to manage these symptoms.";
      } else if (riskLevel.includes('Moderate')) {
        return "You're experiencing moderate anxiety. Relaxation techniques and professional guidance can help reduce these feelings.";
      } else {
        return "You're showing mild or minimal anxiety symptoms. Continue with mindfulness practices to maintain your mental well-being.";
      }
    }
    
    return "Continue following your wellness plan and monitor your progress regularly.";
  };

  const openInsightModal = (assessment) => {
    setSelectedAssessment(assessment);
    setShowInsightModal(true);
  };

  // Prepare chart data with tooltips and formatting
  const prepareChartData = () => {
    return assessments.map((a) => ({
      date: formatDate(a.createdAt),
      score: a.score,
      type: a.assessmentType,
      riskLevel: a.riskLevel,
      fullDate: new Date(a.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].payload.fullDate}</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{payload[0].payload.type}:</span> {payload[0].value}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Risk Level:</span> {payload[0].payload.riskLevel}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-8 lg:px-16">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-teal-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
          <div className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        </div>
      </div>
      
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>
      
      {/* Celebration modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCelebration(false)}></div>
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl relative z-10 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
                  <FaCheckCircle className="h-12 w-12 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Great Progress!</h3>
                <p className="text-gray-600 mb-6">
                  You've completed all tasks in this category. Keep up the good work on your wellness journey!
                </p>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Insight Modal */}
      <AnimatePresence>
        {showInsightModal && selectedAssessment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Assessment Insights</h3>
                <button 
                  onClick={() => setShowInsightModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className={`p-4 rounded-lg mb-4 ${getRiskBg(selectedAssessment.riskLevel)}`}>
                <div className="flex items-start">
                  {React.createElement(getRiskIcon(selectedAssessment.riskLevel), {
                    className: `h-5 w-5 mt-0.5 mr-2 ${getRiskColor(selectedAssessment.riskLevel)}`
                  })}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedAssessment.assessmentType} Assessment</h4>
                    <p className="text-gray-700 mt-1">
                      Score: <span className="font-medium">{selectedAssessment.score}</span> • 
                      Risk Level: <span className={`font-medium ${getRiskColor(selectedAssessment.riskLevel)}`}>
                        {selectedAssessment.riskLevel}
                      </span>
                    </p>
                    <p className="text-gray-700 mt-1">
                      Taken on {formatDate(selectedAssessment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <FaLightbulb className="mr-2 text-amber-500" /> Insight
                </h4>
                <p className="text-gray-700">
                  {getAssessmentInsight(selectedAssessment)}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-500" /> Recommendations
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Continue following your personalized wellness plan</li>
                  <li>Schedule your follow-up assessment by {formatDate(selectedAssessment.followUpDate)}</li>
                  {selectedAssessment.riskLevel.includes('Severe') && (
                    <li className="text-red-600">Consider reaching out to a mental health professional</li>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowInsightModal(false);
                    navigate('/results', { 
                      state: {
                        score: selectedAssessment.score,
                        riskLevel: selectedAssessment.riskLevel,
                        assessmentType: selectedAssessment.assessmentType,
                        followUpDate: selectedAssessment.followUpDate,
                        suggestions: JSON.parse(selectedAssessment.suggestions),
                        id: selectedAssessment.id
                      }
                    });
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  View Full Results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wellness Dashboard</h1>
              <p className="text-gray-600">Track your progress and follow your personalized wellness plan</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => navigate('/assessment')}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center shadow-sm"
              >
                <FaPlus className="mr-2" />
                New Assessment
              </button>
              <button
                onClick={() => navigate('/assessment-history')}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center shadow-sm"
              >
                <FaHistory className="mr-2" />
                History
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tasks'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Wellness Tasks
                </button>
                <button
                  onClick={() => setActiveTab('trends')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'trends'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Trends & Insights
                </button>
              </nav>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center"
            >
              <FaExclamationTriangle className="h-5 w-5 mr-3" />
              <span>{error}</span>
            </motion.div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
              <p className="text-gray-500">Loading your wellness data...</p>
            </div>
          ) : assessments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100"
            >
              <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
                <FaClipboardCheck className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Wellness Journey</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Take your first assessment to get personalized insights and a wellness plan tailored to your needs.
              </p>
              <button
                onClick={() => navigate('/assessment')}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center mx-auto"
              >
                Take Assessment <FaArrowRight className="ml-2" />
              </button>
            </motion.div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Latest Assessment Card */}
                  {latestAssessment && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <FaClipboardCheck className="h-5 w-5 text-blue-600" />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800">Latest Assessment</h2>
                        </div>
                        <button
                          onClick={() => openInsightModal(latestAssessment)}
                          className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                        >
                          View Details <FaArrowRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Assessment Type</p>
                            <p className="text-lg font-medium text-gray-900">{latestAssessment.assessmentType}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Date Taken</p>
                            <p className="text-lg font-medium text-gray-900">{formatDate(latestAssessment.createdAt)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Follow-up Date</p>
                            <div className="flex items-center">
                              <FaCalendarDay className="text-teal-500 mr-2" />
                              <p className="text-lg font-medium text-gray-900">{formatDate(latestAssessment.followUpDate)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-500">Score</p>
                              {scoreTrend && (
                                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                                  scoreTrend.improved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {scoreTrend.improved ? '↓' : '↑'} {Math.abs(scoreTrend.percentChange)}%
                                </div>
                              )}
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{latestAssessment.score}</p>
                          </div>
                          
                          <div className={`mt-4 p-3 rounded-lg ${getRiskBg(latestAssessment.riskLevel)}`}>
                            <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                            <div className="flex items-center">
                              {React.createElement(getRiskIcon(latestAssessment.riskLevel), {
                                className: `h-5 w-5 mr-2 ${getRiskColor(latestAssessment.riskLevel)}`
                              })}
                              <p className={`text-lg font-medium ${getRiskColor(latestAssessment.riskLevel)}`}>
                                {latestAssessment.riskLevel}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-start">
                          <FaLightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-gray-700">
                            {getAssessmentInsight(latestAssessment)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Quick Actions Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate('/assessment')}
                        className="w-full flex items-center justify-between p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-teal-100 rounded-lg mr-3">
                            <FaClipboardCheck className="h-4 w-4 text-teal-600" />
                          </div>
                          <span>Take New Assessment</span>
                        </div>
                        <FaArrowRight className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => navigate('/resources')}
                        className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <FaHeart className="h-4 w-4 text-blue-600" />
                          </div>
                          <span>Wellness Resources</span>
                        </div>
                        <FaArrowRight className="h-4 w-4" />
                      </button>
                      
                     
                    </div>
                    
                    {latestAssessment && (
                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">Next Follow-up</p>
                        <div className="flex items-center">
                          <div className="p-2 bg-amber-100 rounded-lg mr-3">
                            <FaCalendarAlt className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{formatDate(latestAssessment.followUpDate)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
              
              {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 gap-6">
                  {renderSuggestionsCard()}
                </div>
              )}
              
              {activeTab === 'trends' && (
                <div className="grid grid-cols-1 gap-6">
                  {/* Score Trend Chart */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
                    ref={chartRef}
                  >
                    <div className="flex items-center mb-6">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <FaChartLine className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Assessment Score Trends</h2>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 text-sm">
                        {assessments.length > 1 
                          ? "Track how your mental health scores have changed over time. Lower scores generally indicate improvement."
                          : "Take more assessments to see your score trends over time."}
                      </p>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart
                        data={prepareChartData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#0d9488" 
                          fillOpacity={1}
                          fill="url(#colorScore)"
                          strokeWidth={2}
                          activeDot={{ r: 6, stroke: '#0d9488', strokeWidth: 2, fill: 'white' }}
                          name="Assessment Score"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {assessments.length > 1 && scoreTrend && (
                      <div className={`mt-6 p-4 rounded-lg ${scoreTrend.improved ? 'bg-green-50' : 'bg-amber-50'}`}>
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${scoreTrend.improved ? 'bg-green-100' : 'bg-amber-100'}`}>
                            {scoreTrend.improved ? (
                              <FaRegSmile className="h-5 w-5 text-green-600" />
                            ) : (
                              <FaRegMeh className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium ${scoreTrend.improved ? 'text-green-800' : 'text-amber-800'}`}>
                              {scoreTrend.improved ? 'Improvement Detected' : 'Attention Needed'}
                            </h4>
                            <p className={`mt-1 text-sm ${scoreTrend.improved ? 'text-green-700' : 'text-amber-700'}`}>
                              {scoreTrend.improved 
                                ? `Your score has improved by ${Math.abs(scoreTrend.percentChange)}% since your last assessment. Keep up the good work!` 
                                : `Your score has increased by ${Math.abs(scoreTrend.percentChange)}% since your last assessment. Consider reviewing your wellness plan.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Assessment History */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <FaHistory className="h-5 w-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Recent Assessments</h2>
                      </div>
                      <button
                        onClick={() => navigate('/assessment-history')}
                        className="text-teal-600 hover:text-teal-700 text-sm flex items-center"
                      >
                        View All <FaArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Risk Level
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {assessments.slice(-5).reverse().map((assessment) => (
                              <tr key={assessment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatDate(assessment.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assessment.assessmentType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {assessment.score}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    assessment.riskLevel.includes('Severe') ? 'bg-red-100 text-red-800' :
                                    assessment.riskLevel.includes('Moderate') ? 'bg-amber-100 text-amber-800' :
                                    assessment.riskLevel.includes('Mild') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {assessment.riskLevel}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => openInsightModal(assessment)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigate('/results', { 
                                          state: {
                                            score: assessment.score,
                                            riskLevel: assessment.riskLevel,
                                            assessmentType: assessment.assessmentType,
                                            followUpDate: assessment.followUpDate,
                                            suggestions: JSON.parse(assessment.suggestions),
                                            id: assessment.id
                                          }
                                        });
                                      }}
                                      className="text-teal-600 hover:text-teal-900"
                                    >
                                      View Results
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;