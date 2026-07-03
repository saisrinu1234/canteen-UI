import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AdminHome from "./pages/AdminHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/cart";
import AdminDashboard from "./pages/admindashboard";
import ViewItems from "./pages/view-items";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/add-produxt";
import AdminOrders from "./pages/adminorders";
import Refund from "./pages/Refund";

function AppContent() {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const role = localStorage.getItem("role");

  return (
    <Routes>
      {/* 🔁 Default route */}
      <Route
        path="/"
        element={
          authenticated ? (
            role === "ROLE_ADMIN" ? (
              <Navigate to="/admindashboard" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 🔐 Login */}
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/" /> : <Login />}
      />

      {/* 🔐 Register */}
      <Route
        path="/register"
        element={authenticated ? <Navigate to="/" /> : <Register />}
      />

      {/* 👤 USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* 👑 ADMIN DASHBOARD (PROTECTED) */}
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute roleRequired="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="adminorders" element={<AdminOrders />} />
        <Route path="view-items" element={<ViewItems />} />
        <Route path="refund" element={<Refund />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
