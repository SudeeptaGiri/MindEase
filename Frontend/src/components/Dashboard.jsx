import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

        // Sort assessments by date
        const sorted = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setAssessments(sorted);
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

  // Helper function to parse suggestions
  const parseSuggestions = (suggestionsStr) => {
    if (!suggestionsStr) return [];
    return typeof suggestionsStr === 'string' 
      ? suggestionsStr.split(',').map(s => s.trim())
      : Array.isArray(suggestionsStr) 
        ? suggestionsStr 
        : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
              {latestAssessment && (
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Suggestions</h2>
                  <ul className="space-y-2">
                    {parseSuggestions(latestAssessment.suggestions).map((suggestion, index) => (
                      <li 
                        key={index}
                        className="flex items-start text-gray-700"
                      >
                        <span className="mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;