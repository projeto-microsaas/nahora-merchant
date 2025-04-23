import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/create-order">Create Order</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;