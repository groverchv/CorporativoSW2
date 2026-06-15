import React from "react";
import { Layout, Menu, Button } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    AppstoreOutlined,
    HomeOutlined,
    LeftOutlined,
    RightOutlined,
    LogoutOutlined,
    DollarOutlined,
    ProfileOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../services/AuthService.js";

const { Sider } = Layout;

export default function DashboardSidebar({ collapsed, onToggle }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener usuario actual
    const currentUser = AuthService.getCurrentUser();
    const userRole = currentUser?.rol || "usuario_normal";
    const isAdmin = userRole.toLowerCase() === "administrador" || userRole.toLowerCase() === "admin";

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    const menuItems = isAdmin
        ? [
            {
                key: "/dashboard/admin-home",
                icon: <DashboardOutlined />,
                label: "Dashboard",
            },
            {
                key: "/dashboard/perfil",
                icon: <UserOutlined />,
                label: "Mi Perfil",
            },
            {
                key: "gestion",
                icon: <AppstoreOutlined />,
                label: "Gestión",
                children: [
                    {
                        key: "/dashboard/usuarios",
                        icon: <UserOutlined />,
                        label: "Usuarios",
                    },
                    {
                        key: "/dashboard/planes",
                        icon: <DollarOutlined />,
                        label: "Precios de Planes"
                    },
                    {
                        key: "/dashboard/historial-planos",
                        icon: <ProfileOutlined />,
                        label: "Historial de Planos"
                    }
                ]
            },
        ]
        : [
            {
                key: "/dashboard/cliente",
                icon: <DashboardOutlined />,
                label: "Dashboard",
            },
            {
                key: "/dashboard/perfil",
                icon: <UserOutlined />,
                label: "Mi Perfil",
            },
            {
                key: "/inicio",
                icon: <HomeOutlined />,
                label: "Volver a la Web",
            }
        ];

    const handleMenuClick = ({ key }) => {
        if (key.startsWith("/")) {
            navigate(key);
        }
    };

    return (
        <Sider
            width={260}
            collapsedWidth={75}
            collapsible
            collapsed={collapsed}
            trigger={null}
            theme="light"
            className="premium-sidebar"
        >
            {/* Botón de Colapso Flotante Circular */}
            <Button
                type="text"
                className="sidebar-collapse-trigger"
                icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                onClick={onToggle}
            />

            {/* Logo de la Aplicación */}
            <div className="sidebar-logo-container">
                <div className="sidebar-logo-icon">P</div>
                {!collapsed && <span className="sidebar-logo-text">PlanRisk3D</span>}
            </div>

            {/* Menú de Navegación */}
            <div className="sidebar-menu-wrapper">
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="sidebar-menu"
                />
            </div>

            {/* Contenedor de Pie de Sidebar */}
            <div className="sidebar-bottom-container">
                {/* Botón Cerrar Sesión */}
                <Button
                    type="text"
                    danger
                    icon={<LogoutOutlined />}
                    className="sidebar-logout-btn"
                    onClick={handleLogout}
                    block
                >
                    {!collapsed && <span>Cerrar sesión</span>}
                </Button>

                {/* Footer del Usuario Conectado */}
                {!collapsed && currentUser && (
                    <div className="sidebar-user-footer">
                        <span className="user-footer-title">Conectado como</span>
                        <span className="user-footer-email" title={currentUser.correo}>
                            {currentUser.correo}
                        </span>
                        <span className="user-footer-app">Plan Risk 3D</span>
                    </div>
                )}
            </div>
        </Sider>
    );
}
