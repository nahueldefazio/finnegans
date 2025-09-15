import { Service, Product, ProveedorProfile } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';

// Claves para localStorage
const STORAGE_KEYS = {
  SERVICES: 'pyme_connect_services',
  PRODUCTS: 'pyme_connect_products'
} as const;

// Utilidades para localStorage
const storageUtils = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  }
};

// Servicio de persistencia de Servicios
export const servicePersistenceService = {
  // Obtener todos los servicios
  getAllServices: (): Service[] => {
    return storageUtils.get(STORAGE_KEYS.SERVICES, []);
  },

  // Obtener servicio por ID
  getServiceById: (serviceId: string): Service | null => {
    const services = servicePersistenceService.getAllServices();
    return services.find((service) => service.id === serviceId) || null;
  },

  // Obtener servicios por usuario
  getServicesByUserId: (userId: string): Service[] => {
    const services = servicePersistenceService.getAllServices();
    return services.filter((service) => service.userId === userId);
  },

  // Crear nuevo servicio
  createService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service => {
    const services = servicePersistenceService.getAllServices();
    const newService: Service = {
      ...service,
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    services.push(newService);
    storageUtils.set(STORAGE_KEYS.SERVICES, services);
    return newService;
  },

  // Actualizar servicio
  updateService: (serviceId: string, updates: Partial<Service>): Service | null => {
    const services = servicePersistenceService.getAllServices();
    const serviceIndex = services.findIndex((service) => service.id === serviceId);

    if (serviceIndex === -1) return null;

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    storageUtils.set(STORAGE_KEYS.SERVICES, services);
    return services[serviceIndex];
  },

  // Eliminar servicio
  deleteService: (serviceId: string): boolean => {
    const services = servicePersistenceService.getAllServices();
    const filteredServices = services.filter((service) => service.id !== serviceId);

    if (filteredServices.length === services.length) return false;

    storageUtils.set(STORAGE_KEYS.SERVICES, filteredServices);
    return true;
  }
};

// Servicio de persistencia de Productos
export const productPersistenceService = {
  // Obtener todos los productos
  getAllProducts: (): Product[] => {
    return storageUtils.get(STORAGE_KEYS.PRODUCTS, []);
  },

  // Obtener producto por ID
  getProductById: (productId: string): Product | null => {
    const products = productPersistenceService.getAllProducts();
    return products.find((product) => product.id === productId) || null;
  },

  // Obtener productos por usuario
  getProductsByUserId: (userId: string): Product[] => {
    const products = productPersistenceService.getAllProducts();
    return products.filter((product) => product.userId === userId);
  },

  // Crear nuevo producto
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const products = productPersistenceService.getAllProducts();
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    storageUtils.set(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  // Actualizar producto
  updateProduct: (productId: string, updates: Partial<Product>): Product | null => {
    const products = productPersistenceService.getAllProducts();
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    storageUtils.set(STORAGE_KEYS.PRODUCTS, products);
    return products[productIndex];
  },

  // Eliminar producto
  deleteProduct: (productId: string): boolean => {
    const products = productPersistenceService.getAllProducts();
    const filteredProducts = products.filter((product) => product.id !== productId);

    if (filteredProducts.length === products.length) return false;

    storageUtils.set(STORAGE_KEYS.PRODUCTS, filteredProducts);
    return true;
  }
};

// Funciones principales del servicio
export const createService = async (userId: string, serviceData: Omit<Service, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newService = servicePersistenceService.createService({
    ...serviceData,
    userId
  });

  // Actualizar el perfil del proveedor para incluir este servicio
  await updateProveedorWithService(userId, newService);

  return newService;
};

export const createProduct = async (userId: string, productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newProduct = productPersistenceService.createProduct({
    ...productData,
    userId
  });

  // Actualizar el perfil del proveedor para incluir este producto
  await updateProveedorWithProduct(userId, newProduct);

  return newProduct;
};

export const getServicesByUserId = async (userId: string): Promise<Service[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return servicePersistenceService.getServicesByUserId(userId);
};

export const getProductsByUserId = async (userId: string): Promise<Product[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return productPersistenceService.getProductsByUserId(userId);
};

export const updateService = async (serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return servicePersistenceService.updateService(serviceId, updates);
};

export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return productPersistenceService.updateProduct(productId, updates);
};

export const deleteService = async (serviceId: string): Promise<boolean> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return servicePersistenceService.deleteService(serviceId);
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  return productPersistenceService.deleteProduct(productId);
};

