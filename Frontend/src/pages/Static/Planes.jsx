// src/pages/Static/Planes.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Typography, message, Modal, Result, Spin } from "antd";
import {
  CheckOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  CloseCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../../services/AuthService.js";
import PlanConfigService from "../../services/PlanConfigService.js";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Planes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentModal, setPaymentModal] = useState({ visible: false, status: null });
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [precios, setPrecios] = useState({ usuario_estrella: 180, usuario_premium: 220 });

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
    setUser(AuthService.getCurrentUser());
    loadPrecios();
  }, []);

  const loadPrecios = async () => {
    try {
      const data = await PlanConfigService.getPrecios();
      setPrecios({
        usuario_estrella: data.usuario_estrella || 180,
        usuario_premium: data.usuario_premium || 220
      });
    } catch (error) {
      console.error("Error cargando precios", error);
    }
  };

  // Detectar query params de retorno de Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      handlePaymentSuccess(sessionId);
      // Limpiar los query params de la URL
      setSearchParams({});
    } else if (paymentStatus === "cancel") {
      setPaymentModal({ visible: true, status: "cancel" });
      setSearchParams({});
    }
  }, [searchParams]);

  const handlePaymentSuccess = async (sessionId) => {
    setConfirmingPayment(true);
    try {
      // Confirmar el pago con el backend (actualiza el rol)
      await AuthService.confirmPayment(sessionId);
      
      // Refrescar los datos del usuario
      const updatedUser = await AuthService.refreshUserData();
      if (updatedUser) {
        setUser(updatedUser);
      }

      setPaymentModal({ visible: true, status: "success" });
    } catch (error) {
      console.error("Error al confirmar pago:", error);
      // Intentar refrescar de todos modos
      const updatedUser = await AuthService.refreshUserData();
      if (updatedUser) {
        setUser(updatedUser);
      }
      setPaymentModal({ visible: true, status: "success" });
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleSelectPlan = async (planRole) => {
    if (!isAuthenticated) {
      message.warning("Por favor, inicia sesión para adquirir una licencia.");
      navigate("/login");
      return;
    }

    // Plan Free no requiere pago
    if (planRole === "usuario_normal") {
      message.info("Ya cuentas con el plan gratuito.");
      return;
    }

    setLoadingPlan(planRole);
    try {
      // Crear sesión de Stripe Checkout
      const result = await AuthService.createCheckoutSession(planRole);

      if (result.success && result.checkout_url) {
        // Redirigir a Stripe Checkout
        window.location.href = result.checkout_url;
      } else {
        message.error("No se pudo iniciar el proceso de pago.");
      }
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      message.error(error.message || "Error al procesar la solicitud de pago.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = user?.rol || "usuario_normal";

  const isCurrentPlan = (planRole) => currentPlan === planRole;

  return (
    <div className="static-page-wrapper">
      {/* Spinner de confirmación de pago */}
      {confirmingPayment && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)", zIndex: 9999,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <Spin size="large" />
          <Text style={{ color: "#fff", marginTop: 16, fontSize: 16 }}>
            Confirmando tu pago con Stripe...
          </Text>
        </div>
      )}

      <section className="planes-intro-section">
        <Title level={1} className="planes-main-title">Planes & Licencias</Title>
        <Paragraph className="planes-main-desc">
          Elige el plan ideal para tu flujo de trabajo. Todos los planes incluyen actualizaciones de IA automáticas.
        </Paragraph>
        {isAuthenticated && (
          <div style={{ marginTop: 8 }}>
            <Text style={{ color: "#94a3b8", fontSize: 14 }}>
              Plan activo:{" "}
              <span style={{ 
                color: currentPlan === "usuario_premium" ? "#10b981" : 
                       currentPlan === "usuario_estrella" ? "#f59e0b" : "#3b82f6",
                fontWeight: 700 
              }}>
                {currentPlan === "usuario_premium" ? "Premium" : 
                 currentPlan === "usuario_estrella" ? "Estrella" : "Free"}
              </span>
            </Text>
          </div>
        )}
        <div className="divider-gold" style={{ margin: "20px auto 40px" }}></div>
      </section>

      {/* Planes Grid */}
      <section className="planes-grid-section">
        <Row gutter={[24, 24]} align="stretch" justify="center">
          {/* Plan Free */}
          <Col xs={24} md={8}>
            <Card className="plan-card" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge">BÁSICO</Text>
                <Title level={2} className="plan-title">Free</Title>
                <div className="plan-price">
                  <span className="price-value">0</span>
                  <span className="price-symbol"> Bs.</span>
                  <span className="price-period">/ mes</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> Límite de <strong>4 plantillas</strong> de planos 3D</li>
                <li><CheckOutlined className="icon-gold" /> Modelado estructural básico</li>
                <li><CheckOutlined className="icon-gold" /> Análisis de riesgo básico por IA</li>
                <li><CheckOutlined className="icon-gold" /> Soporte estándar por correo electrónico</li>
              </ul>
              <Button 
                type="default" 
                block 
                className="btn-outline plan-btn" 
                disabled={isCurrentPlan("usuario_normal")}
              >
                {isCurrentPlan("usuario_normal") ? "✓ Plan Actual" : "Comenzar Gratis"}
              </Button>
            </Card>
          </Col>

          {/* Plan Estrella */}
          <Col xs={24} md={8}>
            <Card className="plan-card plan-card-featured" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge plan-badge-gold">POPULAR</Text>
                <Title level={2} className="plan-title" style={{ color: "#f59e0b" }}>Estrella</Title>
                <div className="plan-price" style={{ color: "#ffffff" }}>
                  <span className="price-value">{precios.usuario_estrella}</span>
                  <span className="price-symbol"> Bs.</span>
                  <span className="price-period">/ mes</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0", background: "#f59e0b" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> Límite de <strong>24 plantillas</strong> de planos 3D</li>
                <li><CheckOutlined className="icon-gold" /> Modelado estructural sismorresistente por IA</li>
                <li><CheckOutlined className="icon-gold" /> Simulación avanzada de riesgos estructurales</li>
                <li><CheckOutlined className="icon-gold" /> Exportación en formato CAD y reportes PDF</li>
                <li><CheckOutlined className="icon-gold" /> Soporte prioritario 24/7</li>
              </ul>
              <Button 
                type="primary" 
                block 
                className="btn-gold plan-btn" 
                icon={!isCurrentPlan("usuario_estrella") ? <CreditCardOutlined /> : null}
                onClick={() => handleSelectPlan("usuario_estrella")}
                loading={loadingPlan === "usuario_estrella"}
                disabled={isCurrentPlan("usuario_estrella")}
              >
                {isCurrentPlan("usuario_estrella") ? "✓ Plan Actual" : "Pagar con Stripe"}
              </Button>
            </Card>
          </Col>

          {/* Plan Premium */}
          <Col xs={24} md={8}>
            <Card className="plan-card" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge">ILIMITADO</Text>
                <Title level={2} className="plan-title">Premium</Title>
                <div className="plan-price">
                  <span className="price-value">{precios.usuario_premium}</span>
                  <span className="price-symbol"> Bs.</span>
                  <span className="price-period">/ mes</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> <strong>Sin límites</strong> de plantillas de planos 3D</li>
                <li><CheckOutlined className="icon-gold" /> Acceso completo a toda la IA estructural</li>
                <li><CheckOutlined className="icon-gold" /> Simulación avanzada de fatiga y sismos</li>
                <li><CheckOutlined className="icon-gold" /> Generación de presupuestos automática</li>
                <li><CheckOutlined className="icon-gold" /> Soporte VIP dedicado y multiusuario</li>
              </ul>
              <Button 
                type="default" 
                block 
                className="btn-outline plan-btn" 
                icon={!isCurrentPlan("usuario_premium") ? <CreditCardOutlined /> : null}
                onClick={() => handleSelectPlan("usuario_premium")}
                loading={loadingPlan === "usuario_premium"}
                disabled={isCurrentPlan("usuario_premium")}
              >
                {isCurrentPlan("usuario_premium") ? "✓ Plan Actual" : "Pagar con Stripe"}
              </Button>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Modal de resultado del pago */}
      <Modal
        open={paymentModal.visible}
        footer={null}
        onCancel={() => setPaymentModal({ visible: false, status: null })}
        centered
        width={480}
        styles={{ content: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16 } }}
      >
        {paymentModal.status === "success" ? (
          <Result
            icon={<CheckCircleOutlined style={{ color: "#10b981" }} />}
            title={<span style={{ color: "#fff" }}>¡Pago Exitoso!</span>}
            subTitle={
              <span style={{ color: "#94a3b8" }}>
                Tu plan ha sido actualizado correctamente a{" "}
                <strong style={{ color: "#f59e0b" }}>
                  {user?.rol === "usuario_premium" ? "Premium" : 
                   user?.rol === "usuario_estrella" ? "Estrella" : user?.rol}
                </strong>. 
                Ya puedes disfrutar de todas las funcionalidades de tu nuevo plan.
              </span>
            }
            extra={[
              <Button 
                key="dashboard" 
                type="primary" 
                className="btn-gold"
                icon={<RocketOutlined />}
                onClick={() => navigate("/dashboard")}
              >
                Ir al Dashboard
              </Button>,
            ]}
          />
        ) : (
          <Result
            icon={<CloseCircleOutlined style={{ color: "#ef4444" }} />}
            title={<span style={{ color: "#fff" }}>Pago Cancelado</span>}
            subTitle={
              <span style={{ color: "#94a3b8" }}>
                El proceso de pago fue cancelado. No se realizó ningún cargo a tu tarjeta. Puedes intentarlo de nuevo cuando lo desees.
              </span>
            }
            extra={[
              <Button 
                key="retry" 
                type="default" 
                className="btn-outline"
                onClick={() => setPaymentModal({ visible: false, status: null })}
              >
                Cerrar
              </Button>,
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
