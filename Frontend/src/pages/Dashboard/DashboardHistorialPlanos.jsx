import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Spin, Button, message } from 'antd';
import { SyncOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const DJANGO_URL = import.meta.env.VITE_DJANGO_BACKEND_URL || "https://defensasw2.jorgechoquecalle.engineer";

const getAuthHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    if (user && user.token) {
      return {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json"
      };
    }
  } catch (e) {
    return {};
  }
  return {};
};

export default function DashboardHistorialPlanos() {
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${DJANGO_URL}/api/users/admin/historial-planos/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) throw new Error("Error al obtener historial");
      const data = await response.json();
      setPlanos(data);
    } catch (error) {
      console.error(error);
      message.error("No se pudo cargar el historial de planos.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID Plano',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>#{id}</Text>,
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Creador',
      key: 'creador',
      render: (_, record) => (
        <div>
          <Text strong>{record.usuario_nombre} {record.usuario_apellido}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.usuario_email}</Text>
        </div>
      ),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        let color = estado === 'completed' ? 'success' : 'warning';
        return <Tag color={color}>{estado}</Tag>;
      }
    },
    {
      title: 'Modelo 3D',
      key: 'modelo',
      render: (_, record) => (
        record.glb_url ? (
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => window.open(`${DJANGO_URL}${record.glb_url}`, "_blank")}
          >
            Ver GLB
          </Button>
        ) : (
          <Text type="secondary">Pendiente</Text>
        )
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Historial Completo de Planos</Title>
          <Text type="secondary">
            Lista de todos los proyectos 3D generados en Plan Risk 3D.
          </Text>
        </div>
        <Button 
          type="default" 
          icon={<SyncOutlined spin={loading} />} 
          onClick={fetchHistorial}
        >
          Actualizar
        </Button>
      </div>

      <Card>
        <Table 
          dataSource={planos}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} planos`
          }}
        />
      </Card>
    </div>
  );
}
