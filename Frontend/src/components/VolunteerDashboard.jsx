// src/components/VolunteerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaChartLine, 
  FaCommentDots, 
  FaSpinner, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaSearch, 
  FaFilter, 
  FaUserCircle,
  FaClipboardCheck,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaQuestionCircle,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const VolunteerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New assessment from John Doe", read: false },
    { id: 2, message: "Follow-up reminder: Jane Smith", read: false }
  ]);
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
      // Get all users
      const response = await axios.get('http://localhost:8080/api/users');
      const usersData = response.data;
      
      // For each user, fetch their last assessment to get risk level
      const usersWithAssessments = await Promise.all(
        usersData.map(async (user) => {
          try {
            const assessmentResponse = await axios.get(`http://localhost:8080/api/assessments/user/${user.id}`);
            const userAssessments = assessmentResponse.data;
            
            // Sort assessments by createdAt date in descending order
            userAssessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Get the most recent assessment
            const lastAssessment = userAssessments.length > 0 ? userAssessments[0] : null;
            
            return {
              ...user,
              lastAssessmentDate: lastAssessment ? lastAssessment.createdAt : null,
              riskLevel: lastAssessment ? lastAssessment.riskLevel : 'No assessment'
            };
          } catch (err) {
            console.error(`Error fetching assessments for user ${user.id}:`, err);
            return {
              ...user,
              lastAssessmentDate: null,
              riskLevel: 'No assessment'
            };
          }
        })
      );
      
      setUsers(usersWithAssessments);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      // For demo purposes, create some mock users
      const mockUsers = [
        { id: 1, username: 'john_doe', fullName: 'John Doe', lastAssessmentDate: '2023-05-15', riskLevel: 'Moderate Depression', avatar: null },
        { id: 2, username: 'jane_smith', fullName: 'Jane Smith', lastAssessmentDate: '2023-05-18', riskLevel: 'Mild Anxiety', avatar: null },
        { id: 3, username: 'mike_johnson', fullName: 'Mike Johnson', lastAssessmentDate: '2023-05-10', riskLevel: 'Severe Depression', avatar: null },
        { id: 4, username: 'sarah_williams', fullName: 'Sarah Williams', lastAssessmentDate: '2023-05-20', riskLevel: 'Minimal Depression', avatar: null },
        { id: 5, username: 'alex_brown', fullName: 'Alex Brown', lastAssessmentDate: '2023-05-12', riskLevel: 'Severe Anxiety', avatar: null },
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssessments = async (userId) => {
    setLoadingAssessments(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/assessments/user/${userId}`);
      
      // Transform the assessment data to match our frontend structure
      const processedAssessments = response.data.map(assessment => {
        // Parse the suggestions field if it exists and is a JSON string
        let answers = [];
        if (assessment.suggestions) {
          try {
            const suggestionsObj = JSON.parse(assessment.suggestions);
            // Convert suggestions to answers format if possible
            if (suggestionsObj.responses) {
              answers = Object.entries(suggestionsObj.responses).map(([question, answer]) => ({
                question,
                answer: parseInt(answer) || 0
              }));
            }
          } catch (e) {
            console.error('Error parsing assessment suggestions:', e);
          }
        }
        
        return {
          id: assessment.id,
          assessmentType: assessment.assessmentType,
          score: assessment.score,
          riskLevel: assessment.riskLevel,
          createdAt: assessment.createdAt,
          followUpDate: assessment.followUpDate,
          answers: answers
        };
      });
      
      setAssessments(processedAssessments);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      // For demo purposes, create some mock assessments
      const mockAssessments = [
        { 
          id: 1, 
          assessmentType: 'PHQ-9', 
          score: 15, 
          riskLevel: 'Moderate Depression', 
          createdAt: '2023-05-15T10:30:00',
          followUpDate: '2023-05-29',
          answers: [
            { question: "Little interest or pleasure in doing things", answer: 2 },
            { question: "Feeling down, depressed, or hopeless", answer: 3 },
            { question: "Trouble falling or staying asleep", answer: 2 },
            { question: "Feeling tired or having little energy", answer: 3 },
            { question: "Poor appetite or overeating", answer: 1 },
            { question: "Feeling bad about yourself", answer: 2 },
            { question: "Trouble concentrating", answer: 1 },
            { question: "Moving or speaking slowly", answer: 0 },
            { question: "Thoughts of self-harm", answer: 1 }
          ]
        },
        { 
          id: 2, 
          assessmentType: 'GAD-7', 
          score: 12, 
          riskLevel: 'Moderate Anxiety', 
          createdAt: '2023-05-10T14:45:00',
          followUpDate: '2023-05-24',
          answers: [
            { question: "Feeling nervous, anxious, or on edge", answer: 2 },
            { question: "Not being able to stop or control worrying", answer: 3 },
            { question: "Worrying too much about different things", answer: 2 },
            { question: "Trouble relaxing", answer: 2 },
            { question: "Being so restless that it's hard to sit still", answer: 1 },
            { question: "Becoming easily annoyed or irritable", answer: 1 },
            { question: "Feeling afraid as if something awful might happen", answer: 1 }
          ]
        }
      ];
      setAssessments(mockAssessments);
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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  const getRiskLevelClass = (riskLevel) => {
    if (!riskLevel || riskLevel === 'No assessment') return 'bg-gray-100 text-gray-800';
    
    if (riskLevel.toLowerCase().includes('severe')) {
      return 'bg-red-100 text-red-800';
    } else if (riskLevel.toLowerCase().includes('moderate')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (riskLevel.toLowerCase().includes('mild')) {
      return 'bg-blue-100 text-blue-800';
    } else if (riskLevel.toLowerCase().includes('minimal')) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterRisk === 'all') return matchesSearch;
    
    if (filterRisk === 'severe') {
      return matchesSearch && user.riskLevel && user.riskLevel.toLowerCase().includes('severe');
    } else if (filterRisk === 'moderate') {
      return matchesSearch && user.riskLevel && user.riskLevel.toLowerCase().includes('moderate');
    } else if (filterRisk === 'mild') {
      return matchesSearch && user.riskLevel && user.riskLevel.toLowerCase().includes('mild');
    } else if (filterRisk === 'minimal') {
      return matchesSearch && user.riskLevel && user.riskLevel.toLowerCase().includes('minimal');
    }
    
    return matchesSearch;
  });

  const getScoreColor = (score, assessmentType) => {
    if (assessmentType === 'PHQ-9') {
      if (score >= 20) return 'text-red-600';
      if (score >= 15) return 'text-orange-600';
      if (score >= 10) return 'text-yellow-600';
      if (score >= 5) return 'text-blue-600';
      return 'text-green-600';
    }
    
    if (assessmentType === 'GAD-7') {
      if (score >= 15) return 'text-red-600';
      if (score >= 10) return 'text-orange-600';
      if (score >= 5) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    return 'text-gray-600';
  };

  const getAnswerColor = (answer) => {
    if (answer === 3) return 'bg-red-100 text-red-800';
    if (answer === 2) return 'bg-orange-100 text-orange-800';
    if (answer === 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* Logo */}
                <div className="h-8 w-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">MindfulSupport</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Help Button */}
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-3">
                  <FaQuestionCircle className="h-6 w-6" />
                </button>
                
                {/* Notification dropdown */}
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-3">
                    <span className="sr-only">View notifications</span>
                    <FaBell className="h-6 w-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>
                
                {/* Settings Button */}
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-3">
                  <FaCog className="h-6 w-6" />
                </button>
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <FaUserCircle className="h-6 w-6" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Volunteer</span>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              >
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center">
                    <FaUserCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Volunteer</div>
                  <div className="text-sm font-medium text-gray-500">volunteer@example.com</div>
                </div>
              </div>
              
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                <div className="flex items-center">
                  <FaBell className="mr-3 h-6 w-6 text-gray-500" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="ml-2 inline-block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </a>
              
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                <div className="flex items-center">
                  <FaCog className="mr-3 h-6 w-6 text-gray-500" />
                  Settings
                </div>
              </a>
              
              <a href="#" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                <div className="flex items-center">
                  <FaQuestionCircle className="mr-3 h-6 w-6 text-gray-500" />
                  Help & Support
                </div>
              </a>
              
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-3 h-6 w-6 text-red-500" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-teal-100 flex items-center">
              <div className="rounded-full bg-teal-100 p-3 mr-4">
                <FaUser className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100 flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <FaExclamationTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.riskLevel && u.riskLevel.toLowerCase().includes('severe')).length}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-yellow-100 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FaClipboardCheck className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Moderate Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.riskLevel && u.riskLevel.toLowerCase().includes('moderate')).length}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FaCalendarAlt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Follow-ups Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.followUpDate === new Date().toISOString().split('T')[0]).length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
              <button 
                className="ml-auto text-red-700 hover:text-red-900"
                onClick={() => setError('')}
              >
                &times;
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Users List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Users
                </h2>
                
                {/* Search and Filter */}
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select
                      value={filterRisk}
                      onChange={(e) => setFilterRisk(e.target.value)}
                      className="block w-full border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="all">All Risk Levels</option>
                      <option value="severe">Severe</option>
                      <option value="moderate">Moderate</option>
                      <option value="mild">Mild</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 py-4">No users found</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[600px] p-4">
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedUser?.id === user.id
                            ? 'bg-teal-50 border-l-4 border-teal-500 shadow-md'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.username} 
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              user.username.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="ml-4 flex-grow">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-900">{user.fullName || user.username}</div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(user.riskLevel)}`}>
                                {user.riskLevel || 'No assessment'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Last assessment: {formatDate(user.lastAssessmentDate)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Details and Assessments */}
            <div className="lg:col-span-2">
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="h-16 w-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                        {selectedUser.avatar ? (
                          <img 
                            src={selectedUser.avatar} 
                            alt={selectedUser.username} 
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          selectedUser.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="ml-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {selectedUser.fullName || selectedUser.username}
                        </h2>
                        <p className="text-gray-500">@{selectedUser.username}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(selectedUser.riskLevel)}`}>
                            {selectedUser.riskLevel || 'No assessment'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-auto">
{/*                         <button className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"> */}
{/*                           <FaCommentDots className="mr-2" /> */}
{/*                           Message */}
{/*                         </button> */}
                      </div>
                    </div>
                  </div>
                  
                  {/* Assessments */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Assessment History
                      </h2>
                    </div>
                    
                    {loadingAssessments ? (
                      <div className="flex justify-center items-center py-12">
                        <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
                      </div>
                    ) : assessments.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-600 py-4">No assessments found for this user</p>
                      </div>
                    ) : (
                      <div className="p-6 space-y-6">
                        {assessments.map((assessment) => (
                          <div key={assessment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-2 ${
                                    assessment.riskLevel && assessment.riskLevel.toLowerCase().includes('severe') ? 'bg-red-500' :
                                    assessment.riskLevel && assessment.riskLevel.toLowerCase().includes('moderate') ? 'bg-yellow-500' :
                                    assessment.riskLevel && assessment.riskLevel.toLowerCase().includes('mild') ? 'bg-blue-500' :
                                    'bg-green-500'
                                  }`}></div>
                                  <h3 className="font-medium text-gray-900">{assessment.assessmentType} Assessment</h3>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(assessment.riskLevel)}`}>
                                  {assessment.riskLevel}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Taken on {formatDateTime(assessment.createdAt)}</p>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Score</p>
                                  <p className={`text-2xl font-bold ${getScoreColor(assessment.score, assessment.assessmentType)}`}>
                                    {assessment.score}
                                  </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Follow-up Date</p>
                                  <p className="text-lg font-semibold text-gray-900">{formatDate(assessment.followUpDate)}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Responses</h4>
                                <div className="space-y-2">
                                  {assessment.answers && assessment.answers.length > 0 ? (
                                    assessment.answers.map((answer, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 flex-grow">{answer.question}</span>
                                        <span className={`ml-4 px-2 py-1 rounded ${getAnswerColor(answer.answer)}`}>
                                          {answer.answer}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">Confidential</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-between">
{/*                                 <button className="text-teal-600 hover:text-teal-800 flex items-center text-sm"> */}
{/*                                   <FaChartLine className="mr-1" /> */}
{/*                                   View Detailed Report */}
{/*                                 </button> */}
{/*                                 <button className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-4 py-2 rounded-lg text-sm flex items-center transition-colors"> */}
{/*                                   <FaCalendarAlt className="mr-2" /> */}
{/*                                   Schedule Follow-up */}
{/*                                 </button> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-full border border-gray-100 py-16">
                  <div className="bg-teal-50 p-6 rounded-full mb-4">
                    <FaChartLine className="h-12 w-12 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No User Selected</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Select a user from the list to view their assessment details and provide support.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;