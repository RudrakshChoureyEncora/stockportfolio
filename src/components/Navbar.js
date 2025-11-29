// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
const Navbar = () => {
  const { user, logout, isTokenExpiringSoon } = useAuth();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Stockify</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Portfolio</Link>
            <Link to="/news">News</Link>
            <Link to="/profile">Profile</Link>
            {isTokenExpiringSoon() && (
              <span className="token-warning-badge"> </span>
            )}
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout ({user.username})
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login/Register</Link>
            <Link to="/news">News</Link>
            {/* <Link to="/register">Register</Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
