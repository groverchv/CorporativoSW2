// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Alert, Radio } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  BankOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService.js";
import "./Login.css";

const { Title, Text } = Typography;

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null); // 'success' | 'error' | null
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    setAuthStatus(null);

    try {
      if (isRegister) {
        // Registrar usuario (e iniciar sesión automáticamente si está configurado en Supabase)
        const result = await AuthService.register({
          correo: values.correo,
          password: values.password,
          nombre: values.nombre,
          apellido: values.apellido,
          celular: values.celular,
          organizacion: values.organizacion,
        });

        if (!result.session) {
          message.info({
            content: 'Registro exitoso. Por favor confirma tu correo electrónico para poder ingresar.',
            duration: 5,
          });
          setLoading(false);
          return;
        }
      } else {
        // Iniciar sesión
        await AuthService.login(values.correo, values.password);
      }

      setAuthStatus('success');
      message.success({
        content: isRegister ? '¡Registro exitoso y sesión iniciada!' : '¡Autenticación correcta! Redirigiendo...',
        icon: <CheckCircleOutlined style={{ color: '#d97706' }} />,
        duration: 1.5,
      });

      setTimeout(() => {
        navigate("/perfil");
      }, 1500);

    } catch (error) {
      setAuthStatus('error');
      const errorMessage = typeof error === 'string' ? error : 'Ocurrió un error. Por favor verifique los datos.';
      message.error({
        content: errorMessage,
        icon: <CloseCircleOutlined style={{ color: '#f87171' }} />,
        duration: 4,
      });
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" variant="borderless">
        <div className="login-header">
          <Title level={2} className="login-title">Plan Risk 3D</Title>
          <Text className="login-subtitle">
            {isRegister ? "Crea una cuenta para comenzar" : "Inicia sesión para gestionar tu perfil"}
          </Text>
        </div>

        <div className="mode-selector">
          <Radio.Group
            value={isRegister}
            onChange={(e) => {
              setIsRegister(e.target.value);
              setAuthStatus(null);
              form.resetFields();
            }}
            buttonStyle="solid"
            size="middle"
            style={{ width: "100%", display: "flex" }}
          >
            <Radio.Button value={false} style={{ flex: 1, textAlign: "center" }}>
              Ingresar
            </Radio.Button>
            <Radio.Button value={true} style={{ flex: 1, textAlign: "center" }}>
              Registrarse
            </Radio.Button>
          </Radio.Group>
        </div>

        {authStatus === 'success' && (
          <Alert
            message="Acceso concedido"
            description="Redirigiendo a tu perfil..."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          name="auth"
          className="login-form"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          {isRegister && (
            <>
              <Form.Item
                name="nombre"
                label={<span className="form-label-dark">Nombre</span>}
                rules={[{ required: true, message: "Ingresa tu nombre" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Ej. Juan"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="apellido"
                label={<span className="form-label-dark">Apellido</span>}
                rules={[{ required: true, message: "Ingresa tu apellido" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Ej. Pérez"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="celular"
                label={<span className="form-label-dark">Celular / Teléfono</span>}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Ej. +591 76543210"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="organizacion"
                label={<span className="form-label-dark">Organización / Empresa</span>}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="Ej. Constructora Delta"
                  disabled={loading}
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="correo"
            label={<span className="form-label-dark">Correo Electrónico</span>}
            rules={[
              { required: true, message: "Por favor ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="form-label-dark">Contraseña</span>}
            rules={[{ required: true, message: "Ingresa tu contraseña (mín. 6 caracteres)" }, { min: 6, message: "Mínimo 6 caracteres" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
              block
            >
              {loading ? 'Procesando...' : (isRegister ? 'Registrar Cuenta' : 'Iniciar Sesión')}
            </Button>
          </Form.Item>

          <div className="login-footer">
            <Button type="link" className="back-link" onClick={() => navigate("/")} disabled={loading}>
              ← Volver a la Landing Page
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
