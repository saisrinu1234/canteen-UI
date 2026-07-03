import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AdminHome.css";

function AdminHome() {

  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/orders/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2 className="dashboard-title">Welcome Admin </h2>

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-icon blue">🍽</div>
          <div className="stat-info">
            <h2>{stats.totalItems}</h2>
            <p>Total Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div className="stat-info">
            <h2>{stats.totalOrders}</h2>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-info">
            <h2>{stats.pendingOrders}</h2>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">💰</div>
          <div className="stat-info">
            <h2>₹{stats.totalRevenue}</h2>
            <p>Total Revenue</p>
          </div>
        </div>

      </div>
    </>
  );
}

export default AdminHome;