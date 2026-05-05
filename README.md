# EcoDespensa 🌱

EcoDespensa es un sistema de gestión inteligente y sostenible para el inventario del hogar. Su objetivo principal es reducir el desperdicio de comida mediante alertas automatizadas de caducidad y listas de compras gestionadas eficientemente.

## Características Principales

- **Gestión de Inventario**: Registra y mantén la cuenta de todos tus artículos en un solo lugar.
- **Alertas de Caducidad Visuales**: Identifica el estado de tus productos mediante colores:
  - 🟢 **Seguro**: Tiempo de vida abundante.
  - 🟡 **Crítico**: Caduca en 3 días o menos.
  - 🔴 **Caducado**: Fecha de caducidad superada.
- **Diseño Responsivo y Eco-Friendly**: Interfaz limpia, minimalista y cuidadosamente adaptada tanto para computadoras de escritorio como para celulares (Móvil-First).
- **Categorías**: Organización simplificada en Lácteos, Frutas, Verduras, Infusiones, etc.
- **Autenticación Moderna**: Gestión de usuarios basada de manera segura con JWT (JSON Web Tokens) e integración mock con Google.

## Arquitectura y Tecnologías

Este es un proyecto Full-stack (MERN/PERN refactorizado) compuesto por:

- **Frontend**: `React.js` (React Router DOM, Axios, Lucide React).
- **Backend / API**: `Node.js` y `Express.js`.
- **Base de Datos**: Base de datos Relacional (SQL) gestionada por el ORM `Sequelize` con `SQLite`. Permite su uso inmediato sin instalación de motores externos.
- **Autenticación**: `bcryptjs` y `jsonwebtoken`.

## Instalación y Ejecución Local

### Requisitos
- [Node.js](https://nodejs.org/es/) instalado.
- Opcional: Git.

### Pasos

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone https://github.com/TU-USUARIO/EcoDespensa.git
   cd EcoDespensa
   ```

2. **Iniciar el Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *El backend correrá en el puerto `4000`. La base de datos SQLite `database.sqlite` se generará automáticamente.*

3. **Iniciar el Frontend**
   Abre una nueva terminal en la raíz del proyecto y ejecuta:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   *La app web se lanzará en `http://localhost:3000` o en la IP local de tu red si accedes desde tu celular.*

### Modelos de la Base de Datos

- **Usuario**: `id, nombre, email, password, fecha_registro`
- **Categoria**: `id, nombre, icono`
- **Producto**: `id, usuario_id, categoria_id, nombre, cantidad, unidad, fecha_entrada, fecha_caducidad`
- **ListaCompras**: `id, usuario_id, nombre_producto, cantidad, comprado`
- **HistorialEco**: `id, usuario_id, nombre, accion, cantidad, fecha`

---
*Hecho con 💚 para reducir el desperdicio en los hogares.*
