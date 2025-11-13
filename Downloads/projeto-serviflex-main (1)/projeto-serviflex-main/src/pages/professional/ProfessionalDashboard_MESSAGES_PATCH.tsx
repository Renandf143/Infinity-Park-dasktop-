// PATCH PARA ADICIONAR MENSAGENS NO DASHBOARD DO PROFISSIONAL
// 
// 1. Adicione este import no topo do arquivo ProfessionalDashboard.tsx:
import { MessagesPanel } from '../../components/MessagesPanel';

// 2. Substitua a seção de mensagens (procure por activeTab === "messages") por:

{activeTab === "messages" && user && (
  <MessagesPanel
    currentUserId={user.uid}
    currentUserName={user.displayName || "Profissional"}
    currentUserPhoto={user.photoURL || ""}
  />
)}

// CÓDIGO COMPLETO DA SEÇÃO:
// Substitua o bloco que contém "Mensagens em breve" por este código:

{activeTab === "messages" && user && (
  <MessagesPanel
    currentUserId={user.uid}
    currentUserName={user.displayName || "Profissional"}
    currentUserPhoto={user.photoURL || ""}
  />
)}
