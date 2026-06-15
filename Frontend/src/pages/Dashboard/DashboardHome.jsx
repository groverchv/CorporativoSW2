import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Spin, List, Progress, Radio, Empty, Badge, Timeline, Space, Table, Tag } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  MenuOutlined,
  AppstoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  SafetyOutlined,
  TrophyOutlined,
  DashboardOutlined,
  CrownOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AuthService from "../../services/AuthService.js";
import UsuarioService from "../../services/UsuarioService.js";
import NotificationService from "../../services/NotificationService.js";
import KPIService from "../../services/KPIService.js";

const { Title, Text } = Typography;

export default function DashboardHome() {
  // Obtener usuario autenticado desde AuthService
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Obtener usuario al cargar el componente
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    
    // Cargar estadísticas inmediatamente
    fetchStatistics();
  }, []);
  
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    kpis: null,
  });

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Fetch all data concurrently
      const [usuarios, kpiData] = await Promise.all([
        UsuarioService.getAllUsuarios(),
        KPIService.getDashboardKPIs().catch(err => {
          console.error("No se pudieron cargar los KPIs avanzados:", err);
          return null;
        })
      ]);

      // Calculate statistics
      const usuariosActivos = Array.isArray(usuarios)
        ? usuarios.filter((u) => u.estado === true || u.estado === "true" || u.estado === 1).length
        : 0;

      setStats({
        totalUsuarios: Array.isArray(usuarios) ? usuarios.length : 0,
        usuariosActivos,
        kpis: kpiData,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Inicializar Service Worker y solicitar permisos de notificación al montar
  useEffect(() => {
    NotificationService.init();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" spinning={true}>
          <div style={{ padding: '50px' }}>
            <Text>Cargando estadísticas...</Text>
          </div>
        </Spin>
      </div>
    );
  }

  const activeUsersPercentage = stats.totalUsuarios > 0
    ? Math.round((stats.usuariosActivos / stats.totalUsuarios) * 100)
    : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Bienvenido, {user?.nombre} {user?.apellido}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Panel de Administración - Plan Risk 3D
          </Text>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Usuarios"
              value={stats.totalUsuarios}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#2563eb" }}
              suffix={<span style={{ fontSize: 12, color: "#64748b" }}>({stats.usuariosActivos} activos)</span>}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Planos Procesados (Total)"
              value={stats.kpis?.rendimiento?.total_planos || 0}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#fa8c16" }}
              suffix={<span style={{ fontSize: 12, color: "#64748b" }}>({stats.kpis?.rendimiento?.planos_ultimo_mes || 0} mes actual)</span>}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="MRR (Ganancias Estimadas)"
              value={stats.kpis?.finanzas?.mrr || 0}
              prefix={<span style={{ fontWeight: 'bold' }}>Bs.</span>}
              valueStyle={{ color: "#10b981" }}
              suffix={<span style={{ fontSize: 12, color: "#64748b" }}>({stats.kpis?.finanzas?.total_premium || 0} Premium, {stats.kpis?.finanzas?.total_estrella || 0} Estrella)</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficas Estadísticas */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Distribución de Profesiones */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <UserOutlined style={{ marginRight: 8, color: "#7c3aed" }} />
                Demografía de Usuarios (Profesiones)
              </span>
            }
            hoverable
            styles={{ body: { padding: '24px', display: 'flex', justifyContent: 'center' } }}
          >
            {stats.kpis && stats.kpis.demografia ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Estudiantes', value: stats.kpis.demografia.estudiantes },
                      { name: 'Profesionales', value: stats.kpis.demografia.profesionales },
                      { name: 'Otros', value: stats.kpis.demografia.otros },
                    ].filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No hay datos demográficos disponibles" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Nuevas Estadísticas Adicionales */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Actividad del Sistema */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <DashboardOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                Estado del Sistema
              </span>
            }
            hoverable
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Usuarios Activos</Text>
                  <Text strong>{stats.usuariosActivos}/{stats.totalUsuarios}</Text>
                </div>
                <Progress
                  percent={stats.totalUsuarios > 0 ? Math.round((stats.usuariosActivos / stats.totalUsuarios) * 100) : 0}
                  strokeColor="#52c41a"
                  size="small"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Usuarios con Planos Activos (30 días)</Text>
                  <Text strong>{stats.kpis?.rendimiento?.usuarios_activos || 0}/{stats.totalUsuarios}</Text>
                </div>
                <Progress
                  percent={stats.kpis?.rendimiento?.porcentaje_usuarios_activos || 0}
                  strokeColor="#f59e0b"
                  size="small"
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* Desglose de Planes */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />
                Usuarios por Plan
              </span>
            }
            hoverable
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text><CrownOutlined style={{ color: "#faad14", marginRight: 8 }} />Plan Estrella</Text>
                  <Text strong>{stats.kpis?.finanzas?.total_estrella || 0}</Text>
                </div>
                <Progress
                  percent={stats.totalUsuarios > 0 ? Math.round(((stats.kpis?.finanzas?.total_estrella || 0) / stats.totalUsuarios) * 100) : 0}
                  strokeColor="#faad14"
                  size="small"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text><StarOutlined style={{ color: "#1890ff", marginRight: 8 }} />Plan Premium</Text>
                  <Text strong>{stats.kpis?.finanzas?.total_premium || 0}</Text>
                </div>
                <Progress
                  percent={stats.totalUsuarios > 0 ? Math.round(((stats.kpis?.finanzas?.total_premium || 0) / stats.totalUsuarios) * 100) : 0}
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text><UserOutlined style={{ color: "#8c8c8c", marginRight: 8 }} />Plan Normal (Gratis)</Text>
                  <Text strong>{stats.kpis?.detalles?.usuarios_normales || 0}</Text>
                </div>
                <Progress
                  percent={stats.totalUsuarios > 0 ? Math.round(((stats.kpis?.detalles?.usuarios_normales || 0) / stats.totalUsuarios) * 100) : 0}
                  strokeColor="#8c8c8c"
                  size="small"
                />
              </div>
              
              {stats.kpis?.finanzas?.usuarios_por_expirar > 0 && (
                <div style={{ padding: '10px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '6px' }}>
                  <Text type="danger">
                    ⚠️ Hay {stats.kpis.finanzas.usuarios_por_expirar} suscripciones por expirar en los próximos 15 días.
                  </Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tablas de Detalles */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Tabla Suscripciones */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <CrownOutlined style={{ marginRight: 8, color: "#10b981" }} />
                Suscripciones Activas (Pago)
              </span>
            }
            hoverable
          >
            <Table
              dataSource={stats.kpis?.detalles?.suscripciones || []}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              columns={[
                {
                  title: 'Usuario',
                  dataIndex: 'nombre',
                  key: 'nombre',
                  render: (text, record) => `${text} ${record.apellido}`,
                },
                {
                  title: 'Correo',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Plan',
                  dataIndex: 'rol',
                  key: 'rol',
                  render: (rol) => {
                    let color = rol === 'usuario_estrella' ? 'gold' : 'blue';
                    let label = rol === 'usuario_estrella' ? 'Estrella' : 'Premium';
                    return <Tag color={color}>{label}</Tag>;
                  }
                },
                {
                  title: 'Aporte',
                  key: 'aporte',
                  render: (_, record) => {
                    const precios = stats.kpis?.detalles?.precios_actuales || {};
                    const monto = record.rol === 'usuario_estrella' 
                      ? (precios.usuario_estrella || 180) 
                      : (precios.usuario_premium || 220);
                    return <Text strong style={{ color: "#10b981" }}>Bs. {monto}</Text>;
                  }
                }
              ]}
            />
          </Card>
        </Col>

        {/* Tabla Planos */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <AppstoreOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
                Últimos Planos Procesados
              </span>
            }
            hoverable
          >
            <Table
              dataSource={stats.kpis?.detalles?.planos_recientes || []}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              columns={[
                {
                  title: 'ID Plano',
                  dataIndex: 'id',
                  key: 'id',
                  render: (id) => <Text strong>#{id}</Text>
                },
                {
                  title: 'Creador',
                  dataIndex: 'usuario_nombre',
                  key: 'usuario_nombre',
                },
                {
                  title: 'Fecha',
                  dataIndex: 'created_at',
                  key: 'created_at',
                  render: (date) => new Date(date).toLocaleDateString()
                },
                {
                  title: 'Estado',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    let color = status === 'completed' ? 'green' : status === 'processing' ? 'orange' : 'default';
                    return <Tag color={color}>{status || 'N/A'}</Tag>;
                  }
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
