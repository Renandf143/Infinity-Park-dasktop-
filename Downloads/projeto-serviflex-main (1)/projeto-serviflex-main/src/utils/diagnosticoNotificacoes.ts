import { collection, getDocs, addDoc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Script de diagnóstico completo do sistema de notificações
 */

export async function diagnosticoCompleto(userId: string) {
  console.log('🔍 ========================================');
  console.log('🔍 DIAGNÓSTICO DO SISTEMA DE NOTIFICAÇÕES');
  console.log('🔍 ========================================');
  console.log('');
  console.log('👤 User ID:', userId);
  console.log('');

  try {
    // 1. Verificar se a coleção existe
    console.log('1️⃣ Verificando coleção "notifications"...');
    const notificationsRef = collection(db, 'notifications');
    const allSnapshot = await getDocs(notificationsRef);
    console.log(`   ✅ Coleção existe com ${allSnapshot.size} documento(s) total`);
    console.log('');

    // 2. Verificar notificações do usuário
    console.log('2️⃣ Verificando notificações do usuário...');
    const userQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const userSnapshot = await getDocs(userQuery);
    console.log(`   📊 Encontradas ${userSnapshot.size} notificação(ões) para este usuário`);
    
    if (userSnapshot.size > 0) {
      console.log('   📝 Detalhes das notificações:');
      userSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.title}`);
        console.log(`      - Lida: ${data.read ? 'Sim' : 'Não'}`);
        console.log(`      - Tipo: ${data.type}`);
        console.log(`      - Criada: ${data.createdAt?.toDate?.() || 'N/A'}`);
      });
    }
    console.log('');

    // 3. Tentar criar uma notificação de teste
    console.log('3️⃣ Criando notificação de teste...');
    const testNotification = {
      userId: userId,
      title: '🧪 Teste de Diagnóstico',
      message: `Notificação criada em ${new Date().toLocaleString('pt-BR')}`,
      type: 'system',
      read: false,
      createdAt: Timestamp.now(),
      data: {
        diagnostic: true,
        timestamp: new Date().toISOString()
      }
    };

    const docRef = await addDoc(collection(db, 'notifications'), testNotification);
    console.log('   ✅ Notificação de teste criada com sucesso!');
    console.log('   📝 ID:', docRef.id);
    console.log('');

    // 4. Verificar novamente
    console.log('4️⃣ Verificando após criação...');
    const newSnapshot = await getDocs(userQuery);
    console.log(`   📊 Total agora: ${newSnapshot.size} notificação(ões)`);
    console.log('');

    // 5. Resultado final
    console.log('✅ ========================================');
    console.log('✅ DIAGNÓSTICO CONCLUÍDO');
    console.log('✅ ========================================');
    console.log('');
    console.log('📋 RESUMO:');
    console.log(`   - Coleção existe: ✅`);
    console.log(`   - Notificações do usuário: ${newSnapshot.size}`);
    console.log(`   - Notificação de teste criada: ✅`);
    console.log('');
    console.log('💡 PRÓXIMOS PASSOS:');
    console.log('   1. Verifique o sino 🔔 no header');
    console.log('   2. Se não aparecer, verifique o console para erros');
    console.log('   3. Certifique-se que o índice foi criado no Firebase');
    console.log('');

    return {
      success: true,
      totalNotifications: allSnapshot.size,
      userNotifications: newSnapshot.size,
      testNotificationId: docRef.id
    };

  } catch (error: any) {
    console.error('❌ ========================================');
    console.error('❌ ERRO NO DIAGNÓSTICO');
    console.error('❌ ========================================');
    console.error('');
    console.error('Erro:', error.message);
    console.error('Código:', error.code);
    console.error('');

    if (error.code === 'failed-precondition') {
      console.error('🚨 PROBLEMA: Índice não criado!');
      console.error('');
      console.error('📝 SOLUÇÃO:');
      console.error('   1. Acesse: https://console.firebase.google.com/project/serviflex-f5ba3/firestore/indexes');
      console.error('   2. Clique em "Create Index"');
      console.error('   3. Collection: notifications');
      console.error('   4. Campos:');
      console.error('      - userId (Ascending)');
      console.error('      - createdAt (Descending)');
      console.error('   5. Aguarde 2-5 minutos para construção');
      console.error('');
    }

    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
  (window as any).diagnosticoNotificacoes = diagnosticoCompleto;
  
  console.log('');
  console.log('🧪 ========================================');
  console.log('🧪 FERRAMENTA DE DIAGNÓSTICO CARREGADA');
  console.log('🧪 ========================================');
  console.log('');
  console.log('Para usar, digite no console:');
  console.log('  diagnosticoNotificacoes("SEU_USER_ID")');
  console.log('');
  console.log('Exemplo:');
  console.log('  diagnosticoNotificacoes("abc123xyz")');
  console.log('');
}
