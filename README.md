# CorporativoSW2

Este repositorio contiene el Frontend del sitio corporativo y panel de administracion. Esta construido utilizando React y Vite, y se conecta al backend principal de Django mediante API REST y JWT.

## Caracteristicas Implementadas en el Frontend

### Autenticacion y Seguridad
- Integracion de JSON Web Tokens (JWT) para el inicio de sesion y proteccion de rutas.
- Manejo de roles de usuario (Usuario Normal, Usuario Premium, Usuario Estrella, Administrador).
- Proteccion de componentes mediante rutas privadas (RoleRoute) que restringen el acceso segun los privilegios del usuario.

### Panel de Administracion (Dashboard)
- **Inicio:** Visualizacion de estadisticas y KPIs clave del sistema en tiempo real.
- **Gestion de Precios Dinamicos:** Interfaz para que el administrador pueda configurar los precios mensuales de los diferentes planes de suscripcion.
- **Historial de Planos:** Tabla interactiva con paginacion para visualizar el historial completo de los trabajos de generacion 3D. Muestra el autor, correo electronico, estado actual y permite acceso directo a la visualizacion del modelo GLB compilado.
- **Barra de Navegacion (Sidebar):** Estructura de menu escalable que facilita la administracion de multiples vistas para el rol de administrador.

### Integracion Publica
- **Precios Dinamicos:** Las paginas publicas consultan y renderizan en tiempo real los costos de suscripcion configurados por el administrador, garantizando que todos los usuarios observen siempre los precios actualizados.

## Tecnologias Utilizadas
- React 18
- Vite
- Ant Design (para la construccion de tablas paginadas, formularios y alertas)
- React Router DOM (para navegacion y proteccion de rutas)
- Fetch API (para la comunicacion asincrona con el backend Django)