// Funciones para actualizar perfiles de proveedores
export const updateProveedorWithService = async (userId: string, service: Service): Promise<void> => {
  try {
    let proveedor = dataPersistenceService.proveedorProfiles.getProfileByUserId(userId);

    // Si no existe el perfil del proveedor, crear uno básico
    if (!proveedor) {
      // Para el proveedor del sistema, crear un perfil automáticamente
      if (userId === 'system_provider') {
        const newProveedor: ProveedorProfile = {
          id: 'system_provider_profile',
          userId: userId,
          companyName: 'Sistema de Servicios',
          services: [],
          capabilities: [],
          pricing: [],
          location: 'México',
          description: 'Proveedor del sistema para servicios agregados directamente',
          contactInfo: {
            phone: '',
            address: ''
          },
          rating: 4.5,
          totalReviews: 0,
          offeredServices: [],
          offeredProducts: []
        };
        dataPersistenceService.proveedorProfiles.saveProfile(newProveedor);
        proveedor = newProveedor;
        console.log('Created system provider profile');
      } else {
        const user = dataPersistenceService.users.getUserById(userId);
        if (user && user.type === 'proveedor') {
          const newProveedor: ProveedorProfile = {
            id: `prov_profile_${userId}`,
            userId: userId,
            companyName: user.name,
            services: [],
            capabilities: [],
            pricing: [],
            location: 'Ciudad de México',
            description: `Perfil de proveedor para ${user.name}`,
            contactInfo: {
              phone: '',
              address: ''
            },
            rating: 4.0,
            totalReviews: 0,
            offeredServices: [],
            offeredProducts: []
          };
          dataPersistenceService.proveedorProfiles.saveProfile(newProveedor);
          proveedor = newProveedor;
          console.log('Created new proveedor profile for user:', userId);
        } else {
          console.warn('User not found or not a proveedor:', userId);
          return;
        }
      }
    }

    // Actualizar la lista básica de servicios si no existe ya
    const updatedServices = [...proveedor.services];
    if (!updatedServices.includes(service.name)) {
      updatedServices.push(service.name);
    }

    // Actualizar la información de pricing
    const updatedPricing = [...proveedor.pricing];
    const existingPricingIndex = updatedPricing.findIndex((p) => p.service === service.name);

    const newPricingInfo = {
      service: service.name,
      minPrice: service.pricing.minPrice,
      maxPrice: service.pricing.maxPrice,
      unit: service.pricing.unit
    };

    if (existingPricingIndex >= 0) {
      updatedPricing[existingPricingIndex] = newPricingInfo;
    } else {
      updatedPricing.push(newPricingInfo);
    }

    // Actualizar capabilities si no existen ya
    const updatedCapabilities = [...proveedor.capabilities];
    service.features.forEach((feature) => {
      if (!updatedCapabilities.includes(feature)) {
        updatedCapabilities.push(feature);
      }
    });

    const updatedProveedor: ProveedorProfile = {
      ...proveedor,
      services: updatedServices,
      capabilities: updatedCapabilities,
      pricing: updatedPricing,
      offeredServices: [...(proveedor.offeredServices || []), service]
    };

    dataPersistenceService.proveedorProfiles.saveProfile(updatedProveedor);
    console.log('Service added to proveedor:', proveedor.companyName, service.name);
    console.log('Updated services list:', updatedServices);
    console.log('Updated pricing info:', updatedPricing);
  } catch (error) {
    console.error('Error updating proveedor with service:', error);
  }
};

