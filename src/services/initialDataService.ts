import { createService, createProduct, servicePersistenceService, productPersistenceService } from './serviceService';

// Datos de servicios iniciales
const initialServices = [
  {
    name: 'Desarrollo de Sitio Web Corporativo',
    description: 'Creación de sitio web profesional para empresas con diseño responsive, SEO optimizado y panel de administración.',
    category: 'Desarrollo de software',
    type: 'service' as const,
    pricing: {
      minPrice: 800,
      maxPrice: 1500,
      currency: 'USD',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'Buenos Aires, Argentina',
    },
    features: [
      'Diseño responsive',
      'SEO optimizado',
      'Panel de administración',
      'Integración con redes sociales',
      'Certificado SSL',
      'Hosting incluido por 1 año'
    ],
    requirements: [
      'Logo de la empresa',
      'Contenido textual',
      'Imágenes de productos/servicios',
      'Información de contacto'
    ],
    deliveryTime: '4-6 semanas',
    images: [],
    tags: ['web', 'desarrollo', 'corporativo', 'responsive', 'seo'],
    status: 'active' as const,
  },
  {
    name: 'Marketing Digital Completo',
    description: 'Estrategia integral de marketing digital incluyendo redes sociales, Google Ads, SEO y análisis de métricas.',
    category: 'Marketing digital',
    type: 'service' as const,
    pricing: {
      minPrice: 600,
      maxPrice: 1200,
      currency: 'USD',
      unit: 'por mes',
    },
    availability: {
      isAvailable: true,
      location: 'Córdoba, Argentina',
    },
    features: [
      'Gestión de redes sociales',
      'Campañas de Google Ads',
      'SEO técnico y de contenido',
      'Análisis de métricas',
      'Reportes mensuales',
      'Consultoría estratégica'
    ],
    requirements: [
      'Acceso a redes sociales',
      'Presupuesto para publicidad',
      'Información de la empresa',
      'Objetivos de marketing'
    ],
    deliveryTime: '2-3 semanas',
    images: [],
    tags: ['marketing', 'digital', 'seo', 'ads', 'redes sociales'],
    status: 'active' as const,
  },
  {
    name: 'Consultoría en Recursos Humanos',
    description: 'Servicios de consultoría en RRHH incluyendo reclutamiento, capacitación, políticas laborales y desarrollo organizacional.',
    category: 'Recursos humanos',
    type: 'service' as const,
    pricing: {
      minPrice: 500,
      maxPrice: 1500,
      currency: 'USD',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'Rosario, Argentina',
    },
    features: [
      'Reclutamiento y selección',
      'Capacitación de personal',
      'Políticas laborales',
      'Desarrollo organizacional',
      'Evaluación de desempeño',
      'Consultoría legal laboral'
    ],
    requirements: [
      'Descripción de puestos',
      'Perfil de candidatos',
      'Políticas actuales',
      'Objetivos organizacionales'
    ],
    deliveryTime: '3-4 semanas',
    images: [],
    tags: ['rrhh', 'consultoría', 'reclutamiento', 'capacitación'],
    status: 'active' as const,
  },
  {
    name: 'Contabilidad y Fiscal',
    description: 'Servicios contables completos incluyendo contabilidad general, declaraciones fiscales y asesoría tributaria.',
    category: 'Contabilidad',
    type: 'service' as const,
    pricing: {
      minPrice: 300,
      maxPrice: 1200,
      currency: 'USD',
      unit: 'por mes',
    },
    availability: {
      isAvailable: true,
      location: 'Mendoza, Argentina',
    },
    features: [
      'Contabilidad general',
      'Declaraciones fiscales',
      'Asesoría tributaria',
      'Nóminas',
      'Reportes financieros',
      'Cumplimiento normativo'
    ],
    requirements: [
      'Documentos contables',
      'Comprobantes fiscales',
      'Información de empleados',
      'Registros bancarios'
    ],
    deliveryTime: '1-2 semanas',
    images: [],
    tags: ['contabilidad', 'fiscal', 'tributario', 'nóminas'],
    status: 'active' as const,
  },
  {
    name: 'Diseño Gráfico y Branding',
    description: 'Servicios de diseño gráfico profesional incluyendo identidad corporativa, material publicitario y diseño web.',
    category: 'Diseño',
    type: 'service' as const,
    pricing: {
      minPrice: 200,
      maxPrice: 800,
      currency: 'USD',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'La Plata, Argentina',
    },
    features: [
      'Identidad corporativa',
      'Diseño de logotipos',
      'Material publicitario',
      'Diseño web',
      'Ilustraciones',
      'Fotografía corporativa'
    ],
    requirements: [
      'Brief del proyecto',
      'Referencias visuales',
      'Información de la marca',
      'Especificaciones técnicas'
    ],
    deliveryTime: '2-3 semanas',
    images: [],
    tags: ['diseño', 'branding', 'gráfico', 'publicitario'],
    status: 'active' as const,
  }
];

