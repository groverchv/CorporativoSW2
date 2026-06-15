import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService.js";

const RoleRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.rol || "usuario_normal";

  // Comprobar si el rol del usuario está permitido
  const hasAccess = allowedRoles.some(
    (role) => role.toLowerCase() === userRole.toLowerCase()
  );

  if (!hasAccess) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default RoleRoute;
