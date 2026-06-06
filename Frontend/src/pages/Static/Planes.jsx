// src/pages/Static/Planes.jsx
import React from "react";
import { Row, Col, Card, Button, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Planes() {
  const navigate = useNavigate();

  return (
    <div className="static-page-wrapper">
      <section className="planes-intro-section">
        <Title level={1} className="planes-main-title">Planes & Licencias</Title>
        <Paragraph className="planes-main-desc">
          Elige el plan ideal para tu flujo de trabajo. Todos los planes incluyen actualizaciones de IA automáticas.
        </Paragraph>
        <div className="divider-gold" style={{ margin: "20px auto 40px" }}></div>
      </section>

      {/* Planes Grid */}
      <section className="planes-grid-section">
        <Row gutter={[24, 24]} align="stretch" justify="center">
          {/* Plan Profesional */}
          <Col xs={24} md={8}>
            <Card className="plan-card" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge">INDIVIDUAL</Text>
                <Title level={2} className="plan-title">Profesional</Title>
                <div className="plan-price">
                  <span className="price-symbol">$</span>
                  <span className="price-value">49</span>
                  <span className="price-period">/ mes</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> Modelos Estructurales 3D ilimitados</li>
                <li><CheckOutlined className="icon-gold" /> Análisis de riesgo básico</li>
                <li><CheckOutlined className="icon-gold" /> Exportación en formato IFC/CAD</li>
                <li><CheckOutlined className="icon-gold" /> Soporte por correo electrónico</li>
              </ul>
              <Button type="default" block className="btn-outline plan-btn" onClick={() => navigate("/login")}>
                Adquirir Licencia
              </Button>
            </Card>
          </Col>

          {/* Plan Corporativo */}
          <Col xs={24} md={8}>
            <Card className="plan-card plan-card-featured" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge plan-badge-gold">POPULAR</Text>
                <Title level={2} className="plan-title" style={{ color: "#f59e0b" }}>Corporativo</Title>
                <div className="plan-price" style={{ color: "#ffffff" }}>
                  <span className="price-symbol">$</span>
                  <span className="price-value">149</span>
                  <span className="price-period">/ mes</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0", background: "#f59e0b" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> Modelos Estructurales 3D e IA sismorresistente</li>
                <li><CheckOutlined className="icon-gold" /> Simulación de fatiga de materiales</li>
                <li><CheckOutlined className="icon-gold" /> Integración directa BIM & Revit</li>
                <li><CheckOutlined className="icon-gold" /> Soporte prioritario 24/7</li>
                <li><CheckOutlined className="icon-gold" /> Colaboración multiusuario</li>
              </ul>
              <Button type="primary" block className="btn-gold plan-btn" onClick={() => navigate("/login")}>
                Obtener Prueba Gratis
              </Button>
            </Card>
          </Col>

          {/* Plan Enterprise */}
          <Col xs={24} md={8}>
            <Card className="plan-card" variant="borderless">
              <div className="plan-header">
                <Text className="plan-badge">EMPRESAS</Text>
                <Title level={2} className="plan-title">Enterprise</Title>
                <div className="plan-price">
                  <span className="price-value" style={{ fontSize: "2rem" }}>A medida</span>
                </div>
              </div>
              <div className="divider-gold" style={{ margin: "16px 0" }}></div>
              <ul className="plan-features-list">
                <li><CheckOutlined className="icon-gold" /> Servidores y modelos dedicados</li>
                <li><CheckOutlined className="icon-gold" /> API de integración completa</li>
                <li><CheckOutlined className="icon-gold" /> SLA y soporte dedicado corporativo</li>
                <li><CheckOutlined className="icon-gold" /> Capacitación personalizada de personal</li>
              </ul>
              <Button type="default" block className="btn-outline plan-btn" onClick={() => navigate("/contacto")}>
                Contactar Ventas
              </Button>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}