// Datos de productos iniciales
const initialProducts = [
  {
    name: 'Software de Gestión Empresarial',
    description: 'Sistema integral de gestión empresarial que incluye inventario, ventas, contabilidad y reportes en tiempo real.',
    category: 'Software empresarial',
    type: 'product' as const,
    pricing: {
      price: 2500,
      currency: 'USD',
      unit: 'licencia única',
    },
    availability: {
      isAvailable: true,
      stock: 50,
      location: 'Buenos Aires, Argentina',
    },
    specifications: [
      'Compatibilidad: Windows, Mac, Linux',
      'Base de datos: MySQL, PostgreSQL',
      'Usuarios simultáneos: hasta 100',
      'Almacenamiento: 10GB incluido',
      'Soporte técnico: 1 año incluido',
      'Actualizaciones: gratuitas por 2 años'
    ],
    features: [
      'Gestión de inventario',
      'Módulo de ventas',
      'Contabilidad integrada',
      'Reportes en tiempo real',
      'Multi-usuario',
      'Backup automático'
    ],
    images: [],
    tags: ['software', 'gestión', 'empresarial', 'inventario', 'ventas'],
    status: 'active' as const,
  },
  {
    name: 'Kit de Herramientas Digitales',
    description: 'Paquete completo de herramientas digitales para pequeñas empresas incluyendo CRM, email marketing y análisis web.',
    category: 'Herramientas digitales',
    type: 'product' as const,
    pricing: {
      price: 1200,
      currency: 'USD',
      unit: 'paquete anual',
    },
    availability: {
      isAvailable: true,
      stock: 100,
      location: 'Córdoba, Argentina',
    },
    specifications: [
      'CRM para hasta 1000 contactos',
      'Email marketing: 10,000 envíos/mes',
      'Análisis web avanzado',
      'Soporte por chat 24/7',
      'Integración con redes sociales',
      'Backup en la nube'
    ],
    features: [
      'CRM integrado',
      'Email marketing',
      'Análisis web',
      'Automatización',
      'Integración social',
      'Reportes detallados'
    ],
    images: [],
    tags: ['herramientas', 'digitales', 'crm', 'email marketing'],
    status: 'active' as const,
  },
  {
    name: 'Curso de Capacitación Empresarial',
    description: 'Programa completo de capacitación para equipos de trabajo incluyendo liderazgo, comunicación y productividad.',
    category: 'Capacitación',
    type: 'product' as const,
    pricing: {
      price: 800,
      currency: 'USD',
      unit: 'por participante',
    },
    availability: {
      isAvailable: true,
      stock: 200,
      location: 'Rosario, Argentina',
    },
    specifications: [
      'Duración: 40 horas',
      'Modalidad: presencial y virtual',
      'Material incluido',
      'Certificación oficial',
      'Seguimiento post-curso',
      'Acceso a plataforma online'
    ],
    features: [
      'Módulos de liderazgo',
      'Comunicación efectiva',
      'Gestión del tiempo',
      'Trabajo en equipo',
      'Resolución de conflictos',
      'Desarrollo personal'
    ],
    images: [],
    tags: ['capacitación', 'liderazgo', 'comunicación', 'productividad'],
    status: 'active' as const,
  }
];

/**
 * Inicializa los datos de servicios y productos de ejemplo
 */
export const initializeInitialData = async (): Promise<void> => {
  try {
    // Siempre limpiar y recrear para asegurar que tenemos los datos correctos
    await clearAllServicesAndProducts();

    // Crear servicios
    for (let i = 0; i < initialServices.length; i++) {
      const serviceData = initialServices[i];
      try {
        await createService('system_provider', serviceData);
      } catch (error) {
        // Error silencioso
      }
    }

    // Crear productos
    for (let i = 0; i < initialProducts.length; i++) {
      const productData = initialProducts[i];
      try {
        await createProduct('system_provider', productData);
      } catch (error) {
        // Error silencioso
      }
    }

  } catch (error) {
    // Error silencioso
  }
};

/**
 * Limpia todos los datos de servicios y productos
 */
export const clearAllServicesAndProducts = async (): Promise<void> => {
  try {
    const allServices = servicePersistenceService.getAllServices();
    const allProducts = productPersistenceService.getAllProducts();

    // Limpiar servicios
    for (const service of allServices) {
      servicePersistenceService.deleteService(service.id);
    }

    // Limpiar productos
    for (const product of allProducts) {
      productPersistenceService.deleteProduct(product.id);
    }

  } catch (error) {
    // Error silencioso
  }
};

/**
 * Reinicializa los datos (limpia y crea nuevos)
 */
export const reinitializeData = async (): Promise<void> => {
  await clearAllServicesAndProducts();
  await initializeInitialData();
};

/**
 * Función de debug para verificar el estado de los datos
 */
export const debugDataStatus = (): void => {
  // Función de debug silenciosa
};
