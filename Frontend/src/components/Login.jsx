// src/components/Login.jsx (modified)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user', 'volunteer', 'admin'
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
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
        username,
        password,
      });
  
      let userData;
      if (userType === 'user') {
        userData = {
          ...response.data.user,
          role: 'USER'
        };
      } else if (userType === 'volunteer') {
        userData = response.data.volunteer;
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
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-sage-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {/* Logo and Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-teal-600 mb-2">MindEase</h1>
          <h2 className="text-xl text-gray-600 font-light">
            Welcome back to your mental wellness journey
          </h2>
        </div>

        {/* User Type Selection */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setUserType('user')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'user'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setUserType('volunteer')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'volunteer'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Volunteer
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'admin'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error and Success Messages */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 ease-in-out disabled:opacity-50"
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
                `Sign in as ${userType === 'user' ? 'User' : userType === 'volunteer' ? 'Volunteer' : 'Admin'}`
              )}
            </button>
          </div>
        </form>

        {/* Registration Links */}
        <div className="text-center mt-4">
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

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-teal-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;