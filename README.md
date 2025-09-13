# 🚀 PyME Connect - Plataforma de Conexión Empresarial

Una plataforma web moderna que conecta PyMEs (Pequeñas y Medianas Empresas) con proveedores de servicios especializados, facilitando el matching inteligente, comunicación directa y gestión de proyectos.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso de la Aplicación](#-uso-de-la-aplicación)
- [Funcionalidades](#-funcionalidades)
- [API y Servicios](#-api-y-servicios)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características Principales

### 🎯 Matching Inteligente
- **Algoritmo de matching** que conecta PyMEs con proveedores basado en necesidades específicas
- **269 tipos de servicios** organizados en 15 categorías
- **Filtros avanzados** por ubicación, presupuesto y tipo de servicio
- **Sistema de puntuación** para matches más precisos

### 💬 Sistema de Chat
- **Chat en tiempo real** entre PyMEs y proveedores
- **Scroll optimizado** para conversaciones largas
- **Envío de cotizaciones** integrado en el chat
- **Sistema de calificaciones** y reseñas

### 📊 Dashboard y Analytics
- **Métricas en tiempo real** para PyMEs y proveedores
- **Gráficos interactivos** de actividad y ingresos
- **Estadísticas de matches** y conversiones
- **Panel de administración** con herramientas de diagnóstico

### 👤 Gestión de Perfiles
- **Perfiles detallados** para PyMEs y proveedores
- **Edición de perfiles** con validación en tiempo real
- **Sistema de tipos de servicios** personalizable
- **Información de contacto** y ubicación

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Framework principal
- **TypeScript 4.9.5** - Tipado estático
- **Material-UI 5.18.0** - Componentes de interfaz
- **React Router 7.9.1** - Navegación
- **React Hook Form 7.62.0** - Manejo de formularios
- **Recharts 3.2.0** - Gráficos y visualizaciones
- **Axios 1.12.1** - Cliente HTTP

### Herramientas de Desarrollo
- **Create React App** - Configuración base
- **ESLint** - Linting de código
- **TypeScript** - Compilación y verificación de tipos
- **Webpack** - Bundling y optimización

## 📁 Estructura del Proyecto

```
proyecto_finnegans/
├── frontend/                    # Aplicación React
│   ├── public/                 # Archivos públicos
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── admin/         # Panel de administración
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── business/      # Gestión de negocios
│   │   │   ├── chat/          # Sistema de chat
│   │   │   ├── common/        # Componentes comunes
│   │   │   ├── dashboard/     # Dashboard y métricas
│   │   │   ├── layout/        # Layout y navegación
│   │   │   ├── matching/      # Sistema de matching
│   │   │   └── profile/       # Gestión de perfiles
│   │   ├── constants/         # Constantes de la aplicación
│   │   ├── contexts/          # Contextos de React
│   │   ├── hooks/             # Hooks personalizados
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Servicios y API
│   │   ├── types/             # Definiciones de tipos
│   │   └── utils/             # Utilidades
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd proyecto_finnegans
   ```

2. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

3. **Inicializar datos de ejemplo**
   ```bash
   # Los datos se inicializan automáticamente al cargar la aplicación
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia el servidor de desarrollo

# Producción
npm run build      # Construye la aplicación para producción
npm run test       # Ejecuta las pruebas
npm run eject      # Expone la configuración de webpack
```

## 🎮 Uso de la Aplicación

### Para PyMEs

1. **Registro y Perfil**
   - Crear cuenta como PyME
   - Completar perfil con información de la empresa
   - Especificar tipos de servicios necesarios

2. **Búsqueda de Proveedores**
   - Usar la página de búsqueda con filtros
   - Revisar matches sugeridos
   - Ver detalles de proveedores

3. **Comunicación**
   - Iniciar chat con proveedores
   - Recibir y evaluar cotizaciones
   - Gestionar proyectos activos

### Para Proveedores

1. **Registro y Perfil**
   - Crear cuenta como proveedor
   - Completar perfil con servicios ofrecidos
   - Establecer precios y capacidades

2. **Gestión de Matches**
   - Recibir notificaciones de matches
   - Revisar perfiles de PyMEs
   - Enviar cotizaciones

3. **Comunicación y Proyectos**
   - Chat directo con PyMEs
   - Envío de cotizaciones
   - Seguimiento de proyectos

## 🔧 Funcionalidades

### Sistema de Matching
- **Algoritmo inteligente** que considera:
  - Tipos de servicios requeridos vs ofrecidos
  - Ubicación geográfica
  - Presupuesto disponible
  - Experiencia y calificaciones

### Chat y Comunicación
- **Chat en tiempo real** con scroll optimizado
- **Envío de cotizaciones** integrado
- **Sistema de notificaciones**
- **Historial de conversaciones**

### Gestión de Proyectos
- **Estados de proyecto**: pending, in_progress, completed
- **Seguimiento de fechas** y entregables
- **Sistema de calificaciones** bidireccional
- **Reseñas y feedback**

### Dashboard y Analytics
- **Métricas de rendimiento** para PyMEs y proveedores
- **Gráficos de actividad** y tendencias
- **Estadísticas de matches** y conversiones
- **Panel de administración** con herramientas de diagnóstico

## 🔌 API y Servicios

### Servicios Principales

#### `dataPersistenceService`
- Gestión de datos local con localStorage
- Simulación de backend completo
- CRUD operations para todas las entidades

#### `matchingService`
- Algoritmo de matching inteligente
- Filtrado y búsqueda de proveedores
- Cálculo de puntuaciones de compatibilidad

#### `chatService`
- Gestión de conversaciones
- Envío y recepción de mensajes
- Manejo de cotizaciones

#### `businessService`
- Gestión de proyectos y negocios
- Actualización de estados
- Sistema de reseñas

### Tipos de Datos

```typescript
// Usuario
interface User {
  id: string;
  email: string;
  name: string;
  type: 'pyme' | 'proveedor';
  createdAt: string;
  updatedAt: string;
}

// Perfil PyME
interface PyMEProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  size: 'micro' | 'pequeña' | 'mediana';
  location: string;
  needs: string[];
  serviceTypes: string[];
  budget: { min: number; max: number };
  description: string;
  contactInfo: { phone: string; address: string };
}

// Perfil Proveedor
interface ProveedorProfile {
  id: string;
  userId: string;
  companyName: string;
  location: string;
  services: string[];
  capabilities: string[];
  rating: number;
  totalReviews: number;
  pricing: Array<{ service: string; minPrice: number; maxPrice: number; unit: string }>;
  description: string;
  contactInfo: { phone: string; address: string };
}
```

## 🎨 Componentes Principales

### Layout y Navegación
- **Navbar**: Navegación principal con menú responsive
- **Layout**: Contenedor principal con estructura consistente
- **ProtectedRoute**: Protección de rutas autenticadas

### Chat y Comunicación
- **ChatInterface**: Interfaz principal de chat con scroll optimizado
- **ChatList**: Lista de conversaciones con scroll personalizado
- **ChatMessage**: Componente de mensaje individual
- **CustomScrollbar**: Scrollbar personalizado con estilos del tema

### Matching y Búsqueda
- **SearchPage**: Página de búsqueda con filtros avanzados
- **MatchCard**: Tarjeta de match con información del proveedor
- **ProviderInfoDialog**: Modal con detalles del proveedor

### Perfiles y Gestión
- **ProfilePage**: Visualización del perfil del usuario
- **EditProfilePage**: Edición de perfil con validación
- **PyMEProfileForm**: Formulario específico para PyMEs
- **ProveedorProfileForm**: Formulario específico para proveedores

## 📊 Datos de Ejemplo

La aplicación incluye datos de ejemplo para demostración:

- **12 usuarios** (2 PyMEs + 10 proveedores)
- **10 negocios** en diferentes estados
- **15 reseñas** bidireccionales
- **269 tipos de servicios** organizados en categorías
- **Perfiles completos** con información realista

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# .env (opcional)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

### Personalización de Temas
```typescript
// src/theme.ts
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Servir la Aplicación
```bash
# Usando serve
npm install -g serve
serve -s build

# Usando nginx
# Copiar contenido de build/ a /var/www/html
```

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm test -- --coverage
```

## 📈 Rendimiento

### Optimizaciones Implementadas
- **Lazy loading** de componentes
- **Memoización** de componentes pesados
- **Scroll optimizado** con virtualización
- **Bundle splitting** automático
- **Compresión** de assets

### Métricas
- **Tiempo de carga inicial**: < 3 segundos
- **Tamaño del bundle**: ~307KB (gzipped)
- **Lighthouse Score**: 90+ en todas las categorías

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Estándares de Código

- **TypeScript** para tipado estático
- **ESLint** para linting
- **Prettier** para formateo (recomendado)
- **Conventional Commits** para mensajes de commit

### Estructura de Commits
```
feat: agregar nueva funcionalidad
fix: corregir bug en matching
docs: actualizar documentación
style: mejorar estilos del chat
refactor: optimizar algoritmo de matching
test: agregar pruebas para chat
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### Error de Compilación
```bash
# Limpiar cache
npm start -- --reset-cache
```

#### Problemas de Dependencias
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Problemas de Datos
```bash
# Limpiar localStorage
# Abrir DevTools > Application > Storage > Clear All
```

### Logs y Debugging
- **Console logs** en desarrollo
- **React DevTools** para debugging de componentes
- **Redux DevTools** (si se implementa Redux)

## 📞 Soporte

### Contacto
- **Email**: soporte@pymeconnect.com
- **Issues**: [GitHub Issues](https://github.com/usuario/repo/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/usuario/repo/wiki)

### FAQ

**P: ¿Cómo reiniciar los datos de ejemplo?**
R: Limpia el localStorage del navegador o usa el panel de administración.

**P: ¿Cómo agregar nuevos tipos de servicios?**
R: Edita el archivo `src/constants/serviceTypes.ts` y agrega los nuevos servicios.

**P: ¿Cómo personalizar el algoritmo de matching?**
R: Modifica la función `calculateMatchScore` en `src/services/matchingService.ts`.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Material-UI** por los componentes de interfaz
- **React** por el framework principal
- **TypeScript** por el tipado estático
- **Comunidad open source** por las herramientas y librerías

---

**Desarrollado con ❤️ para conectar PyMEs con proveedores de servicios especializados.**