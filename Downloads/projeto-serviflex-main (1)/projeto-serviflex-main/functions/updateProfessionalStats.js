// Cloud Function para atualizar estatísticas do profissional quando uma review é adicionada
// Deploy: firebase deploy --only functions:updateProfessionalStatsOnReview

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializar apenas se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.updateProfessionalStatsOnReview = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const professionalId = review.professionalId;

    try {
      // Buscar todas as reviews do profissional
      const reviewsSnapshot = await db
        .collection('reviews')
        .where('professionalId', '==', professionalId)
        .get();

      // Calcular média de avaliações
      let totalRating = 0;
      let reviewCount = 0;

      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          reviewCount++;
        }
      });

      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      // Atualizar perfil do profissional
      await db.collection('serviceProviders').doc(professionalId).update({
        rating: averageRating,
        reviewCount: reviewCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Perfil atualizado: ${professionalId} - Rating: ${averageRating.toFixed(2)} (${reviewCount} reviews)`);

      return null;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
      return null;
    }
  });

// Função para recalcular estatísticas de todos os profissionais
exports.recalculateAllProfessionalStats = functions.https.onRequest(async (req, res) => {
  try {
    const professionalsSnapshot = await db.collection('serviceProviders').get();
    let updated = 0;

    for (const profDoc of professionalsSnapshot.docs) {
      const professionalId = profDoc.id;

      // Buscar reviews do profissional
      const reviewsSnapshot = await db
        .collection('reviews')
        .where('professionalId', '==', professionalId)
        .get();

      let totalRating = 0;
      let reviewCount = 0;

      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          reviewCount++;
        }
      });

      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      // Atualizar perfil
      await db.collection('serviceProviders').doc(professionalId).update({
        rating: averageRating,
        reviewCount: reviewCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      updated++;
    }

    res.json({
      success: true,
      message: `${updated} profissionais atualizados`,
      updated: updated,
      total: professionalsSnapshot.size,
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
