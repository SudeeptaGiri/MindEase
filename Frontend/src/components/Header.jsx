import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/path-to-your-logo.png" // Add your logo path
                alt="MindEase"
              />
              <span className="ml-2 text-xl font-bold text-teal-600">MindEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/dashboard')
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/assessment"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/assessment')
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              Assessment
            </Link>
            <Link
              to="/helpline"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/helpline')
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              Helpline
            </Link>
            {user && (
              <Link
                to="/todo"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/todo')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                Daily Tasks
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-teal-600 focus:outline-none">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-teal-200"
                    src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.username}
                    alt={user.username}
                  />
                  <span>{user.username}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-teal-100 text-teal-700'
                : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            Dashboard
          </Link>
          {/* Add other mobile menu items similarly */}
        </div>
        {user && (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.username}
                  alt={user.username}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.username}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600"
              >
                Your Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;