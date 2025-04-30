import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/orders">Pedidos</a></li>
        <li><a href="/">Sair</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;