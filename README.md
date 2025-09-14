# PyME Connect - Frontend

Una plataforma de matching entre PyMEs y proveedores de servicios, construida con React, TypeScript y Material-UI.

## 🚀 Características

### Flujo Básico Implementado

- **Sign in/Log in**: Sistema de autenticación completo con registro y login
- **Creación de perfiles**: 
  - PyME: Necesidades, presupuesto, ubicación, industria
  - Proveedor: Servicios, capacidades, precios orientativos, ubicación
- **Búsqueda/Match automático**: Sistema de scoring que calcula similitudes entre perfiles
- **Chat interno**: Comunicación directa con posibilidad de enviar cotizaciones
- **Flujo de negocio**: Conversación → Negocio → Rating/Review
- **Dashboard con métricas**: Estadísticas y gráficos de rendimiento

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes y diseño
- **React Router** para navegación
- **Recharts** para gráficos y métricas
- **React Hook Form** para formularios
- **Axios** para peticiones HTTP (preparado para backend)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── business/       # Componentes de gestión de negocios
│   ├── chat/           # Componentes del sistema de chat
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de layout
│   ├── matching/       # Componentes de búsqueda y matching
│   └── profile/        # Componentes de perfiles
├── contexts/           # Contextos de React
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios para API calls
├── types/              # Definiciones de TypeScript
└── utils/              # Utilidades
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint
```

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Registro con selección de tipo de usuario (PyME/Proveedor)
- Login con validación
- Protección de rutas
- Gestión de sesión

### 2. Perfiles
- **PyME**: Información de empresa, necesidades, presupuesto
- **Proveedor**: Servicios ofrecidos, capacidades, precios orientativos
- Formularios dinámicos con validación

### 3. Sistema de Matching
- Algoritmo de scoring basado en:
  - Coincidencia de necesidades/servicios (40%)
  - Compatibilidad de presupuesto (25%)
  - Rating del proveedor (20%)
  - Ubicación (10%)
  - Número de reviews (5%)
- Búsqueda con filtros avanzados
- Resultados ordenados por relevancia

### 4. Chat y Cotizaciones
- Chat en tiempo real (simulado)
- Envío de cotizaciones con detalles
- Aceptación/rechazo de cotizaciones
- Historial de conversaciones

### 5. Gestión de Negocios
- Seguimiento de proyectos
- Estados: Pendiente → En Progreso → Completado
- Sistema de reviews y ratings
- Métricas de rendimiento

### 6. Dashboard
- Métricas clave (matches, chats, negocios, ingresos)
- Gráficos de tendencias mensuales
- Acciones rápidas
- Consejos personalizados

## 🎨 Diseño y UX

- **Material Design** con tema personalizado
- **Responsive** para móviles y desktop
- **Navegación intuitiva** con breadcrumbs
- **Feedback visual** para todas las acciones
- **Loading states** y manejo de errores

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SOCKET_URL=http://localhost:8000
```

### Tema Personalizado

El tema se puede personalizar en `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: xs, sm, md, lg, xl
- **Navegación adaptativa**: Menú hamburguesa en móviles
- **Grid system**: Layout flexible con Material-UI Grid

## 🔐 Seguridad

- **Rutas protegidas** con autenticación
- **Validación de formularios** en frontend
- **Sanitización de inputs**
- **Manejo seguro de tokens** (preparado para JWT)

## 🚀 Despliegue

### Build para Producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `build/`

### Despliegue en Netlify/Vercel

1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Configurar publish directory: `build`
4. Configurar variables de entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte, contactar a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

**Nota**: Este frontend está preparado para conectarse con un backend. Los servicios actualmente usan datos simulados para demostrar la funcionalidad completa.