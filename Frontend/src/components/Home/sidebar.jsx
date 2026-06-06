// src/components/Home/sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons';
import AuthService from '../../services/AuthService.js';

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, [open, pathname]);

  const items = [
    { key: "/inicio", label: "Inicio", icon: <HomeOutlined /> },
    { key: "/tecnologia", label: "Tecnología", icon: <AppstoreOutlined /> },
    { key: "/planes", label: "Servicios & Planes", icon: <ShoppingOutlined /> },
    { key: "/contacto", label: "Contacto", icon: <PhoneOutlined /> },
  ];

  if (isAuthenticated) {
    items.push({ key: "/perfil", label: "Mi Perfil", icon: <UserOutlined /> });
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
    onClose();
  };

  return (
    <Drawer
      className="app-drawer"
      title={<span style={{ color: '#f59e0b', fontWeight: 800 }}>Plan Risk 3D</span>}
      placement="left"
      open={open}
      onClose={onClose}
      width={280}
      styles={{
        header: {
          background: '#0b0f19',
          borderBottom: '1px solid rgba(217, 119, 6, 0.15)',
        },
        body: {
          background: '#0b0f19',
          padding: 0,
        }
      }}
      zIndex={1200}
      maskClosable
      keyboard
    >
      <Menu
        mode="inline"
        theme="dark"
        style={{
          background: '#0b0f19',
          borderRight: 0,
        }}
        items={items}
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
      />
      
      <style>{`
        /* Personalizar el color de los items seleccionados */
        .app-drawer .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
          background-color: rgba(217, 119, 6, 0.15) !important;
          color: #f59e0b !important;
        }
        .app-drawer .ant-menu-item:hover {
          color: #f59e0b !important;
        }
        .app-drawer .ant-drawer-close {
          color: #f8fafc !important;
        }
      `}</style>
    </Drawer>
  );
}