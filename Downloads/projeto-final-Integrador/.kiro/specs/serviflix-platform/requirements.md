# Documento de Requisitos - Serviflix

## Introdução

O Serviflix é uma plataforma web de disponibilidade e prestação de serviços diversos que conecta prestadores de serviços com clientes. A plataforma utilizará Supabase como banco de dados e permitirá que usuários encontrem, contratem e avaliem diversos tipos de serviços, desde serviços domésticos até profissionais especializados.

## Requisitos

### Requisito 1 - Cadastro e Autenticação de Usuários

**História do Usuário:** Como um usuário, eu quero me cadastrar e fazer login na plataforma, para que eu possa acessar os serviços como cliente ou prestador.

#### Critérios de Aceitação

1. QUANDO um usuário acessa a página de cadastro ENTÃO o sistema DEVE permitir registro com email, senha e tipo de conta (cliente/prestador)
2. QUANDO um usuário escolhe login com Google ENTÃO o sistema DEVE autenticar via OAuth do Google e criar/atualizar perfil automaticamente
3. QUANDO um usuário faz login ENTÃO o sistema DEVE autenticar as credenciais via Supabase Auth e redirecionar para o dashboard apropriado
4. QUANDO um usuário esquece a senha ENTÃO o sistema DEVE enviar um email de recuperação via Supabase
5. SE um usuário não confirmar o email ENTÃO o sistema DEVE restringir o acesso completo à plataforma
6. QUANDO um usuário faz login via Google ENTÃO o sistema DEVE sincronizar dados do perfil Google com o Supabase

### Requisito 2 - Catálogo de Serviços

**História do Usuário:** Como um cliente, eu quero navegar por diferentes categorias de serviços, para que eu possa encontrar o que preciso facilmente.

#### Critérios de Aceitação

1. QUANDO um cliente acessa o catálogo ENTÃO o sistema DEVE exibir serviços organizados por categorias
2. QUANDO um cliente busca por um serviço ENTÃO o sistema DEVE filtrar resultados por localização, preço e avaliação
3. QUANDO um cliente visualiza um serviço ENTÃO o sistema DEVE mostrar descrição, preço, avaliações e perfil do prestador
4. SE não houver serviços disponíveis na região ENTÃO o sistema DEVE sugerir prestadores próximos

### Requisito 3 - Perfil do Prestador de Serviços

**História do Usuário:** Como um prestador de serviços, eu quero criar e gerenciar meu perfil profissional, para que eu possa atrair clientes e oferecer meus serviços.

#### Critérios de Aceitação

1. QUANDO um prestador cria seu perfil ENTÃO o sistema DEVE permitir adicionar descrição, fotos, certificações e preços
2. QUANDO um prestador atualiza disponibilidade ENTÃO o sistema DEVE refletir isso no catálogo em tempo real
3. QUANDO um prestador recebe uma avaliação ENTÃO o sistema DEVE atualizar sua nota média automaticamente
4. SE um prestador não completar o perfil ENTÃO o sistema DEVE limitar sua visibilidade no catálogo

### Requisito 4 - Sistema de Agendamento

**História do Usuário:** Como um cliente, eu quero agendar serviços diretamente pela plataforma, para que eu possa garantir o atendimento no horário desejado.

#### Critérios de Aceitação

1. QUANDO um cliente seleciona um serviço ENTÃO o sistema DEVE mostrar horários disponíveis do prestador
2. QUANDO um agendamento é confirmado ENTÃO o sistema DEVE enviar notificações para ambas as partes
3. QUANDO há conflito de horário ENTÃO o sistema DEVE impedir o agendamento duplo
4. SE um agendamento for cancelado ENTÃO o sistema DEVE liberar o horário e notificar as partes

### Requisito 5 - Sistema de Pagamento

**História do Usuário:** Como um cliente, eu quero pagar pelos serviços de forma segura pela plataforma, para que eu tenha garantias na transação.

#### Critérios de Aceitação

1. QUANDO um cliente confirma um agendamento ENTÃO o sistema DEVE processar o pagamento via cartão ou PIX
2. QUANDO o serviço é concluído ENTÃO o sistema DEVE liberar o pagamento para o prestador
3. QUANDO há disputa ENTÃO o sistema DEVE reter o pagamento até resolução
4. SE o pagamento falhar ENTÃO o sistema DEVE cancelar o agendamento automaticamente

### Requisito 6 - Sistema de Avaliações

**História do Usuário:** Como um cliente, eu quero avaliar os serviços recebidos, para que eu possa ajudar outros usuários e melhorar a qualidade da plataforma.

#### Critérios de Aceitação

1. QUANDO um serviço é concluído ENTÃO o sistema DEVE solicitar avaliação do cliente
2. QUANDO uma avaliação é submetida ENTÃO o sistema DEVE permitir nota de 1 a 5 estrelas e comentário
3. QUANDO um prestador responde à avaliação ENTÃO o sistema DEVE exibir a resposta junto à avaliação
4. SE uma avaliação for inadequada ENTÃO o sistema DEVE permitir denúncia e moderação

