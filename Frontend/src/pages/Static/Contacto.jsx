// src/pages/Static/Contacto.jsx
import React from "react";
import { Form, Input, Button, Row, Col, Card, Typography, message } from "antd";
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  SendOutlined 
} from "@ant-design/icons";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Contacto() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    message.success("Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.");
    form.resetFields();
  };

  return (
    <div className="static-page-wrapper">
      <section className="contacto-section">
        <Title level={1} className="contacto-main-title">Contáctanos</Title>
        <Paragraph className="contacto-main-desc">
          ¿Tienes dudas sobre Plan Risk 3D o necesitas asesoramiento técnico? Escríbenos.
        </Paragraph>
        <div className="divider-gold" style={{ margin: "20px auto 40px" }}></div>

        <Row gutter={[40, 40]} style={{ marginTop: 24 }}>
          {/* Info Column */}
          <Col xs={24} md={10}>
            <div className="contacto-info-cards">
              <Card className="info-item-card" variant="borderless">
                <div className="info-icon"><MailOutlined /></div>
                <div className="info-text">
                  <Text className="info-label">Correo Electrónico</Text>
                  <Text className="info-value">support@planrisk3d.com</Text>
                </div>
              </Card>

              <Card className="info-item-card" variant="borderless">
                <div className="info-icon"><PhoneOutlined /></div>
                <div className="info-text">
                  <Text className="info-label">Teléfono</Text>
                  <Text className="info-value">+1 (800) 555-RISK</Text>
                </div>
              </Card>

              <Card className="info-item-card" variant="borderless">
                <div className="info-icon"><EnvironmentOutlined /></div>
                <div className="info-text">
                  <Text className="info-label">Oficinas Centrales</Text>
                  <Text className="info-value">Silicon Valley, California, EE. UU.</Text>
                </div>
              </Card>
            </div>
          </Col>

          {/* Form Column */}
          <Col xs={24} md={14}>
            <Card className="contacto-form-card" variant="borderless">
              <Form
                form={form}
                name="contacto-form"
                layout="vertical"
                size="large"
                onFinish={onFinish}
              >
                <Form.Item
                  name="nombre"
                  label={<span className="contacto-label">Nombre Completo</span>}
                  rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
                >
                  <Input placeholder="Tu nombre" />
                </Form.Item>

                <Form.Item
                  name="correo"
                  label={<span className="contacto-label">Correo Electrónico</span>}
                  rules={[
                    { required: true, message: "Por favor ingresa tu correo" },
                    { type: "email", message: "Ingresa un correo válido" }
                  ]}
                >
                  <Input placeholder="correo@ejemplo.com" />
                </Form.Item>

                <Form.Item
                  name="mensaje"
                  label={<span className="contacto-label">Mensaje o Consulta</span>}
                  rules={[{ required: true, message: "Por favor ingresa tu consulta" }]}
                >
                  <Input.TextArea rows={5} placeholder="Cuéntanos sobre tu proyecto o consulta..." />
                </Form.Item>

                <Form.Item>
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
      </section>
    </div>
  );
}
