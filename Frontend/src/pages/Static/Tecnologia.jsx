// src/pages/Static/Tecnologia.jsx
import React from "react";
import { Row, Col, Typography, Card } from "antd";
import { 
  DeploymentUnitOutlined, 
  SafetyOutlined, 
  BgColorsOutlined, 
  AuditOutlined 
} from "@ant-design/icons";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Tecnologia() {
  return (
    <div className="static-page-wrapper">
      <section className="tech-intro-section">
        <Title level={1} className="tech-main-title">Nuestra Tecnología</Title>
        <Paragraph className="tech-main-desc">
          Plan Risk 3D fusiona el análisis estructural avanzado con algoritmos de Inteligencia Artificial de vanguardia para garantizar diseños eficientes y seguros.
        </Paragraph>
        <div className="divider-gold" style={{ margin: "20px auto 40px" }}></div>
      </section>

      {/* Tech Breakdown Blocks */}
      <section className="tech-blocks">
        <Row gutter={[40, 40]} align="middle">
          {/* Block 1 */}
          <Col xs={24} lg={12}>
            <Title level={2} className="tech-block-title">
              <DeploymentUnitOutlined className="icon-gold" /> Generación Automática de Modelos 3D
            </Title>
            <Paragraph className="tech-block-text">
              Utilizando modelos de visión artificial entrenados con millones de planos CAD, nuestro motor identifica muros de carga, columnas y vanos directamente desde un PDF o archivo de AutoCAD. En cuestión de segundos, extrapola la geometría a un modelo de elementos finitos tridimensionales listo para análisis mecánico.
            </Paragraph>
            <ul className="tech-list">
              <li>Reconocimiento inteligente de planos estructurales.</li>
              <li>Generación paramétrica compatible con BIM.</li>
              <li>Exportación a formatos Revit, IFC y SAP2000.</li>
            </ul>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="tech-visual-card">
              <div className="cube-placeholder">
                <DeploymentUnitOutlined style={{ fontSize: 80, color: "#d97706" }} />
                <Text style={{ display: "block", marginTop: 16, color: "#94a3b8" }}>Motor de Extrapolación 3D en Tiempo Real</Text>
              </div>
            </Card>
          </Col>

          {/* Block 2 */}
          <Col xs={24} lg={12} className="desktop-reverse-col">
            <Card className="tech-visual-card">
              <div className="cube-placeholder">
                <SafetyOutlined style={{ fontSize: 80, color: "#d97706" }} />
                <Text style={{ display: "block", marginTop: 16, color: "#94a3b8" }}>Módulo de Simulación de Cargas Sísmicas</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Title level={2} className="tech-block-title">
              <SafetyOutlined className="icon-gold" /> Predicción de Riesgo Estructural (IA)
            </Title>
            <Paragraph className="tech-block-text">
              Nuestra IA corre miles de simulaciones en la nube utilizando acelerogramas históricos. Detecta excentricidades estructurales, torsión en planta y fallas por cortante antes de iniciar la construcción, recomendando cambios en las dimensiones de vigas o distribución de muros para cumplir con normativas sismorresistentes.
            </Paragraph>
            <ul className="tech-list">
              <li>Predicción probabilística basada en Montecarlo.</li>
              <li>Clasificación de riesgo de fatiga de materiales.</li>
              <li>Optimización automática de secciones transversales.</li>
            </ul>
          </Col>

          {/* Block 3 */}
          <Col xs={24} lg={12}>
            <Title level={2} className="tech-block-title">
              <BgColorsOutlined className="icon-gold" /> Diseño de Interiores Asistido
            </Title>
            <Paragraph className="tech-block-text">
              El asistente de diseño propone distribuciones óptimas de tabiquería interna no estructural y mobiliario. La IA evalúa la iluminación natural, la circulación de aire y las cargas vivas localizadas para maximizar la habitabilidad y el ahorro energético.
            </Paragraph>
            <ul className="tech-list">
              <li>Distribución inteligente de ambientes residenciales y comerciales.</li>
              <li>Cálculo de centro de masas estructural dinámico.</li>
              <li>Renderizado conceptual fotorrealista asistido por IA.</li>
            </ul>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="tech-visual-card">
              <div className="cube-placeholder">
                <BgColorsOutlined style={{ fontSize: 80, color: "#d97706" }} />
                <Text style={{ display: "block", marginTop: 16, color: "#94a3b8" }}>Motor Creativo & Espacial de Interiores</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}
