// src/components/AssessmentHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  FaArrowLeft
} from 'react-icons/fa';

const AssessmentHistory = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAssessments, setExpandedAssessments] = useState({});
  const [taskStatuses, setTaskStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

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

      // Sort assessments by date in descending order (newest first)
      const sorted = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAssessments(sorted);

      // Initialize task statuses for all assessments
      const initialStatuses = {};
      sorted.forEach(assessment => {
        if (assessment.suggestions) {
          const suggestions = JSON.parse(assessment.suggestions);
          initialStatuses[assessment.id] = {};
          Object.entries(suggestions.categories).forEach(([category, data]) => {
            initialStatuses[assessment.id][category] = data.tasks.map(() => false);
          });
        }
      });
      setTaskStatuses(initialStatuses);

    } catch (err) {
      console.error('Failed to fetch assessments:', err);
      setError('Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const toggleAssessmentExpansion = (assessmentId) => {
    setExpandedAssessments(prev => ({
      ...prev,
      [assessmentId]: !prev[assessmentId]
    }));
  };

  const handleTaskToggle = (assessmentId, category, taskIndex) => {
    setTaskStatuses(prev => ({
      ...prev,
      [assessmentId]: {
        ...prev[assessmentId],
        [category]: prev[assessmentId][category].map((status, i) =>
          i === taskIndex ? !status : status
        )
      }
    }));
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      'Minimal': 'text-green-600',
      'Mild': 'text-yellow-600',
      'Moderate': 'text-orange-600',
      'Moderately Severe': 'text-red-500',
      'Severe': 'text-red-600'
    };
    return colors[riskLevel.split(' ')[0]] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Assessment History</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : assessments.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">No assessment history found.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Take First Assessment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {assessment.assessmentType} Assessment
                      </h2>
                      <p className="text-gray-500">
                        Taken on {formatDate(assessment.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAssessmentExpansion(assessment.id)}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      {expandedAssessments[assessment.id] ? (
                        <FaChevronUp className="h-5 w-5" />
                      ) : (
                        <FaChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {assessment.score}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Risk Level</p>
                      <p className={`text-2xl font-semibold ${getRiskLevelColor(assessment.riskLevel)}`}>
                        {assessment.riskLevel}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Follow-up Date</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatDate(assessment.followUpDate)}
                      </p>
                    </div>
                  </div>

                  {expandedAssessments[assessment.id] && assessment.suggestions && (
                    <div className="mt-6 space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Suggested Tasks
                      </h3>
                      {Object.entries(JSON.parse(assessment.suggestions).categories).map(([key, category]) => (
                        <div
                          key={key}
                          className="bg-gray-50 rounded-xl p-6 transition-all duration-300"
                        >
                          <h4 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                            {React.createElement(getCategoryIcon(key), {
                              className: "h-6 w-6 mr-2 text-teal-500",
                            })}
                            {category.title}
                          </h4>
                          <div className="space-y-3">
                            {category.tasks.map((task, index) => (
                              <div
                                key={index}
                                className={`flex items-start p-4 rounded-lg transition-all duration-200 ${
                                  taskStatuses[assessment.id]?.[key]?.[index]
                                    ? "bg-green-50"
                                    : "bg-white"
                                } hover:shadow-sm`}
                              >
                                <button
                                  onClick={() => handleTaskToggle(assessment.id, key, index)}
                                  className="flex-shrink-0 mt-0.5 focus:outline-none"
                                >
                                  {taskStatuses[assessment.id]?.[key]?.[index] ? (
                                    <FaCheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                                  )}
                                </button>
                                <span
                                  className={`ml-3 text-gray-700 ${
                                    taskStatuses[assessment.id]?.[key]?.[index]
                                      ? "line-through text-gray-500"
                                      : ""
                                  }`}
                                >
                                  {task}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentHistory;