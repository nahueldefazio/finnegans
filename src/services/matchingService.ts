import { PyMEProfile, ProveedorProfile, Match, Service, Product } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';
import { servicePersistenceService, productPersistenceService } from './serviceService';

export const calculateMatchScore = (pyme: PyMEProfile, proveedor: ProveedorProfile): number => {
  let score = 0;
  let factors = 0;

  // Coincidencia de necesidades con servicios (40% del score)
  const needsMatch = pyme.needs.filter((need) => proveedor.services.some((service) => service.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(service.toLowerCase()))).length;

  if (pyme.needs.length > 0) {
    score += (needsMatch / pyme.needs.length) * 40;
    factors++;
  }

  // Coincidencia de presupuesto (25% del score)
  const pymeBudgetAvg = (pyme.budget.min + pyme.budget.max) / 2;
  const proveedorPriceAvg = proveedor.pricing.reduce((sum, price) => sum + (price.minPrice + price.maxPrice) / 2, 0) / proveedor.pricing.length;

  if (pymeBudgetAvg >= proveedorPriceAvg * 0.8 && pymeBudgetAvg <= proveedorPriceAvg * 1.5) {
    score += 25;
  } else if (pymeBudgetAvg >= proveedorPriceAvg * 0.6) {
    score += 15;
  } else if (pymeBudgetAvg >= proveedorPriceAvg * 0.4) {
    score += 10;
  }
  factors++;

  // Rating del proveedor (20% del score)
  score += (proveedor.rating / 5) * 20;
  factors++;

  // Coincidencia de ubicación (10% del score)
  if (pyme.location.toLowerCase() === proveedor.location.toLowerCase()) {
    score += 10;
  } else if (pyme.location.toLowerCase().includes(proveedor.location.toLowerCase()) || proveedor.location.toLowerCase().includes(pyme.location.toLowerCase())) {
    score += 5;
  }

  // Número de reviews (5% del score)
  if (proveedor.totalReviews >= 20) {
    score += 5;
  } else if (proveedor.totalReviews >= 10) {
    score += 3;
  } else if (proveedor.totalReviews >= 5) {
    score += 1;
  }

  return Math.round(score);
};

export const generateMatchReasons = (pyme: PyMEProfile, proveedor: ProveedorProfile): string[] => {
  const reasons: string[] = [];

  // Coincidencias de servicios
  const matchingServices = pyme.needs.filter((need) => proveedor.services.some((service) => service.toLowerCase().includes(need.toLowerCase()) || need.toLowerCase().includes(service.toLowerCase())));

  if (matchingServices.length > 0) {
    reasons.push(`Ofrece ${matchingServices.length} de tus servicios necesarios: ${matchingServices.join(', ')}`);
  }

  // Rating alto
  if (proveedor.rating >= 4.5) {
    reasons.push(`Excelente calificación (${proveedor.rating}/5) con ${proveedor.totalReviews} reseñas`);
  }

  // Ubicación
  if (pyme.location.toLowerCase() === proveedor.location.toLowerCase()) {
    reasons.push('Ubicado en la misma ciudad');
  }

  // Presupuesto compatible
  const pymeBudgetAvg = (pyme.budget.min + pyme.budget.max) / 2;
  const proveedorPriceAvg = proveedor.pricing.reduce((sum, price) => sum + (price.minPrice + price.maxPrice) / 2, 0) / proveedor.pricing.length;

  if (pymeBudgetAvg >= proveedorPriceAvg * 0.8 && pymeBudgetAvg <= proveedorPriceAvg * 1.5) {
    reasons.push('Precios dentro de tu rango de presupuesto');
  }

  return reasons;
};

export const findMatches = async (pyme: PyMEProfile): Promise<Match[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const proveedores = dataPersistenceService.proveedorProfiles.getAllProfiles();
  const matches: Match[] = proveedores.map((proveedor) => {
    const score = calculateMatchScore(pyme, proveedor);
    const reasons = generateMatchReasons(pyme, proveedor);

    return {
      id: `match-${pyme.id}-${proveedor.id}`,
      pymeId: pyme.id,
      proveedorId: proveedor.id,
      score,
      reasons,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  });

  // Filtrar solo matches con score > 30 y ordenar por score
  return matches.filter((match) => match.score > 30).sort((a, b) => b.score - a.score);
};

export const getProveedorById = (id: string): ProveedorProfile | undefined => {
  return dataPersistenceService.proveedorProfiles.getProfileById(id) || undefined;
};

export const getAllProveedores = (): ProveedorProfile[] => {
  return dataPersistenceService.proveedorProfiles.getAllProfiles();
};

// Funciones para buscar servicios y productos desde proveedores
export const searchServices = async (
  searchTerm: string,
  category?: string,
  maxPrice?: number,
  serviceType?: 'service' | 'product',
  deliveryTime?: string,
  features?: string[],
  tags?: string[],
  location?: string,
  isAvailable?: boolean
): Promise<{ service: Service; proveedor: ProveedorProfile }[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener todos los servicios disponibles
  const allServices = servicePersistenceService.getAllServices();
  const allProveedores = dataPersistenceService.proveedorProfiles.getAllProfiles();
  const results: { service: Service; proveedor: ProveedorProfile }[] = [];


  // Buscar en todos los servicios
  allServices.forEach((service) => {
    // Obtener el proveedor asociado al servicio
    const proveedor = allProveedores.find(p => p.userId === service.userId) || 
                     allProveedores.find(p => p.userId === 'system_provider');
    
    if (!proveedor) return;

    
    // Solo servicios activos y disponibles por defecto
    if (service.status === 'active' && service.availability.isAvailable) {
      let matches = true;

      // Filtrar por término de búsqueda (solo si hay término)
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        
        const nameMatch = service.name.toLowerCase().includes(term);
        const descMatch = service.description.toLowerCase().includes(term);
        const catMatch = service.category.toLowerCase().includes(term);
        const tagsMatch = service.tags.some((tag) => tag.toLowerCase().includes(term));
        const featuresMatch = service.features.some((feature) => feature.toLowerCase().includes(term));
        
        matches = matches && (nameMatch || descMatch || catMatch || tagsMatch || featuresMatch);
      }

      // Filtrar por categoría (solo si hay categoría)
      if (category && category.trim() !== '' && matches) {
        matches = matches && service.category.toLowerCase().includes(category.toLowerCase().trim());
      }

      // Filtrar por precio máximo (solo si hay precio máximo)
      if (maxPrice && maxPrice > 0 && matches) {
        matches = matches && service.pricing.minPrice <= maxPrice;
      }

      // Filtrar por tipo de servicio (solo si se especifica)
      if (serviceType && matches) {
        matches = matches && service.type === serviceType;
      }

      // Filtrar por tiempo de entrega (solo si se especifica)
      if (deliveryTime && deliveryTime.trim() !== '' && matches) {
        matches = matches && service.deliveryTime.toLowerCase().includes(deliveryTime.toLowerCase().trim());
      }

      // Filtrar por características específicas (solo si se especifican)
      if (features && features.length > 0 && matches) {
        matches = matches && features.some((feature) => service.features.some((serviceFeature) => serviceFeature.toLowerCase().includes(feature.toLowerCase())));
      }

      // Filtrar por etiquetas específicas (solo si se especifican)
      if (tags && tags.length > 0 && matches) {
        matches = matches && tags.some((tag) => service.tags.some((serviceTag) => serviceTag.toLowerCase().includes(tag.toLowerCase())));
      }

      // Filtrar por ubicación del servicio (solo si se especifica)
      if (location && location.trim() !== '' && matches) {
        const serviceLocation = service.availability.location || proveedor.location;
        matches = matches && serviceLocation.toLowerCase().includes(location.toLowerCase().trim());
      }

      // Filtrar por disponibilidad (solo si se especifica explícitamente)
      if (isAvailable !== undefined && matches) {
        matches = matches && service.availability.isAvailable === isAvailable;
      }

      if (matches) {
        results.push({ service, proveedor });
      }
    }
  });


  // Ordenar resultados
  return results.sort((a, b) => {
    // Si hay término de búsqueda, ordenar por relevancia
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const aExactMatch = a.service.name.toLowerCase() === term;
      const bExactMatch = b.service.name.toLowerCase() === term;
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Ordenar por coincidencia en el nombre
      const aNameMatch = a.service.name.toLowerCase().includes(term);
      const bNameMatch = b.service.name.toLowerCase().includes(term);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
    }

    // Ordenar alfabéticamente por nombre del servicio
    return a.service.name.localeCompare(b.service.name);
  });
};

