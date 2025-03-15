import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Digital Mental Health Assistant</h1>
      <p>Take a quick assessment to understand your mental well-being.</p>
      <Link to="/assessment">
        <button>Start Assessment</button>
      </Link>
    </div>
  );
};

export default Home;