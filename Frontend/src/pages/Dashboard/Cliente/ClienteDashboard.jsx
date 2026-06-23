import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button, Badge, Form, Input, message } from "antd";
import { 
  CustomerServiceOutlined, 
  GlobalOutlined, 
  AndroidOutlined, 
  SendOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import AuthService from "../../../services/AuthService.js";
import "./ClienteDashboard.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ClienteDashboard() {
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);

  const onFinish = (values) => {
    message.success({
      content: "¡Mensaje enviado con éxito! Nuestro equipo técnico se pondrá en contacto contigo.",
      icon: <CheckCircleOutlined style={{ color: "#d97706" }} />,
      duration: 3,
    });
    form.resetFields();
  };

  const getPlanBadgeColor = (rol) => {
    switch (rol) {
      case "usuario_premium":
        return "#10b981"; // Verde
      case "usuario_estrella":
        return "#f59e0b"; // Dorado
      default:
        return "#3b82f6"; // Azul
    }
  };

  const getPlanName = (rol) => {
    switch (rol) {
      case "usuario_premium":
        return "Premium (Ilimitado)";
      case "usuario_estrella":
        return "Estrella (24 Plantillas)";
      default:
        return "Free (4 Plantillas)";
    }
  };

  const currentRole = user?.rol || "usuario_normal";

  return (
    <div className="client-dashboard-wrapper">
      {/* Header de Bienvenida */}
      <div className="welcome-banner">
        <Row align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2} className="welcome-title">
              ¡Bienvenido, {user?.nombre || "Cliente"}!
            </Title>
            <Paragraph className="welcome-desc">
              Desde tu portal puedes acceder a la suite de modelado 3D, descargar la app móvil, conversar con nuestro asistente y gestionar consultas.
            </Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Text className="plan-label">Plan Activo: </Text>
            <Badge 
              count={getPlanName(currentRole)} 
              style={{ backgroundColor: getPlanBadgeColor(currentRole), fontSize: "14px", padding: "4px 12px", borderRadius: "12px" }} 
            />
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Columna Izquierda: Accesos de la Plataforma */}
        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]}>
            {/* Tarjeta Web Angular */}
            <Col xs={24}>
              <Card className="action-card" variant="borderless">
                <div className="action-card-header">
                  <GlobalOutlined className="action-card-icon web-icon" />
                  <div>
                    <Title level={3} className="action-card-title">Plataforma de Ingeniería 3D (Web)</Title>
                    <Paragraph className="action-card-desc">
                      Carga tus planos en DWG, DXF o PDF para que nuestra inteligencia artificial los analice y genere un modelo estructural 3D completo.
                    </Paragraph>
                  </div>
                </div>
                <div className="action-card-footer">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="btn-gold"
                    onClick={() => window.open(import.meta.env.VITE_ANGULAR_FRONTEND_URL || "http://localhost:4200/", "_blank")}
                  >
                    Ingresar a la Plataforma Web
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Tarjeta App Móvil */}
            <Col xs={24}>
              <Card className="action-card" variant="borderless">
                <div className="action-card-header">
                  <AndroidOutlined className="action-card-icon mobile-icon" />
                  <div>
                    <Title level={3} className="action-card-title">Aplicación Móvil (Android)</Title>
                    <Paragraph className="action-card-desc">
                      Escanea planos impresos con la cámara de tu smartphone, visualiza estructuras en AR y recibe notificaciones de simulaciones sísmicas.
                    </Paragraph>
                  </div>
                </div>
                <div className="action-card-footer">
                  <Button 
                    type="default" 
                    size="large" 
                    className="btn-outline"
                    icon={<AndroidOutlined />}
                    onClick={() => window.open("https://drive.google.com/drive/folders/1ZyFxJGkXZBFsdD0BZSkxDZtCftgisoA9?usp=sharing", "_blank")}
                  >
                    Descargar desde Play Store
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Tarjeta Asistente de Voz */}
            <Col xs={24}>
              <Card className="action-card" variant="borderless">
                <div className="action-card-header">
                  <CustomerServiceOutlined className="action-card-icon voice-icon" />
                  <div>
                    <Title level={3} className="action-card-title">Asistente de Voz AI Conversacional</Title>
                    <Paragraph className="action-card-desc">
                      ¿Tienes consultas técnicas sobre riesgos sísmicos, diseño de vigas o materiales? Inicia una llamada interactiva por voz en tiempo real.
                    </Paragraph>
                  </div>
                </div>
                <div className="action-card-footer">
                  <Button 
                    type="default" 
                    size="large" 
                    className="btn-outline"
                    onClick={() => {
                      const convaiElement = document.querySelector("elevenlabs-convai");
                      if (convaiElement) {
                        // Intentar simular click en el botón del widget de ElevenLabs
                        const shadow = convaiElement.shadowRoot;
                        const button = shadow?.querySelector("button") || document.getElementById("elevenlabs-button");
                        if (button) {
                          button.click();
                        } else {
                          message.info("Haz clic en el botón flotante 'Hablar con Asistente' en la parte inferior derecha de la pantalla.");
                        }
                      } else {
                        message.info("Haz clic en el botón flotante 'Hablar con Asistente' en la parte inferior derecha de la pantalla.");
                      }
                    }}
                  >
                    Iniciar Llamada con el Asistente
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Columna Derecha: Formulario de Contacto */}
        <Col xs={24} lg={10}>
          <Card className="support-card" variant="borderless">
            <Title level={3} className="support-card-title">Soporte Técnico & Consultas</Title>
            <Paragraph className="support-card-desc">
              Envíanos tus dudas sobre el modelado 3D, problemas de acceso o consultas de tu plan. Te responderemos a la brevedad.
            </Paragraph>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name="asunto"
                label={<span className="support-form-label">Asunto</span>}
                rules={[{ required: true, message: "Por favor, ingresa el asunto de tu consulta" }]}
              >
                <Input placeholder="Ej. Duda sobre la exportación GLTF" />
              </Form.Item>

              <Form.Item
                name="mensaje"
                label={<span className="support-form-label">Mensaje</span>}
                rules={[
                  { required: true, message: "Por favor, escribe tu mensaje" },
                  { min: 10, message: "El mensaje debe tener al menos 10 caracteres" }
                ]}
              >
                <TextArea rows={6} placeholder="Escribe aquí en detalle tu consulta técnica o administrativa..." />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />} 
                  className="btn-gold" 
                  block
                >
                  Enviar Mensaje
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
