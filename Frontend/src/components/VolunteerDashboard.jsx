// src/components/VolunteerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaChartLine, FaCommentDots, FaSpinner } from 'react-icons/fa';

const VolunteerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const volunteer = JSON.parse(sessionStorage.getItem('user'));
    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // This would be a real endpoint in a complete implementation
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      // For demo purposes, create some mock users
      setUsers([
        { id: 1, username: 'john_doe', lastAssessmentDate: '2023-05-15', riskLevel: 'Moderate Depression' },
        { id: 2, username: 'jane_smith', lastAssessmentDate: '2023-05-18', riskLevel: 'Mild Anxiety' },
        { id: 3, username: 'mike_johnson', lastAssessmentDate: '2023-05-10', riskLevel: 'Severe Depression' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssessments = async (userId) => {
    setLoadingAssessments(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/assessments/user/${userId}`);
      setAssessments(response.data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Failed to load assessments');
      // For demo purposes, create some mock assessments
      setAssessments([
        { 
          id: 1, 
          assessmentType: 'PHQ-9', 
          score: 15, 
          riskLevel: 'Moderate Depression', 
          createdAt: '2023-05-15T10:30:00',
          followUpDate: '2023-05-29'
        },
        { 
          id: 2, 
          assessmentType: 'GAD-7', 
          score: 12, 
          riskLevel: 'Moderate Anxiety', 
          createdAt: '2023-05-10T14:45:00',
          followUpDate: '2023-05-24'
        }
      ]);
    } finally {
      setLoadingAssessments(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserAssessments(user.id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  const getRiskLevelClass = (riskLevel) => {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';
    
    if (riskLevel.toLowerCase().includes('severe')) {
      return 'bg-red-100 text-red-800';
    } else if (riskLevel.toLowerCase().includes('moderate')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (riskLevel.toLowerCase().includes('mild')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Volunteer Dashboard</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Users
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-600 py-4">No users found</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedUser?.id === user.id
                        ? 'bg-teal-50 border-2 border-teal-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">Last assessment: {formatDate(user.lastAssessmentDate)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(user.riskLevel)}`}>
                        {user.riskLevel || 'No assessment'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Details and Assessments */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {selectedUser.username}'s Assessments
                </h2>
                
                {loadingAssessments ? (
                  <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
                  </div>
                ) : assessments.length === 0 ? (
                  <p className="text-gray-600 py-4">No assessments found for this user</p>
                ) : (
                  <div className="space-y-6">
                    {assessments.map((assessment) => (
                      <div key={assessment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{assessment.assessmentType} Assessment</h3>
                            <p className="text-sm text-gray-500">Taken on {formatDate(assessment.createdAt)}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(assessment.riskLevel)}`}>
                            {assessment.riskLevel}
                          </span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Score</p>
                            <p className="text-lg font-semibold">{assessment.score}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Follow-up Date</p>
                            <p className="text-lg font-semibold">{formatDate(assessment.followUpDate)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <button className="flex items-center text-teal-600 hover:text-teal-800">
                            <FaCommentDots className="mr-2" />
                            Send Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-full">
                <FaChartLine className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Select a user to view their assessment details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;