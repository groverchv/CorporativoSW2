import React from "react";
import { Typography, Row, Col, Card, Divider } from "antd";
import {
  AimOutlined,
  CompassOutlined,
  BuildOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import "./StaticPages.css";
import empresaImg from "../../img/empresa.png";
import infraestructuraImg from "../../img/infraestructura.png";

const { Title, Paragraph } = Typography;

export default function Nosotros() {
  return (
    <div className="static-page-container nosotros-container">
      {/* HEADER SECTION */}
      <div className="static-header">
        <Title level={1} className="static-title fade-in-up">
          <TeamOutlined className="icon-gold" /> Sobre <span className="text-gold">Nosotros</span>
        </Title>
        <Paragraph className="static-subtitle fade-in-up" style={{ animationDelay: "0.2s" }}>
          Conoce la profunda historia detrás de Plan Risk 3D, nuestra evolución, y el equipo de visionarios que está transformando radicalmente la ingeniería estructural en Bolivia y el mundo con el poder de la Inteligencia Artificial.
        </Paragraph>
      </div>

      <div className="static-content">
        {/* NUESTRA HISTORIA DETALLADA */}
        <section className="about-section slide-in-left">
          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} md={12}>
              <Title level={2} className="section-title">
                ¿Quiénes Somos?
              </Title>
              <Paragraph className="about-text">
                Somos una empresa tecnológica emergente e innovadora nacida en el corazón de <strong>Santa Cruz de la Sierra, Bolivia</strong>. Nos dedicamos apasionadamente a transformar el sector de la construcción mediante la digitalización avanzada y la prevención de riesgos.
              </Paragraph>
              <Title level={3} className="text-gold" style={{ marginTop: '30px' }}>Nuestros Orígenes e Inspiración</Title>
              <Paragraph className="about-text">
                <strong>Plan Risk 3D</strong> no surgió por casualidad. Nació de la observación directa de una necesidad crítica en nuestra sociedad: mitigar los riesgos y accidentes catastróficos en obras civiles. Históricamente, muchos de estos problemas son causados por análisis preliminares inexactos, mala planificación o la falta de una visualización tridimensional realista en las etapas tempranas de los proyectos.
              </Paragraph>
              <Paragraph className="about-text">
                Nuestros fundadores se dieron cuenta de que las herramientas tradicionales en 2D dejaban un gran margen de error, donde detalles vitales pasaban desapercibidos hasta que la obra ya estaba en marcha, provocando sobrecostos masivos o, peor aún, riesgos estructurales.
              </Paragraph>
            </Col>
            <Col xs={24} md={12} className="image-col">
              <div className="image-wrapper glass-panel">
                <img src={empresaImg} alt="Empresa Plan Risk 3D" className="about-image floating-img" />
              </div>
            </Col>
          </Row>

          <Row gutter={[40, 40]} style={{ marginTop: '40px' }}>
            <Col xs={24}>
              <Title level={3} className="text-gold">Evolución y Desarrollo Tecnológico</Title>
              <Paragraph className="about-text">
                Para resolver este gran problema, decidimos combinar dos mundos que rara vez se cruzan con tanta profundidad: la estricta y milenaria <strong>Ingeniería Estructural</strong> y el avance revolucionario de las <strong>Redes Neuronales Convolucionales (Mask R-CNN)</strong> y la Inteligencia Artificial.
              </Paragraph>
              <Paragraph className="about-text">
                Comenzamos desarrollando algoritmos capaces de "leer" e "interpretar" líneas en planos 2D, identificando muros, columnas, vigas y losas con una precisión milimétrica. Tras meses de intensas pruebas y entrenamiento de modelos, logramos crear nuestra plataforma <strong>SaaS (Software as a Service)</strong>. Hoy, Plan Risk 3D es capaz de levantar modelos tridimensionales inmersivos en cuestión de minutos y ejecutar simulaciones predictivas que alertan sobre posibles fallas de carga antes de poner un solo ladrillo.
              </Paragraph>
            </Col>
          </Row>
        </section>

        <Divider className="gold-divider" />

        {/* VALORES CORPORATIVOS */}
        <section className="values-section fade-in-up">
          <Title level={2} className="section-title text-center">Nuestros Valores Fundamentales</Title>
          <Row gutter={[20, 20]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={12} md={6}>
              <div className="value-card">
                <CheckCircleOutlined className="icon-gold" style={{ fontSize: '30px', marginBottom: '15px' }} />
                <h4 style={{ color: '#fff' }}>Innovación Constante</h4>
                <p style={{ color: '#94a3b8' }}>Buscamos siempre la última tecnología en IA para mejorar nuestros procesos.</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="value-card">
                <SafetyCertificateOutlined className="icon-gold" style={{ fontSize: '30px', marginBottom: '15px' }} />
                <h4 style={{ color: '#fff' }}>Seguridad Primero</h4>
                <p style={{ color: '#94a3b8' }}>Proteger la vida humana asegurando la integridad estructural de las obras.</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="value-card">
                <TeamOutlined className="icon-gold" style={{ fontSize: '30px', marginBottom: '15px' }} />
                <h4 style={{ color: '#fff' }}>Trabajo en Equipo</h4>
                <p style={{ color: '#94a3b8' }}>Colaboración sinérgica entre desarrolladores e ingenieros civiles.</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="value-card">
                <GlobalOutlined className="icon-gold" style={{ fontSize: '30px', marginBottom: '15px' }} />
                <h4 style={{ color: '#fff' }}>Impacto Global</h4>
                <p style={{ color: '#94a3b8' }}>Comenzamos en Bolivia, pero nuestra visión es escalar a toda Latinoamérica.</p>
              </div>
            </Col>
          </Row>
        </section>

        <Divider className="gold-divider" />

        {/* MISIÓN Y VISIÓN */}
        <section className="mission-vision-section slide-in-left">
          <Row gutter={[30, 30]}>
            <Col xs={24} md={12}>
              <Card className="premium-card hover-glow">
                <div className="card-icon-wrapper">
                  <AimOutlined className="card-icon" />
                </div>
                <Title level={3} className="card-title">Nuestra Misión</Title>
                <Paragraph className="card-desc">
                  Proporcionar a arquitectos e ingenieros una plataforma intuitiva y poderosa impulsada por Inteligencia Artificial, que optimice el flujo de trabajo, prevenga colapsos estructurales y garantice que cada edificación sea segura, eficiente y rentable desde su concepción. Queremos salvar vidas y optimizar presupuestos.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="premium-card hover-glow">
                <div className="card-icon-wrapper">
                  <CompassOutlined className="card-icon" />
                </div>
                <Title level={3} className="card-title">Nuestra Visión</Title>
                <Paragraph className="card-desc">
                  Convertirnos en el estándar de oro en Latinoamérica para la validación y digitalización de proyectos civiles. Aspiramos a democratizar el acceso a tecnologías complejas de realidad aumentada e IA predictiva para que cualquier obra, ya sea una pequeña vivienda o un gran rascacielos, se construya con máxima seguridad y precisión técnica.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        <Divider className="gold-divider" />

        {/* ¿QUÉ PROBLEMAS SOLUCIONAMOS? */}
        <section className="problems-section fade-in-up">
          <Title level={2} className="section-title text-center">
            ¿Qué Problemas Resolvemos?
          </Title>
          <Row gutter={[20, 20]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <SafetyCertificateOutlined className="feature-icon" />
                <h4 className="feature-card-title">Riesgos Ocultos</h4>
                <p className="feature-card-desc">Identificamos vulnerabilidades estructurales y fallos en el diseño de planos 2D que el ojo humano podría pasar por alto debido al cansancio o a la extrema complejidad del dibujo.</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <ToolOutlined className="feature-icon" />
                <h4 className="feature-card-title">Ineficiencia en Costos</h4>
                <p className="feature-card-desc">Calculamos automáticamente y con alta precisión presupuestos de obra y cómputos métricos, evitando compras excesivas de materiales o falta de stock en momentos críticos.</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="feature-card">
                <GlobalOutlined className="feature-icon" />
                <h4 className="feature-card-title">Visualización Pobre</h4>
                <p className="feature-card-desc">Eliminamos la barrera comunicacional entre el arquitecto y el cliente final, convirtiendo incomprensibles líneas 2D en modelos 3D interactivos e inmersivos al instante.</p>
              </Card>
            </Col>
          </Row>
        </section>

        {/* ¿QUÉ OFRECEMOS Y A QUIÉN? */}
        <section className="offerings-section slide-in-right" style={{ marginTop: "60px" }}>
          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} md={12} className="image-col">
              <div className="image-wrapper glass-panel">
                <img src={infraestructuraImg} alt="Infraestructura Tecnológica" className="about-image floating-img-delayed" />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={2} className="section-title">
                Nuestras Soluciones y Sectores
              </Title>
              <Paragraph className="about-text">
                <strong>¿Qué ofrecemos como empresa de vanguardia?</strong>
              </Paragraph>
              <ul className="custom-list">
                <li><BuildOutlined className="list-icon" /> Plataforma en la nube SaaS (Software as a Service) disponible 24/7 desde cualquier dispositivo.</li>
                <li><BuildOutlined className="list-icon" /> Renderizado 3D de altísima velocidad y predicción de fallas asistida por Inteligencia Artificial.</li>
                <li><BuildOutlined className="list-icon" /> Generación instantánea de reportes técnicos.</li>
                <li><BuildOutlined className="list-icon" /> Asistencia técnica virtual e integraciones tecnológicas avanzadas para proteger la propiedad intelectual de tus planos.</li>
              </ul>

              <Paragraph className="about-text" style={{ marginTop: "30px" }}>
                <strong>¿A quién va dirigido nuestro producto?</strong>
              </Paragraph>
              <div className="tags-container">
                <span className="gold-tag">Arquitectos Independientes</span>
                <span className="gold-tag">Ingenieros Civiles</span>
                <span className="gold-tag">Empresas Constructoras Grandes y Medianas</span>
                <span className="gold-tag">Estudiantes de Arquitectura e Ingeniería</span>
                <span className="gold-tag">Fiscales de Obra e Inspectores</span>
                <span className="gold-tag">Firmas Inmobiliarias</span>
              </div>
            </Col>
          </Row>
        </section>

        <Divider className="gold-divider" />

        {/* CONTACTO DIRECTO */}
        <section className="direct-contact-section fade-in-up">
          <Row gutter={[40, 40]} justify="center">
            <Col xs={24} md={16}>
              <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
                <Title level={2} className="section-title text-center" style={{ marginBottom: '10px' }}>
                  Contáctate con Nosotros
                </Title>
                <Paragraph className="about-text" style={{ marginBottom: '30px' }}>
                  ¿Tienes dudas, propuestas de colaboración o quieres implementar Plan Risk 3D en tu empresa? Escríbenos o llámanos directamente.
                </Paragraph>
                
                <Row gutter={[20, 20]} justify="center">
                  <Col xs={24} sm={12}>
                    <div className="contact-pill">
                      <MailOutlined className="icon-gold" style={{ fontSize: '24px', marginRight: '10px' }} />
                      <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>jorgitochoque007@gmail.com</span>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="contact-pill">
                      <PhoneOutlined className="icon-gold" style={{ fontSize: '24px', marginRight: '10px' }} />
                      <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>+591 75568384</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </section>

        <Divider className="gold-divider" />

        {/* UBICACIÓN */}
        <section className="location-section fade-in-up">
          <Title level={2} className="section-title text-center">
            <EnvironmentOutlined className="icon-gold" /> Nuestra Sede Central
          </Title>
          <Paragraph className="text-center about-text" style={{ maxWidth: "700px", margin: "0 auto 30px" }}>
            Estamos ubicados estratégicamente en el dinámico centro tecnológico de <strong>Santa Cruz de la Sierra, Bolivia</strong>. Nos enorgullece exportar tecnología de clase mundial desde el corazón de Sudamérica.
          </Paragraph>
          
          <div className="map-container glass-panel">
            {/* Embedded Google Map (Centro de Santa Cruz) */}
            <iframe
              title="Ubicación Plan Risk 3D"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15197.886026900404!2d-63.19047239564639!3d-17.78135898858277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e80e145b2e95%3A0xc36ce988dfaf62fb!2sPlaza%2024%20de%20Septiembre!5e0!3m2!1ses!2sbo!4v1718912345678!5m2!1ses!2sbo"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

      </div>
    </div>
  );
}
