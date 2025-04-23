import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>NaHora Merchant</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;