export const updateProveedorWithProduct = async (userId: string, product: Product): Promise<void> => {
  try {
    let proveedor = dataPersistenceService.proveedorProfiles.getProfileByUserId(userId);

    // Si no existe el perfil del proveedor, crear uno básico
    if (!proveedor) {
      // Para el proveedor del sistema, crear un perfil automáticamente
      if (userId === 'system_provider') {
        const newProveedor: ProveedorProfile = {
          id: 'system_provider_profile',
          userId: userId,
          companyName: 'Sistema de Servicios',
          services: [],
          capabilities: [],
          pricing: [],
          location: 'México',
          description: 'Proveedor del sistema para servicios agregados directamente',
          contactInfo: {
            phone: '',
            address: ''
          },
          rating: 4.5,
          totalReviews: 0,
          offeredServices: [],
          offeredProducts: []
        };
        dataPersistenceService.proveedorProfiles.saveProfile(newProveedor);
        proveedor = newProveedor;
        console.log('Created system provider profile');
      } else {
        const user = dataPersistenceService.users.getUserById(userId);
        if (user && user.type === 'proveedor') {
          const newProveedor: ProveedorProfile = {
            id: `prov_profile_${userId}`,
            userId: userId,
            companyName: user.name,
            services: [],
            capabilities: [],
            pricing: [],
            location: 'Ciudad de México',
            description: `Perfil de proveedor para ${user.name}`,
            contactInfo: {
              phone: '',
              address: ''
            },
            rating: 4.0,
            totalReviews: 0,
            offeredServices: [],
            offeredProducts: []
          };
          dataPersistenceService.proveedorProfiles.saveProfile(newProveedor);
          proveedor = newProveedor;
          console.log('Created new proveedor profile for user:', userId);
        } else {
          console.warn('User not found or not a proveedor:', userId);
          return;
        }
      }
    }

    // Actualizar la lista básica de servicios si no existe ya (productos también se consideran servicios para matching)
    const updatedServices = [...proveedor.services];
    if (!updatedServices.includes(product.name)) {
      updatedServices.push(product.name);
    }

    // Actualizar la información de pricing
    const updatedPricing = [...proveedor.pricing];
    const existingPricingIndex = updatedPricing.findIndex((p) => p.service === product.name);

    const newPricingInfo = {
      service: product.name,
      minPrice: product.pricing.price,
      maxPrice: product.pricing.price,
      unit: product.pricing.unit
    };

    if (existingPricingIndex >= 0) {
      updatedPricing[existingPricingIndex] = newPricingInfo;
    } else {
      updatedPricing.push(newPricingInfo);
    }

    // Actualizar capabilities si no existen ya
    const updatedCapabilities = [...proveedor.capabilities];
    product.features.forEach((feature) => {
      if (!updatedCapabilities.includes(feature)) {
        updatedCapabilities.push(feature);
      }
    });

    const updatedProveedor: ProveedorProfile = {
      ...proveedor,
      services: updatedServices,
      capabilities: updatedCapabilities,
      pricing: updatedPricing,
      offeredProducts: [...(proveedor.offeredProducts || []), product]
    };

    dataPersistenceService.proveedorProfiles.saveProfile(updatedProveedor);
    console.log('Product added to proveedor:', proveedor.companyName, product.name);
    console.log('Updated services list:', updatedServices);
    console.log('Updated pricing info:', updatedPricing);
  } catch (error) {
    console.error('Error updating proveedor with product:', error);
  }
};

// Servicio principal
export const serviceService = {
  services: servicePersistenceService,
  products: productPersistenceService,
  createService,
  createProduct,
  getServicesByUserId,
  getProductsByUserId,
  updateService,
  updateProduct,
  deleteService,
  deleteProduct
};

export default serviceService;
