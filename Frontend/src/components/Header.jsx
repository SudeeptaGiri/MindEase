import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/Dashboard">Home</Link>
        <Link to="/assessment">Take Assessment</Link>
        <Link to="/helpline">Helpline</Link>
      </nav>
    </header>
  );
};

export default Header;