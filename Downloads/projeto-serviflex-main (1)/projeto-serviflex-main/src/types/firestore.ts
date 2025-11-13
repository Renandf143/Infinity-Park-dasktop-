/**
 * 🗄️ TIPOS DO FIRESTORE
 * Baseado no esquema do Data Connect
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: 'client' | 'professional';
  createdAt: string;
  photoUrl?: string;
  phoneNumber?: string;
  address?: string;
  emailVerified: boolean;
  isActive: boolean;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slug: string;
}

export interface ServiceProviderProfile {
  userId: string;
  user: User;
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: string;
  portfolioLink?: string;
  yearsOfExperience: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  profession: string;
  category: string;
  categorySlug: string;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  stats?: {
    totalJobs: number;
    completedJobs: number;
    totalEarnings: number;
    responseTime: number;
  };
  createdAt: string;
  updatedAt: string;
  // Campos do usuário para acesso direto
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  // Documentos de verificação
  documents?: {
    cpf: string;
    documentType: 'rg' | 'cnh';
    documentNumber: string;
    documentIssuer: string;
    documentIssueDate: string;
    documentFrontUrl?: string;
    documentBackUrl?: string;
    selfieUrl?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationDate?: string;
    rejectionReason?: string;
  };
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  client: User;
  serviceCategoryId: string;
  serviceCategory: ServiceCategory;
  title: string;
  description: string;
  location: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  requiredSkills: string[];
  preferredDate?: string;
  proposals: number; // Contador de propostas
}

export interface ServiceContract {
  id: string;
  clientId: string;
  client: User;
  serviceProviderId: string;
  serviceProvider: User;
  serviceRequestId: string;
  serviceRequest: ServiceRequest;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  agreedPrice: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  completedAt?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  serviceContractId: string;
  serviceContract: ServiceContract;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  reviewType: 'client_to_provider' | 'provider_to_client';
  helpful: number; // Contador de "útil"
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Message {
  id: string;
  contractId: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  message: string;
  createdAt: string;
  read: boolean;
  attachments?: string[];
}
