import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role")?.trim();

  // ❌ not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ role mismatch
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;