import React from 'react';
  import { Link } from 'react-router-dom';
  import './Sidebar.css';

  const Sidebar = () => {
    const handleLogout = () => {
      localStorage.removeItem('userToken');
      window.location.href = '/';
    };

    return (
      <div className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to="/dashboard/orders">Ver Pedidos</Link>
          </li>
          <li>
            <Link to="/dashboard/create-order">Criar Pedido</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </li>
        </ul>
      </div>
    );
  };

  export default Sidebar;