### Requisito 7 - Dashboard Administrativo

**História do Usuário:** Como um administrador, eu quero gerenciar usuários e transações da plataforma, para que eu possa manter a qualidade e segurança do serviço.

#### Critérios de Aceitação

1. QUANDO um admin acessa o dashboard ENTÃO o sistema DEVE mostrar métricas de usuários, transações e avaliações
2. QUANDO há uma denúncia ENTÃO o sistema DEVE permitir investigação e ações disciplinares
3. QUANDO um usuário viola termos ENTÃO o sistema DEVE permitir suspensão ou banimento
4. SE há atividade suspeita ENTÃO o sistema DEVE alertar automaticamente os administradores

### Requisito 8 - Integração com Supabase

**História do Usuário:** Como desenvolvedor, eu quero utilizar Supabase para gerenciar dados e autenticação, para que eu tenha uma solução robusta e escalável de backend.

#### Critérios de Aceitação

1. QUANDO dados são salvos ENTÃO o sistema DEVE utilizar Supabase como banco de dados principal
2. QUANDO há mudanças em tempo real ENTÃO o sistema DEVE usar Supabase Realtime para atualizações automáticas
3. QUANDO arquivos são enviados ENTÃO o sistema DEVE usar Supabase Storage para armazenamento
4. SE há falha na conexão ENTÃO o sistema DEVE implementar retry automático e cache local quando possível

### Requisito 9 - Landing Page e Design Visual

**História do Usuário:** Como um visitante, eu quero ver uma landing page atrativa com vídeo no banner e design moderno, para que eu me sinta confiante em usar a plataforma.

#### Critérios de Aceitação

1. QUANDO um usuário acessa a página inicial ENTÃO o sistema DEVE exibir um banner principal com vídeo de fundo (video-baner-principal.mp4)
2. QUANDO a página carrega ENTÃO o sistema DEVE usar as cores definidas: primária #0284C7, secundária #EFF6FF, botões #FFAF00 e #1D4ED8, texto #1F2937
3. QUANDO um usuário visualiza a página ENTÃO o sistema DEVE mostrar seções de categorias populares com ícones
4. QUANDO um usuário rola a página ENTÃO o sistema DEVE exibir seção "Principais serviços pedidos" com cards de serviços
5. QUANDO um usuário visualiza os serviços ENTÃO o sistema DEVE mostrar preços, avaliações e botões de ação coloridos
6. QUANDO um usuário acessa "Como funciona" ENTÃO o sistema DEVE exibir 3 passos: solicitar serviços, comparar qualificações, serviços realizados
7. QUANDO um usuário visualiza depoimentos ENTÃO o sistema DEVE mostrar seção "O que nossos clientes dizem" com avaliações
8. QUANDO um usuário rola até o final ENTÃO o sistema DEVE exibir seção de download do app com mockup de celular
9. QUANDO um usuário visualiza o rodapé ENTÃO o sistema DEVE mostrar seção "Por que escolher o Serviflix" com 4 pilares principais

### Requisito 10 - Header e Navegação

**História do Usuário:** Como um usuário, eu quero ter uma navegação clara e intuitiva no topo da página, para que eu possa acessar facilmente as diferentes seções da plataforma.

#### Critérios de Aceitação

1. QUANDO um usuário visualiza o header ENTÃO o sistema DEVE exibir o logo "Serviflix" no canto esquerdo
2. QUANDO um usuário visualiza a navegação ENTÃO o sistema DEVE mostrar menu com: Início, Como funciona, Categorias, Para empresas
3. QUANDO um usuário não está logado ENTÃO o sistema DEVE exibir botões "Entrar" e "Cadastrar" no canto direito
4. QUANDO um usuário está logado ENTÃO o sistema DEVE mostrar avatar do usuário e menu dropdown
5. QUANDO um usuário clica no logo ENTÃO o sistema DEVE redirecionar para a página inicial
6. QUANDO um usuário usa dispositivo móvel ENTÃO o sistema DEVE mostrar menu hambúrguer responsivo
7. QUANDO um usuário rola a página ENTÃO o sistema DEVE manter o header fixo no topo

### Requisito 11 - Interface Responsiva

**História do Usuário:** Como um usuário, eu quero acessar a plataforma de qualquer dispositivo, para que eu possa usar os serviços a qualquer momento.

#### Critérios de Aceitação

1. QUANDO um usuário acessa via mobile ENTÃO o sistema DEVE adaptar a interface para telas pequenas
2. QUANDO um usuário usa tablet ENTÃO o sistema DEVE otimizar o layout para tela média
3. QUANDO um usuário navega no desktop ENTÃO o sistema DEVE aproveitar o espaço disponível
4. SE a conexão for lenta ENTÃO o sistema DEVE priorizar conteúdo essencial e otimizar carregamento