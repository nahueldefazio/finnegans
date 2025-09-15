import { PyMEProfile, ProveedorProfile, Service, Product } from '../types';
import { dataPersistenceService } from './dataPersistenceService';
import { servicePersistenceService, productPersistenceService } from './serviceService';
import { searchServices, searchProducts } from './matchingService';

export interface SmartMatchResult {
  service: Service;
  product?: Product;
  proveedor: ProveedorProfile;
  matchScore: number;
  reasons: string[];
  compatibility: {
    needs: number;
    budget: number;
    location: number;
    industry: number;
    size: number;
  };
}

export interface UserNeeds {
  serviceTypes: string[];
  needs: string[];
  budget: { min: number; max: number };
  industry: string;
  size: string;
  location: string;
}

/**
 * Obtiene las necesidades del usuario basándose en su perfil
 */
export const getUserNeeds = (userId: string): UserNeeds | null => {
  try {
    // Primero intentar obtener el perfil PyME directamente por userId
    let pymeProfile = dataPersistenceService.pymeProfiles.getProfileByUserId(userId);
    
    // Si no se encuentra, intentar obtener el primer perfil PyME disponible
    if (!pymeProfile) {
      const allPyMEProfiles = dataPersistenceService.pymeProfiles.getAllProfiles();
      if (allPyMEProfiles.length > 0) {
        pymeProfile = allPyMEProfiles[0];
        console.log('Usando perfil PyME por defecto:', pymeProfile.companyName);
      }
    }

    if (!pymeProfile) {
      console.log('No se encontró ningún perfil PyME');
      return null;
    }

    return {
      serviceTypes: pymeProfile.serviceTypes || [],
      needs: pymeProfile.needs || [],
      budget: pymeProfile.budget || { min: 0, max: 100000 },
      industry: pymeProfile.industry || '',
      size: pymeProfile.size || 'micro',
      location: pymeProfile.location || '',
    };
  } catch (error) {
    console.error('Error getting user needs:', error);
    return null;
  }
};

/**
 * Calcula el score de compatibilidad de necesidades
 */
const calculateNeedsCompatibility = (userNeeds: string[], serviceFeatures: string[], serviceRequirements: string[]): number => {
  if (userNeeds.length === 0) return 0.5; // Neutral si no hay necesidades específicas

  const allServiceInfo = [...serviceFeatures, ...serviceRequirements];
  let matches = 0;

  userNeeds.forEach(need => {
    const needLower = need.toLowerCase();
    allServiceInfo.forEach(info => {
      if (info.toLowerCase().includes(needLower) || needLower.includes(info.toLowerCase())) {
        matches++;
      }
    });
  });

  return Math.min(matches / userNeeds.length, 1);
};

/**
 * Calcula el score de compatibilidad de presupuesto
 */
const calculateBudgetCompatibility = (userBudget: { min: number; max: number }, servicePrice: { minPrice: number; maxPrice: number }): number => {
  const userMin = userBudget.min;
  const userMax = userBudget.max;
  const serviceMin = servicePrice.minPrice;
  const serviceMax = servicePrice.maxPrice;

  // Si el servicio está completamente dentro del presupuesto del usuario
  if (serviceMin >= userMin && serviceMax <= userMax) {
    return 1.0;
  }

  // Si hay solapamiento parcial
  if (serviceMin <= userMax && serviceMax >= userMin) {
    const overlap = Math.min(serviceMax, userMax) - Math.max(serviceMin, userMin);
    const serviceRange = serviceMax - serviceMin;
    return overlap / serviceRange;
  }

  // Si el servicio está fuera del presupuesto pero cerca
  if (serviceMin > userMax) {
    const difference = serviceMin - userMax;
    const userRange = userMax - userMin;
    return Math.max(0, 1 - (difference / userRange));
  }

  if (serviceMax < userMin) {
    const difference = userMin - serviceMax;
    const userRange = userMax - userMin;
    return Math.max(0, 1 - (difference / userRange));
  }

  return 0;
};

/**
 * Calcula el score de compatibilidad de ubicación
 */
const calculateLocationCompatibility = (userLocation: string, serviceLocation: string): number => {
  if (!userLocation || !serviceLocation) return 0.5;

  const userLoc = userLocation.toLowerCase();
  const serviceLoc = serviceLocation.toLowerCase();

  // Coincidencia exacta
  if (userLoc === serviceLoc) return 1.0;

  // Misma ciudad
  if (userLoc.includes(serviceLoc) || serviceLoc.includes(userLoc)) return 0.8;

  // Mismo estado/región
  const userState = userLoc.split(',')[1]?.trim();
  const serviceState = serviceLoc.split(',')[1]?.trim();
  if (userState && serviceState && userState === serviceState) return 0.6;

  // Mismo país
  const userCountry = userLoc.split(',')[2]?.trim();
  const serviceCountry = serviceLoc.split(',')[2]?.trim();
  if (userCountry && serviceCountry && userCountry === serviceCountry) return 0.4;

  return 0.2; // Ubicación diferente
};

