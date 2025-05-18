// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';

const AdminDashboard = () => {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [approvedVolunteers, setApprovedVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'reject', 'approve'
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    fetchVolunteers();
  }, [navigate]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get('http://localhost:8080/api/volunteers/pending'),
        axios.get('http://localhost:8080/api/volunteers/approved')
      ]);
      
      setPendingVolunteers(pendingRes.data);
      setApprovedVolunteers(approvedRes.data);
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
    try {
      await axios.post(`http://localhost:8080/api/volunteers/${selectedVolunteer.id}/approve`);
      fetchVolunteers();
      setShowModal(false);
    } catch (err) {
      console.error('Error approving volunteer:', err);
      setError('Failed to approve volunteer');
    }
  };

  const rejectVolunteer = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/volunteers/${selectedVolunteer.id}/reject`, {
        reason: rejectionReason
      });
      fetchVolunteers();
      setShowModal(false);
    } catch (err) {
      console.error('Error rejecting volunteer:', err);
      setError('Failed to reject volunteer');
    }
  };

  const deleteVolunteer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/volunteers/${id}`);
      fetchVolunteers();
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      setError('Failed to delete volunteer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pending Volunteers Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Volunteer Applications
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
            </div>
          ) : pendingVolunteers.length === 0 ? (
            <p className="text-gray-600 py-4">No pending applications</p>
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
                  {pendingVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-700 font-medium text-sm">
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
                        <div className="text-sm text-gray-900">
                          {new Date(volunteer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewVolunteer(volunteer)}
                          className="text-teal-600 hover:text-teal-900 mr-3"
                        >
                          <FaEye className="inline-block mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleApproveClick(volunteer)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <FaCheck className="inline-block mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectClick(volunteer)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimes className="inline-block mr-1" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approved Volunteers Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Approved Volunteers
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin h-8 w-8 text-teal-500" />
            </div>
          ) : approvedVolunteers.length === 0 ? (
            <p className="text-gray-600 py-4">No approved volunteers</p>
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
                  {approvedVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-gray-50">
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
                        <div className="text-sm text-gray-900">
                          {new Date(volunteer.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewVolunteer(volunteer)}
                          className="text-teal-600 hover:text-teal-900 mr-3"
                        >
                          <FaEye className="inline-block mr-1" /> View
                        </button>
                        <button
                          onClick={() => deleteVolunteer(volunteer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline-block mr-1" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            {modalType === 'view' && (
              <div>
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Volunteer Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                    <p><strong>Full Name:</strong> {selectedVolunteer.fullName}</p>
                    <p><strong>Username:</strong> {selectedVolunteer.username}</p>
                    <p><strong>Email:</strong> {selectedVolunteer.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Professional Information</h4>
                    <p><strong>Credentials:</strong> {selectedVolunteer.credentials || 'N/A'}</p>
                    <p><strong>Specialization:</strong> {selectedVolunteer.specialization || 'N/A'}</p>
                    <p><strong>Experience:</strong> {selectedVolunteer.experience || '0'} years</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2"><strong>Certificate:</strong></p>
                      {selectedVolunteer.certificateImage ? (
                        <img
                          src={selectedVolunteer.certificateImage}
                          alt="Certificate"
                          className="w-full h-auto border rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-500">No certificate uploaded</p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2"><strong>ID Proof:</strong></p>
                      {selectedVolunteer.idProofImage ? (
                        <img
                          src={selectedVolunteer.idProofImage}
                          alt="ID Proof"
                          className="w-full h-auto border rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-500">No ID proof uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
                  >
                    Close
                  </button>
                  {!selectedVolunteer.approved && (
                    <>
                      <button
                        onClick={() => {
                          setModalType('approve');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg mr-2 hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setModalType('reject');
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {modalType === 'approve' && (
              <div>
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Approve Volunteer</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                
                <p className="mb-6">
                  Are you sure you want to approve <strong>{selectedVolunteer.fullName}</strong> as a volunteer?
                  This will grant them access to user assessments and allow them to provide support.
                </p>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={approveVolunteer}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            )}
            
            {modalType === 'reject' && (
              <div>
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Reject Volunteer</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                
                <p className="mb-4">
                  Please provide a reason for rejecting <strong>{selectedVolunteer.fullName}</strong>'s application:
                </p>
                
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 mb-6"
                  rows="4"
                  placeholder="Enter rejection reason..."
                ></textarea>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={rejectVolunteer}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;