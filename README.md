# 🚀 Como Rodar o Projeto Localmente no seu VS Code

Este documento detalha os passos necessários para configurar e executar o projeto do site de eventos no seu ambiente de desenvolvimento local (VS Code).

## 📁 Estrutura do Projeto

O projeto é dividido em duas partes principais:

-   `evento-site/`: Contém o frontend desenvolvido em React.
-   `evento-backend/`: Contém o backend desenvolvido em Flask.

```
. (diretório raiz do projeto)
├── evento-site/          # Frontend React
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
│
└── evento-backend/       # Backend Flask
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── static/       # Frontend compilado será copiado para cá
    │   └── main.py
    ├── .gitignore
    ├── requirements.txt
    └── venv/             # Ambiente virtual Python
```

## 🛠️ Pré-requisitos

Certifique-se de ter o seguinte software instalado em sua máquina:

-   **Node.js** (versão 18 ou superior) e **pnpm** (gerenciador de pacotes)
    -   Instale o Node.js em [nodejs.org](https://nodejs.org/)
    -   Instale o pnpm: `npm install -g pnpm`
-   **Python** (versão 3.9 ou superior)
    -   Instale o Python em [python.org](https://www.python.org/)
-   **PostgreSQL** (versão 12 ou superior)
    -   Instale o PostgreSQL em [postgresql.org](https://www.postgresql.org/download/)
    -   Certifique-se de que o serviço PostgreSQL está rodando
-   **Git**
    -   Instale o Git em [git-scm.com](https://git-scm.com/)

## ⬇️ Configuração do Projeto

### 1. Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA_DO_REPOSITORIO>
```

### 2. Configurar o Frontend (React)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd evento-site
    ```
2.  **Instale as dependências do JavaScript:**
    ```bash
    pnpm install
    ```
3.  **Construa o projeto para produção (opcional, mas recomendado para o backend):**
    ```bash
    pnpm run build
    ```
    Isso criará uma pasta `dist/` com os arquivos estáticos do frontend.

### 3. Configurar o Backend (Flask)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd ../evento-backend
    ```
2.  **Crie e ative um ambiente virtual Python:**
    ```bash
    python3 -m venv venv # & "C:\Users\gabrielrodrigues\AppData\Local\Programs\Python\Python314\python.exe" -m venv venv
    source venv/bin/activate  # No Windows: .\venv\Scripts\activate
    ```
3.  **Instale as dependências do Python:**
    ```bash
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
    
    *Nota: Em máquinas onde o banco já está configurado (banco e usuários existem), você pode pular o passo 4 e ir direto para o passo 5.*

5.  **Copie os arquivos estáticos do frontend para o backend:**
    Se você executou `pnpm run build` no frontend, copie os arquivos gerados para a pasta `static` do backend. Certifique-se de estar no diretório `evento-backend`:
    ```bash
    Remove-Item -Recurse -Force .\src\static\*
    Copy-Item -Recurse -Force ..\evento-site\dist\* .\src\static\
    ```
    *Nota: Este passo é crucial para que o Flask sirva os arquivos do React. Se você for rodar o frontend e o backend separadamente (como descrito abaixo), este passo não é estritamente necessário para o desenvolvimento, mas é para a implantação ou para servir o frontend via Flask.*

## ▶️ Como Rodar o Projeto

Você precisará iniciar o frontend e o backend em terminais separados.

### 1. Iniciar o Backend (Flask API)

Abra um terminal no VS Code, navegue até `evento-backend` e execute:

```bash
cd evento-backend
source venv/bin/activate  # No Windows: .\venv\Scripts\activate
# Localmente
flask run # $env:FLASK_APP = "src/main.py"; flask run
# Servidor Local
flask run --host=0.0.0.0 --port=5000
```

O backend estará disponível em `http://localhost:5000`.

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
