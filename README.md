# 🚀 Sistema de Gestão de Eventos - Guia Completo

Este documento detalha os passos necessários para configurar e executar o projeto completo de gestão de eventos, incluindo frontend React, backend Flask e funcionalidades de segurança avançadas.

## 📁 Estrutura do Projeto

O projeto é dividido em duas partes principais:

-   `evento-site/`: Frontend desenvolvido em React + Vite + Tailwind CSS
-   `evento-backend/`: Backend desenvolvido em Flask com segurança enterprise-grade

```
. (diretório raiz do projeto)
├── evento-site/                 # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ui/              # Componentes Shadcn/UI
│   │   │   ├── Login.jsx        # Sistema de autenticação
│   │   │   ├── FormularioResgate.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── IngressoConfirmacao.jsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── main.jsx
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
│
└── evento-backend/              # Backend Flask
    ├── src/
    │   ├── models/              # Modelos de dados
    │   │   ├── user.py          # Usuário (autenticação)
    │   │   ├── participante.py  # Participante do evento
    │   │   ├── login_attempt.py # Rate limiting
    │   │   └── audit_log.py     # Log de auditoria
    │   ├── routes/              # Rotas da API
    │   │   ├── user.py          # Autenticação e MFA
    │   │   └── evento.py        # Gestão de ingressos
    │   ├── utils/               # Utilitários
    │   │   └── encryption.py    # Criptografia AES-256
    │   ├── static/              # Frontend compilado (produção)
    │   ├── config.py            # Configurações multi-ambiente
    │   └── main.py              # Aplicação principal
    ├── scripts/                 # Scripts de automação
    │   ├── audit_python.py      # Auditoria de segurança Python
    │   ├── audit_nodejs.js      # Auditoria de segurança Node.js
    │   ├── pre_deploy_audit.py  # Auditoria pré-deploy
    │   └── setup_postgresql.sql # Setup do banco de dados
    ├── tests/                   # Testes automatizados
    ├── audit_reports/           # Relatórios de segurança
    ├── requirements.txt         # Dependências Python
    ├── .env.example             # Exemplo de variáveis de ambiente
    └── gunicorn_config.py       # Configuração do servidor de produção
```

## 🛠️ Pré-requisitos

Certifique-se de ter o seguinte software instalado em sua máquina:

### Ferramentas Obrigatórias

