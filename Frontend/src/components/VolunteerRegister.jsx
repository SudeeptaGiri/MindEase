import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaIdCard, 
  FaGraduationCap, 
  FaFileUpload, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaExclamationTriangle, 
  FaArrowLeft, 
  FaArrowRight, 
  FaShieldAlt, 
  FaBrain,
  FaHandHoldingHeart,
  FaInfoCircle,
  FaCalendarAlt,
  FaClipboardCheck,
  FaUserMd,
  FaTimes
} from 'react-icons/fa';

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    credentials: '',
    specialization: '',
    experience: '',
    bio: '',
    availability: '',
    certificateImage: null,
    idProofImage: null,
    agreeTerms: false,
    agreeCode: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    isValid: false
  });
  const [dragActive, setDragActive] = useState({
    certificate: false,
    idProof: false
  });
  const [previewImages, setPreviewImages] = useState({
    certificateImage: null,
    idProofImage: null
  });

  // Password requirements
  const passwordRequirements = [
    { id: 'length', label: 'At least 6 characters', test: (password) => password.length >= 6 },
    { id: 'uppercase', label: 'Contains uppercase letter', test: (password) => /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'Contains lowercase letter', test: (password) => /[a-z]/.test(password) },
    { id: 'number', label: 'Contains a number', test: (password) => /\d/.test(password) },
    { id: 'special', label: 'Contains special character', test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      const passedRequirements = passwordRequirements.filter(req => req.test(formData.password));
      const score = Math.min(5, passedRequirements.length);
      
      let feedback = '';
      if (score <= 2) feedback = 'Weak password';
      else if (score <= 4) feedback = 'Moderate password';
      else feedback = 'Strong password';
      
      setPasswordStrength({
        score,
        feedback,
        isValid: score >= 3
      });
    } else {
      setPasswordStrength({
        score: 0,
        feedback: '',
        isValid: false
      });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleBlur = (field) => {
    setTouched({...touched, [field]: true});
  };

  const handleDragEnter = (field, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({...dragActive, [field]: true});
  };

  const handleDragLeave = (field, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({...dragActive, [field]: false});
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (field, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({...dragActive, [field]: false});
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(field, e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(name, file);
    }
  };

  const handleFileUpload = (name, file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError(`File ${file.name} is too large. Maximum size is 10MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        [name]: reader.result
      });
      setPreviewImages({
        ...previewImages,
        [name]: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
  };

  const validateField = (field) => {
    if (!touched[field]) return null;

    switch (field) {
      case 'username':
        if (!formData.username.trim()) return 'Username is required';
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
        return null;
      case 'email':
        if (!formData.email) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Email is invalid';
        return null;
      case 'password':
        if (!formData.password) return 'Password is required';
        if (!passwordStrength.isValid) return 'Password does not meet requirements';
        return null;
      case 'confirmPassword':
        if (!formData.confirmPassword) return 'Please confirm your password';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return null;
      case 'fullName':
        if (!formData.fullName.trim()) return 'Full name is required';
        return null;
      case 'credentials':
        if (!formData.credentials.trim()) return 'Credentials are required';
        return null;
      default:
        return null;
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    let newError = '';

    if (step === 1) {
      // Validate account information
      if (!formData.username.trim()) {
        newError = 'Username is required';
        isValid = false;
      } else if (!formData.email.trim()) {
        newError = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newError = 'Email is invalid';
        isValid = false;
      } else if (!formData.password) {
        newError = 'Password is required';
        isValid = false;
      } else if (!passwordStrength.isValid) {
        newError = 'Password does not meet minimum requirements';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newError = 'Passwords do not match';
        isValid = false;
      }
    } else if (step === 2) {
      // Validate professional information
      if (!formData.fullName.trim()) {
        newError = 'Full name is required';
        isValid = false;
      } else if (!formData.credentials.trim()) {
        newError = 'Credentials are required';
        isValid = false;
      } else if (!formData.specialization) {
        newError = 'Please select a specialization';
        isValid = false;
      }
    } else if (step === 3) {
      // Validate document uploads
      if (!formData.certificateImage) {
        newError = 'Please upload your professional certificate';
        isValid = false;
      } else if (!formData.idProofImage) {
        newError = 'Please upload your ID proof';
        isValid = false;
      } else if (!formData.agreeTerms) {
        newError = 'You must agree to the Terms and Privacy Policy';
        isValid = false;
      } else if (!formData.agreeCode) {
        newError = 'You must agree to the Volunteer Code of Conduct';
        isValid = false;
      }
    }

    setError(newError);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
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
        bio: formData.bio,
        availability: formData.availability,
        certificateImage: formData.certificateImage,
        idProofImage: formData.idProofImage
      });
      
      console.log('Volunteer Registration Response:', response.data);
      setSuccess(true);
      window.scrollTo(0, 0);
      
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  // Progress steps
  const steps = [
    { number: 1, title: "Account Setup" },
    { number: 2, title: "Professional Info" },
    { number: 3, title: "Verification" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Logo and Branding */}
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-full p-4 shadow-md mb-4"
          >
            <FaHandHoldingHeart className="text-4xl text-gradient-to-r from-teal-500 to-blue-500" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
          >
            MindEase
          </motion.h1>
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white">
            <h2 className="text-3xl font-bold">Volunteer Registration</h2>
            <p className="mt-2 opacity-90">
              Join our team of mental health volunteers and make a difference
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep > step.number 
                          ? 'bg-teal-600 border-teal-600 text-white' 
                          : currentStep === step.number
                          ? 'bg-white border-teal-600 text-teal-600'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <FaCheck className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      currentStep >= step.number ? 'text-teal-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="w-full h-1 bg-gray-200 flex-1 mx-4">
                      <div 
                        className="h-full bg-teal-600 transition-all duration-300"
                        style={{ width: currentStep > step.number ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-lg text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 rounded-full p-4 mb-4">
                      <FaCheck className="text-green-600 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Application Submitted Successfully!</h3>
                    <p className="mb-4 max-w-md mx-auto">
                      Thank you for applying to be a volunteer with MindEase. Your application has been submitted and is pending review by our administrators.
                    </p>
                    <p className="mb-6 text-sm">
                      You will receive an email notification at <strong>{formData.email}</strong> once your application has been reviewed.
                    </p>
                    
                    <motion.div
                      className="relative pt-1 w-full max-w-md mb-6"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5 }}
                    >
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 4.5 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        ></motion.div>
                      </div>
                      <p className="text-xs text-green-600 mt-1">Redirecting to login page...</p>
                    </motion.div>
                    
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                    >
                      Go to Login Now
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-start mb-6">
                        <div className="flex-shrink-0 bg-teal-100 rounded-full p-2">
                          <FaUser className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-800">Account Information</h3>
                          <p className="text-gray-600">Create your volunteer account credentials</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="space-y-1">
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                              className={`text-black pl-10 w-full px-4 py-3 border ${
                                validateField('username') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="Choose a username"
                              value={formData.username}
                              onChange={handleChange}
                              onBlur={() => handleBlur('username')}
                            />
                          </div>
                          {validateField('username') && (
                            <p className="text-sm text-red-600">{validateField('username')}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                              className={`text-black pl-10 w-full px-4 py-3 border ${
                                validateField('email') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="Your email address"
                              value={formData.email}
                              onChange={handleChange}
                              onBlur={() => handleBlur('email')}
                            />
                          </div>
                          {validateField('email') && (
                            <p className="text-sm text-red-600">{validateField('email')}</p>
                          )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password*
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              className={`text-black pl-10 pr-10 w-full px-4 py-3 border ${
                                validateField('password') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="Create a password"
                              value={formData.password}
                              onChange={handleChange}
                              onBlur={() => handleBlur('password')}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {validateField('password') && (
                            <p className="text-sm text-red-600">{validateField('password')}</p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password*
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              required
                              className={`text-black pl-10 w-full px-4 py-3 border ${
                                validateField('confirmPassword') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              onBlur={() => handleBlur('confirmPassword')}
                            />
                          </div>
                          {validateField('confirmPassword') && (
                            <p className="text-sm text-red-600">{validateField('confirmPassword')}</p>
                          )}
                        </div>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 mr-2">Password Strength:</span>
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  passwordStrength.score <= 2 ? 'bg-red-500' : 
                                  passwordStrength.score <= 4 ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`ml-2 text-xs font-medium ${
                              passwordStrength.score <= 2 ? 'text-red-600' : 
                              passwordStrength.score <= 4 ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {passwordStrength.feedback}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {passwordRequirements.map((req) => (
                              <div key={req.id} className="flex items-center">
                                {req.test(formData.password) ? (
                                  <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                  <FaTimes className="h-4 w-4 text-red-500 mr-2" />
                                )}
                                <span className={req.test(formData.password) ? 'text-gray-600' : 'text-gray-500'}>
                                  {req.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-start mb-6">
                        <div className="flex-shrink-0 bg-teal-100 rounded-full p-2">
                          <FaUserMd className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-800">Professional Information</h3>
                          <p className="text-gray-600">Tell us about your qualifications and expertise</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
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
                              className={`text-black pl-10 w-full px-4 py-3 border ${
                                validateField('fullName') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="Your full name"
                              value={formData.fullName}
                              onChange={handleChange}
                              onBlur={() => handleBlur('fullName')}
                            />
                          </div>
                          {validateField('fullName') && (
                            <p className="text-sm text-red-600">{validateField('fullName')}</p>
                          )}
                        </div>

                        {/* Credentials */}
                        <div className="space-y-1">
                          <label htmlFor="credentials" className="block text-sm font-medium text-gray-700">
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
                              className={`text-black pl-10 w-full px-4 py-3 border ${
                                validateField('credentials') ? 'border-red-300' : 'border-gray-300'
                              } rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors`}
                              placeholder="e.g., Licensed Counselor, MSW, PhD"
                              value={formData.credentials}
                              onChange={handleChange}
                              onBlur={() => handleBlur('credentials')}
                            />
                          </div>
                          {validateField('credentials') && (
                            <p className="text-sm text-red-600">{validateField('credentials')}</p>
                          )}
                        </div>

                        {/* Specialization */}
                        <div className="space-y-1">
                          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                            Specialization*
                          </label>
                          <select
                            id="specialization"
                            name="specialization"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                            <option value="Stress">Stress Management</option>
                            <option value="Grief">Grief & Loss</option>
                            <option value="LGBTQ+">LGBTQ+ Support</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Years of Experience */}
                        <div className="space-y-1">
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                            Years of Experience*
                          </label>
                          <input
                            id="experience"
                            name="experience"
                            type="number"
                            min="0"
                            max="50"
                            required
                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            placeholder="Years of experience"
                            value={formData.experience}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        {/* Bio */}
                        <div className="space-y-1">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Professional Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            placeholder="Tell us about your professional background and approach to mental health support..."
                            value={formData.bio}
                            onChange={handleChange}
                          ></textarea>
                          <p className="text-xs text-gray-500">
                            This bio will be visible to users seeking support if your application is approved.
                          </p>
                        </div>

                        {/* Availability */}
                        <div className="space-y-1">
                          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                            Availability
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="availability"
                              name="availability"
                              type="text"
                              className="text-black pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors"
                              placeholder="e.g., Evenings and weekends, 10-15 hours per week"
                              value={formData.availability}
                              onChange={handleChange}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Indicate when you're typically available to provide support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-start mb-6">
                        <div className="flex-shrink-0 bg-teal-100 rounded-full p-2">
                          <FaClipboardCheck className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-800">Document Verification</h3>
                          <p className="text-gray-600">Upload your documents for verification</p>
                        </div>
                      </div>
                      
                      {/* Security Notice */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaShieldAlt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              Your documents are securely encrypted and only accessible to our verification team. We prioritize your privacy and data security.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Certificate Upload */}
                        <div className="space-y-2">
                          <label htmlFor="certificateImage" className="block text-sm font-medium text-gray-700">
                            Professional Certificate*
                          </label>
                          <div 
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-lg ${
                              dragActive.certificate 
                                ? 'border-teal-500 bg-teal-50' 
                                : formData.certificateImage 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 border-dashed'
                            }`}
                            onDragEnter={(e) => handleDragEnter('certificate', e)}
                            onDragLeave={(e) => handleDragLeave('certificate', e)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop('certificateImage', e)}
                          >
                            {previewImages.certificateImage ? (
                              <div className="space-y-2 text-center">
                                <img 
                                  src={previewImages.certificateImage} 
                                  alt="Certificate preview" 
                                  className="mx-auto h-32 object-cover rounded-md"
                                />
                                <div className="flex flex-col items-center">
                                  <FaCheck className="h-5 w-5 text-green-500" />
                                  <p className="text-sm text-green-600">Certificate uploaded</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({...formData, certificateImage: null});
                                      setPreviewImages({...previewImages, certificateImage: null});
                                    }}
                                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                                  >
                                    Remove file
                                  </button>
                                </div>
                              </div>
                            ) : (
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
                                      accept="image/*,.pdf"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ID Proof Upload */}
                        <div className="space-y-2">
                          <label htmlFor="idProofImage" className="block text-sm font-medium text-gray-700">
                            ID Proof*
                          </label>
                          <div 
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-lg ${
                              dragActive.idProof 
                                ? 'border-teal-500 bg-teal-50' 
                                : formData.idProofImage 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 border-dashed'
                            }`}
                            onDragEnter={(e) => handleDragEnter('idProof', e)}
                            onDragLeave={(e) => handleDragLeave('idProof', e)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop('idProofImage', e)}
                          >
                            {previewImages.idProofImage ? (
                              <div className="space-y-2 text-center">
                                <img 
                                  src={previewImages.idProofImage} 
                                  alt="ID proof preview" 
                                  className="mx-auto h-32 object-cover rounded-md"
                                />
                                <div className="flex flex-col items-center">
                                  <FaCheck className="h-5 w-5 text-green-500" />
                                  <p className="text-sm text-green-600">ID proof uploaded</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({...formData, idProofImage: null});
                                      setPreviewImages({...previewImages, idProofImage: null});
                                    }}
                                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                                  >
                                    Remove file
                                  </button>
                                </div>
                              </div>
                            ) : (
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
                                      accept="image/*,.pdf"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Terms and Agreements */}
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="agreeTerms"
                              name="agreeTerms"
                              type="checkbox"
                              checked={formData.agreeTerms}
                              onChange={handleChange}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                              I agree to the{' '}
                              <a href="/terms" className="text-teal-600 hover:text-teal-500 underline">
                                Terms of Service
                              </a>{' '}
                              and{' '}
                              <a href="/privacy" className="text-teal-600 hover:text-teal-500 underline">
                                Privacy Policy
                              </a>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="agreeCode"
                              name="agreeCode"
                              type="checkbox"
                              checked={formData.agreeCode}
                              onChange={handleChange}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="agreeCode" className="font-medium text-gray-700">
                              I agree to follow the{' '}
                              <a href="/code-of-conduct" className="text-teal-600 hover:text-teal-500 underline">
                                Volunteer Code of Conduct
                              </a>
                            </label>
                            <p className="text-gray-500 mt-1">
                              This includes maintaining confidentiality, providing respectful support, and upholding ethical standards.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between items-center">
                    {currentStep > 1 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
                        Back
                      </motion.button>
                    ) : (
                      <Link to="/" className="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-800">
                        <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
                        Back to Home
                      </Link>
                    )}
                    
                    {currentStep < 3 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Continue
                        <FaArrowRight className="ml-2 -mr-1 h-4 w-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
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
                          <>
                            Submit Application
                            <FaCheck className="ml-2 -mr-1 h-4 w-4" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-teal-600 h-5 w-5" />
            <h3 className="ml-2 text-lg font-semibold text-gray-800">About Volunteering with MindEase</h3>
          </div>
          <div className="text-gray-600 space-y-2 text-sm">
            <p>
              As a MindEase volunteer, you'll have the opportunity to provide valuable mental health support to those in need. Our volunteers typically commit 5-10 hours per week and receive ongoing training.
            </p>
            <p>
              After your application is submitted, our team will review your credentials and may contact you for a virtual interview. The verification process typically takes 3-5 business days.
            </p>
            <p>
              If you have any questions about the volunteer process, please contact us at <a href="mailto:volunteer@mindease.org" className="text-teal-600 hover:underline">volunteer@mindease.org</a>.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VolunteerRegister;