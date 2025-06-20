// src/components/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheck, FaTimes, FaTrash, FaEye, FaSpinner, FaUserShield, 
  FaUserClock, FaUserCheck, FaSearch, FaFileAlt, FaIdCard,
  FaEnvelope, FaBriefcase, FaGraduationCap, FaClock, FaCalendarAlt,
  FaFilter, FaDownload, FaExclamationTriangle
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [approvedVolunteers, setApprovedVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'reject', 'approve'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, specialization, experience
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0
  });
  const [actionLoading, setActionLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    fetchVolunteers();
  }, [navigate]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/volunteers/pending'),
        axios.get('http://localhost:8080/api/volunteers/approved')
      ]);
      
      setPendingVolunteers(pendingRes.data);
      setApprovedVolunteers(approvedRes.data);
      
      setStats({
        pending: pendingRes.data.length,
        approved: approvedRes.data.length,
        total: pendingRes.data.length + approvedRes.data.length
      });
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalType('view');
    setShowModal(true);
  };

  const handleApproveClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalType('approve');
    setShowModal(true);
  };

  const handleRejectClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalType('reject');
    setRejectionReason('');
    setShowModal(true);
  };

  const approveVolunteer = async () => {
    setActionLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/volunteers/${selectedVolunteer.id}/approve`);
      fetchVolunteers();
      setShowModal(false);
      
      // Show success notification
      showNotification('Volunteer approved successfully', 'success');
    } catch (err) {
      console.error('Error approving volunteer:', err);
      setError('Failed to approve volunteer');
      
      // Show error notification
      showNotification('Failed to approve volunteer', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const rejectVolunteer = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/volunteers/${selectedVolunteer.id}/reject`, {
        reason: rejectionReason
      });
      fetchVolunteers();
      setShowModal(false);
      
      // Show success notification
      showNotification('Volunteer application rejected', 'success');
    } catch (err) {
      console.error('Error rejecting volunteer:', err);
      setError('Failed to reject volunteer');
      
      // Show error notification
      showNotification('Failed to reject volunteer', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteVolunteer = async (id) => {
    setSelectedVolunteer(approvedVolunteers.find(v => v.id === id));
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDeleteVolunteer = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/volunteers/${selectedVolunteer.id}`);
      fetchVolunteers();
      setShowModal(false);
      
      // Show success notification
      showNotification('Volunteer removed successfully', 'success');
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      setError('Failed to delete volunteer');
      
      // Show error notification
      showNotification('Failed to remove volunteer', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const exportVolunteers = () => {
    const allVolunteers = [...pendingVolunteers, ...approvedVolunteers];
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Email,Status,Credentials,Specialization,Experience,Date Applied\n"
      + allVolunteers.map(v => {
          return `${v.id},"${v.fullName}","${v.email}","${v.approved ? 'Approved' : 'Pending'}","${v.credentials || ''}","${v.specialization || ''}","${v.experience || 0}","${new Date(v.createdAt).toLocaleDateString()}"`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification('Volunteer data exported successfully', 'success');
  };

  // Filter and search functionality
  const filteredPendingVolunteers = pendingVolunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (volunteer.specialization && volunteer.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'specialization') return matchesSearch && volunteer.specialization;
    if (filterBy === 'experience') return matchesSearch && volunteer.experience > 2;
    
    return matchesSearch;
  });
  
  const filteredApprovedVolunteers = approvedVolunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (volunteer.specialization && volunteer.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'specialization') return matchesSearch && volunteer.specialization;
    if (filterBy === 'experience') return matchesSearch && volunteer.experience > 2;
    
    return matchesSearch;
  });

  // Notification system
  const [notifications, setNotifications] = useState([]);
  
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center ${
                notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
              }`}
            >
              {notification.type === 'success' && <FaCheck className="mr-2" />}
              {notification.type === 'error' && <FaTimes className="mr-2" />}
              {notification.type === 'info' && <FaInfo className="mr-2" />}
              <span>{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <FaUserShield className="mr-3 text-indigo-600" /> 
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage volunteer applications and accounts</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={exportVolunteers}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FaDownload className="mr-2" /> Export Volunteers
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-100 mr-4">
                  <FaUserClock className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100 mr-4">
                  <FaUserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Volunteers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100 mr-4">
                  <FaUserShield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or specialization..."
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-lg text-black"
                />
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-sm font-medium text-gray-700">Filter:</label>
                <div className="relative inline-block text-left">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-gray-800 bg-white"
                  >
                    <option value="all" className="text-gray-800">All Volunteers</option>
                    <option value="specialization" className="text-gray-800">With Specialization</option>
                    <option value="experience" className="text-gray-800">Experienced (2+ years)</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start"
            >
              <FaExclamationTriangle className="h-5 w-5 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Pending Volunteers Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <FaUserClock className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Pending Volunteer Applications
              </h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <FaSpinner className="animate-spin h-8 w-8 text-indigo-500 mb-4" />
                <p className="text-gray-500">Loading volunteer data...</p>
              </div>
            ) : filteredPendingVolunteers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                {searchTerm || filterBy !== 'all' ? (
                  <p className="text-gray-600">No matching pending applications found</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mb-3">
                      <FaUserClock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-600">No pending volunteer applications</p>
                    <p className="text-gray-500 text-sm mt-2">New applications will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credentials
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Applied
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPendingVolunteers.map((volunteer) => (
                      <motion.tr 
                        key={volunteer.id} 
                        className="hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-700 font-medium text-sm">
                                {volunteer.fullName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{volunteer.fullName}</div>
                              <div className="text-sm text-gray-500">{volunteer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.credentials || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.specialization || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.experience || 0} years</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2 h-3 w-3" />
                            {new Date(volunteer.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewVolunteer(volunteer)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <FaEye className="mr-1" /> View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproveClick(volunteer)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <FaCheck className="mr-1" /> Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectClick(volunteer)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <FaTimes className="mr-1" /> Reject
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Approved Volunteers Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <FaUserCheck className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Approved Volunteers
              </h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <FaSpinner className="animate-spin h-8 w-8 text-green-500 mb-4" />
                <p className="text-gray-500">Loading volunteer data...</p>
              </div>
            ) : filteredApprovedVolunteers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                {searchTerm || filterBy !== 'all' ? (
                  <p className="text-gray-600">No matching approved volunteers found</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-3">
                      <FaUserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-gray-600">No approved volunteers yet</p>
                    <p className="text-gray-500 text-sm mt-2">Approved volunteers will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credentials
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Approved
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApprovedVolunteers.map((volunteer) => (
                      <motion.tr 
                        key={volunteer.id} 
                        className="hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-700 font-medium text-sm">
                                {volunteer.fullName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{volunteer.fullName}</div>
                              <div className="text-sm text-gray-500">{volunteer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.credentials || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.specialization || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.experience || 0} years</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2 h-3 w-3" />
                            {new Date(volunteer.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewVolunteer(volunteer)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <FaEye className="mr-1" /> View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteVolunteer(volunteer.id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <FaTrash className="mr-1" /> Remove
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedVolunteer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
          >
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-xl bg-white"
            >
              {modalType === 'view' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className={`p-2 rounded-lg ${selectedVolunteer.approved ? 'bg-green-100' : 'bg-indigo-100'} mr-3`}>
                        {selectedVolunteer.approved ? (
                          <FaUserCheck className={`h-5 w-5 text-green-600`} />
                        ) : (
                          <FaUserClock className={`h-5 w-5 text-indigo-600`} />
                        )}
                      </div>
                      Volunteer Details
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <FaIdCard className="mr-2 text-gray-500" /> Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.username}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <div className="flex items-center">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <FaBriefcase className="mr-2 text-gray-500" /> Professional Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Credentials</p>
                          <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.credentials || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.specialization || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <div className="flex items-center">
                            <FaClock className="text-gray-400 mr-2" />
                            <p className="ml-2 font-medium text-gray-600">{selectedVolunteer.experience || '0'} years</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <FaFileAlt className="mr-2 text-gray-500" /> Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Certificate</p>
                        {selectedVolunteer.certificateImage ? (
                          <div className="relative">
                            <img
                              src={selectedVolunteer.certificateImage}
                              alt="Certificate"
                              className="w-full h-auto border rounded-lg shadow-sm"
                            />
                            <a 
                              href={selectedVolunteer.certificateImage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No certificate uploaded</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">ID Proof</p>
                        {selectedVolunteer.idProofImage ? (
                          <div className="relative">
                            <img
                              src={selectedVolunteer.idProofImage}
                              alt="ID Proof"
                              className="w-full h-auto border rounded-lg shadow-sm"
                            />
                            <a 
                              href={selectedVolunteer.idProofImage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No ID proof uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    {!selectedVolunteer.approved && (
                      <>
                        <button
                          onClick={() => {
                            setModalType('approve');
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg mr-2 hover:bg-green-700 transition-colors"
                        >
                          <FaCheck className="inline-block mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            setModalType('reject');
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaTimes className="inline-block mr-1" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {modalType === 'approve' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="p-2 rounded-lg bg-green-100 mr-3">
                        <FaCheck className="h-5 w-5 text-green-600" />
                      </div>
                      Approve Volunteer
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaUserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          You are about to approve <strong>{selectedVolunteer.fullName}</strong> as a volunteer.
                          This will grant them access to user assessments and allow them to provide support.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Volunteer Summary</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FaIdCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <span className="ml-1 font-medium text-gray-800">{selectedVolunteer.fullName}</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FaGraduationCap className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-600">Credentials:</span>
                          <span className="ml-1 font-medium text-gray-800">{selectedVolunteer.credentials || 'N/A'}</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FaBriefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm text-gray-600">Experience:</span>
                          <span className="ml-1 font-medium text-gray-800">{selectedVolunteer.experience || '0'} years</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={approveVolunteer}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Confirm Approval
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {modalType === 'reject' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="p-2 rounded-lg bg-red-100 mr-3">
                        <FaTimes className="h-5 w-5 text-red-600" />
                      </div>
                      Reject Application
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Applicant</h4>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-medium text-sm">
                          {selectedVolunteer.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{selectedVolunteer.fullName}</div>
                        <div className="text-sm text-gray-500">{selectedVolunteer.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      rows="4"
                      placeholder="Please provide a detailed reason for rejection..."
                    ></textarea>
                    {error && error.includes('reason') && (
                      <p className="mt-2 text-sm text-red-600">
                        {error}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={rejectVolunteer}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTimes className="mr-2" />
                          Confirm Rejection
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {modalType === 'delete' && (
                <div>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div className="p-2 rounded-lg bg-red-100 mr-3">
                        <FaTrash className="h-5 w-5 text-red-600" />
                      </div>
                      Remove Volunteer
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <span className="text-2xl">&times;</span>
                    </button>
                  </div>
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          You are about to permanently remove <strong>{selectedVolunteer.fullName}</strong> from the volunteer database.
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Volunteer to Remove</h4>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-medium text-sm">
                          {selectedVolunteer.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{selectedVolunteer.fullName}</div>
                        <div className="text-sm text-gray-500">{selectedVolunteer.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteVolunteer}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTrash className="mr-2" />
                          Confirm Removal
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;