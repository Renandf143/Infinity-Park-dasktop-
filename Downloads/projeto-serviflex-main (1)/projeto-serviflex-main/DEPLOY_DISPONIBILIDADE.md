# 🚀 Deploy do Sistema de Disponibilidade em Tempo Real

## ✅ Checklist de Deploy

### 1. Deploy das Regras do Firestore
```bash
cd projeto-serviflex-main
firebase deploy --only firestore:rules
```

**Aguarde a mensagem:**
```
✔  Deploy complete!
```

### 2. Verificar Regras no Console Firebase
1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database** → **Regras**
4. Verifique se as regras de `availability` estão lá:

```javascript
match /availability/{professionalId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == professionalId;
}
```

### 3. Testar o Sistema

#### Teste 1: Configurar Disponibilidade
1. Faça login como profissional
2. Vá em Dashboard → Disponibilidade
3. Configure os dias e horários
4. Clique em "Salvar"
5. ✅ Deve aparecer: "Horários salvos com sucesso!"

#### Teste 2: Ver em Tempo Real
1. Abra o perfil do profissional em outra aba/janela
2. Volte no Dashboard
3. Desabilite um dia (ex: Domingo)
4. Clique em "Salvar"
5. ✅ Veja a mudança INSTANTÂNEA no perfil!

#### Teste 3: Filtro de Disponibilidade
1. Vá na página inicial ou categorias
2. Ative o toggle "Disponíveis Hoje"
3. ✅ Deve mostrar apenas profissionais disponíveis no dia atual

## 🔍 Verificar Logs

Abra o Console do Navegador (F12) e procure por:

### Logs de Sucesso:
```
👂 Iniciando listener de disponibilidade para: [ID]
🔄 Disponibilidade atualizada em tempo real!
✅ Horários salvos com sucesso no Firebase
✅ X profissionais disponíveis hoje
```

### Logs de Erro (se houver):
```
❌ Erro no listener de disponibilidade
❌ Erro ao atualizar horários
```

## 🐛 Troubleshooting

### Problema: "Missing or insufficient permissions"
**Solução:** Deploy das regras não foi feito
```bash
firebase deploy --only firestore:rules
```

### Problema: Mudanças não aparecem em tempo real
**Solução:** 
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (Ctrl+F5)
3. Verifique se há erros no console

### Problema: Profissional não aparece no filtro
**Solução:**
1. Verifique se o profissional configurou a disponibilidade
2. Verifique se o dia atual está habilitado
3. Verifique se não há datas bloqueadas

## 📊 Monitoramento

### Firebase Console
1. Vá em **Firestore Database**
2. Procure a coleção `availability`
3. Veja os documentos criados pelos profissionais

### Estrutura Esperada:
```
availability/
  └── [professionalId]/
      ├── weekSchedule
      ├── blockedDates
      ├── advanceBookingDays
      ├── bufferTime
      └── updatedAt
```

## ✅ Tudo Pronto!

Se todos os testes passaram, o sistema está funcionando perfeitamente! 🎉

### Funcionalidades Ativas:
- ✅ Configuração de horários no dashboard
- ✅ Atualização em tempo real
- ✅ Filtro por disponibilidade
- ✅ Bloqueio de datas
- ✅ Visualização no perfil

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do console (F12)
2. Regras do Firestore
3. Conexão com Firebase
4. Autenticação do usuário
