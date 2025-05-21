import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaLock, 
  FaUserMd, 
  FaUserShield, 
  FaArrowLeft, 
  FaGoogle, 
  FaFacebookF, 
  FaApple,
  FaEye,
  FaEyeSlash,
  FaBrain,
  FaHandHoldingHeart
} from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user', 'volunteer', 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved credentials
  useEffect(() => {
    const savedUserType = localStorage.getItem('preferredUserType');
    if (savedUserType) {
      setUserType(savedUserType);
    }
    
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  // Check if account is locked
  useEffect(() => {
    const lockedUntil = localStorage.getItem('accountLockedUntil');
    if (lockedUntil && new Date(lockedUntil) > new Date()) {
      setIsLocked(true);
      setLockTime(new Date(lockedUntil));
      
      const interval = setInterval(() => {
        if (new Date(lockedUntil) <= new Date()) {
          setIsLocked(false);
          localStorage.removeItem('accountLockedUntil');
          localStorage.removeItem('loginAttempts');
          setLoginAttempts(0);
          clearInterval(interval);
        } else {
          setLockTime(new Date(lockedUntil));
        }
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      const attempts = localStorage.getItem('loginAttempts');
      if (attempts) {
        setLoginAttempts(parseInt(attempts));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    localStorage.setItem('preferredUserType', type);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }
  
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      let endpoint;
      switch (userType) {
        case 'volunteer':
          endpoint = 'http://localhost:8080/api/volunteers/login';
          break;
        case 'admin':
          endpoint = 'http://localhost:8080/api/admin/login';
          break;
        default:
          endpoint = 'http://localhost:8080/api/users/login';
      }
      
      const response = await axios.post(endpoint, {
        username: formData.username,
        password: formData.password,
      });
  
      let userData;
      if (userType === 'user') {
        userData = {
          ...response.data.user,
          role: 'USER'
        };
      } else if (userType === 'volunteer') {
        userData = {
          ...response.data.volunteer,
          role: 'VOLUNTEER'
        };
      } else {
        userData = {
          ...response.data.admin,
          role: 'ADMIN'
        };
      }
  
      if (!userData || !userData.id) {
        throw new Error('User data not found in response');
      }
  
      // Save user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userType', userType);
      
      // Reset login attempts on successful login
      localStorage.removeItem('loginAttempts');
      setLoginAttempts(0);
      
      // Save username if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      }
  
      setSuccessMessage(`Welcome back, ${userData.username}!`);
  
      setTimeout(() => {
        if (userType === 'admin') {
          navigate('/admin-dashboard');
        } else if (userType === 'volunteer') {
          navigate('/volunteer-dashboard');
        } else {
          navigate(location.state?.from || '/dashboard');
        }
      }, 1500);
  
    } catch (error) {
      console.error('Login failed:', error);
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts);
      
      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockDuration = 5 * 60 * 1000; // 5 minutes
        const unlockTime = new Date(Date.now() + lockDuration);
        localStorage.setItem('accountLockedUntil', unlockTime.toISOString());
        setIsLocked(true);
        setLockTime(unlockTime);
        setError('Too many failed login attempts. Your account is locked for 5 minutes.');
      } else {
        if (error.response?.status === 401) {
          setError('Invalid username or password');
        } else if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError('Something went wrong. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (lockTime) => {
    if (!lockTime) return '';
    
    const now = new Date();
    const diff = Math.max(0, lockTime - now);
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const userTypeIcons = {
    user: <FaUser className="mr-2" />,
    volunteer: <FaHandHoldingHeart className="mr-2" />,
    admin: <FaUserShield className="mr-2" />
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full space-y-8"
      >
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
          
          <motion.h2 
            variants={itemVariants}
            className="mt-2 text-xl text-gray-600 font-light text-center"
          >
            Welcome back to your mental wellness journey
          </motion.h2>
        </div>

        <motion.div 
          variants={itemVariants}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        >
          {/* User Type Selection */}
          <div className="flex justify-center space-x-2 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUserTypeChange('user')}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                userType === 'user'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200`}
            >
              <FaUser className="mr-2" /> User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUserTypeChange('volunteer')}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                userType === 'volunteer'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200`}
            >
              <FaHandHoldingHeart className="mr-2" /> Volunteer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUserTypeChange('admin')}
              className={`px-4 py-2 rounded-lg flex items-center text-sm ${
                userType === 'admin'
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200`}
            >
              <FaUserShield className="mr-2" /> Admin
            </motion.button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {isLocked ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-lg bg-red-50 p-6 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-red-100 p-3 rounded-full mb-3">
                      <FaLock className="text-red-500 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Account Temporarily Locked</h3>
                    <p className="text-red-700 mb-4">
                      Too many failed login attempts. Please try again in:
                    </p>
                    <div className="text-2xl font-bold text-red-800 mb-3">
                      {formatTimeRemaining(lockTime)}
                    </div>
                    <p className="text-sm text-red-600">
                      For security purposes, your account has been temporarily locked.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMe}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  
                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 disabled:opacity-50 shadow-md"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {userTypeIcons[userType]}
                        Sign in as {userType === 'user' ? 'User' : userType === 'volunteer' ? 'Volunteer' : 'Admin'}
                      </span>
                    )}
                  </motion.button>
                  
                  {loginAttempts > 0 && loginAttempts < 5 && (
                    <p className="text-xs text-amber-600 text-center">
                      Failed attempts: {loginAttempts}/5
                      {loginAttempts >= 3 && (
                        <span className="block mt-1">
                          Warning: Your account will be temporarily locked after 5 failed attempts.
                        </span>
                      )}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error and Success Messages */}
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
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {error && !isLocked && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md bg-red-50 p-4"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social Login Options */}
          {!isLocked && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
                  <span className="sr-only">Sign in with Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0 }}
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaFacebookF className="text-blue-600" />
                  <span className="sr-only">Sign in with Facebook</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ y: 0 }}
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaApple className="text-gray-800" />
                  <span className="sr-only">Sign in with Apple</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Registration Links */}
          {!isLocked && (
            <div className="text-center mt-6">
              {userType === 'user' && (
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                    Start your wellness journey
                  </Link>
                </p>
              )}
              {userType === 'volunteer' && (
                <p className="text-sm text-gray-600">
                  Want to become a volunteer?{' '}
                  <Link to="/volunteer-register" className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-200">
                    Apply to be a volunteer
                  </Link>
                </p>
              )}
            </div>
          )}
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

export default Login;