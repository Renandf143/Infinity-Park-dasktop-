import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Script para inicializar e testar o sistema de notificações
 */

export async function initNotifications() {
  console.log('🔧 Inicializando sistema de notificações...');
  
  try {
    // Verificar se a coleção existe
    const notificationsRef = collection(db, 'notifications');
    const snapshot = await getDocs(notificationsRef);
    
    console.log(`📊 Coleção 'notifications' encontrada com ${snapshot.size} documentos`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar coleção:', error);
    return false;
  }
}

export async function createTestNotification(userId: string) {
  console.log('🧪 Criando notificação de teste para:', userId);
  
  try {
    const notificationData = {
      userId: userId,
      title: '🎉 Sistema de Notificações Ativo!',
      message: 'Parabéns! O sistema de notificações está funcionando corretamente.',
      type: 'system',
      read: false,
      createdAt: Timestamp.now(),
      data: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    
    console.log('✅ Notificação criada com sucesso! ID:', docRef.id);
    console.log('📝 Dados:', notificationData);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error);
    throw error;
  }
}

export async function checkUserNotifications(userId: string) {
  console.log('🔍 Verificando notificações do usuário:', userId);
  
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    console.log(`📊 Encontradas ${snapshot.size} notificações`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📬 Notificação:', {
        id: doc.id,
        title: data.title,
        message: data.message,
        read: data.read,
        createdAt: data.createdAt?.toDate()
      });
    });
    
    return snapshot.size;
  } catch (error) {
    console.error('❌ Erro ao verificar notificações:', error);
    throw error;
  }
}

export async function testNotificationSystem(userId: string) {
  console.log('🚀 Iniciando teste completo do sistema de notificações...');
  console.log('👤 User ID:', userId);
  
  try {
    // 1. Verificar coleção
    console.log('\n1️⃣ Verificando coleção...');
    await initNotifications();
    
    // 2. Verificar notificações existentes
    console.log('\n2️⃣ Verificando notificações existentes...');
    const existingCount = await checkUserNotifications(userId);
    
    // 3. Criar notificação de teste
    console.log('\n3️⃣ Criando notificação de teste...');
    const notificationId = await createTestNotification(userId);
    
    // 4. Verificar novamente
    console.log('\n4️⃣ Verificando após criação...');
    await checkUserNotifications(userId);
    
    console.log('\n✅ Teste completo! Verifique o sino de notificações no header.');
    console.log('💡 Dica: Recarregue a página se não aparecer imediatamente.');
    
    return {
      success: true,
      notificationId,
      existingCount
    };
  } catch (error) {
    console.error('\n❌ Erro no teste:', error);
    return {
      success: false,
      error
    };
  }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
  (window as any).initNotifications = initNotifications;
  (window as any).createTestNotification = createTestNotification;
  (window as any).checkUserNotifications = checkUserNotifications;
  (window as any).testNotificationSystem = testNotificationSystem;
}
