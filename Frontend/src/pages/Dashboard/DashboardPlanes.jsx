import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, notification, Typography, Space, Spin, Alert } from 'antd';
import { SaveOutlined, CrownOutlined, StarOutlined } from '@ant-design/icons';
import PlanConfigService from '../../services/PlanConfigService';

const { Title, Text } = Typography;

export default function DashboardPlanes() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrecios();
  }, []);

  const loadPrecios = async () => {
    try {
      setLoading(true);
      const data = await PlanConfigService.getPrecios();
      form.setFieldsValue(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los precios actuales.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      await PlanConfigService.updatePrecios(values);
      notification.success({
        message: 'Precios Actualizados',
        description: 'Los nuevos precios han sido guardados exitosamente. El Dashboard ahora usará estos valores.',
      });
    } catch (error) {
      notification.error({
        message: 'Error al Guardar',
        description: 'Hubo un problema guardando los nuevos precios.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Configuración de Planes</Title>
      <Text type="secondary">
        Establece los precios mensuales para los planes de Plan Risk 3D. Estos precios se utilizarán para calcular tus ganancias (MRR) de forma dinámica en tu Dashboard.
      </Text>

     

      <Card hoverable style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="usuario_premium"
            label={<span><StarOutlined style={{ color: '#1890ff', marginRight: 8 }} />Precio Plan Premium (Bs.)</span>}
            rules={[{ required: true, message: 'Por favor ingresa un precio' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              min={0}
              step={0.1}
              formatter={value => `Bs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/Bs\.\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="usuario_estrella"
            label={<span><CrownOutlined style={{ color: '#faad14', marginRight: 8 }} />Precio Plan Estrella (Bs.)</span>}
            rules={[{ required: true, message: 'Por favor ingresa un precio' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              min={0}
              step={0.1}
              formatter={value => `Bs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/Bs\.\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={saving}
              block
            >
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