/**
 * Calcula el score de compatibilidad de industria
 */
const calculateIndustryCompatibility = (userIndustry: string, serviceCategory: string): number => {
  if (!userIndustry || !serviceCategory) return 0.5;

  const industry = userIndustry.toLowerCase();
  const category = serviceCategory.toLowerCase();

  // Mapeo de industrias a categorías de servicios relevantes
  const industryMappings: { [key: string]: string[] } = {
    'tecnología': ['desarrollo de software', 'consultoría it', 'marketing digital', 'diseño web'],
    'retail': ['marketing digital', 'diseño', 'logística', 'contabilidad'],
    'manufactura': ['logística', 'consultoría', 'contabilidad', 'recursos humanos'],
    'servicios': ['marketing digital', 'contabilidad', 'recursos humanos', 'consultoría'],
    'salud': ['consultoría', 'contabilidad', 'recursos humanos', 'marketing digital'],
    'educación': ['consultoría', 'marketing digital', 'recursos humanos', 'contabilidad'],
    'construcción': ['logística', 'contabilidad', 'consultoría', 'recursos humanos'],
    'alimentación': ['marketing digital', 'logística', 'contabilidad', 'consultoría'],
  };

  const relevantCategories = industryMappings[industry] || [];
  if (relevantCategories.some(cat => category.includes(cat))) {
    return 0.9;
  }

  // Coincidencia parcial
  if (category.includes(industry) || industry.includes(category)) {
    return 0.7;
  }

  return 0.3; // Industria no relacionada
};

/**
 * Calcula el score de compatibilidad de tamaño de empresa
 */
const calculateSizeCompatibility = (userSize: string, servicePricing: { minPrice: number; maxPrice: number }): number => {
  const sizeMultipliers: { [key: string]: number } = {
    'micro': 0.3,
    'pequeña': 0.6,
    'mediana': 1.0,
  };

  const userMultiplier = sizeMultipliers[userSize] || 0.5;
  const avgServicePrice = (servicePricing.minPrice + servicePricing.maxPrice) / 2;
  
  // Ajustar el precio esperado basándose en el tamaño de la empresa
  const expectedPrice = avgServicePrice * userMultiplier;
  const actualPrice = avgServicePrice;

  // Si el precio está dentro del rango esperado para el tamaño de empresa
  if (Math.abs(actualPrice - expectedPrice) / expectedPrice < 0.5) {
    return 1.0;
  }

  return 0.6; // Precio fuera del rango esperado pero aún viable
};

/**
 * Busca servicios que coincidan con las necesidades del usuario
 */
