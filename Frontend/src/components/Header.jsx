import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaClipboardList,
  FaPhoneAlt,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaQuestion,
  FaRegLightbulb,
  FaRegChartBar,
  FaRegCommentDots
} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);

    // Mock notifications - in a real app, these would come from an API
    if (userData) {
      const mockNotifications = [
        {
          id: 1,
          type: 'reminder',
          message: 'Time for your weekly assessment',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false
        },
        {
          id: 2,
          type: 'achievement',
          message: 'You completed all daily tasks!',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true
        },
        {
          id: 3,
          type: 'info',
          message: 'New wellness resources available',
          date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setHasUnreadNotifications(mockNotifications.some(n => !n.read));
    }

    // Handle clicks outside of dropdown menus
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setHasUnreadNotifications(false);
  };

  const formatNotificationTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <FaClipboardList className="text-blue-500" />;
      case 'achievement':
        return <FaRegChartBar className="text-green-500" />;
      case 'info':
        return <FaRegLightbulb className="text-amber-500" />;
      default:
        return <FaRegCommentDots className="text-gray-500" />;
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">MindEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                isActive('/dashboard')
                  ? 'bg-teal-100 text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <FaHome className="mr-1.5 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/assessment"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                isActive('/assessment')
                  ? 'bg-teal-100 text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <FaClipboardList className="mr-1.5 h-4 w-4" />
              <span>Assessment</span>
            </Link>
            <Link
              to="/helpline"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                isActive('/helpline')
                  ? 'bg-teal-100 text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <FaPhoneAlt className="mr-1.5 h-4 w-4" />
              <span>Helpline</span>
              
            </Link>
{/*             
            <Link
              to="/resources"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                isActive('/resources')
                  ? 'bg-teal-100 text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <FaRegLightbulb className="mr-1.5 h-4 w-4" />
              <span>Resources</span>
            </Link>
            <Link
              to="/help"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                isActive('/help')
                  ? 'bg-teal-100 text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <FaQuestion className="mr-1.5 h-4 w-4" />
              <span>Help</span>
            </Link> */}
          </nav>

          {/* User Menu & Notifications */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                    aria-label="Notifications"
                  >
                    <FaBell className="h-5 w-5 text-gray-600" />
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                          {hasUnreadNotifications && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-xs text-teal-600 hover:text-teal-800"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-4 px-4 text-center">
                              <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div 
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors flex items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                              >
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatNotificationTime(notification.date)}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="px-4 py-2 border-t border-gray-100">
                          <Link 
                            to="/notifications"
                            className="text-xs text-center block text-teal-600 hover:text-teal-800"
                          >
                            View all notifications
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-teal-600 focus:outline-none group"
                  >
                    <div className="relative">
                      <img
                        className="h-9 w-9 rounded-full border-2 border-gray-200 group-hover:border-teal-300 transition-colors object-cover"
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=E2F5F5&color=0D9488`}
                        alt={user.username}
                      />
                      {user.role === 'ADMIN' && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div className="hidden lg:block">
                      <span className="block text-sm font-medium truncate max-w-[100px]">{user.username}</span>
                      <span className="block text-xs text-gray-500 truncate max-w-[100px]">
                        {user.role === 'ADMIN' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                    {showUserDropdown ? (
                      <FaChevronUp className="h-3 w-3 text-gray-400 hidden lg:block" />
                    ) : (
                      <FaChevronDown className="h-3 w-3 text-gray-400 hidden lg:block" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.fullName || user.username}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <FaUserCircle className="mr-3 h-4 w-4 text-gray-500" />
                            Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <FaCog className="mr-3 h-4 w-4 text-gray-500" />
                            Settings
                          </Link>
                          
                          {user.role === 'ADMIN' && (
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
                            >
                              <svg className="mr-3 h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Admin Dashboard
                            </Link>
                          )}
                        </div>
                        
                        <div className="py-1 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <FaSignOutAlt className="mr-3 h-4 w-4 text-red-500" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-teal-600 text-sm font-medium rounded-lg text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm hover:shadow transition-all"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {user && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5 text-gray-600" />
                {hasUnreadNotifications && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-inner">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  isActive('/dashboard')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <FaHome className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/assessment"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  isActive('/assessment')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <FaClipboardList className="mr-3 h-5 w-5" />
                Assessment
              </Link>
              <Link
                to="/helpline"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  isActive('/helpline')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <FaPhoneAlt className="mr-3 h-5 w-5" />
                Helpline
              </Link>
              <Link
                to="/resources"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  isActive('/resources')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <FaRegLightbulb className="mr-3 h-5 w-5" />
                Resources
              </Link>
              <Link
                to="/help"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  isActive('/help')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <FaQuestion className="mr-3 h-5 w-5" />
                Help
              </Link>
            </div>
            
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-teal-200"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=E2F5F5&color=0D9488`}
                      alt={user.username}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.fullName || user.username}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600 flex items-center"
                  >
                    <FaUserCircle className="mr-3 h-5 w-5" />
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600 flex items-center"
                  >
                    <FaCog className="mr-3 h-5 w-5" />
                    Settings
                  </Link>
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 flex items-center"
                    >
                      <svg className="mr-3 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-200 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-teal-600 text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Notifications Panel */}
      <AnimatePresence>
        {showNotifications && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 inset-x-4 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
            ref={notificationRef}
          >
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              {hasUnreadNotifications && (
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-teal-600 hover:text-teal-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-4 px-4 text-center">
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors flex items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatNotificationTime(notification.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-100">
              <Link 
                to="/notifications"
                className="text-xs text-center block text-teal-600 hover:text-teal-800"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;