# 📧 Configuração do Sistema de Email de Contato

## ✅ O Que Foi Implementado

### 1. Serviço de Email (`emailService.ts`)
- Salva mensagens no Firestore (coleção `contactMessages`)
- Gera HTML formatado para emails
- Suporte para envio via API (quando disponível)

### 2. Variáveis de Ambiente (`.env`)
```env
# Informações da Empresa
VITE_COMPANY_EMAIL=suporteserviflix@gmail.com
VITE_COMPANY_PHONE=(11) 3000-0000
VITE_COMPANY_ADDRESS=Av. Paulista, 1000 - São Paulo, SP
```

### 3. Página de Contato Atualizada
- ✅ Usa email do `.env` (não mais hardcoded)
- ✅ Salva mensagens no Firestore
- ✅ Feedback visual (loading, sucesso, erro)
- ✅ Validação de formulário

### 4. Regras do Firestore
- ✅ Qualquer pessoa pode criar mensagem
- ✅ Apenas admin pode ler todas as mensagens
- ✅ Usuário pode ler suas próprias mensagens

## 🚀 Como Usar

### 1. Configurar Email da Empresa

Edite o arquivo `.env`:
```env
VITE_COMPANY_EMAIL=seu-email@empresa.com
VITE_COMPANY_PHONE=(XX) XXXX-XXXX
VITE_COMPANY_ADDRESS=Seu Endereço Completo
```

### 2. Deploy das Regras

```bash
cd projeto-serviflex-main
firebase deploy --only firestore:rules
```

### 3. Testar o Formulário

1. Acesse: `http://localhost:5173/contato`
2. Preencha o formulário
3. Clique em "Enviar Mensagem"
4. ✅ Deve aparecer: "Mensagem Enviada!"

### 4. Ver Mensagens no Firebase

1. Acesse: https://console.firebase.google.com
2. Vá em **Firestore Database**
3. Procure a coleção `contactMessages`
4. Veja as mensagens recebidas

## 📊 Estrutura de Dados

### Coleção: `contactMessages`

```typescript
{
  name: string;           // Nome do remetente
  email: string;          // Email do remetente
  phone: string;          // Telefone (opcional)
  subject: string;        // Assunto (duvida, suporte, etc)
  message: string;        // Mensagem
  status: 'pending';      // Status da mensagem
  createdAt: Timestamp;   // Data de criação
  readAt: null;           // Data de leitura (null = não lida)
}
```

## 🔔 Notificações por Email (Opcional)

Para enviar emails automáticos quando alguém preenche o formulário:

### Opção 1: Firebase Cloud Functions

Crie uma função que escuta novos documentos em `contactMessages`:

```typescript
// functions/src/index.ts
export const sendContactEmail = functions.firestore
  .document('contactMessages/{messageId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Enviar email usando nodemailer
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.VITE_COMPANY_EMAIL,
      subject: `[Contato] ${data.subject}`,
      html: generateEmailHTML(data)
    });
  });
```

### Opção 2: EmailJS (Mais Simples)

1. Crie conta em: https://www.emailjs.com
2. Configure um template
3. Adicione no `.env`:
```env
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

4. Instale:
```bash
npm install @emailjs/browser
```

5. Use no `emailService.ts`:
```typescript
import emailjs from '@emailjs/browser';

await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  data,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

## 📱 Painel Admin (Futuro)

Você pode criar um painel para visualizar as mensagens:

```typescript
// src/pages/admin/ContactMessagesPage.tsx
const messages = await getDocs(
  query(
    collection(db, 'contactMessages'),
    orderBy('createdAt', 'desc')
  )
);
```

## ✅ Checklist de Deploy

- [ ] Configurar variáveis no `.env`
- [ ] Deploy das regras do Firestore
- [ ] Testar formulário de contato
- [ ] Verificar mensagens no Firebase Console
- [ ] (Opcional) Configurar envio de email automático
- [ ] (Opcional) Criar painel admin

## 🎯 Resultado Final

### Antes:
- ❌ Email hardcoded: `contato@serviflix.com.br`
- ❌ Formulário não salvava nada
- ❌ Sem feedback visual

### Depois:
- ✅ Email configurável via `.env`
- ✅ Mensagens salvas no Firestore
- ✅ Feedback visual completo
- ✅ Pronto para integração com email

## 🐛 Troubleshooting

### Problema: "Erro ao Enviar"
**Solução:**
1. Verifique se as regras do Firestore foram deployadas
2. Verifique o console do navegador (F12)
3. Verifique se o Firebase está configurado

### Problema: Email não aparece
**Solução:**
1. Verifique se a variável `VITE_COMPANY_EMAIL` está no `.env`
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador

### Problema: Mensagens não aparecem no Firebase
**Solução:**
1. Verifique as regras do Firestore
2. Verifique se o usuário tem permissão
3. Verifique o console do Firebase

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs do console (F12)
2. Verifique o Firebase Console
3. Verifique as regras do Firestore
