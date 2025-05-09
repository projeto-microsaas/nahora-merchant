import { Link } from "react-router-dom";
  import "./Sidebar.css";

  const Sidebar = () => {
    return (
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>
            <Link to="/deliveries/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/deliveries">Entregas</Link>
          </li>
          <li>
            <Link to="/deliveries/history">Histórico</Link>
          </li>
        </ul>
      </div>
    );
  };

  export default Sidebar;