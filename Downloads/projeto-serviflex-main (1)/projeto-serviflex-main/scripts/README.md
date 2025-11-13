# Scripts de Atualização do Banco de Dados

## Atualização de Ícones das Categorias

Este script substitui os emojis das categorias por nomes de ícones do Lucide React no Firestore.

### Pré-requisitos

1. Node.js instalado
2. Credenciais do Firebase configuradas no arquivo `.env`
3. Dependências instaladas: `npm install`

### Como Executar

#### Opção 1: Script JavaScript (Recomendado)

```bash
node scripts/updateCategoryIcons.js
```

#### Opção 2: Script TypeScript

```bash
npx ts-node scripts/updateCategoryIcons.ts
```

### O que o script faz

1. Conecta ao Firestore usando suas credenciais
2. Busca todas as categorias da coleção `categories`
3. Para cada categoria:
   - Substitui o emoji do ícone principal pelo nome do ícone do Lucide React
   - Substitui os emojis de todas as subcategorias
4. Atualiza os documentos no Firestore
5. Exibe um resumo da operação

### Mapeamento de Ícones

O script usa o seguinte mapeamento:

#### Categorias Principais
- 🧹 → Sparkles (Limpeza)
- 🔧 → Wrench (Reparos)
- 💅 → Scissors (Beleza)
- 💪 → Heart (Saúde)
- 📚 → BookOpen (Aulas)
- 🎉 → PartyPopper (Eventos)
- 🚚 → Truck (Transporte)
- 💻 → Laptop (Tecnologia)
- 🌱 → Leaf (Jardinagem)
- 👶 → Baby (Cuidados Pessoais)
- 🐾 → PawPrint (Pet Care)
- 👨‍🍳 → ChefHat (Alimentação)

#### Subcategorias
Veja o arquivo `updateCategoryIcons.js` para o mapeamento completo de subcategorias.

### Exemplo de Saída

```
🚀 Iniciando atualização de ícones...

✅ Categoria atualizada: Limpeza e Organização
   Ícone: 🧹 → Sparkles
✅ Categoria atualizada: Reparos e Manutenção
   Ícone: 🔧 → Wrench
...

📊 Resumo da atualização:
   ✅ Categorias atualizadas: 12
   ❌ Erros: 0

✨ Atualização concluída!
```

### Troubleshooting

#### Erro: "Firebase config not found"
- Verifique se o arquivo `.env` existe e contém todas as variáveis necessárias:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID

#### Erro: "Permission denied"
- Verifique se suas credenciais do Firebase têm permissão de escrita no Firestore
- Verifique as regras de segurança do Firestore

### Backup

⚠️ **IMPORTANTE**: Faça backup do seu banco de dados antes de executar o script!

Você pode fazer backup pelo console do Firebase:
1. Acesse o Firebase Console
2. Vá em Firestore Database
3. Clique em "Export"
4. Escolha a coleção "categories"
5. Salve o backup

### Reverter Alterações

Se precisar reverter as alterações, você pode:
1. Restaurar o backup do Firestore
2. Ou criar um script reverso que converte os nomes de ícones de volta para emojis

### Notas

- O script é idempotente: pode ser executado múltiplas vezes sem problemas
- Ícones não mapeados permanecem inalterados
- O script não deleta dados, apenas atualiza os campos `icon`
