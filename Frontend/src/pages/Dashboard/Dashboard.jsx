import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";

// Importamos el CSS unificado
import "./DashboardLayout.css";

const { Content } = Layout;

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Layout className="dashboard-layout">
      <DashboardSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Content className="dashboard-content">
        {/* Aquí se renderizan GestionarMenu, GestionarUsuario, etc. */}
        <Outlet />
      </Content>
    </Layout>
  );
}