# Infinity Park Desktop 🎢

Sistema de gerenciamento para parque de diversões desenvolvido em Python com Kivy, incluindo banco de dados SQLite para controle completo de operações.

## 📋 Sobre o Projeto

O Infinity Park Desktop é uma aplicação completa para gerenciamento de parques de diversões que oferece:

- **Sistema de Login** com diferentes perfis de usuário (Comum, Operador, Administrador)
- **Gestão de Atrações** com informações detalhadas, manutenção e status
- **Controle de Ingressos** com diferentes tipos e preços
- **Cadastro de Visitantes** com informações pessoais e restrições médicas
- **Gerenciamento de Shows** e eventos especiais
- **Sistema de Lanchonetes** com cardápios e preços
- **Controle de Funcionários** e departamentos
- **Horários de Funcionamento** flexíveis
- **Sistema de Avaliações** e feedback dos visitantes

## 🚀 Tecnologias Utilizadas

- **Python 3.x**
- **Kivy** - Framework para interface gráfica
- **SQLite** - Banco de dados local
- **Hashlib** - Criptografia de senhas

## 📁 Estrutura do Projeto

```
Infinity-Park-Desktop/
├── teste1.py              # Aplicação principal
├── Infinity_parksql.sql   # Script SQL para MySQL (referência)
├── infinity_park_215.db   # Banco de dados SQLite
├── assets/                # Recursos visuais (imagens, logos)
└── README.md             # Este arquivo
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

```bash
pip install kivy
```

### Como executar

1. Clone o repositório:
```bash
git clone https://github.com/Renandf143/Infinity-Park-dasktop-.git
cd Infinity-Park-dasktop-
```

2. Execute a aplicação:
```bash
python teste1.py
```

### Login Padrão

- **Usuário:** admin
- **Senha:** admin123

## 🎯 Funcionalidades Principais

### Para Administradores
- Gestão completa de atrações e manutenções
- Controle de funcionários e departamentos
- Relatórios de vendas e visitação
- Configuração de horários e preços

### Para Operadores
- Controle de status das atrações
- Gerenciamento de filas e capacidade
- Registro de manutenções

### Para Usuários Comuns
- Compra de ingressos online
- Visualização de atrações e shows
- Criação de itinerários personalizados
- Sistema de avaliações

## 🗃️ Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas principais:

- `usuarios_sistema` - Controle de acesso
- `visitantes` - Cadastro de clientes
- `atracoes` - Informações das atrações
- `tipos_ingressos` - Tipos e preços de ingressos
- `compras_ingressos` - Histórico de vendas
- `funcionarios` - Gestão de pessoal
- `shows` - Programação de eventos
- `lanchonetes` - Pontos de alimentação

## 🎨 Interface

A aplicação possui interface gráfica moderna desenvolvida em Kivy com:

- Design responsivo e intuitivo
- Paleta de cores personalizada
- Navegação por telas organizadas
- Componentes visuais customizados

## 🔧 Desenvolvimento

### Estrutura do Código

- **Inicialização do BD:** Função `init_db()` cria todas as tabelas necessárias
- **Telas da Aplicação:** Classes Screen para cada funcionalidade
- **Widgets Customizados:** Componentes visuais reutilizáveis
- **Gerenciamento de Estado:** Controle de usuário logado e navegação

### Próximas Melhorias

- [ ] Sistema de relatórios avançados
- [ ] Integração com APIs de pagamento
- [ ] Notificações push
- [ ] Backup automático do banco
- [ ] Interface web complementar

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Renan** - [GitHub](https://github.com/Renandf143) | [Instagram](https://www.instagram.com/renan.gomeslobo)

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

⭐ Se este projeto te ajudou, não esqueça de dar uma estrela!