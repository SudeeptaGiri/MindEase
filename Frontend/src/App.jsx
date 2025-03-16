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
  const hideHeaderRoutes = ['/login', '/register','/'];

  return (
    <div className="App">
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/helpline" element={<Helpline />} />
        <Route path="/followup" element={<FollowUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* <Footer /> */}
    </div>
  );
};

export default App;
