import { PyMEProfile, ProveedorProfile, Match } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';

export const calculateMatchScore = (pyme: PyMEProfile, proveedor: ProveedorProfile): number => {
  let score = 0;
  let factors = 0;

  // Coincidencia de necesidades con servicios (40% del score)
  const needsMatch = pyme.needs.filter(need => 
    proveedor.services.some(service => 
      service.toLowerCase().includes(need.toLowerCase()) || 
      need.toLowerCase().includes(service.toLowerCase())
    )
  ).length;
  
  if (pyme.needs.length > 0) {
    score += (needsMatch / pyme.needs.length) * 40;
    factors++;
  }

  // Coincidencia de presupuesto (25% del score)
  const pymeBudgetAvg = (pyme.budget.min + pyme.budget.max) / 2;
  const proveedorPriceAvg = proveedor.pricing.reduce((sum, price) => 
    sum + (price.minPrice + price.maxPrice) / 2, 0
  ) / proveedor.pricing.length;

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
  } else if (pyme.location.toLowerCase().includes(proveedor.location.toLowerCase()) ||
             proveedor.location.toLowerCase().includes(pyme.location.toLowerCase())) {
    score += 5;
  }
  factors++;

  // Número de reviews (5% del score)
  if (proveedor.totalReviews >= 20) {
    score += 5;
  } else if (proveedor.totalReviews >= 10) {
    score += 3;
  } else if (proveedor.totalReviews >= 5) {
    score += 1;
  }
  factors++;

  return Math.round(score);
};

export const generateMatchReasons = (pyme: PyMEProfile, proveedor: ProveedorProfile): string[] => {
  const reasons: string[] = [];

  // Coincidencias de servicios
  const matchingServices = pyme.needs.filter(need => 
    proveedor.services.some(service => 
      service.toLowerCase().includes(need.toLowerCase()) || 
      need.toLowerCase().includes(service.toLowerCase())
    )
  );

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
  const proveedorPriceAvg = proveedor.pricing.reduce((sum, price) => 
    sum + (price.minPrice + price.maxPrice) / 2, 0
  ) / proveedor.pricing.length;

  if (pymeBudgetAvg >= proveedorPriceAvg * 0.8 && pymeBudgetAvg <= proveedorPriceAvg * 1.5) {
    reasons.push('Precios dentro de tu rango de presupuesto');
  }

  return reasons;
};

export const findMatches = async (pyme: PyMEProfile): Promise<Match[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));

  const proveedores = dataPersistenceService.proveedorProfiles.getAllProfiles();
  const matches: Match[] = proveedores.map(proveedor => {
    const score = calculateMatchScore(pyme, proveedor);
    const reasons = generateMatchReasons(pyme, proveedor);

    return {
      id: `match-${pyme.id}-${proveedor.id}`,
      pymeId: pyme.id,
      proveedorId: proveedor.id,
      score,
      reasons,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  });

  // Filtrar solo matches con score > 30 y ordenar por score
  return matches
    .filter(match => match.score > 30)
    .sort((a, b) => b.score - a.score);
};

export const getProveedorById = (id: string): ProveedorProfile | undefined => {
  return dataPersistenceService.proveedorProfiles.getProfileById(id) || undefined;
};

export const getAllProveedores = (): ProveedorProfile[] => {
  return dataPersistenceService.proveedorProfiles.getAllProfiles();
};

