// src/pages/Auth/Perfil.jsx
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Typography, Spin, Space, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  EditOutlined,
  SaveOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService.js";
import UsuarioService from "../../services/UsuarioService.js";
import "./Perfil.css";

const { Title, Text } = Typography;

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    // Verificar sesión al cargar
    if (!AuthService.isAuthenticated()) {
      message.error("Debes iniciar sesión para acceder al perfil.");
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const fullProfile = await UsuarioService.getUsuarioById(currentUser.id);
        setUser(fullProfile);
        form.setFieldsValue({
          nombre: fullProfile.nombre,
          apellido: fullProfile.apellido,
          correo: fullProfile.correo,
          celular: fullProfile.celular,
          organizacion: fullProfile.organizacion
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        message.error("No se pudo obtener la información de perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const updatedProfile = await UsuarioService.updateUsuario(user.id, {
        nombre: values.nombre,
        apellido: values.apellido,
        correo: values.correo,
        celular: values.celular,
        organizacion: values.organizacion
      });

      // Actualizar localStorage también
      const currentUser = AuthService.getCurrentUser();
      const updatedUserLocal = {
        ...currentUser,
        nombre: updatedProfile.nombre,
        apellido: updatedProfile.apellido,
        celular: updatedProfile.celular,
        organizacion: updatedProfile.organizacion
      };
      localStorage.setItem("user", JSON.stringify(updatedUserLocal));

      setUser(updatedProfile);
      setIsEditing(false);
      message.success({
        content: "Perfil actualizado correctamente",
        icon: <CheckCircleOutlined style={{ color: "#d97706" }} />
      });
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      message.error("Error al actualizar la información de perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    message.success("Sesión cerrada correctamente.");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="perfil-loading">
        <Spin size="large" />
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <Card className="perfil-card" variant="borderless">
        <div className="perfil-header">
          <Title level={2} className="perfil-title">Mi Perfil</Title>
          <Text className="perfil-subtitle">Administra tu información de cuenta en Plan Risk 3D</Text>
        </div>

        <Divider className="perfil-divider" />

        <Form
          form={form}
          name="profile"
          layout="vertical"
          onFinish={handleSave}
          size="large"
          className="perfil-form"
        >
          <Form.Item
            name="nombre"
            label={<span className="profile-label">Nombre</span>}
            rules={[{ required: true, message: "El nombre es obligatorio" }]}
          >
            <Input
              prefix={<UserOutlined />}
              disabled={!isEditing || saving}
              placeholder="Nombre"
            />
          </Form.Item>

          <Form.Item
            name="apellido"
            label={<span className="profile-label">Apellido</span>}
            rules={[{ required: true, message: "El apellido es obligatorio" }]}
          >
            <Input
              prefix={<UserOutlined />}
              disabled={!isEditing || saving}
              placeholder="Apellido"
            />
          </Form.Item>

          <Form.Item
            name="correo"
            label={<span className="profile-label">Correo Electrónico (Solo lectura)</span>}
          >
            <Input
              prefix={<MailOutlined />}
              disabled={true}
              placeholder="correo@ejemplo.com"
            />
          </Form.Item>

          <Form.Item
            name="celular"
            label={<span className="profile-label">Celular / Teléfono</span>}
          >
            <Input
              prefix={<PhoneOutlined />}
              disabled={!isEditing || saving}
              placeholder="Ej. +591 76543210"
            />
          </Form.Item>

          <Form.Item
            name="organizacion"
            label={<span className="profile-label">Organización / Empresa</span>}
          >
            <Input
              prefix={<BankOutlined />}
              disabled={!isEditing || saving}
              placeholder="Ej. Constructora Delta"
            />
          </Form.Item>

          <Divider className="perfil-divider" />

          <div className="perfil-actions">
            {isEditing ? (
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => {
                    setIsEditing(false);
                    form.setFieldsValue(user);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />} 
                  loading={saving}
                  className="perfil-save-btn"
                >
                  Guardar Cambios
                </Button>
              </Space>
            ) : (
              <div className="action-row">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setIsEditing(true)}
                  className="perfil-edit-btn"
                >
                  Editar Perfil
                </Button>
                <Button 
                  danger 
                  type="primary"
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  className="perfil-logout-btn"
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}
