export interface Review {
  id?: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: Date;
  helpful: number;
}

export interface PortfolioItem {
  id?: string;
  professionalId: string;
  title: string;
  description: string;
  images: string[];
  links?: string[];
  category: string;
  completedAt: Date;
  createdAt: Date;
}

export interface Certification {
  id?: string;
  professionalId: string;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description: string;
  imageUrl?: string;
  verified: boolean;
  createdAt: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewReply {
  id?: string;
  reviewId: string;
  professionalId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: Date;
}
