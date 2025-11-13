import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceCategory } from '../types/firestore';

/**
 * 🏷️ SERVIÇO DE CATEGORIAS
 */
class CategoryService {
  
  /**
   * Buscar todas as categorias
   */
  async getAllCategories(): Promise<ServiceCategory[]> {
    try {
      const categoriesRef = collection(db, 'serviceCategories');
      const snapshot = await getDocs(categoriesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ServiceCategory));
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      return [];
    }
  }
  
  /**
   * Buscar categoria por ID
   */
  async getCategoryById(id: string): Promise<ServiceCategory | null> {
    try {
      const categoryDoc = await getDoc(doc(db, 'serviceCategories', id));
      
      if (categoryDoc.exists()) {
        return {
          id: categoryDoc.id,
          ...categoryDoc.data()
        } as ServiceCategory;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar categoria:', error);
      return null;
    }
  }
  
  /**
   * Buscar categoria por slug
   */
  async getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
    try {
      const categoriesRef = collection(db, 'serviceCategories');
      const q = query(categoriesRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as ServiceCategory;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar categoria por slug:', error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();
