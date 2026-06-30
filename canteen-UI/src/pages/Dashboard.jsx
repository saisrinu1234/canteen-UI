import { useState, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      localStorage.removeItem("accessToken");
      setAuthenticated(false);
      navigate("/login");
    }
  };
  const username = localStorage.getItem("usermail");
  return (
    <div className="dashboard">
      {/* Topbar */}
      <div className="topbar">
        {/* Hamburger menu */}
        <div className="hamburger" onClick={() => setOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* User icon */}
        <span className="user-icon">👤 {username}</span>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "show" : ""}`}>
        <span className="close" onClick={() => setOpen(false)}>
          ×
        </span>

        <p
          onClick={() => {
            navigate("/dashboard");
            setOpen(false);
          }}
        >
          Home
        </p>

        <p
          onClick={() => {
            navigate("/dashboard/profile");
            setOpen(false);
          }}
        >
          My Profile
        </p>
        <p
          onClick={() => {
            navigate("/dashboard/cart");
            setOpen(false);
          }}
        >
          Cart
        </p>
        <p
          onClick={() => {
            navigate("/dashboard/orders");
            setOpen(false);
          }}
        >
          Orders
        </p>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* 🔥 THIS RENDERS PAGES */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
