import React from "react";
import { Typography, Card } from "antd";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Privacidad() {
  return (
    <div className="static-page-wrapper" style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
      <section className="tech-intro-section" style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={1} className="tech-main-title" style={{ color: "#ffffff" }}>Política de Privacidad</Title>
        <Text style={{ color: "#94a3b8" }}>Última actualización: Junio 2026</Text>
        <div className="divider-gold" style={{ margin: "20px auto" }}></div>
      </section>

      <Card className="legal-content-card" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(217, 119, 6, 0.15)", borderRadius: 16 }}>
        <Typography style={{ color: "#cbd5e1" }}>
          <Title level={3} style={{ color: "#fff", marginTop: 0 }}>1. Información que Recopilamos</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Recopilamos la información estrictamente necesaria para brindar nuestros servicios SaaS de simulación estructural y control de obras:
          </Paragraph>
          <ul style={{ paddingLeft: 20, marginBottom: 16, color: "#cbd5e1" }}>
            <li>**Datos de Registro:** Nombre completo, apellido, dirección de correo electrónico, contraseña (encriptada), teléfono y profesión.</li>
            <li>**Datos Técnicos:** Archivos de planos arquitectónicos (PDF, PNG, JPG, CAD) que cargue en la plataforma y los modelos 3D resultantes.</li>
            <li>**Registros de Transacciones:** Registros del plan de suscripción seleccionado e historial de pagos.</li>
          </ul>

          <Title level={3} style={{ color: "#fff", marginTop: 24 }}>2. Uso de la Información</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Sus datos y planos se utilizan únicamente para procesar los modelos 3D estructurales mediante nuestra red neuronal Mask R-CNN, realizar análisis de daños vía Gemini AI y generar cómputos métricos de materiales. Nos comprometemos a no vender, alquilar ni compartir su información o archivos técnicos con terceros para fines comerciales o publicitarios.
          </Paragraph>

          <Title level={3} style={{ color: "#f59e0b", marginTop: 24 }}>3. Seguridad y Auditoría en Blockchain</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Para garantizar la inmutabilidad y transparencia de las auditorías de riesgo estructural generadas en la plataforma, registramos los hashes criptográficos (huellas digitales) de los reportes en una cadena de bloques (Blockchain). Esto asegura que sus análisis de seguridad no puedan ser alterados retroactivamente. Adicionalmente, toda la comunicación se cifra mediante protocolos SSL/TLS y las contraseñas se almacenan con algoritmos de hasheo seguros (bcrypt/argon2) en el backend de Django.
          </Paragraph>

          <Title level={3} style={{ color: "#fff", marginTop: 24 }}>4. Sus Derechos de Acceso y Eliminación</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Usted conserva el control total de sus datos. En cualquier momento, puede acceder a su perfil para modificar sus datos personales, descargar sus planos procesados o solicitar la eliminación total de su cuenta y archivos de nuestros servidores llamando al canal de soporte técnico.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
}
