export interface User {
  id: string;
  email: string;
  name: string;
  type: 'pyme' | 'proveedor';
  createdAt: string;
  updatedAt: string;
}

export interface PyMEProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  size: 'micro' | 'pequeña' | 'mediana';
  location: string;
  needs: string[];
  serviceTypes: string[]; // Tipos de servicios que la PyME necesita
  budget: {
    min: number;
    max: number;
  };
  description: string;
  contactInfo: {
    phone: string;
    address: string;
  };
}

export interface ProveedorProfile {
  id: string;
  userId: string;
  companyName: string;
  services: string[];
  capabilities: string[];
  pricing: {
    service: string;
    minPrice: number;
    maxPrice: number;
    unit: string;
  }[];
  location: string;
  description: string;
  contactInfo: {
    phone: string;
    address: string;
  };
  rating: number;
  totalReviews: number;
}

export interface Match {
  id: string;
  pymeId: string;
  proveedorId: string;
  score: number;
  reasons: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'quotation' | 'file';
  quotation?: Quotation;
  timestamp: string;
}

export interface Quotation {
  id: string;
  service: string;
  description: string;
  price: number;
  currency: string;
  validUntil: string;
  terms: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Chat {
  id: string;
  pymeId: string;
  proveedorId: string;
  matchId: string;
  lastMessage?: ChatMessage;
  status?: 'active' | 'closed' | 'deleted';
  closedAt?: string;
  closeReason?: string;
  closeComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  businessId: string;
  createdAt: string;
}

export interface Business {
  id: string;
  chatId: string;
  pymeId: string;
  proveedorId: string;
  quotationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalMatches: number;
  activeChats: number;
  completedBusinesses: number;
  totalRevenue: number;
  averageRating: number;
  monthlyStats: {
    month: string;
    matches: number;
    businesses: number;
    revenue: number;
  }[];
}

