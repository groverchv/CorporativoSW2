import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Perfil from "../pages/Auth/Perfil";
import Inicio from "../pages/Static/Inicio";
import Tecnologia from "../pages/Static/Tecnologia";
import Planes from "../pages/Static/Planes";
import Contacto from "../pages/Static/Contacto";
import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/tecnologia" element={<Tecnologia />} />
      <Route path="/planes" element={<Planes />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      
      {/* Ruta de Perfil de Usuario Protegida */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      {/* Fallback de redirección */}
      <Route path="/*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}
