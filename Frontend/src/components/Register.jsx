import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft, 
  FaGoogle, 
  FaFacebookF, 
  FaCheck, 
  FaTimes, 
  FaInfoCircle,
  FaBrain,
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    agreeTerms: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    isValid: false
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
    firstName: false,
    lastName: false
  });
  
  const navigate = useNavigate();

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
      case 'firstName':
        if (currentStep === 2 && !formData.firstName.trim()) return 'First name is required';
        return null;
      case 'lastName':
        if (currentStep === 2 && !formData.lastName.trim()) return 'Last name is required';
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    // First step validation
    if (currentStep === 1) {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Email is invalid');
        return false;
      }
      if (!passwordStrength.isValid) {
        setError('Password does not meet minimum requirements');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      return true;
    }
    
    // Second step validation
    if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.lastName.trim()) {
        setError('Last name is required');
        return false;
      }
      if (!formData.agreeTerms) {
        setError('You must agree to the Terms and Privacy Policy');
        return false;
      }
      return true;
    }
    
    return false;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      console.log('Registration Response:', response.data);
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full mx-auto space-y-8"
      >
        {/* Logo and Branding */}
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-full p-4 shadow-md mb-4"
          >
            <FaBrain className="text-4xl text-gradient-to-r from-teal-500 to-blue-500" />
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
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStep === 1 ? 'Create your account' : 'Complete your profile'}
            </h2>
            <p className="mt-2 text-gray-600">
              {currentStep === 1 
                ? 'Join MindEase and start your wellness journey' 
                : 'Tell us a bit more about yourself'}
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center">
              <div className={`h-2 w-12 rounded-l-full ${currentStep === 1 ? 'bg-teal-500' : 'bg-teal-500'}`}></div>
              <div className={`h-2 w-12 rounded-r-full ${currentStep === 1 ? 'bg-gray-200' : 'bg-teal-500'}`}></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Step {currentStep} of 2
            </div>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.form 
                key="step1"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="space-y-6"
                onSubmit={handleNextStep}
              >
                {/* Username Field */}
                <div className="space-y-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
                        validateField('username') ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                    />
                  </div>
                  {validateField('username') && (
                    <p className="mt-1 text-sm text-red-600">{validateField('username')}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
                        validateField('email') ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                    />
                  </div>
                  {validateField('email') && (
                    <p className="mt-1 text-sm text-red-600">{validateField('email')}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-3 border ${
                        validateField('password') ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              passwordStrength.score <= 2 ? 'bg-red-500' : 
                              passwordStrength.score <= 4 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-gray-600">
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {passwordRequirements.map((req) => (
                          <div key={req.id} className="flex items-center text-sm">
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

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
                        validateField('confirmPassword') ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                    />
                  </div>
                  {validateField('confirmPassword') && (
                    <p className="mt-1 text-sm text-red-600">{validateField('confirmPassword')}</p>
                  )}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-md bg-red-50 p-4"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-md"
                  >
                    Continue
                    <FaArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="space-y-6"
                onSubmit={handleRegister}
              >
                {/* First Name Field */}
                <div className="space-y-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                      validateField('firstName') ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                  />
                  {validateField('firstName') && (
                    <p className="mt-1 text-sm text-red-600">{validateField('firstName')}</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                      validateField('lastName') ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                  />
                  {validateField('lastName') && (
                    <p className="mt-1 text-sm text-red-600">{validateField('lastName')}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-teal-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-teal-600 hover:text-teal-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-teal-600 hover:text-teal-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Data Security Notice */}
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaShieldAlt className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your data is encrypted and secure. We prioritize your privacy and will never share your information without consent.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-md bg-red-50 p-4"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-md bg-green-50 p-4"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Actions */}
                <div className="flex flex-col space-y-3">
                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your account...
                      </span>
                    ) : 'Complete Registration'}
                  </motion.button>
                  
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Back to Account Details
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Registration */}
          {currentStep === 1 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0 }}
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaGoogle className="text-red-500" />
                  <span className="sr-only">Sign up with Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0 }}
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaFacebookF className="text-blue-600" />
                  <span className="sr-only">Sign up with Facebook</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0 }}
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="text-black" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="sr-only">Sign up with GitHub</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="text-sm text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600">
            <FaArrowLeft className="mr-1" /> Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;