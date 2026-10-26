# Impacta

Plataforma de campanhas e participação social. Projeto containerizado com Docker (Frontend React, Backend Node/Express, MySQL e Nginx como proxy reverso com HTTPS).

## Pré-requisitos

Antes de rodar o projeto, instale:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (e deixe ele aberto/rodando)
- [mkcert](https://github.com/FiloSottile/mkcert) (para gerar o certificado HTTPS local)

No Windows, instale o mkcert via PowerShell (como administrador):

```powershell
winget install FiloSottile.mkcert
```

Depois **feche e abra o PowerShell novamente** e rode:

```powershell
mkcert -install
```

## Configuração inicial (só na primeira vez)

### 1. Clonar o repositório

```powershell
git clone <url-do-repositorio>
cd Impacta
```

### 2. Criar o arquivo `.env`

Copie o arquivo de exemplo:

```powershell
copy .env.example .env
```

O `.env` já vem com valores padrão prontos para rodar localmente — não precisa alterar nada para desenvolvimento.

### 3. Gerar o certificado HTTPS local

```powershell
mkdir nginx\certs
cd nginx\certs
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1
cd ..\..
```

Isso cria os arquivos `nginx/certs/cert.pem` e `nginx/certs/key.pem`, necessários para o Nginx servir HTTPS.

> Esses arquivos **não vão para o Git** (estão no `.gitignore`). Cada pessoa que clonar o projeto precisa gerar o seu próprio certificado seguindo este passo.

## Rodando o projeto

Na raiz do projeto, rode:

```powershell
docker-compose up --build
```

Aguarde os containers subirem (MySQL, Backend, Frontend e Nginx). Quando aparecer `webpack compiled successfully` no log do frontend, o projeto está pronto.

Acesse no navegador:

```
https://localhost
```

> No primeiro acesso, o navegador pode mostrar um aviso de certificado. Isso é esperado (é um certificado local). Clique em "Avançado" → "Continuar para localhost".

## Parando o projeto

```powershell
docker-compose down
```

## Rodando novamente (depois da primeira vez)

Não precisa repetir a configuração inicial. Basta:

```powershell
docker-compose up
```

## Problemas comuns

**Erro de porta 80/443 em uso:**
Feche o XAMPP, Skype ou qualquer outro programa que possa estar usando essas portas.

**Alterações no `.env` do frontend não aparecem:**
O React precisa recompilar para ler o `.env`. Rode:
```powershell
docker-compose build --no-cache frontend
docker-compose up
```

**Erro de cache corrompido no build:**
```powershell
docker builder prune -f
docker-compose up --build
```

## Estrutura do projeto

```
Impacta/
├── BackEnd_Impacta/    # API Node.js + Express + Sequelize
├── frontend-2026/      # Aplicação React
├── nginx/               # Configuração do proxy reverso e certificados HTTPS
├── docker-compose.yml
└── .env.example
```
