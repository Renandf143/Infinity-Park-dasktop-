# 🧪 Como Testar o Sistema em Tempo Real

## ✅ Teste Rápido (2 minutos)

### Passo 1: Abrir 2 Abas
1. **Aba 1**: Dashboard do Profissional
   - URL: `http://localhost:5173/professional/dashboard`
   - Faça login como profissional

2. **Aba 2**: Perfil do Profissional
   - URL: `http://localhost:5173/profissional/[SEU_ID]`
   - Pode estar deslogado

### Passo 2: Ver Disponibilidade Atual
Na **Aba 2** (Perfil), role até a seção "Disponibilidade"

Você verá algo como:
```
Segunda-feira: 08:00 - 18:00
Terça-feira:   08:00 - 18:00
...
Domingo:       08:00 - 12:00
```

### Passo 3: Alterar no Dashboard
Na **Aba 1** (Dashboard):
1. Clique em "Disponibilidade" no menu
2. **DESABILITE** o checkbox de "Domingo"
3. Clique em "Salvar"
4. Aguarde a mensagem: "✅ Horários salvos com sucesso!"

### Passo 4: Ver Mudança Instantânea
Volte para a **Aba 2** (Perfil)

**SEM RECARREGAR A PÁGINA**, você verá:
```
Segunda-feira: 08:00 - 18:00
Terça-feira:   08:00 - 18:00
...
Domingo:       Fechado  ← MUDOU AUTOMATICAMENTE!
```

## 🎯 O Que Observar

### No Console (F12):
```
👂 Iniciando listener de disponibilidade para: [ID]
🔄 Disponibilidade atualizada em tempo real!
```

### Na Interface:
- ✅ Domingo muda de verde para cinza
- ✅ Horário muda de "08:00 - 12:00" para "Fechado"
- ✅ Badge "Disponível Hoje" pode mudar (se hoje for domingo)

## 🔥 Teste Avançado

### Teste 1: Múltiplos Horários
1. No Dashboard, adicione 2 horários para Segunda:
   - 08:00 - 12:00
   - 14:00 - 18:00
2. Salve
3. No Perfil, verá: "08:00 - 12:00, 14:00 - 18:00"

### Teste 2: Bloquear Data
1. No Dashboard, bloqueie a data de hoje
2. Salve
3. No Perfil, o badge mudará para "Indisponível Hoje"

### Teste 3: Múltiplos Usuários
1. Abra o perfil em outro navegador/dispositivo
2. Altere no Dashboard
3. Veja a mudança em TODOS os dispositivos simultaneamente!

## ❌ Se Não Funcionar

### Problema: Não atualiza automaticamente
**Solução:**
```bash
# 1. Deploy das regras
firebase deploy --only firestore:rules

# 2. Limpar cache
Ctrl+Shift+Delete → Limpar tudo

# 3. Recarregar
Ctrl+F5
```

### Problema: Erro no console
**Verifique:**
1. Regras do Firestore deployadas?
2. Profissional configurou disponibilidade?
3. ID do profissional está correto?

## ✅ Sucesso!

Se você viu a mudança SEM recarregar a página, está funcionando perfeitamente! 🎉

### O que aconteceu:
1. Dashboard salvou no Firebase
2. Firebase notificou o listener
3. Listener atualizou o estado React
4. React re-renderizou a interface
5. Tudo em < 1 segundo!

## 📊 Monitorar no Firebase

1. Abra: https://console.firebase.google.com
2. Vá em Firestore Database
3. Procure a coleção `availability`
4. Veja o documento do profissional
5. Observe os campos `weekSchedule` e `updatedAt`

Quando você salva no Dashboard, o `updatedAt` muda instantaneamente!
