// src/Components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        
    navigate("/login"); 
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="navbar">
      <div className="navbar-title">Employee Task Manager</div>

      {user && (
        <nav className="navbar-links">
          {isAdmin && (
            <NavLink to="/" end className="nav-link">
              Dashboard
            </NavLink>
          )}
          <NavLink to="/tasks" className="nav-link">
            Tasks
          </NavLink>
          {isAdmin && (
            <NavLink to="/employees" className="nav-link">
              Employees
            </NavLink>
          )}
        </nav>
      )}

      <div className="navbar-right">
        {user ? (
          <>
            <span className="nav-user">
              {user.name} ({user.role})
            </span>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
