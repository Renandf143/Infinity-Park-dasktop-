import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { STAR_LEVELS, ACHIEVEMENTS_LIST, GamificationStats, Achievement } from '../types/gamification';

export const gamificationService = {
  // Calcular nível de estrelas baseado em avaliação média e número de reviews
  calculateStarLevel(averageRating: number, totalReviews: number) {
    // Encontrar o nível apropriado
    for (let i = STAR_LEVELS.length - 1; i >= 0; i--) {
      const level = STAR_LEVELS[i];
      if (
        averageRating >= level.minRating &&
        averageRating <= level.maxRating &&
        totalReviews >= level.minReviews
      ) {
        return level;
      }
    }
    return STAR_LEVELS[0]; // Retorna 1 estrela por padrão
  },

  // Obter próximo nível
  getNextStarLevel(currentStars: number) {
    return STAR_LEVELS.find(level => level.stars === currentStars + 1) || null;
  },

  // Calcular progresso para próximo nível
  calculateProgress(averageRating: number, totalReviews: number, currentLevel: any, nextLevel: any) {
    if (!nextLevel) return 100;
    
    // Progresso baseado em avaliação
    const ratingProgress = ((averageRating - currentLevel.minRating) / (nextLevel.minRating - currentLevel.minRating)) * 50;
    
    // Progresso baseado em número de reviews
    const reviewsProgress = (totalReviews / nextLevel.minReviews) * 50;
    
    return Math.min(100, ratingProgress + reviewsProgress);
  },

  // Buscar estatísticas de gamificação do profissional
  async getGamificationStats(userId: string): Promise<GamificationStats> {
    try {
      // Buscar dados do profissional
      const providerDoc = await getDoc(doc(db, 'serviceProviders', userId));
      
      if (!providerDoc.exists()) {
        const currentLevel = STAR_LEVELS[0];
        return {
          currentStars: 1,
          averageRating: 0,
          totalReviews: 0,
          currentLevel,
          nextLevel: this.getNextStarLevel(1),
          progressToNextLevel: 0,
          achievements: ACHIEVEMENTS_LIST.map(a => ({ ...a, unlocked: false })),
          ranking: 0,
          totalProfessionals: 0,
          needsQualification: true,
          qualificationCourses: []
        };
      }

      const providerData = providerDoc.data();
      const averageRating = providerData.rating || 0;
      const totalReviews = providerData.reviewCount || 0;
      
      const currentLevel = this.calculateStarLevel(averageRating, totalReviews);
      const nextLevel = this.getNextStarLevel(currentLevel.stars);
      const progressToNextLevel = this.calculateProgress(averageRating, totalReviews, currentLevel, nextLevel);

      // Verificar se precisa de qualificação (menos de 3 estrelas com mais de 5 avaliações)
      const needsQualification = currentLevel.stars < 3 && totalReviews >= 5;

      // Buscar conquistas
      const gamificationDoc = await getDoc(doc(db, 'gamification', userId));
      const achievements = gamificationDoc.exists() 
        ? gamificationDoc.data().achievements 
        : ACHIEVEMENTS_LIST.map(a => ({ ...a, unlocked: false }));

      // Calcular ranking baseado em estrelas e avaliações
      const allProfessionalsQuery = query(
        collection(db, 'serviceProviders'),
        orderBy('rating', 'desc')
      );
      const allProfessionals = await getDocs(allProfessionalsQuery);
      const ranking = allProfessionals.docs.findIndex(d => d.id === userId) + 1;

      return {
        currentStars: currentLevel.stars,
        averageRating,
        totalReviews,
        currentLevel,
        nextLevel,
        progressToNextLevel,
        achievements: achievements || [],
        ranking,
        totalProfessionals: allProfessionals.size,
        needsQualification,
        qualificationCourses: providerData.qualificationCourses || []
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de gamificação:', error);
      throw error;
    }
  },

  // Adicionar pontos
  async addPoints(userId: string, points: number, reason: string) {
    try {
      const gamificationRef = doc(db, 'gamification', userId);
      const gamificationDoc = await getDoc(gamificationRef);

      if (!gamificationDoc.exists()) {
        await setDoc(gamificationRef, {
          userId,
          totalPoints: points,
          achievements: ACHIEVEMENTS_LIST.map(a => ({ ...a, unlocked: false })),
          createdAt: new Date()
        });
      } else {
        const currentPoints = gamificationDoc.data().totalPoints || 0;
        await updateDoc(gamificationRef, {
          totalPoints: currentPoints + points,
          lastPointsAdded: {
            amount: points,
            reason,
            timestamp: new Date()
          }
        });
      }

      // Verificar conquistas
      await this.checkAchievements(userId);
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  },

  // Verificar e desbloquear conquistas
  async checkAchievements(userId: string) {
    try {
      const providerDoc = await getDoc(doc(db, 'serviceProviders', userId));
      if (!providerDoc.exists()) return;

      const providerData = providerDoc.data();
      const stats = providerData.stats || {};
      
      const gamificationRef = doc(db, 'gamification', userId);
      const gamificationDoc = await getDoc(gamificationRef);
      if (!gamificationDoc.exists()) return;

      const achievements = gamificationDoc.data().achievements || [];
      let pointsToAdd = 0;
      let newAchievements = [...achievements];

      // Verificar cada conquista
      ACHIEVEMENTS_LIST.forEach((achievement, index) => {
        const currentAchievement = achievements[index];
        if (currentAchievement?.unlocked) return;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_job':
            shouldUnlock = stats.totalJobs >= 1;
            break;
          case 'five_jobs':
            shouldUnlock = stats.totalJobs >= 5;
            break;
          case 'ten_jobs':
            shouldUnlock = stats.totalJobs >= 10;
            break;
          case 'perfect_rating':
            shouldUnlock = providerData.rating === 5.0 && providerData.reviewCount >= 10;
            break;
          case 'big_earner':
            shouldUnlock = stats.totalEarnings >= 5000;
            break;
          default:
            break;
        }

        if (shouldUnlock) {
          newAchievements[index] = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          pointsToAdd += achievement.points;
        }
      });

      if (pointsToAdd > 0) {
        const currentPoints = gamificationDoc.data().totalPoints || 0;
        await updateDoc(gamificationRef, {
          achievements: newAchievements,
          totalPoints: currentPoints + pointsToAdd
        });
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  },

  // Buscar ranking
  async getLeaderboard(limitCount: number = 10) {
    try {
      const leaderboardQuery = query(
        collection(db, 'serviceProviders'),
        orderBy('rating', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(leaderboardQuery);
      const leaderboard = await Promise.all(
        snapshot.docs.map(async (docSnap, index) => {
          const data = docSnap.data();
          const userDoc = await getDoc(doc(db, 'users', docSnap.id));
          const userData = userDoc.data();

          const averageRating = data.rating || 0;
          const totalReviews = data.reviewCount || 0;
          const level = this.calculateStarLevel(averageRating, totalReviews);

          return {
            rank: index + 1,
            userId: docSnap.id,
            displayName: userData?.displayName || 'Profissional',
            photoUrl: userData?.photoUrl,
            averageRating,
            totalReviews,
            stars: level.stars,
            level
          };
        })
      );

      return leaderboard;
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      throw error;
    }
  }
};
