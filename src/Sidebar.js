import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('merchantToken');
    navigate('/', { replace: true });
  };

  return (
    <div style={{ width: '200px', background: '#f4f4f4', padding: '1rem', height: '100vh' }}>
      <h3>Merchant Menu</h3>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
