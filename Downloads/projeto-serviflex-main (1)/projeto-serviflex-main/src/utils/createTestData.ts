/**
 * Script para criar dados de teste no Firestore
 * Execute no console do navegador: createTestData()
 */

import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function createTestData(professionalId: string) {
  console.log('🔧 Criando dados de teste...');
  
  try {
    const now = new Date();
    
    // Criar 10 serviços concluídos no mês atual
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 25); // 0-25 dias atrás
      const completedDate = new Date(now);
      completedDate.setDate(now.getDate() - daysAgo);
      
      const serviceValue = 100 + Math.floor(Math.random() * 400); // R$ 100-500
      const tip = Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0; // 30% chance de gorjeta
      
      await addDoc(collection(db, 'serviceRequests'), {
        professionalId,
        clientId: `client_${i}`,
        clientName: `Cliente ${i + 1}`,
        clientEmail: `cliente${i + 1}@email.com`,
        clientPhone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        serviceType: ['Limpeza Residencial', 'Manutenção Elétrica', 'Encanamento', 'Jardinagem'][Math.floor(Math.random() * 4)],
        date: completedDate.toISOString().split('T')[0],
        time: `${8 + Math.floor(Math.random() * 10)}:00`,
        address: `Rua Teste, ${100 + i}`,
        city: 'São Paulo',
        state: 'SP',
        estimatedValue: serviceValue,
        status: 'completed',
        description: 'Serviço de teste',
        completedAt: Timestamp.fromDate(completedDate),
        tip: tip,
        createdAt: serverTimestamp()
      });
      
      console.log(`✅ Serviço ${i + 1}/10 criado - R$ ${serviceValue} (Gorjeta: R$ ${tip})`);
    }
    
    // Criar 3 serviços aceitos (futuros)
    for (let i = 0; i < 3; i++) {
      const daysAhead = i + 1; // 1, 2, 3 dias à frente
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + daysAhead);
      
      const serviceValue = 150 + Math.floor(Math.random() * 350);
      
      await addDoc(collection(db, 'serviceRequests'), {
        professionalId,
        clientId: `client_future_${i}`,
        clientName: `Cliente Futuro ${i + 1}`,
        clientEmail: `clientefuturo${i + 1}@email.com`,
        clientPhone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        serviceType: ['Limpeza Residencial', 'Manutenção Elétrica', 'Encanamento'][i],
        date: futureDate.toISOString().split('T')[0],
        time: `${10 + i * 2}:00`,
        address: `Rua Futura, ${200 + i}`,
        city: 'São Paulo',
        state: 'SP',
        estimatedValue: serviceValue,
        status: 'accepted',
        description: 'Serviço agendado',
        createdAt: serverTimestamp()
      });
      
      console.log(`✅ Serviço futuro ${i + 1}/3 criado - R$ ${serviceValue}`);
    }
    
    console.log('🎉 Dados de teste criados com sucesso!');
    console.log('🔄 Recarregue a página para ver os dados');
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  }
}

// Disponibilizar no console
if (typeof window !== 'undefined') {
  (window as any).createTestData = createTestData;
  console.log('💡 Para criar dados de teste, execute no console:');
  console.log('createTestData("SEU_USER_ID")');
}
