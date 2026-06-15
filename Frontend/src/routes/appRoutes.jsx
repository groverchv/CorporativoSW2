import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import Login from "../pages/Auth/Login";
import Perfil from "../pages/Auth/Perfil";
import Inicio from "../pages/Static/Inicio";
import Tecnologia from "../pages/Static/Tecnologia";
import Planes from "../pages/Static/Planes";
import Contacto from "../pages/Static/Contacto";
import Terminos from "../pages/Static/Terminos";
import Privacidad from "../pages/Static/Privacidad";

// Guards
import PrivateRoute from "../components/PrivateRoute";
import RoleRoute from "../components/RoleRoute";

// Componentes del Dashboard
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import DashboardPlanes from "../pages/Dashboard/DashboardPlanes";
import DashboardHistorialPlanos from "../pages/Dashboard/DashboardHistorialPlanos";
import GestionarPresentacion from "../pages/Dashboard/GestionarPresentacion";
import GestionarUsuario from "../pages/Dashboard/PaqueteUsuario/GestionarUsuario";
import GestionarRol from "../pages/Dashboard/PaqueteUsuario/GestionarRol";
import GestionarRolUsuario from "../pages/Dashboard/PaqueteUsuario/GestionarRolUsuario";
import GestionarMenu from "../pages/Dashboard/PaqueteContenido/GestionarMenu";
import GestionarSub_Menu from "../pages/Dashboard/PaqueteContenido/GestionarSub_Menu";
import GestionarContenido from "../pages/Dashboard/PaqueteContenido/Contenido/GestionarContenido";
import ContentEditor from "../pages/Dashboard/PaqueteContenido/Contenido/ContentEditor";
import ClienteDashboard from "../pages/Dashboard/Cliente/ClienteDashboard";
import AuthService from "../services/AuthService.js";

// Redirección del Dashboard según Rol
function DashboardRedirect() {
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.rol || "usuario_normal";
  
  if (userRole.toLowerCase() === "administrador" || userRole.toLowerCase() === "admin") {
    return <Navigate to="/dashboard/admin-home" replace />;
  } else {
    return <Navigate to="/dashboard/cliente" replace />;
  }
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/tecnologia" element={<Tecnologia />} />
      <Route path="/planes" element={<Planes />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacidad" element={<Privacidad />} />
      
      {/* Ruta de Perfil de Usuario Protegida General redirigida al Dashboard */}
      <Route path="/perfil" element={<Navigate to="/dashboard/perfil" replace />} />

      {/* Rutas del Dashboard Protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {/* Redirección dinámica basada en el rol del usuario logueado */}
        <Route index element={<DashboardRedirect />} />

        {/* Ruta de Perfil común dentro del Dashboard */}
        <Route path="perfil" element={<Perfil />} />
        
        {/* Sub-rutas exclusivas del Administrador de la Empresa */}
        <Route
          path="admin-home"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <DashboardHome />
            </RoleRoute>
          }
        />
        <Route
          path="presentacion"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarPresentacion />
            </RoleRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarUsuario />
            </RoleRoute>
          }
        />
        <Route
          path="planes"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <DashboardPlanes />
            </RoleRoute>
          }
        />
        <Route
          path="historial-planos"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <DashboardHistorialPlanos />
            </RoleRoute>
          }
        />
        <Route
          path="roles"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarRol />
            </RoleRoute>
          }
        />
        <Route
          path="rol-usuario"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarRolUsuario />
            </RoleRoute>
          }
        />
        <Route
          path="menus"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarMenu />
            </RoleRoute>
          }
        />
        <Route
          path="sub_menus"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarSub_Menu />
            </RoleRoute>
          }
        />
        <Route
          path="contenido"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <GestionarContenido />
            </RoleRoute>
          }
        />
        <Route
          path="contenido/editar/:id"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <ContentEditor />
            </RoleRoute>
          }
        />
        <Route
          path="contenido/nuevo"
          element={
            <RoleRoute allowedRoles={["Administrador", "admin"]}>
              <ContentEditor />
            </RoleRoute>
          }
        />

        {/* Sub-ruta exclusiva para el Cliente (Free, Estrella, Premium) */}
        <Route
          path="cliente"
          element={
            <RoleRoute allowedRoles={["usuario_normal", "usuario_premium", "usuario_estrella"]}>
              <ClienteDashboard />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback de redirección */}
      <Route path="/*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}