-   **Node.js** (versão 18 ou superior) e **pnpm**
    -   Instale o Node.js: [nodejs.org](https://nodejs.org/)
    -   Instale o pnpm: `npm install -g pnpm`
-   **Python** (versão 3.9 ou superior)
    -   Instale o Python: [python.org](https://www.python.org/)
    -   Certifique-se de que `pip` está instalado
-   **Git**
    -   Instale o Git: [git-scm.com](https://git-scm.com/)

### Banco de Dados

**Desenvolvimento:** SQLite (incluído, nenhuma instalação necessária)

**Produção (escolha um):**
-   **PostgreSQL** (versão 12+, RECOMENDADO)
    -   [postgresql.org](https://www.postgresql.org/download/)
-   **MySQL** (versão 8+, alternativa)
    -   [mysql.com](https://dev.mysql.com/downloads/)

### Ferramentas Opcionais

-   **VS Code**: Editor recomendado
-   **Postman/Insomnia**: Testes de API
-   **PostgreSQL/MySQL Client**: Gerenciamento de banco de dados

## ⬇️ Configuração do Projeto

### 1. Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_REPOSITORIO>
```

### 3. Configurar o Backend (Flask)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd ../evento-backend
    ```

2.  **Crie e ative um ambiente virtual Python:**
    ```bash
    # Linux/macOS
    python3 -m venv venv
    source venv/bin/activate
    
    # Windows PowerShell
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    
    # Windows CMD
    python -m venv venv
    venv\Scripts\activate.bat
    ```

3.  **Instale as dependências do Python:**
    ```bash
    pip install -r requirements.txt
    ```
    
    **Pacotes principais instalados:**
    - `Flask 3.1.1` - Framework web
    - `Flask-SQLAlchemy` - ORM para banco de dados
    - `Flask-CORS` - Suporte a CORS
5.  **Configure o Banco de Dados (apenas primeira instalação):**

    **Opção A: Desenvolvimento com SQLite (mais simples)**
    
    Não requer configuração! O SQLite cria o arquivo automaticamente na primeira execução.
    
    ```bash
    # As tabelas serão criadas automaticamente na primeira execução
    python src/main.py
    ```
    
    **Opção B: Produção com PostgreSQL (recomendado)**
    
    *Este passo é necessário apenas na primeira vez em uma máquina nova.*
    
    **5.1. Execute o script de setup:**
    ```bash
    # Linux/macOS
    psql -U postgres -f scripts/setup_postgresql.sql
    
    # Windows
    psql -U postgres -f scripts\setup_postgresql.sql
    ```
    
    **O script cria:**
    - Banco de dados `evento_db`
    - Usuário `evento_admin` (criar tabelas)
    - Usuário `evento_app_user` (aplicação - **permissões restritas**)
    
    **5.2. Crie as tabelas (use evento_admin temporariamente):**
    
    Edite `.env` temporariamente:
    ```env
    DATABASE_TYPE=postgresql
    DB_USER=evento_admin
    DB_PASSWORD=Ev3nt0@Adm1n#2024$SecurePass!
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=evento_db
    ```
    
    Execute para criar tabelas:
    ```bash
    python src/main.py
    # Pressione Ctrl+C após ver "Running on..."
    ```
    
    **5.3. Configure permissões restritas:**
    ```bash
    psql -U postgres -d evento_db
    ```
    
    Execute no console PostgreSQL:
    ```sql
    -- Permissões APENAS para SELECT, INSERT, UPDATE (sem DELETE/DROP)
    GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO evento_app_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO evento_app_user;
    
    -- Futuras tabelas
    ALTER DEFAULT PRIVILEGES FOR ROLE evento_admin IN SCHEMA public 
        GRANT SELECT, INSERT, UPDATE ON TABLES TO evento_app_user;
    
    ALTER DEFAULT PRIVILEGES FOR ROLE evento_admin IN SCHEMA public 
        GRANT USAGE, SELECT ON SEQUENCES TO evento_app_user;
    
    \q
    ```
    
    **5.4. Volte `.env` para usuário da aplicação:**
    ```env
    DB_USER=evento_app_user
    DB_PASSWORD=evento_secure_password_2024
    ```

6.  **Copie os arquivos estáticos do frontend para o backend (opcional):**
    pip install -r requirements.txt
    ```
4.  **Configure o PostgreSQL (APENAS UMA VEZ - primeira instalação):**
    
    *Este passo é necessário apenas na primeira vez que você configurar o projeto em uma máquina nova.*
    
    **4.1. Execute o script de setup do banco de dados:**
    ```bash
    # Cria banco de dados, usuários e permissões
    psql -U postgres -f scripts/setup_postgresql.sql
    ```
    
    Este script cria:
    - Banco de dados `evento_db`
    - Usuário `evento_admin` (para criar tabelas)
    - Usuário `evento_app_user` (para a aplicação - **permissões restritas**: apenas SELECT, INSERT, UPDATE)
    
    **4.2. Crie as tabelas com usuário admin:**
    
    Edite temporariamente o arquivo `.env` no `evento-backend`:
    ```env
    DB_USER=evento_admin
    DB_PASSWORD=Ev3nt0@Adm1n#2024$SecurePass!
    ```
    
    Execute a aplicação para criar as tabelas:
    ```bash
    python src/main.py
    ```
    
    Pressione `Ctrl+C` após ver as mensagens de log.
    
    **4.3. Conceda permissões restritas ao usuário da aplicação:**
    ```bash
    psql -U postgres -d evento_db
    ```
    
    Execute no console do PostgreSQL:
    ```sql
    -- Conceder permissões APENAS SELECT, INSERT, UPDATE
    GRANT SELECT, INSERT, UPDATE ON participante TO evento_app_user;
    GRANT SELECT, INSERT, UPDATE ON "user" TO evento_app_user;
    
    -- Permitir uso de sequences (IDs auto-incrementados)
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO evento_app_user;
    
    -- Para futuras tabelas
    ALTER DEFAULT PRIVILEGES FOR ROLE evento_admin IN SCHEMA public 
        GRANT SELECT, INSERT, UPDATE ON TABLES TO evento_app_user;
    
    ALTER DEFAULT PRIVILEGES FOR ROLE evento_admin IN SCHEMA public 
        GRANT USAGE, SELECT ON SEQUENCES TO evento_app_user;
    
    -- Sair
    \q
    ```
    
    **4.4. Volte o arquivo `.env` para o usuário da aplicação:**
    ```env
    DB_USER=evento_app_user
    DB_PASSWORD=evento_secure_password_2024
    ```
## ▶️ Como Rodar o Projeto

Você precisará iniciar o frontend e o backend em terminais separados.

### 1. Iniciar o Backend (Flask API)

Abra um terminal no VS Code, navegue até `evento-backend` e execute:

```bash
cd evento-backend

# Ative o ambiente virtual
# Linux/macOS
source venv/bin/activate

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Inicie o servidor Flask
# Desenvolvimento (localhost apenas)
python src/main.py

# Desenvolvimento (rede local)
flask run --host=0.0.0.0 --port=5000

# Produção (use gunicorn)
gunicorn -c gunicorn_config.py src.main:app
## 🌐 Acessando o Sistema

Com ambos os servidores rodando, abra seu navegador e acesse:

### Frontend (Desenvolvimento)
**`http://localhost:5173`**

### Frontend (Produção - servido pelo Flask)
**`http://localhost:5000`**

**Funcionalidades disponíveis:**
- ✅ Registro de usuários
- ✅ Login com MFA (autenticação de dois fatores)
- ✅ Resgate de ingressos
- ✅ Visualização de dados do participante
- ✅ Gerenciamento de sessão
- ✅ Proteção contra ataques (XSS, CSRF, SQL Injection)

O frontend React faz requisições automáticas para o backend Flask. Todas as rotas da API estão em `/api/*`.
## 🔧 Troubleshooting

### Erros Comuns do Backend (Flask)

**"ModuleNotFoundError"**
```bash
# Verifique se o ambiente virtual está ativado
which python  # Linux/macOS
where python  # Windows

# Reinstale as dependências
pip install -r requirements.txt
```

**"SECRET_KEY ou ENCRYPTION_KEY não configurados"**
```bash
# Gere novas chaves
python -c "import secrets; print(secrets.token_hex(32))"

# Adicione ao arquivo .env
```

**"Banco de dados não encontrado" (PostgreSQL)**
```bash
# Verifique se PostgreSQL está rodando
# Windows
Get-Service postgresql*

# Linux/macOS
sudo systemctl status postgresql

# Verifique se o banco existe
psql -U postgres -l | grep evento_db
```

**"permission denied for table"**
```sql
-- Execute as permissões novamente (passo 5.3)
psql -U postgres -d evento_db
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO evento_app_user;
```

**"relation does not exist"**
```bash
# Recrie as tabelas com evento_admin
# Edite .env para DB_USER=evento_admin
python src/main.py
# Volte DB_USER=evento_app_user
```

### Erros Comuns do Frontend (React)

## 🔐 Funcionalidades de Segurança

Este projeto implementa segurança de nível empresarial (enterprise-grade):

### Autenticação e Autorização
- ✅ **Hash de senhas** com Argon2 (vencedor do Password Hashing Competition)
- ✅ **MFA (Multi-Factor Authentication)** com TOTP (Google Authenticator)
- ✅ **Tokens JWT** com expiração configurável
- ✅ **Sessões seguras** com cookies HttpOnly e SameSite
- ✅ **Revalidação de usuário** a cada 30 minutos

### Proteção contra Ataques
- ✅ **Rate Limiting**: 5 tentativas de login → bloqueio de 30 minutos
- ✅ **SQL Injection**: Prepared statements em todas as queries
- ✅ **XSS**: Sanitização automática de inputs
- ✅ **CSRF**: Tokens CSRF em formulários
- ✅ **Clickjacking**: Headers X-Frame-Options
- ✅ **HTTPS**: Redirecionamento automático em produção

### Criptografia
- ✅ **AES-256-GCM** para dados sensíveis (CPF, telefone)
- ✅ **TLS/SSL** para comunicação (produção)
- ✅ **Secrets management** com variáveis de ambiente

### Auditoria e Compliance
- ✅ **Audit Logs**: Registro de todas as ações críticas
- ✅ **Dependency Audit**: Verificação automática de vulnerabilidades
- ✅ **Security Headers**: CSP, HSTS, X-Content-Type-Options
- ✅ **IDs públicos**: UUIDs ao invés de IDs incrementais

### Banco de Dados (Princípio do Menor Privilégio)
- ✅ **evento_app_user**: SELECT, INSERT, UPDATE apenas
- ❌ **SEM permissões**: DROP, DELETE, CREATE, ALTER

## 📊 Auditoria de Dependências

O projeto inclui scripts automatizados para verificar vulnerabilidades:

```bash
cd evento-backend

# Auditoria Python
python scripts/audit_python.py

# Auditoria Node.js
node scripts/audit_nodejs.js

# Auditoria completa (Python + Node.js)
python scripts/pre_deploy_audit.py

# Corrigir vulnerabilidades automaticamente
python scripts/pre_deploy_audit.py --fix

# Política strict (bloquear apenas high/critical)
python scripts/pre_deploy_audit.py --fail-on high
```

**Relatórios gerados em:** `audit_reports/`
- `python_audit.json` - Vulnerabilidades Python
- `nodejs_audit.json` - Vulnerabilidades Node.js
- `consolidated_audit.json` - Relatório consolidado

**Última auditoria:** Todas as dependências seguras (0 vulnerabilidades)

## 📚 Documentação Adicional

O projeto inclui documentação completa em arquivos Markdown:

### Segurança
- `SECURITY_HEADERS.md` - Configuração de headers de segurança
- `SQL_INJECTION_PROTECTION.md` - Proteção contra SQL Injection
- `RATE_LIMITING_LOGIN.md` - Sistema de rate limiting
- `MFA_SETUP.md` - Configuração de autenticação multi-fator
- `ENCRYPTION.md` - Criptografia de dados sensíveis
- `SESSION_MANAGEMENT.md` - Gerenciamento de sessões

### Configuração
- `CONFIG_AMBIENTES.md` - Configuração multi-ambiente
- `DATABASE_SETUP.md` - Setup do banco de dados
- `PRODUCTION_DEPLOY.md` - Deploy em produção
- `HTTPS_CONFIG_SUMMARY.md` - Configuração HTTPS

### Auditoria
- `AUDITORIA_DEPENDENCIAS.md` - Sistema de auditoria completo
- `RESUMO_AUDITORIA.md` - Resumo da última auditoria

### Funcionalidades
- `FEATLOGIN.md` - Sistema de login
- `USERNAME_VALIDATION.md` - Validação de usernames
- `TICKET_REDEMPTION_CONCURRENCY.md` - Resgate de ingressos

## 🚀 Deploy em Produção

### Pré-requisitos
1. Servidor Linux (Ubuntu 20.04+)
2. PostgreSQL configurado
3. Nginx ou Apache
4. Certificado SSL (Let's Encrypt)

### Passos Rápidos

```bash
# 1. Clonar repositório
git clone <repo-url>
cd evento-backend

# 2. Configurar ambiente
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configurar .env para produção
cp .env.example .env
# Edite .env com credenciais de produção

# 4. Auditoria de segurança
python scripts/pre_deploy_audit.py --fail-on high

# 5. Build do frontend
cd ../evento-site
pnpm install
pnpm run build
cp -r dist/* ../evento-backend/src/static/

# 6. Iniciar serviço
cd ../evento-backend
gunicorn -c gunicorn_config.py src.main:app
```

**Veja documentação completa em:** `PRODUCTION_DEPLOY.md`

## 🧪 Testes

O projeto inclui testes automatizados:

```bash
cd evento-backend

# Executar todos os testes
python -m pytest tests/ -v

# Testes específicos
python -m pytest tests/test_rate_limiting.py -v
python -m pytest tests/test_security_headers.py -v
python -m pytest tests/test_username_validation.py -v

# Cobertura de testes
python -m pytest tests/ --cov=src --cov-report=html
```

## 📞 Suporte

Para mais ajuda, consulte:
- Documentação nos arquivos `.md` do `evento-backend/`
- Issues no repositório
- Logs da aplicação em `evento-backend/app.log`

---

**Desenvolvido com foco em segurança e boas práticas de desenvolvimento.**
npm install -g pnpm
```

### Problemas de Segurança

**"Rate limit exceeded"**
- Aguarde 30 minutos após 5 tentativas de login falhas
- Ou limpe o banco de dados de login_attempt

**"MFA token inválido"**
- Sincronize o horário do sistema
- Verifique se o QR code foi escaneado corretamente
- Use o secret key manualmente no app autenticador

**"Sessão expirada"**
- Sessões expiram após 15 minutos de inatividade
- Faça login novamente
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview
```

**O frontend estará disponível em:**
- Desenvolvimento: `http://localhost:5173`
- Preview: `http://localhost:4173`

### 2. Iniciar o Frontend (React Development Server)

Abra *outro* terminal no VS Code, navegue até `evento-site` e execute:

```bash
cd evento-site
pnpm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou a porta indicada no terminal).

## 🌐 Acessando o Site

Com ambos os servidores rodando, abra seu navegador e acesse:

**`http://localhost:5173`**

O frontend (React) fará as requisições para o backend (Flask) automaticamente. Você poderá interagir com o site completo, preencher o formulário, resgatar ingressos e visualizar a página de confirmação.

## Troubleshooting

-   **"ModuleNotFoundError" no Flask:** Certifique-se de que o ambiente virtual está ativado (`source venv/bin/activate`) e que as dependências foram instaladas (`pip install -r requirements.txt`).
-   **Página em branco no React:** Verifique o console do navegador para erros. Certifique-se de que o servidor de desenvolvimento do React está rodando e que não há erros de compilação.
-   **Erros de CORS:** O backend Flask já está configurado para lidar com CORS, mas se encontrar problemas, verifique a configuração no `main.py` do Flask.
-   **"permission denied for table" no PostgreSQL:** Execute o passo 4.3 da configuração do backend (Conceder permissões restritas).
-   **"relation does not exist" no PostgreSQL:** Execute o passo 4.2 da configuração do backend (Criar tabelas com evento_admin).
-   **"connection refused" do PostgreSQL:** Verifique se o PostgreSQL está rodando:
    ```bash
    # Windows
    Get-Service postgresql*
    
    # Linux/Mac
    sudo systemctl status postgresql
    ```

## 🔐 Segurança do Banco de Dados

O projeto implementa o **Princípio do Menor Privilégio** para o banco de dados:

-   **evento_app_user** (usuário da aplicação) possui APENAS:
    -   ✅ `SELECT` - Leitura de dados
    -   ✅ `INSERT` - Inserção de registros
    -   ✅ `UPDATE` - Atualização de registros
-   **SEM permissões de**:
    -   ❌ `DROP` - Excluir tabelas
    -   ❌ `DELETE` - Excluir registros
    -   ❌ `CREATE` - Criar tabelas
    -   ❌ `ALTER` - Modificar estrutura

Para mais detalhes, consulte `evento-backend/DATABASE_SETUP.md`.

Se precisar de mais ajuda, me avise!
