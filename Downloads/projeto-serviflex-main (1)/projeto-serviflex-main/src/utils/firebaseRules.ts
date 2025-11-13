/**
 * 🔒 REGRAS DE SEGURANÇA DO FIRESTORE
 * 
 * Este arquivo documenta as regras que devem ser aplicadas no Firebase Console
 * Copie e cole no Firebase Console > Firestore Database > Rules
 */

export const FIRESTORE_SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar: verificar se usuário está autenticado
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Função auxiliar: verificar se é o próprio usuário
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Função auxiliar: validar email
    function isValidEmail(email) {
      return email.matches('^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$');
    }
    
    // Função auxiliar: validar tamanho de string
    function isValidStringLength(str, min, max) {
      return str.size() >= min && str.size() <= max;
    }
    
    // 🔒 USUÁRIOS
    match /users/{userId} {
      // Ler: apenas o próprio usuário
      allow read: if isOwner(userId);
      
      // Criar: apenas o próprio usuário
      allow create: if isOwner(userId) 
        && isValidEmail(request.resource.data.email)
        && isValidStringLength(request.resource.data.displayName, 3, 100);
      
      // Atualizar: apenas o próprio usuário
      allow update: if isOwner(userId)
        && request.resource.data.email == resource.data.email; // Email não pode mudar
      
      // Deletar: apenas o próprio usuário
      allow delete: if isOwner(userId);
    }
    
    // 🔒 PROFISSIONAIS
    match /serviceProviders/{providerId} {
      // Ler: todos podem ver perfis públicos
      allow read: if true;
      
      // Criar: apenas o próprio usuário
      allow create: if isOwner(providerId)
        && isValidStringLength(request.resource.data.displayName, 3, 100)
        && isValidStringLength(request.resource.data.profession, 3, 100);
      
      // Atualizar: apenas o próprio profissional
      allow update: if isOwner(providerId)
        && request.resource.data.userId == resource.data.userId; // userId não pode mudar
      
      // Deletar: apenas o próprio profissional
      allow delete: if isOwner(providerId);
    }
    
    // 🔒 AVALIAÇÕES
    match /reviews/{reviewId} {
      // Ler: todos podem ver
      allow read: if true;
      
      // Criar: apenas usuários autenticados
      allow create: if isSignedIn()
        && request.resource.data.clientId == request.auth.uid
        && request.resource.data.rating >= 1 
        && request.resource.data.rating <= 5
        && isValidStringLength(request.resource.data.comment, 10, 1000);
      
      // Atualizar: apenas o autor da avaliação
      allow update: if isSignedIn() 
        && resource.data.clientId == request.auth.uid
        && request.resource.data.clientId == resource.data.clientId; // Cliente não pode mudar
      
      // Deletar: apenas o autor
      allow delete: if isSignedIn() 
        && resource.data.clientId == request.auth.uid;
    }
    
    // 🔒 MENSAGENS
    match /chats/{chatId} {
      // Ler: apenas participantes do chat
      allow read: if isSignedIn() 
        && (request.auth.uid in resource.data.participants);
      
      // Criar: apenas usuários autenticados
      allow create: if isSignedIn()
        && request.auth.uid in request.resource.data.participants;
      
      // Atualizar: apenas participantes
      allow update: if isSignedIn()
        && request.auth.uid in resource.data.participants;
      
      // Deletar: não permitido
      allow delete: if false;
      
      // Mensagens dentro do chat
      match /messages/{messageId} {
        // Ler: apenas participantes do chat pai
        allow read: if isSignedIn()
          && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        
        // Criar: apenas participantes e autor da mensagem
        allow create: if isSignedIn()
          && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants
          && request.resource.data.senderId == request.auth.uid
          && isValidStringLength(request.resource.data.text, 1, 5000);
        
        // Atualizar: não permitido (mensagens são imutáveis)
        allow update: if false;
        
        // Deletar: apenas o autor
        allow delete: if isSignedIn()
          && resource.data.senderId == request.auth.uid;
      }
    }
    
    // 🔒 SOLICITAÇÕES DE SERVIÇO
    match /serviceRequests/{requestId} {
      // Ler: apenas cliente ou profissional envolvido
      allow read: if isSignedIn() 
        && (request.auth.uid == resource.data.clientId 
            || request.auth.uid == resource.data.professionalId);
      
      // Criar: apenas usuários autenticados
      allow create: if isSignedIn()
        && request.resource.data.clientId == request.auth.uid
        && request.resource.data.estimatedValue > 0;
      
      // Atualizar: apenas cliente ou profissional envolvido
      allow update: if isSignedIn()
        && (request.auth.uid == resource.data.clientId 
            || request.auth.uid == resource.data.professionalId);
      
      // Deletar: apenas o cliente que criou
      allow delete: if isSignedIn()
        && resource.data.clientId == request.auth.uid;
    }
    
    // 🔒 GAMIFICAÇÃO
    match /gamification/{userId} {
      // Ler: todos podem ver
      allow read: if true;
      
      // Criar/Atualizar/Deletar: apenas sistema (via Cloud Functions)
      allow write: if false;
    }
    
    // 🔒 BLOQUEAR TUDO QUE NÃO FOI ESPECIFICADO
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

export const STORAGE_SECURITY_RULES = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Função auxiliar: verificar se usuário está autenticado
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Função auxiliar: validar tamanho do arquivo (10MB)
    function isValidSize() {
      return request.resource.size <= 10 * 1024 * 1024;
    }
    
    // Função auxiliar: validar tipo de imagem
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // 🔒 FOTOS DE PERFIL
    match /profile-photos/{userId}/{fileName} {
      // Ler: todos podem ver
      allow read: if true;
      
      // Upload: apenas o próprio usuário, imagens até 10MB
      allow write: if isSignedIn()
        && request.auth.uid == userId
        && isImage()
        && isValidSize();
      
      // Deletar: apenas o próprio usuário
      allow delete: if isSignedIn()
        && request.auth.uid == userId;
    }
    
    // 🔒 FOTOS DE TRABALHOS
    match /work-photos/{userId}/{fileName} {
      // Ler: todos podem ver
      allow read: if true;
      
      // Upload: apenas o próprio usuário
      allow write: if isSignedIn()
        && request.auth.uid == userId
        && isImage()
        && isValidSize();
      
      // Deletar: apenas o próprio usuário
      allow delete: if isSignedIn()
        && request.auth.uid == userId;
    }
    
    // 🔒 DOCUMENTOS
    match /documents/{userId}/{fileName} {
      // Ler: apenas o próprio usuário
      allow read: if isSignedIn()
        && request.auth.uid == userId;
      
      // Upload: apenas o próprio usuário
      allow write: if isSignedIn()
        && request.auth.uid == userId
        && isValidSize();
      
      // Deletar: apenas o próprio usuário
      allow delete: if isSignedIn()
        && request.auth.uid == userId;
    }
    
    // 🔒 BLOQUEAR TUDO QUE NÃO FOI ESPECIFICADO
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
`;
