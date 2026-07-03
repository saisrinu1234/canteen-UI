import { useEffect } from "react";
import api from "../api/axios";
import "./admin.css";
import { useNavigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role")?.trim();

    if (!token || role !== "ROLE_ADMIN") {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      setAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <div className="admin-container">
      {/* 🔥 TOP NAV */}
      <div className="admin-nav">
        <h2>Admin Panel</h2>

        <div className="nav-links">
          <button onClick={() => navigate("")}>Home</button>
          <button onClick={() => navigate("view-items")}>🍽 View Items</button>
          <button onClick={() => navigate("add-product")}>
            ➕ Add Product
          </button>

          <button onClick={() => navigate("adminorders")}>📦 Orders</button>
          <button onClick={() => navigate("refund")}>💰 Refund</button>

          <button onClick={logout}>🚪 Logout</button>
        </div>
      </div>

      {/* 🔥 CHILD ROUTES */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
