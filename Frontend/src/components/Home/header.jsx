// src/components/header.jsx
import React, { useState, useCallback, useEffect } from "react";
import { Layout, Grid, Button, Space } from "antd";
import { MenuOutlined, DashboardOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService.js";
import Sidebar from "./sidebar.jsx";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

export default function Header() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm; // Móvil es menos de 576px
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleDrawer = useCallback(() => setOpenDrawer((v) => !v), []);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  const brandText = "Plan Risk 3D";

  const css = `
    /* Reset básico para el header de Antd */
    .ant-layout-header.app-header {
      display: flex;
      align-items: center;
      justify-content: space-between; /* Separa izquierda y derecha */
      height: 64px;
      padding: 0 24px;
      background: #0f172a; /* Slate 900 */
      border-bottom: 1px solid rgba(217, 119, 6, 0.15); /* Borde dorado */
      position: sticky;
      top: 0;
      z-index: 1100;
      line-height: normal;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    /* Contenedor izquierdo (Menu + Logo) */
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .app-header__brand {
      color: #f59e0b; /* Dorado */
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      font-family: inherit;
    }

    .app-header__brand:hover {
      color: #fbbf24;
    }

    /* Botones de la derecha */
    .app-header__right {
      display: flex;
      align-items: center;
    }

    .app-header__link {
      color: #f8fafc !important;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      border: 1px solid rgba(217, 119, 6, 0.3) !important;
      border-radius: 8px;
      padding: 6px 16px !important;
      background: rgba(217, 119, 6, 0.05);
      transition: all 0.3s ease;
    }
    
    .app-header__link:hover {
      background: rgba(217, 119, 6, 0.15) !important;
      border-color: #f59e0b !important;
      color: #f59e0b !important;
      transform: translateY(-1px);
    }

    /* Botón Hamburguesa */
    .hamburger-btn {
      color: #f8fafc !important;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
    }

    /* Ocultar hamburguesa en pantallas grandes */
    @media (min-width: 992px) {
      .hamburger-btn {
        display: none !important;
      }
      .header-left {
        gap: 0;
      }
    }

    /* ====== RESPONSIVE (MÓVIL) ====== */
    @media (max-width: 768px) {
      .ant-layout-header.app-header {
        height: 56px;
        padding: 0 16px;
      }

      .header-left {
        gap: 12px;
      }

      .app-header__brand {
        font-size: 18px;
      }
      
      .app-header__link {
        font-size: 12px;
        padding: 4px 10px !important;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>

      <AntHeader role="banner" className="app-header">
        {/* Lado Izquierdo: Menú + Logo */}
        <div className="header-left">
          <Button
            className="hamburger-btn"
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            aria-label="Menú"
          />
          <div 
            className="app-header__brand" 
            onClick={() => navigate("/")}
          >
            {brandText}
          </div>
        </div>

        {/* Lado Derecho: Acciones */}
        <Space className="app-header__right">
          {isAuthenticated ? (
            <Button
              type="text"
              className="app-header__link"
              icon={<UserOutlined />}
              onClick={() => navigate("/perfil")}
            >
              {!isMobile && "MI PERFIL"}
            </Button>
          ) : (
            <Button
              type="text"
              className="app-header__link"
              icon={!isMobile ? null : <LoginOutlined />} 
              onClick={() => navigate("/login")}
            >
              {isMobile ? "ACCEDER" : "INICIAR SESIÓN"}
            </Button>
          )}
        </Space>
      </AntHeader>

      <Sidebar open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </>
  );
}