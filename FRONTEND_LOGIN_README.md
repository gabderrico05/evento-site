# Sistema de Login - Frontend

## Visão Geral

O frontend foi atualizado para incluir um sistema completo de autenticação que se integra com a API de login do backend. O sistema inclui páginas de login, cadastro e proteção de rotas.

## Componentes Implementados

### 1. Login (`/login`)
- **Arquivo**: `src/components/Login.jsx`
- **Funcionalidades**:
  - Login com email ou username
  - Validação de formulário
  - Mostrar/ocultar senha
  - Mensagens de erro
  - Redirecionamento automático se já logado
  - Link para página de cadastro

### 2. Cadastro (`/cadastro`)
- **Arquivo**: `src/components/Cadastro.jsx`
- **Funcionalidades**:
  - Cadastro de novos usuários
  - Validação de email, username e senha
  - Confirmação de senha
  - Mensagens de sucesso e erro
  - Login automático após cadastro
  - Link para página de login

### 3. Hook de Autenticação
- **Arquivo**: `src/hooks/useAuth.js`
- **Funcionalidades**:
  - Gerenciamento global do estado de autenticação
  - Persistência de token no localStorage
  - Funções de login, logout e verificação
  - Context API para compartilhar estado

### 4. Proteção de Rotas
- **Arquivo**: `src/components/ProtectedRoute.jsx`
- **Funcionalidades**:
  - Protege rotas que requerem autenticação
  - Redireciona para login se não autenticado
  - Loading state durante verificação

## Fluxo de Navegação Atualizado

### Antes:
```
Página Inicial → [Botão "Resgatar ingresso"] → Formulário de Resgate
```

### Agora:
```
Página Inicial → [Botão "Resgatar ingresso"] → Login
                                                 ↓
Login → [Link "Cadastre-se"] → Cadastro → Formulário de Resgate (protegido)
  ↓
Formulário de Resgate (protegido)
```

## Rotas Implementadas

- `/` - Página inicial
- `/login` - Página de login
- `/cadastro` - Página de cadastro
- `/formulario` - Formulário de resgate (protegido)
- `/ingresso` - Confirmação do ingresso (protegido)

## Configuração da API

O arquivo `vite.config.js` foi atualizado para incluir proxy para as chamadas da API:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Backend Flask
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## Funcionalidades de Segurança

### Frontend:
- Validação de formulários
- Proteção de rotas sensíveis
- Armazenamento seguro de tokens
- Redirecionamento automático baseado no estado de auth

### Integração com Backend:
- Autenticação JWT
- Chamadas autenticadas para APIs protegidas
- Headers de autorização automáticos
- Tratamento de erros de autenticação

## Como Usar

### 1. Para novos usuários:
1. Clique em "Resgatar ingresso" na página inicial
2. Na página de login, clique em "Cadastre-se aqui"
3. Preencha o formulário de cadastro
4. Após cadastro, será redirecionado automaticamente para o formulário

### 2. Para usuários existentes:
1. Clique em "Resgatar ingresso" na página inicial
2. Faça login com email/username e senha
3. Será redirecionado para o formulário de resgate

### 3. Logout:
- No formulário de resgate, clique no botão "Sair"
- Será redirecionado para a página inicial

## Estrutura de Arquivos Atualizada

```
src/
├── components/
│   ├── Login.jsx                 # NOVO - Página de login
│   ├── Cadastro.jsx             # NOVO - Página de cadastro
│   ├── ProtectedRoute.jsx       # NOVO - Proteção de rotas
│   ├── HomePage.jsx             # MODIFICADO - Botão agora vai para login
│   ├── FormularioResgate.jsx    # MODIFICADO - Adicionado logout e proteção
│   └── IngressoConfirmacao.jsx  # PROTEGIDO
├── hooks/
│   └── useAuth.js               # NOVO - Hook de autenticação
└── App.jsx                      # MODIFICADO - Novas rotas e AuthProvider
```

## Estados de Autenticação

O sistema gerencia os seguintes estados:

- **Não autenticado**: Acesso apenas a páginas públicas (home, login, cadastro)
- **Autenticado**: Acesso a todas as páginas, incluindo formulário e confirmação
- **Loading**: Estado transitório durante verificação de autenticação

## Integração com Backend

O frontend faz as seguintes chamadas para a API:

```javascript
// Login
POST /api/auth/login
{
  "login": "usuario123",  // email ou username
  "password": "senha123"
}

// Cadastro
POST /api/auth/register
{
  "username": "usuario123",
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

## Tratamento de Erros

- **Erros de validação**: Mostrados em tempo real nos formulários
- **Erros de API**: Exibidos em alertas visuais
- **Erros de conexão**: Mensagens apropriadas para o usuário
- **Token expirado**: Redirecionamento automático para login

## Próximos Passos Sugeridos

1. **Recuperação de senha**: Implementar fluxo de reset de senha
2. **Lembrar-me**: Opção para manter login por mais tempo
3. **Validação em tempo real**: Username/email já em uso
4. **Loading states**: Melhorar feedback visual durante carregamento
5. **Testes**: Implementar testes unitários para componentes de auth

## Testando o Sistema

Para testar o sistema completo:

1. Inicie o backend Flask (porta 5000)
2. Inicie o frontend com `npm run dev`
3. Acesse `http://localhost:5173`
4. Teste o fluxo de cadastro → login → acesso protegido → logout

O sistema está pronto para uso e integrado com a API de autenticação do backend!