// src/components/Home/navbar.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import AuthService from "../../services/AuthService";

export default function Navbar() {
  const { pathname } = useLocation();
  const [hoverKey, setHoverKey] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, [pathname]);

  const items = [
    { key: "inicio", label: "Inicio", href: "/inicio", icon: <HomeOutlined /> },
    { key: "tecnologia", label: "Tecnología", href: "/tecnologia", icon: <AppstoreOutlined /> },
    { key: "planes", label: "Servicios & Planes", href: "/planes", icon: <ShoppingOutlined /> },
    { key: "contacto", label: "Contacto", href: "/contacto", icon: <PhoneOutlined /> },
  ];

  if (isAuthenticated) {
    items.push({ key: "perfil", label: "Mi Perfil", href: "/perfil", icon: <UserOutlined /> });
  }

  return (
    <>
      <style>{`
        :root {
          --nav-bg: #0b0f19; /* Fondo ultra oscuro */
          --nav-hover-bg: rgba(217, 119, 6, 0.08); /* Ámbar/Oro translúcido */
          --nav-text: #f8fafc; /* Texto claro */
          --nav-muted: #94a3b8; /* Gris azulado */
          --nav-accent: #d97706; /* Dorado / Ámbar principal */
          --nav-accent-hover: #f59e0b;
          --nav-border: rgba(217, 119, 6, 0.15);
        }

        .navbar-desktop { 
          display: block; 
          position: sticky;
          top: 64px;
          z-index: 1000;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 991px) { 
          .navbar-desktop { 
            display: none !important; 
          } 
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8px 16px;
        }

        .nav-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
        }

        .nav-item-wrap {
          position: relative;
        }

        .nav-item {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-item.active {
          background: var(--nav-hover-bg);
          border: 1px solid rgba(217, 119, 6, 0.3);
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--nav-text);
          text-decoration: none;
          font-family: inherit;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          transition: color 0.2s ease;
        }

        .nav-item.active .nav-btn,
        .nav-item.hovered .nav-btn {
          color: var(--nav-accent);
        }

        .nav-icon {
          font-size: 16px;
          display: inline-flex;
          align-items: center;
        }

        .nav-underline {
          position: absolute;
          bottom: -8px;
          left: 0;
          height: 2px;
          background: var(--nav-accent);
          transition: width 0.3s ease;
          width: 0;
        }

        .nav-item.active .nav-underline,
        .nav-item.hovered .nav-underline {
          width: 100%;
        }

        /* ====== MOBILE BREADCRUMBS ====== */
        .mobile-crumbs-wrap {
          display: none;
        }

        @media (max-width: 991px) {
          .mobile-crumbs-wrap {
            display: block;
            background: #0f172a;
            border-bottom: 1px solid rgba(217, 119, 6, 0.15);
            padding: 12px 16px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }

        .mobile-crumbs {
          font-size: 14px;
          font-weight: 700;
          color: var(--nav-accent);
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .mobile-crumbs a {
          color: var(--nav-text);
          text-decoration: none;
        }
      `}</style>

      {/* MOBILE HEADER CRUMB */}
      <div className="mobile-crumbs-wrap">
        <div className="mobile-crumbs">
          {items.map((it) => {
            const isActive = pathname === it.href || (it.href === "/inicio" && pathname === "/");
            return isActive ? (
              <span key={it.key} style={{ color: "var(--nav-accent)" }}>
                {it.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="navbar-desktop">
        <div className="nav-container">
          <div className="nav-grid">
            {items.map((it) => {
              const isActive = pathname === it.href || (it.href === "/inicio" && pathname === "/");
              const isHovered = hoverKey === it.key;
              return (
                <div
                  key={it.key}
                  onMouseEnter={() => setHoverKey(it.key)}
                  onMouseLeave={() => setHoverKey(null)}
                  className="nav-item-wrap"
                >
                  <div className={`nav-item ${isActive ? "active" : ""} ${isHovered ? "hovered" : ""}`}>
                    <Link className="nav-btn" to={it.href}>
                      <span className="nav-icon">{it.icon}</span>
                      <span>{it.label}</span>
                    </Link>
                    <div className="nav-underline" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
