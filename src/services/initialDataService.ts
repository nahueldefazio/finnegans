import { createService, createProduct, servicePersistenceService, productPersistenceService } from './serviceService';

// Datos de servicios iniciales
const initialServices = [
  {
    name: 'Desarrollo de Sitio Web Corporativo',
    description: 'Creación de sitio web profesional para empresas con diseño responsive, SEO optimizado y panel de administración.',
    category: 'Desarrollo de software',
    type: 'service' as const,
    pricing: {
      minPrice: 8000,
      maxPrice: 15000,
      currency: 'MXN',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'Ciudad de México, México',
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
      minPrice: 6000,
      maxPrice: 12000,
      currency: 'MXN',
      unit: 'por mes',
    },
    availability: {
      isAvailable: true,
      location: 'Guadalajara, Jalisco, México',
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
      minPrice: 5000,
      maxPrice: 15000,
      currency: 'MXN',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'Monterrey, Nuevo León, México',
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
      minPrice: 3000,
      maxPrice: 12000,
      currency: 'MXN',
      unit: 'por mes',
    },
    availability: {
      isAvailable: true,
      location: 'Puebla, Puebla, México',
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
      minPrice: 2000,
      maxPrice: 8000,
      currency: 'MXN',
      unit: 'por proyecto',
    },
    availability: {
      isAvailable: true,
      location: 'Tijuana, Baja California, México',
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
      price: 25000,
      currency: 'MXN',
      unit: 'licencia única',
    },
    availability: {
      isAvailable: true,
      stock: 50,
      location: 'Ciudad de México, México',
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
      price: 12000,
      currency: 'MXN',
      unit: 'paquete anual',
    },
    availability: {
      isAvailable: true,
      stock: 100,
      location: 'Guadalajara, Jalisco, México',
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
      price: 8000,
      currency: 'MXN',
      unit: 'por participante',
    },
    availability: {
      isAvailable: true,
      stock: 200,
      location: 'Monterrey, Nuevo León, México',
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
    console.log('🚀 Inicializando datos de servicios y productos...');

    // Verificar si ya existen datos
    const existingServices = servicePersistenceService.getAllServices();
    const existingProducts = productPersistenceService.getAllProducts();

    console.log(`📊 Servicios existentes: ${existingServices.length}`);
    console.log(`📊 Productos existentes: ${existingProducts.length}`);

    // Siempre limpiar y recrear para asegurar que tenemos los datos correctos
    console.log('🧹 Limpiando datos existentes para crear servicios iniciales correctos...');
    await clearAllServicesAndProducts();
    console.log('✅ Datos limpiados, procediendo con inicialización...');

    // Crear servicios
    console.log('📝 Creando servicios iniciales...');
    console.log(`📋 Total de servicios a crear: ${initialServices.length}`);
    
    for (let i = 0; i < initialServices.length; i++) {
      const serviceData = initialServices[i];
      try {
        console.log(`🔄 Creando servicio ${i + 1}/${initialServices.length}: ${serviceData.name}`);
        const createdService = await createService('system_provider', serviceData);
        console.log(`✅ Servicio creado exitosamente: ${createdService.name} (ID: ${createdService.id})`);
      } catch (error) {
        console.error(`❌ Error creando servicio ${serviceData.name}:`, error);
      }
    }

    // Crear productos
    console.log('📦 Creando productos iniciales...');
    console.log(`📋 Total de productos a crear: ${initialProducts.length}`);
    
    for (let i = 0; i < initialProducts.length; i++) {
      const productData = initialProducts[i];
      try {
        console.log(`🔄 Creando producto ${i + 1}/${initialProducts.length}: ${productData.name}`);
        const createdProduct = await createProduct('system_provider', productData);
        console.log(`✅ Producto creado exitosamente: ${createdProduct.name} (ID: ${createdProduct.id})`);
      } catch (error) {
        console.error(`❌ Error creando producto ${productData.name}:`, error);
      }
    }

    console.log('🎉 Datos iniciales creados exitosamente!');
    console.log(`📊 Total servicios: ${initialServices.length}`);
    console.log(`📊 Total productos: ${initialProducts.length}`);

  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
  }
};

/**
 * Limpia todos los datos de servicios y productos
 */
export const clearAllServicesAndProducts = async (): Promise<void> => {
  try {
    console.log('🧹 Limpiando todos los servicios y productos...');

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

    console.log(`✅ Limpiados ${allServices.length} servicios y ${allProducts.length} productos`);

  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
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
  const services = servicePersistenceService.getAllServices();
  const products = productPersistenceService.getAllProducts();
  
  console.log('🔍 DEBUG - Estado de los datos:');
  console.log(`Servicios: ${services.length}`);
  services.forEach((service, index) => {
    console.log(`  ${index + 1}. ${service.name} (${service.category}) - Status: ${service.status}`);
  });
  
  console.log(`Productos: ${products.length}`);
  products.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.name} (${product.category}) - Status: ${product.status}`);
  });
};
