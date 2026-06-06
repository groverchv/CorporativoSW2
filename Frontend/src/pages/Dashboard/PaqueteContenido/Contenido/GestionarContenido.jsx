// src/pages/Dashboard/Contenido/GestionarContenido.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Select,
    message,
    Card,
    Typography,
    Spin,
    Row,
    Col,
    Empty,
    Table,
    Tag,
    Space,
    Modal,
    Input,
    Popconfirm,
    Tooltip,
    Switch
} from "antd";
import {
    FileTextOutlined,
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    FormOutlined
} from "@ant-design/icons";

// Services
import MenuService from "../../../../services/MenuService.js";
import Sub_MenuService from "../../../../services/Sub_MenuService.js";
import ContenidoService from "../../../../services/ContenidoService.js";
import Filtador from "../../Filtador";
import Paginacion from "../../Paginacion";

const { Title, Text } = Typography;
const { Option } = Select;

export default function GestionarContenido() {
    const navigate = useNavigate();

    // Estados para navegación
    const [menus, setMenus] = useState([]);
    const [subMenus, setSubMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [filteredSubMenus, setFilteredSubMenus] = useState([]);

    // Estados para contenidos
    const [contenidos, setContenidos] = useState([]);
    const [loadingContenidos, setLoadingContenidos] = useState(false);

    // Estados para crear contenido
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [newContenidoTitle, setNewContenidoTitle] = useState('');
    const [creatingContenido, setCreatingContenido] = useState(false);

    // Estados para editar contenido (título y visibilidad)
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingContenido, setEditingContenido] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedVisibilidad, setEditedVisibilidad] = useState(true);
    const [savingEdit, setSavingEdit] = useState(false);

    // Estados para Paginación y Filtrado
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Cargar Menús al montar
    useEffect(() => {
        const loadMenus = async () => {
            try {
                const data = await MenuService.getAllMenus();
                setMenus(Array.isArray(data) ? data : []);
            } catch (error) {
                message.error("Error al cargar Menús");
            }
        };
        loadMenus();
    }, []);

    // Cargar todos los SubMenus al montar
    useEffect(() => {
        const loadSubMenus = async () => {
            try {
                const data = await Sub_MenuService.getAllSubMenu();
                setSubMenus(Array.isArray(data) ? data : []);
            } catch (error) {
                message.error("Error al cargar SubMenus");
            }
        };
        loadSubMenus();
    }, []);

    // Filtrar SubMenus cuando se selecciona un Menu
    const handleMenuChange = (menuId) => {
        setSelectedMenu(menuId);
        setSelectedSubMenu(null);
        setContenidos([]);

        if (!menuId) {
            setFilteredSubMenus([]);
            return;
        }

        const filtered = subMenus.filter(sm => sm.menu_id?.id === menuId);
        setFilteredSubMenus(filtered);
    };

    // Cargar CONTENIDOS cuando se selecciona SubMenu
    const handleSubMenuChange = async (subMenuId) => {
        setSelectedSubMenu(subMenuId);

        if (!subMenuId) {
            setContenidos([]);
            return;
        }

        setLoadingContenidos(true);
        try {
            const data = await ContenidoService.getContenidosBySubMenu(subMenuId);
            setContenidos(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error("Error al cargar contenidos");
        } finally {
            setLoadingContenidos(false);
        }
    };

    // Lógica de Filtrado
    const filteredContenidos = contenidos.filter((item) => {
        if (!searchText) return true;
        const searchLower = searchText.toLowerCase();
        return item.titulo?.toLowerCase().includes(searchLower);
    });

    // Lógica de Paginación
    const paginatedContenidos = filteredContenidos.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Abrir modal para crear nuevo contenido
    const handleCreateContenido = () => {
        setNewContenidoTitle('');
        setCreateModalVisible(true);
    };

    // Crear contenido
    const handleConfirmCreateContenido = async () => {
        if (!newContenidoTitle.trim()) {
            message.warning("Ingrese un título para el contenido");
            return;
        }

        setCreatingContenido(true);
        try {
            await ContenidoService.createContenido(selectedSubMenu, newContenidoTitle);
            message.success("Contenido creado exitosamente");
            setCreateModalVisible(false);
            setNewContenidoTitle('');
            // Recargar contenidos
            await handleSubMenuChange(selectedSubMenu);
        } catch (error) {
            message.error("Error al crear contenido");
        } finally {
            setCreatingContenido(false);
        }
    };

    // Navegar al editor para un contenido
    const handleEditContenido = (contenido) => {
        navigate(`/dashboard/contenido/editar/${contenido.id}`);
    };

    // Eliminar contenido
    const handleDeleteContenido = async (contenidoId) => {
        try {
            await ContenidoService.deleteContenido(contenidoId);
            message.success("Contenido eliminado");
            // Recargar contenidos
            await handleSubMenuChange(selectedSubMenu);
        } catch (error) {
            message.error("Error al eliminar contenido");
        }
    };

    // Abrir modal para editar (título y visibilidad)
    const handleOpenEdit = (contenido) => {
        setEditingContenido(contenido);
        setEditedTitle(contenido.titulo);
        setEditedVisibilidad(contenido.estado !== false);
        setEditModalVisible(true);
    };

    // Guardar cambios (título y visibilidad)
    const handleSaveEdit = async () => {
        if (!editedTitle.trim()) {
            message.warning("El título no puede estar vacío");
            return;
        }

        setSavingEdit(true);
        try {
            await ContenidoService.updateContenido(editingContenido.id, {
                ...editingContenido,
                titulo: editedTitle.trim(),
                estado: editedVisibilidad
            });
            message.success("Contenido actualizado correctamente");
            setEditModalVisible(false);
            setEditingContenido(null);
            setEditedTitle('');
            setEditedVisibilidad(true);
            // Recargar contenidos
            await handleSubMenuChange(selectedSubMenu);
        } catch (error) {
            message.error("Error al actualizar el contenido");
        } finally {
            setSavingEdit(false);
        }
    };

    // Columnas para tabla de contenidos
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Título',
            dataIndex: 'titulo',
            key: 'titulo',
        },
        {
            title: 'Visibilidad',
            dataIndex: 'estado',
            key: 'estado',
            width: 120,
            align: 'center',
            render: (estado) => (
                estado !== false ? (
                    <Tag color="green" icon={<EyeOutlined />}>Visible</Tag>
                ) : (
                    <Tag color="default" icon={<EyeInvisibleOutlined />}>Oculto</Tag>
                )
            )
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 300,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Editar título y visibilidad">
                        <Button
                            icon={<FormOutlined />}
                            onClick={() => handleOpenEdit(record)}
                            size="small"
                        >
                            Editar
                        </Button>
                    </Tooltip>
                    <Tooltip title="Editar el contenido">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEditContenido(record)}
                            size="small"
                        >
                            Editar Contenido
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="¿Eliminar este contenido?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => handleDeleteContenido(record.id)}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Eliminar contenido permanentemente">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Eliminar
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-container">
            {/* Header con selectors */}
            <Card style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 16 }}>
                    <FileTextOutlined style={{ fontSize: 24, marginRight: 12, color: '#1890ff' }} />
                    <Title level={2} style={{ display: 'inline', margin: 0 }}>
                        Gestión de Contenido por Bloques
                    </Title>
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5}>1. Seleccione el Menú:</Title>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Seleccione un Menú"
                            onChange={handleMenuChange}
                            value={selectedMenu}
                            allowClear
                        >
                            {menus.map(menu => (
                                <Option key={menu.id} value={menu.id}>
                                    {menu.titulo}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={12}>
                        <Title level={5}>2. Seleccione el SubMenú:</Title>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Seleccione un SubMenú"
                            onChange={handleSubMenuChange}
                            value={selectedSubMenu}
                            disabled={!selectedMenu}
                            allowClear
                        >
                            {filteredSubMenus.map(sm => (
                                <Option key={sm.id} value={sm.id}>
                                    {sm.titulo}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Lista de contenidos */}
            {!selectedMenu && !selectedSubMenu && (
                <Card>
                    <Empty description="Seleccione un Menú y un SubMenú para comenzar" />
                </Card>
            )}

            {selectedMenu && !selectedSubMenu && (
                <Card>
                    <Empty description="Seleccione un SubMenú para ver sus contenidos" />
                </Card>
            )}

            {selectedSubMenu && (
                loadingContenidos ? (
                    <Card>
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    </Card>
                ) : (
                    <Card
                        title="Contenidos del SubMenú"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreateContenido}
                            >
                                Crear Nuevo Contenido
                            </Button>
                        }
                    >
                        <Filtador
                            placeholder="Buscar por título..."
                            onSearch={setSearchText}
                            value={searchText}
                        />

                        {contenidos.length === 0 ? (
                            <Empty description="No hay contenidos. Crea uno nuevo." />
                        ) : (
                            <>
                                <Table
                                    columns={columns}
                                    dataSource={paginatedContenidos}
                                    rowKey="id"
                                    pagination={false}
                                />
                                <Paginacion
                                    current={currentPage}
                                    total={filteredContenidos.length}
                                    pageSize={pageSize}
                                    onChange={(page, size) => {
                                        setCurrentPage(page);
                                        setPageSize(size);
                                    }}
                                />
                            </>
                        )}
                    </Card>
                )
            )}

            {/* Modal para crear contenido */}
            <Modal
                title="Crear Nuevo Contenido"
                open={createModalVisible}
                onOk={handleConfirmCreateContenido}
                onCancel={() => setCreateModalVisible(false)}
                confirmLoading={creatingContenido}
                okText="Crear"
                cancelText="Cancelar"
            >
                <Input
                    placeholder="Título del contenido"
                    value={newContenidoTitle}
                    onChange={(e) => setNewContenidoTitle(e.target.value)}
                    onPressEnter={handleConfirmCreateContenido}
                    autoFocus
                />
            </Modal>

            {/* Modal para editar título y visibilidad */}
            <Modal
                title="Editar Contenido"
                open={editModalVisible}
                onOk={handleSaveEdit}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingContenido(null);
                    setEditedTitle('');
                    setEditedVisibilidad(true);
                }}
                confirmLoading={savingEdit}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Título:</Text>
                    <Input
                        placeholder="Título del contenido"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{ marginTop: 8 }}
                        autoFocus
                    />
                </div>
                <div>
                    <Text strong>Visibilidad:</Text>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Switch
                            checked={editedVisibilidad}
                            onChange={setEditedVisibilidad}
                            checkedChildren={<EyeOutlined />}
                            unCheckedChildren={<EyeInvisibleOutlined />}
                        />
                        <Text type={editedVisibilidad ? 'success' : 'secondary'}>
                            {editedVisibilidad ? 'Visible para usuarios' : 'Oculto para usuarios'}
                        </Text>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
