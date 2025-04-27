import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Assessment from './components/Assessment';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import Helpline from './components/Helpline';
import FollowUp from './components/FollowUp';
import Header from './components/Header';
import Footer from './components/Footer';
import Todo from './components/Todo';
import AssessmentHistory from './components/AssessmentHistory';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/'];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {!hideHeaderRoutes.includes(location.pathname) && (
        <header className="fixed top-0 w-full z-50">
          <Header />
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${
        !hideHeaderRoutes.includes(location.pathname) ? 'pt-16' : ''
      }`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/helpline" element={<Helpline />} />
          <Route path="/followup" element={<FollowUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/assessment-history" element={<AssessmentHistory />} />
        </Routes>
      </main>

      {/* Footer */}
      {!hideHeaderRoutes.includes(location.pathname) && (
        <footer className="mt-auto">
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default App;