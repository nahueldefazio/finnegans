import { DashboardMetrics } from '../types';

export const getDashboardMetrics = async (userId: string): Promise<DashboardMetrics> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Datos simulados - en producción vendrían del backend
  return {
    totalMatches: 12,
    activeChats: 5,
    completedBusinesses: 8,
    totalRevenue: 45000,
    averageRating: 4.7,
    monthlyStats: [
      { month: 'Ene', matches: 2, businesses: 1, revenue: 5000 },
      { month: 'Feb', matches: 3, businesses: 2, revenue: 8000 },
      { month: 'Mar', matches: 4, businesses: 3, revenue: 12000 },
      { month: 'Abr', matches: 2, businesses: 1, revenue: 6000 },
      { month: 'May', matches: 5, businesses: 4, revenue: 15000 },
      { month: 'Jun', matches: 3, businesses: 2, revenue: 9000 },
    ],
  };
};