export const findSmartMatches = async (userId: string): Promise<SmartMatchResult[]> => {
  try {
    const userNeeds = getUserNeeds(userId);
    if (!userNeeds) {
      console.log('No se encontraron necesidades del usuario');
      return [];
    }

    console.log('🔍 Buscando matches inteligentes para:', userNeeds);

    const matches: SmartMatchResult[] = [];
    
    console.log('📊 Presupuesto del usuario:', userNeeds.budget);
    console.log('📍 Ubicación del usuario:', userNeeds.location);

    // Usar la misma lógica de búsqueda que la búsqueda general
    // Buscar servicios que coincidan con las necesidades del usuario
    const serviceResults = await searchServices(
      '', // Sin término de búsqueda específico
      '', // Sin categoría específica
      userNeeds.budget.max, // Usar el presupuesto máximo del usuario
      'service', // Solo servicios
      '', // Sin tiempo de entrega específico
      [], // Sin características específicas
      [], // Sin tags específicos
      userNeeds.location, // Usar la ubicación del usuario
      true // Solo servicios disponibles
    );

    // Buscar productos que coincidan con las necesidades del usuario
    const productResults = await searchProducts(
      '', // Sin término de búsqueda específico
      '', // Sin categoría específica
      userNeeds.budget.max // Usar el presupuesto máximo del usuario
    );
    
    console.log(`🔍 Resultados de búsqueda de servicios: ${serviceResults.length}`);
    console.log(`🔍 Resultados de búsqueda de productos: ${productResults.length}`);

    // Convertir resultados de servicios a SmartMatchResult
    serviceResults.forEach(({ service, proveedor }) => {

      const compatibility = {
        needs: calculateNeedsCompatibility(userNeeds.needs, service.features, service.requirements),
        budget: calculateBudgetCompatibility(userNeeds.budget, service.pricing),
        location: calculateLocationCompatibility(userNeeds.location, service.availability.location || ''),
        industry: calculateIndustryCompatibility(userNeeds.industry, service.category),
        size: calculateSizeCompatibility(userNeeds.size, service.pricing),
      };
      
      console.log(`🔍 Análisis detallado para ${service.name}:`);
      console.log(`   - Necesidades del usuario: [${userNeeds.needs.join(', ')}]`);
      console.log(`   - Características del servicio: [${service.features.join(', ')}]`);
      console.log(`   - Presupuesto usuario: $${userNeeds.budget.min}-${userNeeds.budget.max}`);
      console.log(`   - Precio servicio: $${service.pricing.minPrice}-${service.pricing.maxPrice}`);
      console.log(`   - Ubicación usuario: ${userNeeds.location}`);
      console.log(`   - Ubicación servicio: ${service.availability.location}`);
      console.log(`   - Industria usuario: ${userNeeds.industry}`);
      console.log(`   - Categoría servicio: ${service.category}`);

      // Calcular score total (promedio ponderado)
      const weights = {
        needs: 0.3,
        budget: 0.25,
        location: 0.2,
        industry: 0.15,
        size: 0.1,
      };

      const matchScore = 
        compatibility.needs * weights.needs +
        compatibility.budget * weights.budget +
        compatibility.location * weights.location +
        compatibility.industry * weights.industry +
        compatibility.size * weights.size;

      // Solo incluir matches con score > 0.1 (reducido de 30% a 10%)
      if (matchScore > 0.1) {
        const reasons: string[] = [];
        
        if (compatibility.needs > 0.7) {
          reasons.push('Coincide con tus necesidades específicas');
        }
        if (compatibility.budget > 0.7) {
          reasons.push('Se ajusta a tu presupuesto');
        }
        if (compatibility.location > 0.7) {
          reasons.push('Ubicación conveniente');
        }
        if (compatibility.industry > 0.7) {
          reasons.push('Relevante para tu industria');
        }
        if (compatibility.size > 0.7) {
          reasons.push('Apropiado para el tamaño de tu empresa');
        }

        matches.push({
          service,
          proveedor,
          matchScore,
          reasons,
          compatibility,
        });
      }
    });

    // Convertir resultados de productos a SmartMatchResult
    productResults.forEach(({ product, proveedor }) => {

      const compatibility = {
        needs: calculateNeedsCompatibility(userNeeds.needs, product.features, product.specifications),
        budget: calculateBudgetCompatibility(userNeeds.budget, { minPrice: product.pricing.price, maxPrice: product.pricing.price }),
        location: calculateLocationCompatibility(userNeeds.location, product.availability.location || ''),
        industry: calculateIndustryCompatibility(userNeeds.industry, product.category),
        size: calculateSizeCompatibility(userNeeds.size, { minPrice: product.pricing.price, maxPrice: product.pricing.price }),
      };

      const weights = {
        needs: 0.3,
        budget: 0.25,
        location: 0.2,
        industry: 0.15,
        size: 0.1,
      };

      const matchScore = 
        compatibility.needs * weights.needs +
        compatibility.budget * weights.budget +
        compatibility.location * weights.location +
        compatibility.industry * weights.industry +
        compatibility.size * weights.size;
        
      console.log(`📊 Score para servicio: ${(matchScore * 100).toFixed(1)}%`);
      console.log(`   - Necesidades: ${(compatibility.needs * 100).toFixed(1)}%`);
      console.log(`   - Presupuesto: ${(compatibility.budget * 100).toFixed(1)}%`);
      console.log(`   - Ubicación: ${(compatibility.location * 100).toFixed(1)}%`);
      console.log(`   - Industria: ${(compatibility.industry * 100).toFixed(1)}%`);
      console.log(`   - Tamaño: ${(compatibility.size * 100).toFixed(1)}%`);

      if (matchScore > 0.1) { // Reducir umbral de 30% a 10%
        const reasons: string[] = [];
        
        if (compatibility.needs > 0.7) {
          reasons.push('Coincide con tus necesidades específicas');
        }
        if (compatibility.budget > 0.7) {
          reasons.push('Se ajusta a tu presupuesto');
        }
        if (compatibility.location > 0.7) {
          reasons.push('Ubicación conveniente');
        }
        if (compatibility.industry > 0.7) {
          reasons.push('Relevante para tu industria');
        }
        if (compatibility.size > 0.7) {
          reasons.push('Apropiado para el tamaño de tu empresa');
        }

        matches.push({
          service: product as any, // Convertir producto a servicio para compatibilidad
          product,
          proveedor,
          matchScore,
          reasons,
          compatibility,
        });
      }
    });

    // Ordenar por score de matching (mayor a menor)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`🎯 Encontrados ${matches.length} matches inteligentes`);
    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.service.name} - Score: ${(match.matchScore * 100).toFixed(1)}% - Razones: ${match.reasons.join(', ')}`);
    });

    return matches;
  } catch (error) {
    console.error('Error finding smart matches:', error);
    return [];
  }
};

/**
 * Obtiene recomendaciones personalizadas para el usuario
 */
export const getPersonalizedRecommendations = async (userId: string, limit: number = 10): Promise<SmartMatchResult[]> => {
  const matches = await findSmartMatches(userId);
  return matches.slice(0, limit);
};
