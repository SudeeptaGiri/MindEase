// src/components/VolunteerRegister.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaGraduationCap, FaFileUpload } from 'react-icons/fa';

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    credentials: '',
    specialization: '',
    experience: '',
    certificateImage: null,
    idProofImage: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [e.target.name]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (!formData.certificateImage || !formData.idProofImage) {
      setError('Please upload both certificate and ID proof');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/volunteers/register', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        credentials: formData.credentials,
        specialization: formData.specialization,
        experience: formData.experience,
        certificateImage: formData.certificateImage,
        idProofImage: formData.idProofImage
      });
      
      setSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Volunteer Registration</h2>
            <p className="mt-2 text-gray-600">
              Join our team of mental health volunteers and make a difference
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Registration Successful!</h3>
              <p className="mb-4">
                Thank you for applying to be a volunteer. Your application has been submitted and is pending review by our administrators.
              </p>
              <p className="mb-6">
                You will receive an email notification once your application has been reviewed.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-teal-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-teal-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Credentials */}
                  <div>
                    <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">
                      Credentials*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="credentials"
                        name="credentials"
                        type="text"
                        required
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Licensed Counselor, MSW, PhD"
                        value={formData.credentials}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      value={formData.specialization}
                      onChange={handleChange}
                    >
                      <option value="">Select specialization</option>
                      <option value="Depression">Depression</option>
                      <option value="Anxiety">Anxiety</option>
                      <option value="Trauma">Trauma</option>
                      <option value="Addiction">Addiction</option>
                      <option value="Youth">Youth Counseling</option>
                      <option value="Family">Family Therapy</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Years of experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-teal-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Document Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload your professional certificate and identification for verification purposes.
                  All documents are securely stored and will only be reviewed by administrators.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Certificate Upload */}
                  <div>
                    <label htmlFor="certificateImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Certificate*
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="certificateImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="certificateImage"
                              name="certificateImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {formData.certificateImage && (
                      <p className="mt-2 text-sm text-green-600">Certificate uploaded successfully</p>
                    )}
                  </div>

                  {/* ID Proof Upload */}
                  <div>
                    <label htmlFor="idProofImage" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Proof*
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="idProofImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="idProofImage"
                              name="idProofImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {formData.idProofImage && (
                      <p className="mt-2 text-sm text-green-600">ID proof uploaded successfully</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4">
                <Link to="/" className="text-teal-600 hover:text-teal-800">
                  Back to Home
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegister;