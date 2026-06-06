// src/components/Home/footer.jsx
import React from "react";
import { Layout, Row, Col, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;
const logo = "/logo.svg";

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Title level={4} style={{ color: "#ffffff", margin: 0, fontWeight: 700 }}>
        {children}
      </Title>
      <div
        style={{
          height: 3,
          width: 120,
          marginTop: 8,
          background:
            "linear-gradient(90deg, #d97706 0%, #b45309 60%, rgba(180,83,9,0) 100%)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

export default function Footer() {
  return (
    <AntFooter
      style={{
        padding: 0,
        background: "#0b0f19", // Ultra dark background
        color: "rgba(255,255,255,0.85)",
        borderTop: "1px solid rgba(217, 119, 6, 0.15)",
      }}
    >
      {/* Contenido principal */}
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px" }}
      >
        <Row gutter={[32, 24]} align="top">
          {/* Logo */}
          <Col xs={24} md={6} style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="Plan Risk 3D Logo"
              style={{ width: 140, height: 140, objectFit: "contain", filter: "drop-shadow(0px 0px 8px rgba(217, 119, 6, 0.5))" }}
            />
          </Col>

          <Col xs={24} md={6}>
            <SectionTitle>Plan Risk 3D</SectionTitle>
            <div style={{ lineHeight: 1.9 }}>
              <Text strong style={{ color: "#fff" }}>
                Ubicación:{" "}
              </Text>
              <Text style={{ color: "#fff" }}>
                Silicon Valley, CA (Sedes en México, Colombia y Bolivia)
              </Text>
              <br />
              <Text strong style={{ color: "#fff" }}>
                Contacto:{" "}
              </Text>
              <Text style={{ color: "#fff" }}>+1 (800) 555-RISK</Text>
              <br />
              <Text strong style={{ color: "#fff" }}>
                Correo:{" "}
              </Text>
              <Text style={{ color: "#fff" }}>support@planrisk3d.com</Text>
            </div>
          </Col>

          {/* Tecnología */}
          <Col xs={24} md={6}>
            <SectionTitle>Tecnología</SectionTitle>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                lineHeight: 2,
              }}
            >
              <li>Generación 3D Paramétrica</li>
              <li>Simulación de Riesgo Estructural</li>
              <li>Diseño de Interiores Asistido</li>
              <li>Integración BIM & Revit</li>
            </ul>
          </Col>

          {/* Compañía */}
          <Col xs={24} md={6}>
            <SectionTitle>Compañía</SectionTitle>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                lineHeight: 2,
              }}
            >
              <li>Sobre Nosotros</li>
              <li>Planes &amp; Precios</li>
              <li>Casos de Éxito</li>
              <li>Términos de Servicio</li>
            </ul>
          </Col>
        </Row>
      </div>

      {/* Línea separadora y copyright */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 28px" }}>
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.15)",
            margin: "0 0 18px",
          }}
        />
        <div style={{ textAlign: "center", paddingBottom: 16 }}>
          <Text style={{ color: "rgba(255,255,255,0.65)" }}>
            © Plan Risk 3D Inc. {new Date().getFullYear()}. Todos los
            derechos reservados.
          </Text>
        </div>
      </div>
    </AntFooter>
  );
}
