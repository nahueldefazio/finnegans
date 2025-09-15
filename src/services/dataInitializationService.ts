// Servicio de inicialización de datos de ejemplo
// Pobla la aplicación con datos iniciales para demostración

import { dataPersistenceService } from './dataPersistenceService';
import { initializeInitialData, debugDataStatus } from './initialDataService';
import { servicePersistenceService, productPersistenceService } from './serviceService';
import { 
  Chat, 
  ChatMessage, 
  PyMEProfile, 
  User
} from '../types/index';

// Datos de ejemplo para usuarios
const sampleUsers: User[] = [
  {
    id: '1',
    email: 'pyme@empresa.com',
    name: 'María González',
    type: 'pyme',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: '2',
    email: 'pyme2@empresa.com',
    name: 'Carlos Rodríguez',
    type: 'pyme',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'prov1',
    email: 'proveedor@tech.com',
    name: 'Tech Solutions',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prov2',
    email: 'proveedor2@design.com',
    name: 'Creative Design Studio',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prov3',
    email: 'marketing@digitalpro.com',
    name: 'Digital Marketing Pro',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prov4',
    email: 'contadores@asociados.com',
    name: 'Contadores Asociados',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prov5',
    email: 'hr@solutions.com',
    name: 'HR Solutions',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'prov6',
    email: 'legal@partners.com',
    name: 'Legal Partners',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prov7',
    email: 'logistica@logitech.com',
    name: 'LogiTech Solutions',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prov8',
    email: 'webdev@masters.com',
    name: 'WebDev Masters',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prov9',
    email: 'eventos@premium.com',
    name: 'Eventos Premium',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prov10',
    email: 'cleantech@services.com',
    name: 'CleanTech Services',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prov11',
    email: 'foto@profesional.com',
    name: 'Fotografía Profesional',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prov12',
    email: 'consultoria@estrategica.com',
    name: 'Consultoría Estratégica',
    type: 'proveedor',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// Datos de ejemplo para perfiles PyME
const samplePyMEProfiles: PyMEProfile[] = [
  {
    id: 'pyme_profile_1',
    userId: '1',
    companyName: 'Distribuidora González',
    industry: 'retail',
    size: 'mediana',
    location: 'Buenos Aires',
    description: 'Distribuidora de productos electrónicos con más de 10 años de experiencia en el mercado.',
    needs: ['Desarrollo de software', 'Marketing digital', 'Consultoría financiera'],
    serviceTypes: ['Desarrollo de software', 'Marketing digital', 'Consultoría'],
    budget: { min: 500, max: 1000 },
    contactInfo: {
      phone: '+54 11 1234 5678',
      address: 'Av. Corrientes 123, Buenos Aires',
    },
  },
  {
    id: 'pyme_profile_2',
    userId: '2',
    companyName: 'Restaurante El Buen Sabor',
    industry: 'servicios',
    size: 'pequeña',
    location: 'Córdoba',
    description: 'Restaurante familiar especializado en comida tradicional argentina.',
    needs: ['Diseño gráfico', 'Marketing digital', 'Sistema de reservas'],
    serviceTypes: ['Diseño gráfico', 'Marketing digital', 'Desarrollo de software'],
    budget: { min: 200, max: 500 },
    contactInfo: {
      phone: '+54 351 9876 5432',
      address: 'Av. Colón 456, Córdoba',
    },
  },
];

// Datos de ejemplo para perfiles Proveedor (no utilizados)
/*
const sampleProveedorProfiles: ProveedorProfile[] = [
  {
    id: 'prov_profile_1',
    userId: 'prov1',
    companyName: 'Tech Solutions',
    location: 'Buenos Aires',
    services: ['Desarrollo de software', 'Consultoría IT', 'Soporte técnico'],
    capabilities: ['Trabajo remoto', '24/7 disponible', 'Certificaciones'],
    rating: 4.8,
    totalReviews: 25,
    pricing: [
      { service: 'Desarrollo de software', minPrice: 50, maxPrice: 100, unit: 'por hora' },
      { service: 'Consultoría IT', minPrice: 80, maxPrice: 150, unit: 'por hora' },
    ],
    description: 'Empresa especializada en desarrollo de software y soluciones tecnológicas para PyMEs.',
    contactInfo: {
      phone: '+54 11 1111 2222',
      address: 'Av. Corrientes 123, Buenos Aires',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_2',
    userId: 'prov2',
    companyName: 'Creative Design Studio',
    location: 'Córdoba',
    services: ['Diseño gráfico', 'Branding', 'Marketing digital'],
    capabilities: ['Trabajo remoto', 'Experiencia internacional', 'Soporte técnico'],
    rating: 4.6,
    totalReviews: 18,
    pricing: [
      { service: 'Diseño gráfico', minPrice: 30, maxPrice: 60, unit: 'por hora' },
      { service: 'Branding', minPrice: 40, maxPrice: 80, unit: 'por hora' },
    ],
    description: 'Estudio creativo especializado en diseño gráfico y branding para empresas.',
    contactInfo: {
      phone: '+54 351 3333 4444',
      address: 'Av. Colón 456, Córdoba',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_3',
    userId: 'prov3',
    companyName: 'Digital Marketing Pro',
    location: 'Rosario',
    services: ['Marketing digital', 'SEO', 'SEM', 'Redes sociales', 'Content Marketing'],
    capabilities: ['Certificaciones Google', 'Analytics avanzado', 'ROI garantizado'],
    rating: 4.7,
    totalReviews: 32,
    pricing: [
      { service: 'SEO', minPrice: 500, maxPrice: 2000, unit: 'por mes' },
      { service: 'Marketing digital', minPrice: 1000, maxPrice: 5000, unit: 'por mes' },
    ],
    description: 'Agencia de marketing digital especializada en crecimiento de PyMEs.',
    contactInfo: {
      phone: '+54 341 5555 6666',
      address: 'Av. Pellegrini 789, Rosario',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_4',
    userId: 'prov4',
    companyName: 'Contadores Asociados',
    location: 'Ciudad de México',
    services: ['Contabilidad', 'Asesoría fiscal', 'Auditoría financiera', 'Nóminas'],
    capabilities: ['CPA certificados', 'SAT actualizado', 'Software especializado'],
    rating: 4.9,
    totalReviews: 45,
    pricing: [
      { service: 'Contabilidad', minPrice: 2000, maxPrice: 8000, unit: 'por mes' },
      { service: 'Asesoría fiscal', minPrice: 100, maxPrice: 300, unit: 'por hora' },
    ],
    description: 'Despacho contable con más de 15 años de experiencia en PyMEs.',
    contactInfo: {
      phone: '+54 11 7777 8888',
      address: 'Av. Santa Fe 321, Buenos Aires',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_5',
    userId: 'prov5',
    companyName: 'HR Solutions',
    location: 'Mendoza',
    services: ['Recursos humanos', 'Reclutamiento', 'Capacitación', 'Coaching ejecutivo'],
    capabilities: ['Psicólogos organizacionales', 'Assessment tools', 'Desarrollo de talento'],
    rating: 4.5,
    totalReviews: 28,
    pricing: [
      { service: 'Reclutamiento', minPrice: 3000, maxPrice: 10000, unit: 'por posición' },
      { service: 'Capacitación', minPrice: 200, maxPrice: 500, unit: 'por hora' },
    ],
    description: 'Consultoría especializada en recursos humanos y desarrollo organizacional.',
    contactInfo: {
      phone: '+54 261 9999 0000',
      address: 'Av. San Martín 654, Mendoza',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_6',
    userId: 'prov6',
    companyName: 'Legal Partners',
    location: 'La Plata',
    services: ['Legal', 'Derecho corporativo', 'Derecho laboral', 'Propiedad intelectual'],
    capabilities: ['Abogados certificados', 'Especialización corporativa', 'Consultas 24/7'],
    rating: 4.8,
    totalReviews: 22,
    pricing: [
      { service: 'Consultoría legal', minPrice: 150, maxPrice: 400, unit: 'por hora' },
      { service: 'Derecho corporativo', minPrice: 5000, maxPrice: 15000, unit: 'por proyecto' },
    ],
    description: 'Bufete jurídico especializado en derecho empresarial y corporativo.',
    contactInfo: {
      phone: '+54 221 1111 2222',
      address: 'Av. 7 987, La Plata',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_7',
    userId: 'prov7',
    companyName: 'LogiTech Solutions',
    location: 'Querétaro',
    services: ['Logística', 'Cadena de suministro', 'Almacenamiento', 'Distribución'],
    capabilities: ['Warehouse management', 'Transporte especializado', 'Tecnología RFID'],
    rating: 4.6,
    totalReviews: 19,
    pricing: [
      { service: 'Logística', minPrice: 1000, maxPrice: 5000, unit: 'por mes' },
      { service: 'Almacenamiento', minPrice: 50, maxPrice: 150, unit: 'por m²/mes' },
    ],
    description: 'Empresa de logística integral con tecnología de punta para PyMEs.',
    contactInfo: {
      phone: '+52 442 3333 4444',
      address: 'Blvd. Bernardo Quintana 147, Querétaro',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_8',
    userId: 'prov8',
    companyName: 'WebDev Masters',
    location: 'Mérida',
    services: ['Desarrollo web', 'E-commerce', 'UX/UI Design', 'SEO'],
    capabilities: ['React/Node.js', 'E-commerce platforms', 'Mobile responsive'],
    rating: 4.7,
    totalReviews: 35,
    pricing: [
      { service: 'Desarrollo web', minPrice: 8000, maxPrice: 25000, unit: 'por proyecto' },
      { service: 'E-commerce', minPrice: 15000, maxPrice: 40000, unit: 'por proyecto' },
    ],
    description: 'Desarrolladores web especializados en sitios modernos y e-commerce.',
    contactInfo: {
      phone: '+52 999 5555 6666',
      address: 'Calle 60 #456, Mérida',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_9',
    userId: 'prov9',
    companyName: 'Eventos Premium',
    location: 'Cancún',
    services: ['Eventos', 'Catering', 'Decoración', 'Sonido e iluminación'],
    capabilities: ['Eventos corporativos', 'Wedding planning', 'Tecnología audiovisual'],
    rating: 4.9,
    totalReviews: 41,
    pricing: [
      { service: 'Eventos corporativos', minPrice: 5000, maxPrice: 20000, unit: 'por evento' },
      { service: 'Catering', minPrice: 150, maxPrice: 300, unit: 'por persona' },
    ],
    description: 'Empresa de eventos premium con experiencia en turismo y corporativo.',
    contactInfo: {
      phone: '+52 998 7777 8888',
      address: 'Av. Tulum 258, Cancún',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_10',
    userId: 'prov10',
    companyName: 'CleanTech Services',
    location: 'León',
    services: ['Limpieza', 'Mantenimiento', 'Jardinería', 'Seguridad'],
    capabilities: ['Limpieza industrial', 'Mantenimiento preventivo', 'Seguridad 24/7'],
    rating: 4.4,
    totalReviews: 26,
    pricing: [
      { service: 'Limpieza', minPrice: 2000, maxPrice: 8000, unit: 'por mes' },
      { service: 'Mantenimiento', minPrice: 100, maxPrice: 250, unit: 'por hora' },
    ],
    description: 'Servicios integrales de limpieza, mantenimiento y seguridad para empresas.',
    contactInfo: {
      phone: '+52 477 9999 0000',
      address: 'Blvd. López Mateos 369, León',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_11',
    userId: 'prov11',
    companyName: 'Fotografía Profesional',
    location: 'Córdoba',
    services: ['Fotografía', 'Video producción', 'Fotografía de eventos', 'Branding visual'],
    capabilities: ['Equipo profesional', 'Post-producción', 'Drones', 'Estudio propio'],
    rating: 4.8,
    totalReviews: 33,
    pricing: [
      { service: 'Fotografía de eventos', minPrice: 3000, maxPrice: 12000, unit: 'por evento' },
      { service: 'Video producción', minPrice: 5000, maxPrice: 20000, unit: 'por proyecto' },
    ],
    description: 'Estudio de fotografía y video profesional para empresas y eventos.',
    contactInfo: {
      phone: '+52 33 4444 5555',
      address: 'Av. Chapultepec 741, Guadalajara',
    },
    offeredServices: [],
    offeredProducts: [],
  },
  {
    id: 'prov_profile_12',
    userId: 'prov12',
    companyName: 'Consultoría Estratégica',
    location: 'Ciudad de México',
    services: ['Consultoría estratégica', 'Plan de negocios', 'Análisis de mercado', 'Mentoring empresarial'],
    capabilities: ['MBA certificados', 'Experiencia internacional', 'Metodologías probadas'],
    rating: 4.9,
    totalReviews: 38,
    pricing: [
      { service: 'Consultoría estratégica', minPrice: 200, maxPrice: 500, unit: 'por hora' },
      { service: 'Plan de negocios', minPrice: 15000, maxPrice: 35000, unit: 'por proyecto' },
    ],
    description: 'Consultoría estratégica especializada en crecimiento y expansión de PyMEs.',
    contactInfo: {
      phone: '+52 55 6666 7777',
      address: 'Polanco, Ciudad de México',
    },
    offeredServices: [],
    offeredProducts: [],
  },
];

// Datos de ejemplo para matches (no utilizados)
/*
const sampleMatches: Match[] = [
  {
    id: 'match_1_1',
    pymeId: '1',
    proveedorId: 'prov1',
    score: 85,
    reasons: ['Ofrece desarrollo de software', 'Excelente calificación (4.8/5)', 'Precios dentro del presupuesto'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'match_2_2',
    pymeId: '2',
    proveedorId: 'prov2',
    score: 78,
    reasons: ['Ofrece diseño gráfico', 'Buena calificación (4.6/5)', 'Ubicado en la misma ciudad'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
];
*/

// Datos de ejemplo para chats
const sampleChats: Chat[] = [
  {
    id: 'chat1',
    pymeId: '1',
    proveedorId: 'prov1',
    matchId: 'match_1_1',
    lastMessage: {
      id: 'msg1',
      chatId: 'chat1',
      senderId: '1',
      content: 'Hola, me interesa tu servicio de desarrollo de software',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'chat2',
    pymeId: '2',
    proveedorId: 'prov2',
    matchId: 'match_2_2',
    lastMessage: {
      id: 'msg5',
      chatId: 'chat2',
      senderId: 'prov2',
      content: 'Perfecto, aquí tienes la propuesta de diseño',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

// Datos de ejemplo para mensajes
const sampleMessages: ChatMessage[] = [
  {
    id: 'msg1',
    chatId: 'chat1',
    senderId: '1',
    content: 'Hola, me interesa tu servicio de desarrollo de software',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'msg2',
    chatId: 'chat1',
    senderId: 'prov1',
    content: '¡Hola! Me da mucho gusto que te interese. ¿Podrías contarme más sobre tu proyecto?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
  },
  {
    id: 'msg3',
    chatId: 'chat1',
    senderId: '1',
    content: 'Necesito desarrollar una aplicación web para mi empresa. Es un sistema de gestión de inventario.',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'msg4',
    chatId: 'chat1',
    senderId: 'prov1',
    content: 'Perfecto, aquí tienes una cotización para tu proyecto:',
    type: 'quotation',
    quotation: {
      id: 'quote1',
      service: 'Desarrollo de aplicación web',
      description: 'Sistema de gestión de inventario con panel de administración, reportes y API REST',
      price: 5000,
      currency: 'USD',
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      terms: 'Pago 50% al inicio, 50% al finalizar. Tiempo estimado: 4-6 semanas',
      status: 'pending',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'msg5',
    chatId: 'chat2',
    senderId: '2',
    content: 'Hola, necesito diseño para mi restaurante',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
  },
  {
    id: 'msg6',
    chatId: 'chat2',
    senderId: 'prov2',
    content: '¡Hola! Me encantaría ayudarte con el diseño. ¿Qué tipo de elementos necesitas?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'msg7',
    chatId: 'chat2',
    senderId: 'prov2',
    content: 'Perfecto, aquí tienes la propuesta de diseño',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

// Datos de ejemplo para negocios (no utilizados)
/*
const sampleBusinesses: Business[] = [
  {
    id: 'business1',
    chatId: 'chat1',
    pymeId: '1',
    proveedorId: 'prov1',
    quotationId: 'quote1',
    status: 'completed',
    totalAmount: 5000,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'business2',
    chatId: 'chat2',
    pymeId: '2',
    proveedorId: 'prov2',
    quotationId: 'quote2',
    status: 'in_progress',
    totalAmount: 3000,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'business3',
    chatId: 'chat3',
    pymeId: '1',
    proveedorId: 'prov3',
    quotationId: 'quote3',
    status: 'pending',
    totalAmount: 2500,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'business4',
    chatId: 'chat4',
    pymeId: '2',
    proveedorId: 'prov4',
    quotationId: 'quote4',
    status: 'completed',
    totalAmount: 1800,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: 'business5',
    chatId: 'chat5',
    pymeId: '1',
    proveedorId: 'prov5',
    quotationId: 'quote5',
    status: 'in_progress',
    totalAmount: 4200,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'business6',
    chatId: 'chat6',
    pymeId: '2',
    proveedorId: 'prov6',
    quotationId: 'quote6',
    status: 'pending',
    totalAmount: 1500,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'business7',
    chatId: 'chat7',
    pymeId: '1',
    proveedorId: 'prov7',
    quotationId: 'quote7',
    status: 'completed',
    totalAmount: 3200,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: 'business8',
    chatId: 'chat8',
    pymeId: '2',
    proveedorId: 'prov8',
    quotationId: 'quote8',
    status: 'in_progress',
    totalAmount: 2800,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'business9',
    chatId: 'chat9',
    pymeId: '1',
    proveedorId: 'prov9',
    quotationId: 'quote9',
    status: 'pending',
    totalAmount: 4500,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'business10',
    chatId: 'chat10',
    pymeId: '2',
    proveedorId: 'prov10',
    quotationId: 'quote10',
    status: 'completed',
    totalAmount: 2100,
    currency: 'USD',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
];
*/

// Datos de ejemplo para reseñas (no utilizados)
/*
const sampleReviews: Review[] = [
  {
    id: 'review1',
    fromUserId: '1',
    toUserId: 'prov1',
    rating: 5,
    comment: 'Excelente trabajo, muy profesional y cumplió con todos los plazos. Lo recomiendo ampliamente.',
    businessId: 'business1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'review2',
    fromUserId: '2',
    toUserId: 'prov2',
    rating: 4,
    comment: 'Buen servicio, aunque hubo algunos retrasos menores. El resultado final fue satisfactorio.',
    businessId: 'business2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'review3',
    fromUserId: '1',
    toUserId: 'prov3',
    rating: 5,
    comment: 'Servicio excepcional, muy detallado y profesional. Superó mis expectativas completamente.',
    businessId: 'business3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'review4',
    fromUserId: '2',
    toUserId: 'prov4',
    rating: 4,
    comment: 'Trabajo de calidad, comunicación clara y entrega puntual. Muy recomendable.',
    businessId: 'business4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'review5',
    fromUserId: '1',
    toUserId: 'prov5',
    rating: 3,
    comment: 'Servicio aceptable, pero hubo algunos malentendidos en el proceso. El resultado final fue bueno.',
    businessId: 'business5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'review6',
    fromUserId: '2',
    toUserId: 'prov6',
    rating: 5,
    comment: 'Increíble atención al detalle y profesionalismo. Definitivamente trabajaré con ellos nuevamente.',
    businessId: 'business6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'review7',
    fromUserId: '1',
    toUserId: 'prov7',
    rating: 4,
    comment: 'Buen servicio, cumplió con los plazos y el presupuesto acordado. Recomendado.',
    businessId: 'business7',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'review8',
    fromUserId: '2',
    toUserId: 'prov8',
    rating: 5,
    comment: 'Excelente comunicación y resultados. Muy satisfecho con el trabajo realizado.',
    businessId: 'business8',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'review9',
    fromUserId: '1',
    toUserId: 'prov9',
    rating: 4,
    comment: 'Servicio profesional, aunque el proceso tomó un poco más de tiempo del esperado.',
    businessId: 'business9',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'review10',
    fromUserId: '2',
    toUserId: 'prov10',
    rating: 5,
    comment: 'Trabajo excepcional, muy detallado y creativo. Superó todas mis expectativas.',
    businessId: 'business10',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  // Reseñas recibidas por los proveedores
  {
    id: 'review11',
    fromUserId: 'prov1',
    toUserId: '1',
    rating: 5,
    comment: 'Cliente excelente, muy claro en sus requerimientos y puntual en los pagos.',
    businessId: 'business1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'review12',
    fromUserId: 'prov2',
    toUserId: '2',
    rating: 4,
    comment: 'Buen cliente, comunicación fluida y colaborativo en el proceso.',
    businessId: 'business2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'review13',
    fromUserId: 'prov3',
    toUserId: '1',
    rating: 5,
    comment: 'Cliente ideal, muy profesional y agradable de trabajar.',
    businessId: 'business3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'review14',
    fromUserId: 'prov4',
    toUserId: '2',
    rating: 4,
    comment: 'Cliente confiable y con expectativas claras. Recomendado.',
    businessId: 'business4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'review15',
    fromUserId: 'prov5',
    toUserId: '1',
    rating: 3,
    comment: 'Cliente con algunos cambios de último momento, pero al final todo salió bien.',
    businessId: 'business5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];
*/

// Función para inicializar todos los datos
export const initializeSampleData = (): void => {
  try {
    // Verificar si ya hay datos
    const existingUsers = dataPersistenceService.users.getAllUsers();
    if (existingUsers.length > 0) {
      console.log('Los datos ya están inicializados');
      return;
    }

    console.log('Inicializando datos de ejemplo...');

    // Limpiar proveedores de ejemplo primero
    try {
      clearSampleProveedores();
      console.log('🧹 Proveedores de ejemplo limpiados automáticamente');
    } catch (error) {
      console.log('No hay proveedores de ejemplo para limpiar');
    }

    // Guardar usuarios
    sampleUsers.forEach(user => {
      try {
        dataPersistenceService.users.createUser(user);
      } catch (error) {
        console.error('Error al crear usuario:', user.id, error);
      }
    });

    // Guardar perfiles PyME
    samplePyMEProfiles.forEach(profile => {
      try {
        dataPersistenceService.pymeProfiles.saveProfile(profile);
      } catch (error) {
        console.error('Error al guardar perfil PyME:', profile.id, error);
      }
    });

    // Guardar perfiles Proveedor (comentado para no crear proveedores de ejemplo)
    // sampleProveedorProfiles.forEach(profile => {
    //   try {
    //     dataPersistenceService.proveedorProfiles.saveProfile(profile);
    //   } catch (error) {
    //     console.error('Error al guardar perfil Proveedor:', profile.id, error);
    //   }
    // });

    // Guardar matches (comentado - no se crean matches automáticamente)
    // sampleMatches.forEach(match => {
    //   try {
    //     dataPersistenceService.matches.createMatch(match);
    //   } catch (error) {
    //     console.error('Error al crear match:', match.id, error);
    //   }
    // });

    // No crear chats automáticamente - se crearán cuando el usuario envíe mensajes
    // sampleChats.forEach(chat => {
    //   try {
    //     // Crear chat sin los campos que se generan automáticamente
    //     const { id, createdAt, updatedAt, ...chatData } = chat;
    //     dataPersistenceService.chats.createChat(chatData);
    //   } catch (error) {
    //     console.error('Error al crear chat:', chat.id, error);
    //   }
    // });

    // No crear mensajes automáticamente - se crearán cuando el usuario envíe mensajes
    // sampleMessages.forEach(message => {
    //   try {
    //     // Crear mensaje sin los campos que se generan automáticamente
    //     const { id, timestamp, ...messageData } = message;
    //     dataPersistenceService.messages.createMessage(messageData);
    //   } catch (error) {
    //     console.error('Error al crear mensaje:', message.id, error);
    //   }
    // });

    // No crear negocios automáticamente - se crearán cuando se acepten cotizaciones
    // sampleBusinesses.forEach(business => {
    //   try {
    //     dataPersistenceService.businesses.createBusiness(business);
    //   } catch (error) {
    //     console.error('Error al crear negocio:', business.id, error);
    //   }
    // });

    // No crear reseñas automáticamente - se crearán cuando se completen proyectos
    // sampleReviews.forEach(review => {
    //   try {
    //     dataPersistenceService.reviews.createReview(review);
    //   } catch (error) {
    //     console.error('Error al crear reseña:', review.id, error);
    //   }
    // });

    console.log('Datos de ejemplo inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar datos de ejemplo:', error);
  }
};

// Función para inicializar servicios y productos
export const initializeServicesAndProducts = async (): Promise<void> => {
  try {
    await initializeInitialData();
    
    // Debug: verificar el estado de los datos
    debugDataStatus();
  } catch (error) {
    // Error silencioso
  }
};

// Función para forzar la inicialización de servicios y productos
export const forceInitializeServicesAndProducts = async (): Promise<{
  success: boolean;
  servicesCount: number;
  productsCount: number;
  message: string;
}> => {
  try {
    await initializeInitialData();
    
    // Verificar que se crearon correctamente
    const services = servicePersistenceService.getAllServices();
    const products = productPersistenceService.getAllProducts();
    
    return {
      success: true,
      servicesCount: services.length,
      productsCount: products.length,
      message: `✅ Inicialización exitosa: ${services.length} servicios y ${products.length} productos creados`
    };
  } catch (error) {
    return {
      success: false,
      servicesCount: 0,
      productsCount: 0,
      message: '❌ Error al inicializar servicios y productos'
    };
  }
};

// Función para inicializar solo los chats y mensajes
export const initializeChatsAndMessages = (): void => {
  try {
    console.log('Inicializando chats y mensajes de ejemplo...');

    // Guardar chats
    sampleChats.forEach(chat => {
      try {
        // Crear chat sin los campos que se generan automáticamente
        const { id, createdAt, updatedAt, ...chatData } = chat;
        dataPersistenceService.chats.createChat(chatData);
      } catch (error) {
        console.error('Error al crear chat:', chat.id, error);
      }
    });

    // Guardar mensajes
    sampleMessages.forEach(message => {
      try {
        // Crear mensaje sin los campos que se generan automáticamente
        const { id, timestamp, ...messageData } = message;
        dataPersistenceService.messages.createMessage(messageData);
      } catch (error) {
        console.error('Error al crear mensaje:', message.id, error);
      }
    });

    console.log('Chats y mensajes de ejemplo inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar chats y mensajes:', error);
  }
};

// Función para crear chats de ejemplo con diferentes estados
export const createSampleChatsWithStatus = (): void => {
  try {
    console.log('Creando chats de ejemplo con diferentes estados...');

    // Chat activo
    const activeChat = dataPersistenceService.chats.createChat({
      pymeId: '1',
      proveedorId: 'prov1',
      matchId: 'match_active',
    });
    dataPersistenceService.chats.updateChat(activeChat.id, {
      status: 'active',
    });

    // Chat cerrado
    const closedChat = dataPersistenceService.chats.createChat({
      pymeId: '1',
      proveedorId: 'prov2',
      matchId: 'match_closed',
    });
    dataPersistenceService.chats.updateChat(closedChat.id, {
      status: 'closed',
      closedAt: new Date().toISOString(),
      closeReason: 'Proyecto completado',
    });

    // Crear negocios asociados a estos chats
    dataPersistenceService.businesses.createBusiness({
      chatId: activeChat.id,
      pymeId: '1',
      proveedorId: 'prov1',
      quotationId: 'quote_active',
      status: 'in_progress',
      totalAmount: 5000,
      currency: 'USD',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    });

    dataPersistenceService.businesses.createBusiness({
      chatId: closedChat.id,
      pymeId: '1',
      proveedorId: 'prov2',
      quotationId: 'quote_closed',
      status: 'completed',
      totalAmount: 3000,
      currency: 'USD',
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    });

    console.log('Chats de ejemplo con estados creados correctamente');
  } catch (error) {
    console.error('Error al crear chats de ejemplo:', error);
  }
};

// Función para limpiar solo chats y mensajes
export const clearChatsAndMessages = (): void => {
  try {
    dataPersistenceService.cleanup.clearDataByType('CHATS');
    dataPersistenceService.cleanup.clearDataByType('CHAT_MESSAGES');
    console.log('Chats y mensajes han sido eliminados');
  } catch (error) {
    console.error('Error al limpiar chats y mensajes:', error);
  }
};

// Función para limpiar solo negocios y reseñas
export const clearBusinessesAndReviews = (): void => {
  try {
    dataPersistenceService.cleanup.clearDataByType('BUSINESSES');
    dataPersistenceService.cleanup.clearDataByType('REVIEWS');
    console.log('Negocios y reseñas han sido eliminados');
  } catch (error) {
    console.error('Error al limpiar negocios y reseñas:', error);
  }
};

// Función para limpiar todos los datos
export const clearAllData = (): void => {
  try {
    dataPersistenceService.cleanup.clearAllData();
    console.log('Todos los datos han sido eliminados');
  } catch (error) {
    console.error('Error al limpiar datos:', error);
  }
};

// Función para limpiar solo proveedores de ejemplo
export const clearSampleProveedores = (): number => {
  try {
    // Obtener todos los proveedores
    const allProveedores = dataPersistenceService.proveedorProfiles.getAllProfiles();
    
    // Filtrar solo los proveedores de ejemplo (que tienen IDs como 'prov1', 'prov2', etc.)
    const sampleProveedores = allProveedores.filter(proveedor => 
      proveedor.id.startsWith('prov') && proveedor.id !== 'prov_profile_'
    );
    
    // Eliminar cada proveedor de ejemplo
    sampleProveedores.forEach(proveedor => {
      dataPersistenceService.proveedorProfiles.deleteProfile(proveedor.id);
    });
    
    console.log(`🧹 Se eliminaron ${sampleProveedores.length} proveedores de ejemplo`);
    return sampleProveedores.length;
  } catch (error) {
    console.error('Error al limpiar proveedores de ejemplo:', error);
    return 0;
  }
};

// Función para limpiar automáticamente al cargar la aplicación
export const autoCleanupSampleData = (): void => {
  try {
    const deletedCount = clearSampleProveedores();
    if (deletedCount > 0) {
      console.log(`✅ Limpieza automática completada: ${deletedCount} proveedores de ejemplo eliminados`);
    }
  } catch (error) {
    console.error('Error en limpieza automática:', error);
  }
};

// Función para exportar datos
export const exportData = (): Record<string, any> => {
  try {
    return dataPersistenceService.cleanup.exportAllData();
  } catch (error) {
    console.error('Error al exportar datos:', error);
    return {};
  }
};

// Función para importar datos
export const importData = (data: Record<string, any>): void => {
  try {
    dataPersistenceService.cleanup.importData(data);
    console.log('Datos importados correctamente');
  } catch (error) {
    console.error('Error al importar datos:', error);
  }
};

// Función para verificar si hay datos
export const hasData = (): boolean => {
  const users = dataPersistenceService.users.getAllUsers();
  return users.length > 0;
};

// Función para obtener estadísticas de datos
export const getDataStats = (): Record<string, number> => {
  return {
    users: dataPersistenceService.users.getAllUsers().length,
    pymeProfiles: dataPersistenceService.pymeProfiles.getAllProfiles().length,
    proveedorProfiles: dataPersistenceService.proveedorProfiles.getAllProfiles().length,
    matches: dataPersistenceService.matches.getAllMatches().length,
    chats: dataPersistenceService.chats.getAllChats().length,
    messages: dataPersistenceService.messages.getAllMessages().length,
    businesses: dataPersistenceService.businesses.getAllBusinesses().length,
    reviews: dataPersistenceService.reviews.getAllReviews().length,
  };
};

const dataInitializationService = {
  initializeSampleData,
  initializeServicesAndProducts,
  forceInitializeServicesAndProducts,
  initializeChatsAndMessages,
  createSampleChatsWithStatus,
  clearChatsAndMessages,
  clearBusinessesAndReviews,
  clearAllData,
  exportData,
  importData,
  hasData,
  getDataStats,
};

export default dataInitializationService;
