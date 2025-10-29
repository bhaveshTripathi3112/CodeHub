// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // If user not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    // If logged in but not admin, redirect to homepage
    return <Navigate to="/" replace />;
  }

  // ✅ User is authenticated and an admin
  return children;
}

export default AdminRoute;
