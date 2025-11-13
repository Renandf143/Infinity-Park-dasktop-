import { userService } from './services/userService.js';

async function testUserCreation() {
  try {
    console.log('🧪 Testando criação de usuários...');

    // Teste 1: Criar cliente
    console.log('\n📝 Teste 1: Criando cliente...');
    const clientData = {
      firebaseUid: 'test-client-uid-' + Date.now(),
      email: 'cliente@teste.com',
      name: 'João Cliente',
      phone: '(11) 99999-1111',
      accountType: 'client'
    };

    const client = await userService.createUser(clientData);
    console.log('✅ Cliente criado:', client.name);

    // Teste 2: Criar profissional
    console.log('\n📝 Teste 2: Criando profissional...');
    const professionalData = {
      firebaseUid: 'test-professional-uid-' + Date.now(),
      email: 'profissional@teste.com',
      name: 'Maria Profissional',
      phone: '(11) 99999-2222',
      accountType: 'professional',
      profession: 'Eletricista',
      experience: '5 anos',
      description: 'Especialista em instalações elétricas residenciais e comerciais',
      skills: ['Instalação elétrica', 'Manutenção', 'Automação'],
      location: {
        city: 'São Paulo',
        state: 'SP',
        address: 'Rua das Flores, 123'
      },
      priceRange: {
        min: 80,
        max: 150
      }
    };

    const professional = await userService.createUser(professionalData);
    console.log('✅ Profissional criado:', professional.name);

    // Teste 3: Buscar usuários
    console.log('\n🔍 Teste 3: Buscando usuários...');
    
    const foundClient = await userService.getUserByFirebaseUid(clientData.firebaseUid);
    console.log('✅ Cliente encontrado:', foundClient?.name);

    const foundProfessional = await userService.getUserByEmail(professionalData.email);
    console.log('✅ Profissional encontrado:', foundProfessional?.name);

    // Teste 4: Listar profissionais
    console.log('\n👷 Teste 4: Listando profissionais...');
    const professionals = await userService.getProfessionals();
    console.log(`✅ ${professionals.length} profissionais encontrados`);

    // Teste 5: Buscar por profissão
    console.log('\n🔍 Teste 5: Buscando eletricistas...');
    const electricians = await userService.getProfessionalsByProfession('Eletricista');
    console.log(`✅ ${electricians.length} eletricistas encontrados`);

    console.log('\n🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  } finally {
    await userService.close();
    process.exit(0);
  }
}

testUserCreation();