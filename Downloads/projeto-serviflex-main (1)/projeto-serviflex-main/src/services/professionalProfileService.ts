import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import { Review, PortfolioItem, Certification, ReviewStats, ReviewReply } from '../types/professional';
import { error } from 'console';

export const professionalProfileService = {
  // Reviews
  async getReviews(professionalId: string): Promise<Review[]> {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('professionalId', '==', professionalId)
      );

      const snapshot = await getDocs(reviewsQuery);
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Review[];

      // Ordenar manualmente por data
      return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  },

  async getReviewStats(professionalId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.getReviews(professionalId);
      
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;

      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        totalRating += review.rating;
      });

      return {
        averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
        totalReviews: reviews.length,
        ratingDistribution
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  },

  // Portfolio
  async getPortfolio(professionalId: string): Promise<PortfolioItem[]> {
    try {
      const portfolioQuery = query(
        collection(db, 'portfolio'),
        where('professionalId', '==', professionalId)
      );

      const snapshot = await getDocs(portfolioQuery);
      const portfolio = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as PortfolioItem[];

      // Ordenar manualmente por data de conclusão
      return portfolio.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    } catch (error) {
      console.error('Erro ao buscar portfólio:', error);
      throw error;
    }
  },

  async addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'portfolio'), {
        ...item,
        completedAt: Timestamp.fromDate(item.completedAt),
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar item ao portfólio:', error);
      throw error;
    }
  },

  async updatePortfolioItem(itemId: string, data: Partial<PortfolioItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'portfolio', itemId), data);
    } catch (error) {
      console.error('Erro ao atualizar item do portfólio:', error);
      throw error;
    }
  },

  async deletePortfolioItem(itemId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'portfolio', itemId));
    } catch (error) {
      console.error('Erro ao deletar item do portfólio:', error);
      throw error;
    }
  },

  // Certifications
  async getCertifications(professionalId: string): Promise<Certification[]> {
    try {
      const certificationsQuery = query(
        collection(db, 'certifications'),
        where('professionalId', '==', professionalId)
      );

      const snapshot = await getDocs(certificationsQuery);
      const certifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issueDate: doc.data().issueDate?.toDate(),
        expiryDate: doc.data().expiryDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Certification[];

      // Ordenar manualmente por data de emissão
      return certifications.sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
    } catch (error) {
      console.error('Erro ao buscar certificações:', error);
      throw error;
    }
  },

  async addCertification(cert: Omit<Certification, 'id' | 'createdAt' | 'verified'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'certifications'), {
        ...cert,
        issueDate: Timestamp.fromDate(cert.issueDate),
        expiryDate: cert.expiryDate ? Timestamp.fromDate(cert.expiryDate) : null,
        verified: false,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar certificação:', error);
      throw error;
    }
  },

  async updateCertification(certId: string, data: Partial<Certification>): Promise<void> {
    try {
      await updateDoc(doc(db, 'certifications', certId), data);
    } catch (error) {
      console.error('Erro ao atualizar certificação:', error);
      throw error;
    }
  },

  async deleteCertification(certId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'certifications', certId));
    } catch (error) {
      console.error('Erro ao deletar certificação:', error);
      throw error;
    }
  },

  // Review Replies
  async getReviewReplies(reviewId: string): Promise<ReviewReply[]> {
    try {
      const repliesQuery = query(
        collection(db, 'reviewReplies'),
        where('reviewId', '==', reviewId),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(repliesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as ReviewReply[];
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      throw error;
    }
  },

  async getAllReviewReplies(professionalId: string): Promise<Map<string, ReviewReply[]>> {
    try {
      // Tentar buscar com ordenação
      let repliesQuery = query(
        collection(db, 'reviewReplies'),
        where('professionalId', '==', professionalId),
        orderBy('createdAt', 'asc')
      );

      let snapshot;
      
      try {
        snapshot = await getDocs(repliesQuery);
      } catch (indexError: any) {
        // Se falhar por falta de índice, buscar sem ordenação
        if (indexError?.code === 'failed-precondition' || indexError?.message?.includes('index')) {
          console.warn('⚠️ Índice não encontrado, buscando sem ordenação...');
          repliesQuery = query(
            collection(db, 'reviewReplies'),
            where('professionalId', '==', professionalId)
          );
          snapshot = await getDocs(repliesQuery);
        } else {
          throw indexError;
        }
      }

      const repliesMap = new Map<string, ReviewReply[]>();

      snapshot.docs.forEach(doc => {
        const reply = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        } as ReviewReply;

        const reviewId = reply.reviewId;
        if (!repliesMap.has(reviewId)) {
          repliesMap.set(reviewId, []);
        }
        repliesMap.get(reviewId)?.push(reply);
      });

      // Ordenar manualmente por data
      repliesMap.forEach((replies) => {
        replies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      });

      return repliesMap;
    } catch (error: unknown) {
      // Se ainda houver erro, retornar mapa vazio ao invés de quebrar
      console.error('Erro ao buscar respostas:', error);
      console.warn('⚠️ Para resolver, execute: firebase deploy --only firestore:indexes');
      return new Map<string, ReviewReply[]>();
    }
  }
};
