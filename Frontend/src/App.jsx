import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import Header from "./components/Home/header";
import Navbar from "./components/Home/navbar";
import Footer from "./components/Home/footer";
import AppRoutes from "./routes/appRoutes";
import "./App.css";
import DynamicSlider from "./components/Home/DynamicSlider";
import { PWAInstallPrompt, OfflineIndicator, PWAUpdatePrompt } from "./components/PWA";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <AppRoutes />;
  }

  return (
    <div className="app-shell">
      <Header />
      <DynamicSlider height="clamp(280px, 35vh, 450px)" fullBleed={false} />
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f3f4f6",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <OfflineIndicator />
        <PWAInstallPrompt />
        <PWAUpdatePrompt />
        <AppContent />
      </BrowserRouter>
    </ConfigProvider>
  );
}
