
# FindWare

**FindWare** é um sistema moderno de gestão de estoque, desenvolvido para facilitar o controle, visualização e otimização de inventário para pequenas e médias empresas.

## ✨ Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Adição, edição e remoção de produtos do estoque
- Visualização de métricas e gráficos financeiros do inventário
- Alertas automáticos de estoque crítico
- Pesquisa e filtro de produtos em tempo real
- Interface responsiva e moderna

## 🖥️ Tecnologias Utilizadas

### Frontend
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [ApexCharts](https://apexcharts.com/) (gráficos)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/) (autenticação)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) (hash de senha)
- [dotenv](https://github.com/motdotla/dotenv) (variáveis de ambiente)

## 📁 Estrutura do Projeto

```
FindWare/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── setup-db.js
│   ├── package.json
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middlewares/
│       └── routes/
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       └── styles/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## ⚡ Instalação e Execução

### Pré-requisitos
- Node.js >= 18
- PostgreSQL

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/findware.git
cd findware
```

### 2. Backend

```bash
cd backend
cp .env.example .env # Edite as variáveis conforme seu ambiente
npm install
node setup-db.js     # Cria o banco e tabelas
npm start            # Inicia o servidor em http://localhost:3000
```

### 3. Frontend

Abra outro terminal e execute:

```bash
cd frontend
npm install
npm run dev          # Inicia o frontend em http://localhost:5173
```

### 4. Acesse o sistema

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 🔑 Variáveis de Ambiente

No backend, configure o arquivo `.env` com:

```
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/findware
JWT_SECRET=sua_chave_secreta
```

## 🛠️ Principais Comandos

### Backend
- `npm start` — Inicia o servidor Express
- `node setup-db.js` — Cria o banco e tabelas

### Frontend
- `npm run dev` — Inicia o Vite em modo desenvolvimento
- `npm run build` — Gera build de produção
- `npm run lint` — Executa o ESLint

## 🚀 Deploy

O projeto está pronto para deploy em plataformas como [Vercel](https://vercel.com/) ou [Heroku](https://heroku.com/). Veja o arquivo `vercel.json` para configuração de rotas SPA.

## 👤 Autenticação

O sistema utiliza autenticação JWT. Usuários precisam se cadastrar e fazer login para acessar as rotas protegidas e gerenciar o estoque.

## 📊 Métricas e Gráficos

O painel exibe métricas de estoque, ticket médio, produtos críticos e gráficos de distribuição financeira em tempo real.

## 📢 Alertas de Estoque Crítico

Produtos com estoque abaixo de 5 unidades são destacados em alertas para rápida reposição.

## 📄 Licença

Este projeto é open-source e pode ser utilizado e modificado livremente.
