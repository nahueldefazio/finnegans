import { Business, Review } from '../types/index';
import { dataPersistenceService } from './dataPersistenceService';

export const createBusiness = async (
  chatId: string,
  pymeId: string,
  proveedorId: string,
  quotationId: string,
  totalAmount: number,
  currency: string
): Promise<Business> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return dataPersistenceService.businesses.createBusiness({
    chatId,
    pymeId,
    proveedorId,
    quotationId,
    status: 'pending',
    totalAmount,
    currency,
    startDate: new Date().toISOString(),
  });
};

export const getBusinessesByUserId = async (userId: string): Promise<Business[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return dataPersistenceService.businesses.getBusinessesByUserId(userId);
};

export const updateBusinessStatus = async (
  businessId: string,
  status: Business['status'],
  endDate?: string
): Promise<void> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const updates: Partial<Business> = { status };
  if (endDate) {
    updates.endDate = endDate;
  }
  
  dataPersistenceService.businesses.updateBusiness(businessId, updates);
};

export const createReview = async (
  fromUserId: string,
  toUserId: string,
  businessId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return dataPersistenceService.reviews.createReview({
    fromUserId,
    toUserId,
    businessId,
    rating,
    comment,
  });
};

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return dataPersistenceService.reviews.getReviewsByUserId(userId);
};

export const getBusinessById = (businessId: string): Business | undefined => {
  return dataPersistenceService.businesses.getBusinessById(businessId) || undefined;
};

