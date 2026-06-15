import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  Select,
  message,
  Popconfirm,
  Tag,
  Card,
  Typography
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  Html5Outlined,
  FilePdfOutlined,
  FileExcelOutlined
} from "@ant-design/icons";
import UsuarioService from "../../../services/UsuarioService.js";
import Filtador from "../Filtador";
import Paginacion from "../Paginacion";

const { Title } = Typography;
const { Option } = Select;

export default function GestionarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [form] = Form.useForm();

  // Estados para Paginación y Filtrado
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await UsuarioService.getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      message.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Filtrado
  const filteredUsuarios = usuarios.filter((user) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(searchLower) ||
      user.apellido?.toLowerCase().includes(searchLower) ||
      user.correo?.toLowerCase().includes(searchLower) ||
      user.rol?.toLowerCase().includes(searchLower) ||
      user.id?.toString().includes(searchLower)
    );
  });

  // Lógica de Paginación
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenModal = (usuario = null) => {
    setEditingUsuario(usuario);
    if (usuario) {
      form.setFieldsValue({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol || "usuario_normal",
        estado: usuario.estado ?? true
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ estado: true, rol: "usuario_normal" });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingUsuario(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUsuario) {
        const payload = { ...values };
        if (!payload.password) {
          delete payload.password;
        }
        await UsuarioService.updateUsuario(editingUsuario.id, payload);
        message.success("Usuario actualizado exitosamente");
      } else {
        await UsuarioService.createUsuario(values);
        message.success("Usuario creado exitosamente");
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleDelete = async (id) => {
    try {
      await UsuarioService.deleteUsuario(id);
      message.success("Usuario eliminado exitosamente");
      fetchUsuarios();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleToggleEstado = async (id) => {
    try {
      await UsuarioService.toggleEstado(id);
      message.success("Estado actualizado exitosamente");
      fetchUsuarios();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 150
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      width: 150
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      width: 250
    },
    {
      title: "Rol / Plan",
      dataIndex: "rol",
      key: "rol",
      width: 150,
      render: (rol) => {
        let color = "blue";
        let text = "Normal (Free)";
        if (rol === "usuario_premium") {
          color = "gold";
          text = "Premium";
        } else if (rol === "usuario_estrella") {
          color = "purple";
          text = "Estrella";
        } else if (rol === "Administrador") {
          color = "volcano";
          text = "Administrador";
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 100,
      render: (estado, record) => (
        <Tag
          color={estado ? "green" : "red"}
          style={{ cursor: "pointer" }}
          onClick={() => handleToggleEstado(record.id)}
        >
          {estado ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenModal(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Está seguro de eliminar este usuario?"
            description="Esta acción no se puede deshacer."
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-container">
      <Card variant="borderless">
        <div className="admin-header">
          <div className="admin-title-wrapper">
            <Title level={2}>Gestión de Usuarios</Title>
            <span className="admin-subtitle">Administra los usuarios y sus licencias de Plan Risk 3D</span>
          </div>
          <div className="admin-header-actions">
            <Button className="btn-export btn-export-html" icon={<Html5Outlined />}>HTML</Button>
            <Button className="btn-export btn-export-pdf" icon={<FilePdfOutlined />}>PDF</Button>
            <Button className="btn-export btn-export-excel" icon={<FileExcelOutlined />}>Excel</Button>
            <Button
              type="primary"
              className="btn-primary-action"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
            >
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <Filtador
          placeholder="Buscar por nombre, correo, rol o ID..."
          onSearch={setSearchText}
          value={searchText}
        />

        <Table
          columns={columns}
          dataSource={paginatedUsuarios}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />

        <Paginacion
          current={currentPage}
          total={filteredUsuarios.length}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </Card>

      <Modal
        title={editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ estado: true, rol: "usuario_normal" }}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ej: Juan" />
          </Form.Item>

          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: "Por favor ingrese el apellido" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ej: Perez" />
          </Form.Item>

          <Form.Item
            name="correo"
            label="Correo Electrónico"
            rules={[
              { required: true, message: "Por favor ingrese el correo" },
              { type: "email", message: "Ingrese un correo válido" }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Ej: juan@gmail.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: !editingUsuario, message: "Por favor ingrese la contraseña" }]}
            help={editingUsuario ? "Dejar en blanco para mantener la actual" : null}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item
            name="rol"
            label="Rol / Licencia"
            rules={[{ required: true, message: "Por favor seleccione el rol" }]}
          >
            <Select placeholder="Seleccione un rol">
              <Option value="usuario_normal">Free (Normal - 4 Plantillas)</Option>
              <Option value="usuario_estrella">Estrella (180 Bs. - 24 Plantillas)</Option>
              <Option value="usuario_premium">Premium (220 Bs. - Ilimitado)</Option>
              <Option value="Administrador">Administrador</Option>
            </Select>
          </Form.Item>

          <Form.Item name="estado" label="Estado" valuePropName="checked">
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {editingUsuario ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}