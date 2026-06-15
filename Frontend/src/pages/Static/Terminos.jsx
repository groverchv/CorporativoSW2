import React from "react";
import { Typography, Card } from "antd";
import "./StaticPages.css";

const { Title, Paragraph, Text } = Typography;

export default function Terminos() {
  return (
    <div className="static-page-wrapper" style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
      <section className="tech-intro-section" style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={1} className="tech-main-title" style={{ color: "#ffffff" }}>Términos y Condiciones</Title>
        <Text style={{ color: "#94a3b8" }}>Última actualización: Junio 2026</Text>
        <div className="divider-gold" style={{ margin: "20px auto" }}></div>
      </section>

      <Card className="legal-content-card" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(217, 119, 6, 0.15)", borderRadius: 16 }}>
        <Typography style={{ color: "#cbd5e1" }}>
          <Title level={3} style={{ color: "#fff", marginTop: 0 }}>1. Aceptación de los Términos</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Al registrarse y utilizar los servicios de la plataforma **Plan Risk 3D**, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de servicio. Si no está de acuerdo con alguna parte de estos términos, no debe acceder al software.
          </Paragraph>

          <Title level={3} style={{ color: "#fff", marginTop: 24 }}>2. Descripción del Servicio (Licencia SaaS)</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Plan Risk 3D es una plataforma de software en la nube bajo la modalidad SaaS (Software as a Service) que proporciona herramientas de modelado tridimensional de planos arquitectónicos y simulación de riesgos estructurales asistidos por Inteligencia Artificial (Mask R-CNN y Gemini). El usuario adquiere una licencia de acceso temporal según el plan seleccionado (Básico, Estrella o Premium) y no posee ningún derecho de propiedad sobre el código fuente, marcas o patentes del software.
          </Paragraph>

          <Title level={3} style={{ color: "#f59e0b", marginTop: 24 }}>3. Limitación de Responsabilidad Técnica (Ingeniería Civil)</Title>
          <Paragraph style={{ color: "#cbd5e1", fontWeight: "bold" }}>
            IMPORTANTE: Todos los cálculos, predicciones de riesgos, modelos 3D y reportes generados por la Inteligencia Artificial de Plan Risk 3D son herramientas de asistencia técnica computacional preliminar y NO reemplazan el criterio profesional de un Ingeniero Civil o Ingeniero Estructural colegiado. La empresa no asume responsabilidad civil ni legal por daños directos o indirectos, fallas de construcción, colapsos estructurales o multas derivadas de la ejecución de obras basadas únicamente en los análisis proporcionados por esta plataforma.
          </Paragraph>

          <Title level={3} style={{ color: "#fff", marginTop: 24 }}>4. Uso Aceptable de la Cuenta</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            Usted se compromete a no utilizar el sistema para subir archivos corruptos, planos que violen derechos de autor de terceros o ejecutar scripts maliciosos. Queda prohibida la ingeniería inversa del motor de IA o el scraping automatizado de la base de datos de materiales y presupuestos de obra.
          </Paragraph>

          <Title level={3} style={{ color: "#fff", marginTop: 24 }}>5. Modificaciones del Servicio y Tarifas</Title>
          <Paragraph style={{ color: "#cbd5e1" }}>
            La empresa se reserva el derecho de modificar o suspender temporal o permanentemente el servicio con o sin previo aviso. Los precios de los planes (180 Bs. y 220 Bs.) pueden estar sujetos a cambios, los cuales se notificarán con al menos 30 días de anticipación.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
}
