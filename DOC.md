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
4.  **Copie os arquivos estáticos do frontend para o backend:**
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
flask run # $env:FLASK_APP = "src/main.py"; flask run
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

Se precisar de mais ajuda, me avise!
