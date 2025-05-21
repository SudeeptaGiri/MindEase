// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // Add framer-motion for premium animations
import Login from './components/Login';
import Register from './components/Register';
import Assessment from './components/Assessment';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import Helpline from './components/Helpline';
import FollowUp from './components/FollowUp';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import VolunteerRegister from './components/VolunteerRegister';
import AdminDashboard from './components/AdminDashboard';
import VolunteerDashboard from './components/VolunteerDashboard';
import AssessmentHistory from './components/AssessmentHistory';
import './styles/App.css';

// Subtle background patterns
import BackgroundPattern from './components/ui/BackgroundPattern';


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

const AppContent = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/volunteer-register', '/', '/volunteer-dashboard', '/admin-dashboard'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Subtle background pattern for visual depth */}
      <BackgroundPattern />
      
      {/* Floating UI elements for visual interest */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header with smooth reveal animation */}
      {showHeader && (
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm"
        >
          <Header />
        </motion.header>
      )}

      {/* Main Content with page transitions */}
      <main className={`flex-grow relative z-10 ${
        showHeader ? 'pt-16' : ''
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="h-full"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/volunteer-register" element={<VolunteerRegister />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/results" element={<Results />} />
              <Route path="/helpline" element={<Helpline />} />
              <Route path="/followup" element={<FollowUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
              <Route path="/assessment-history" element={<AssessmentHistory />} />
              {/* Add more routes as needed */}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with reveal animation */}
      {showHeader && (
        <motion.footer 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-auto relative z-10"
        >
          <Footer />
        </motion.footer>
      )}
    </div>
  );
};

export default App;