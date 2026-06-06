// src/pages/Static/Inicio.jsx
import React from "react";
import { Button, Row, Col, Card, Typography } from "antd";
import { 
  ThunderboltOutlined, 
  SafetyCertificateOutlined, 
  FormatPainterOutlined, 
  ArrowRightOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="static-page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <Row align="middle" gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div className="hero-content">
              <span className="hero-badge">IA + INGENIERÍA ESTRUCTURAL</span>
              <Title className="hero-title">Plan Risk 3D</Title>
              <Title level={2} className="hero-subtitle">
                Modelado Estructural, Predicción de Riesgo y Diseño Asistido por IA
              </Title>
              <Paragraph className="hero-description">
                Transforme planos arquitectónicos 2D en completos modelos estructurales tridimensionales con análisis de resistencia sísmica en tiempo real y diseño automatizado.
              </Paragraph>
              <div className="hero-actions">
                <Button 
                  type="primary" 
                  size="large" 
                  className="btn-gold"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate("/tecnologia")}
                >
                  Ver Tecnología
                </Button>
                <Button 
                  type="default" 
                  size="large" 
                  className="btn-outline"
                  onClick={() => navigate("/login")}
                >
                  Comenzar Gratis
                </Button>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={12} className="hero-visual">
            <div className="container-3d">
              <div className="structural-model-3d">
                {/* 4 Niveles de Losas Estructurales */}
                <div className="floor-losa-3d floor-0"></div>
                <div className="floor-losa-3d floor-1"></div>
                <div className="floor-losa-3d floor-2"></div>
                <div className="floor-losa-3d floor-3"></div>

                {/* 4 Columnas principales con nodos sísmicos (Joints) */}
                <div className="column-3d col-left-front">
                  <div className="joint-3d joint-y0"></div>
                  <div className="joint-3d joint-y1"></div>
                  <div className="joint-3d joint-y2"></div>
                  <div className="joint-3d joint-y3"></div>
                </div>
                <div className="column-3d col-right-front">
                  <div className="joint-3d joint-y0"></div>
                  <div className="joint-3d joint-y1"></div>
                  <div className="joint-3d joint-y2"></div>
                  <div className="joint-3d joint-y3"></div>
                </div>
                <div className="column-3d col-left-back">
                  <div className="joint-3d joint-y0"></div>
                  <div className="joint-3d joint-y1"></div>
                  <div className="joint-3d joint-y2"></div>
                  <div className="joint-3d joint-y3"></div>
                </div>
                <div className="column-3d col-right-back">
                  <div className="joint-3d joint-y0"></div>
                  <div className="joint-3d joint-y1"></div>
                  <div className="joint-3d joint-y2"></div>
                  <div className="joint-3d joint-y3"></div>
                </div>

                {/* Tensores de arriostramiento sismorresistente */}
                <div className="brace-3d brace-1"></div>
                <div className="brace-3d brace-2"></div>
              </div>

              {/* HUD Analítico de Simulación Sísmica */}
              <div className="hud-analytics-card">
                <div className="hud-line">
                  <span>ANALISIS SISMO:</span>
                  <span className="hud-alert">ACTIVO</span>
                </div>
                <div className="hud-line">
                  <span>DESPLAZAMIENTO:</span>
                  <span>0.004 rad</span>
                </div>
                <div className="hud-line">
                  <span>FUERZA max:</span>
                  <span>340 kN</span>
                </div>
                <div className="hud-line">
                  <span>ESTADO IA:</span>
                  <span style={{ color: '#10b981' }}>SEGURO (99.8%)</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Características Breves */}
      <section className="features-summary-section">
        <Title level={2} className="section-title">Pilares de Innovación</Title>
        <div className="divider-gold"></div>
        
        <Row gutter={[24, 24]} style={{ marginTop: 40 }}>
          <Col xs={24} md={8}>
            <Card className="feature-card" variant="borderless">
              <div className="feature-icon"><ThunderboltOutlined /></div>
              <Title level={3} className="feature-card-title">Modelado Estructural</Title>
              <Paragraph className="feature-card-desc">
                Carga de archivos DWG, PDF o imágenes y generación de esqueletos estructurales 3D paramétricos instantáneos.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="feature-card" variant="borderless">
              <div className="feature-icon"><SafetyCertificateOutlined /></div>
              <Title level={3} className="feature-card-title">Predicción de Riesgo</Title>
              <Paragraph className="feature-card-desc">
                Simulación probabilística de fallas y predicción de riesgo sísmico/viento mediante redes neuronales.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="feature-card" variant="borderless">
              <div className="feature-icon"><FormatPainterOutlined /></div>
              <Title level={3} className="feature-card-title">Diseño Asistido</Title>
              <Paragraph className="feature-card-desc">
                Distribución inteligente de vigas, columnas y mobiliario interno respetando normativas de construcción.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}
