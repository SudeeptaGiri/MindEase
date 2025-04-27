import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  FaHistory 
} from 'react-icons/fa';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [taskStatus, setTaskStatus] = useState({});
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
          Object.entries(latestSuggestions.categories).forEach(([category, data]) => {
            initialStatus[category] = data.tasks.map(() => false);
          });
          setTaskStatus(initialStatus);
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

  const latestAssessment = assessments[assessments.length - 1];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const handleTaskToggle = (category, taskIndex) => {
    setTaskStatus(prev => ({
      ...prev,
      [category]: prev[category].map((status, i) =>
        i === taskIndex ? !status : status
      ),
    }));
  };

  const renderSuggestionsCard = () => {
    if (!latestAssessment?.suggestions) return null;

    try {
      const suggestions = JSON.parse(latestAssessment.suggestions);
      const categories = Object.entries(suggestions.categories);
      const categoriesToShow = showAllCategories ? categories : categories.filter(([key]) => key === 'daily');

      return (
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Suggested Tasks</h2>
            {categories.length > 1 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-teal-600 hover:text-teal-700 flex items-center"
              >
                {showAllCategories ? (
                  <>Show Less <FaChevronUp className="ml-1" /></>
                ) : (
                  <>View More <FaChevronDown className="ml-1" /></>
                )}
              </button>
            )}
          </div>

          <div className="space-y-6">
            {categoriesToShow.map(([key, category]) => (
              <div
                key={key}
                className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg"
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
                        taskStatus[key]?.[index] ? "bg-green-50" : "bg-gray-50"
                      } hover:shadow-sm`}
                    >
                      <button
                        onClick={() => handleTaskToggle(key, index)}
                        className="flex-shrink-0 mt-0.5 focus:outline-none"
                      >
                        {taskStatus[key]?.[index] ? (
                          <FaCheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <FaRegCircle className="h-5 w-5 text-gray-400 hover:text-teal-500" />
                        )}
                      </button>
                      <span
                        className={`ml-3 text-gray-700 ${
                          taskStatus[key]?.[index] ? "line-through text-gray-500" : ""
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
        </div>
      );
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
     
<div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
  <button
    onClick={() => navigate('/assessment-history')}
    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
  >
    <FaHistory className="mr-2" />
    View All Assessments
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
            <p className="text-gray-600 mb-4">No assessments found. Please take one to get started.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Take Assessment
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-10">
              {/* Latest Assessment Card */}
              {latestAssessment && (
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Latest Assessment</h2>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Type:</span> {latestAssessment.assessmentType}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Score:</span> {latestAssessment.score}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Risk Level:</span> {latestAssessment.riskLevel}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Date:</span> {formatDate(latestAssessment.createdAt)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Follow-up:</span> {formatDate(latestAssessment.followUpDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Suggestions Card */}
              {renderSuggestionsCard()}
              

              {/* Score Trend Chart */}
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Score Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={assessments.map((a) => ({
                      date: formatDate(a.createdAt),
                      score: a.score,
                      type: a.assessmentType,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#0d9488" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                      name="Assessment Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;