export const searchProducts = async (searchTerm: string, category?: string, maxPrice?: number): Promise<{ product: Product; proveedor: ProveedorProfile }[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener todos los productos disponibles
  const allProducts = productPersistenceService.getAllProducts();
  const allProveedores = dataPersistenceService.proveedorProfiles.getAllProfiles();
  const results: { product: Product; proveedor: ProveedorProfile }[] = [];


  // Buscar en todos los productos
  allProducts.forEach((product) => {
    // Obtener el proveedor asociado al producto
    const proveedor = allProveedores.find(p => p.userId === product.userId) || 
                     allProveedores.find(p => p.userId === 'system_provider');
    
    if (!proveedor) return;

    
    if (product.status === 'active' && product.availability.isAvailable) {
      let matches = true;

      // Filtrar por término de búsqueda (solo si hay término)
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        matches =
          matches &&
          (product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term) ||
            product.tags.some((tag) => tag.toLowerCase().includes(term)));
      }

      // Filtrar por categoría (solo si hay categoría)
      if (category && category.trim() !== '' && matches) {
        matches = matches && product.category.toLowerCase().includes(category.toLowerCase().trim());
      }

      // Filtrar por precio máximo (solo si hay precio máximo)
      if (maxPrice && maxPrice > 0 && matches) {
        matches = matches && product.pricing.price <= maxPrice;
      }

      if (matches) {
        results.push({ product, proveedor });
      }
    }
  });


  // Ordenar resultados
  return results.sort((a, b) => {
    // Si hay término de búsqueda, ordenar por relevancia
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const aExactMatch = a.product.name.toLowerCase() === term;
      const bExactMatch = b.product.name.toLowerCase() === term;
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Ordenar por coincidencia en el nombre
      const aNameMatch = a.product.name.toLowerCase().includes(term);
      const bNameMatch = b.product.name.toLowerCase().includes(term);
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
    }

    // Ordenar alfabéticamente por nombre del producto
    return a.product.name.localeCompare(b.product.name);
  });
};

// Funciones para obtener todos los servicios y productos disponibles
export const getAllAvailableServices = async (): Promise<{ service: Service; proveedor: ProveedorProfile }[]> => {
  return await searchServices('', undefined, undefined);
};

export const getAllAvailableProducts = async (): Promise<{ product: Product; proveedor: ProveedorProfile }[]> => {
  return await searchProducts('', undefined, undefined);
};

// Función para obtener estadísticas de servicios y productos disponibles
export const getServicesAndProductsStats = (): {
  totalProveedores: number;
  totalServices: number;
  totalProducts: number;
  servicesByCategory: Record<string, number>;
  productsByCategory: Record<string, number>;
  proveedoresWithServices: number;
  proveedoresWithProducts: number;
} => {
  const allProveedores = getAllProveedores();

  let totalServices = 0;
  let totalProducts = 0;
  const servicesByCategory: Record<string, number> = {};
  const productsByCategory: Record<string, number> = {};
  let proveedoresWithServices = 0;
  let proveedoresWithProducts = 0;

  allProveedores.forEach((proveedor) => {
    const hasServices = proveedor.offeredServices && proveedor.offeredServices.length > 0;
    const hasProducts = proveedor.offeredProducts && proveedor.offeredProducts.length > 0;

    if (hasServices) {
      proveedoresWithServices++;
      proveedor.offeredServices!.forEach((service) => {
        if (service.status === 'active') {
          totalServices++;
          servicesByCategory[service.category] = (servicesByCategory[service.category] || 0) + 1;
        }
      });
    }

    if (hasProducts) {
      proveedoresWithProducts++;
      proveedor.offeredProducts!.forEach((product) => {
        if (product.status === 'active') {
          totalProducts++;
          productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
        }
      });
    }
  });

  return {
    totalProveedores: allProveedores.length,
    totalServices,
    totalProducts,
    servicesByCategory,
    productsByCategory,
    proveedoresWithServices,
    proveedoresWithProducts
  };
};

export const matchingService = {
  calculateMatchScore,
  generateMatchReasons,
  findMatches,
  getProveedorById,
  getAllProveedores,
  searchServices,
  searchProducts,
  getAllAvailableServices,
  getAllAvailableProducts,
  getServicesAndProductsStats
};
