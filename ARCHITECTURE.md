# Arquitetura MVC - Impact Platform

## 📚 Visão Geral

Este projeto segue o padrão **MVC (Model-View-Controller)** adaptado para React, organizando o código de forma clara e mantível.

## 🏗️ Estrutura MVC

### 📦 Models (models/)
**Responsabilidade**: Representação e manipulação de dados

- Modelos de dados da aplicação
- Validação de dados
- Lógica de negócio relacionada aos dados
- Futuramente: classes/interfaces de entidades (User, Project, Service, etc.)

**Exemplo futuro**:
```javascript
// models/User.js
class User {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
  }
  
  validate() {
    // lógica de validação
  }
}
```

### 👁️ Views (views/)
**Responsabilidade**: Interface do usuário e apresentação

#### views/pages/
- Páginas completas da aplicação
- Home, Login, Cadastro, etc.
- Cada página é uma rota específica

#### views/layouts/
- Componentes de layout (Header, Footer)
- Estruturas que envolvem outras views

#### views/components/
- Componentes reutilizáveis
- Componentes de UI (botões, cards, formulários, etc.)

**Características**:
- Apenas apresentação e renderização
- Recebe dados via props ou hooks
- Dispara ações via callbacks
- CSS isolado por componente

### 🎮 Controllers (controllers/)
**Responsabilidade**: Lógica de controle e coordenação

#### controllers/services/
- Comunicação com APIs externas
- **api.js**: Serviço base para requisições HTTP
- **authService.js**: Autenticação e autorização
- **userService.js**: Operações relacionadas a usuários

**Exemplo**:
```javascript
// Intercepta requisições, adiciona token, trata erros
class ApiService {
  get(endpoint) { ... }
  post(endpoint, body) { ... }
}
```

#### controllers/contexts/
- Estado global da aplicação
- **AuthContext.js**: Estado de autenticação compartilhado

**Uso**:
```javascript
const { user, login, logout } = useAuth();
```

#### controllers/hooks/
- Lógica reutilizável de interface
- **useFetch.js**: Hook para requisições
- **useForm.js**: Hook para gerenciar formulários

**Exemplo**:
```javascript
const { data, loading, error } = useFetch('/users');
```

#### controllers/utils/
- Funções utilitárias puras
- Formatação, validação, helpers
- Sem estado ou efeitos colaterais

## 🛣️ Routes (routes/)
**Responsabilidade**: Configuração de rotas

- **AppRoutes.js**: Define todas as rotas da aplicação
- Centraliza navegação
- Facilita manutenção e adição de novas rotas

## ⚙️ Config (config/)
**Responsabilidade**: Configurações da aplicação

- **api.config.js**: URLs, timeouts, headers padrão
- Variáveis de ambiente
- Configurações centralizadas

## 🎨 Assets (assets/)
**Responsabilidade**: Recursos estáticos

- **styles/**: CSS global e variáveis
- Futuro: imagens, fontes, ícones

## 🔄 Fluxo de Dados

```
User Action (View) 
    ↓
Component Handler (View)
    ↓
Hook/Context (Controller)
    ↓
Service (Controller)
    ↓
API Request (Controller)
    ↓
Model (Model) - futuro
    ↓
Response to Service
    ↓
Update State (Context/Hook)
    ↓
Re-render View
```

## 📝 Padrões e Boas Práticas

### ✅ DO - Faça

- ✅ Mantenha views simples, apenas apresentação
- ✅ Coloque lógica complexa em hooks ou services
- ✅ Use contexts para estado global
- ✅ Crie modelos para entidades complexas
- ✅ Centralize configurações em config/
- ✅ Use index.js para exportações limpas
- ✅ Documente funções e componentes complexos

### ❌ DON'T - Não Faça

- ❌ Não coloque lógica de negócio em componentes
- ❌ Não faça requisições diretas em views
- ❌ Não duplique código (use utils)
- ❌ Não misture responsabilidades
- ❌ Não deixe variáveis hardcoded (use config)

## 🚀 Como Adicionar Novos Recursos

### Nova Página
1. Criar componente em `views/pages/`
2. Criar CSS específico
3. Adicionar rota em `routes/AppRoutes.js`
4. Exportar em `views/pages/index.js`

### Novo Service
1. Criar arquivo em `controllers/services/`
2. Usar api.js como base
3. Exportar em `controllers/services/index.js`

### Novo Context
1. Criar em `controllers/contexts/`
2. Definir Provider e hook de acesso
3. Exportar em `controllers/contexts/index.js`
4. Adicionar Provider no App.js (se necessário)

### Novo Model
1. Criar classe/interface em `models/`
2. Definir propriedades e métodos
3. Adicionar validações
4. Exportar para uso nos controllers

## 📖 Referências

- [React Docs](https://react.dev/)
- [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Mantido por**: Equipe Impact
**Última atualização**: Março 2026
