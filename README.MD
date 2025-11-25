# 📚 Catálogo de Livros (Book Catalog API)

> Uma plataforma moderna para gerenciamento de acervo bibliográfico, com foco em experiência do usuário e performance.

## 📖 Sobre o Projeto

O **Project Book Catalog** é uma aplicação Full Stack desenvolvida como parte da avaliação da disciplina de Backend. O objetivo é fornecer uma API robusta para cadastro de livros e autores, consumida por um frontend moderno e responsivo.

A aplicação permite:

- Autenticação de usuários (Login/Cadastro) com JWT.
    
- Gerenciamento completo de livros (CRUD).
    
- Visualização de dashboard com métricas do acervo.
    
- Interface rica com tema escuro/claro e animações.
    

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna e performática:

### **Frontend (Client-Side)**

- **React (Vite):** Biblioteca principal para interface.
    
- **TypeScript:** Para tipagem estática e segurança de código.
    
- **Tailwind CSS:** Framework de estilização utilitária.
    
- **Shadcn/ui:** Componentes de UI reutilizáveis e acessíveis.
    
- **React Router Dom:** Gerenciamento de rotas.
    
- **Axios:** Cliente HTTP para comunicação com a API.
    
- **Lucide React:** Ícones vetoriais.
    

### **Backend (Server-Side)**

- **Node.js & Express:** Servidor e roteamento da API.
    
- **SQLite:** Banco de dados relacional leve (arquivo local).
    
- **Sequelize:** ORM para interação com o banco de dados.
    
- **JWT (JsonWebToken):** Autenticação segura.
    
- **Bcryptjs:** Criptografia de senhas.
    

## 🚀 Como Rodar o Projeto

Este projeto é um **monorepo** (Frontend e Backend no mesmo repositório). Siga os passos abaixo para rodar ambos simultaneamente.

### Pré-requisitos

- **Node.js** (Versão LTS recomendada)
    
- **Git**
    

### 1. Clonar o Repositório

git clone [https://github.com/Lucas-Sabino01/Project-Book-Catalog](https://github.com/Lucas-Sabino01/Project-Book-Catalog)

cd Project-Book-Catalog

### 2. Configurar e Rodar o Backend (API)

Abra um terminal e navegue até a pasta `api`:

```
cd api

npm install
```

**Importante: Configuração de Ambiente** Você precisa criar um arquivo `.env` com a chave secreta para o JWT.

1. Crie um arquivo chamado `.env` dentro da pasta `api`.
    
2. Copie o conteúdo de `.env.example` ou use o exemplo abaixo:
    

```
SECRET=vibe_coders_secret_key_2024
```

Inicie o servidor:

```
npm run dev
# O servidor rodará em http://localhost:3001
```

### 3. Configurar e Rodar o Frontend (App)

Abra um **novo terminal** (não feche o anterior) e navegue até a pasta `frontend`:

```
cd frontend/frontend

npm install
```

Inicie a aplicação React:

```
npm run dev
# A aplicação rodará em http://localhost:3010
```
## 🧪 Rodando os Testes

O projeto conta com testes automatizados para garantir a qualidade.

Para rodar todos os testes (`Frontend`) em sequência:
```
npm test
```

 ## ⚙️ Configurações e Dicas de Desenvolvimento

### 🔒 Como se tornar Administrador (Admin)

Por padrão, novos usuários são criados com a role (`user`). Para acessar funcionalidades restritas ou visualizar rotas protegidas:

1. **Via Código (Dev Mode):**
    
    - No arquivo `api/routes/userRoutes.js`, você pode remover temporariamente os middlewares de verificação (`adminMiddleware`) das rotas GET para facilitar o desenvolvimento.
        
    - No Frontend, a lógica de proteção de rotas pode ser ajustada na página de administração conforme necessário.
    - Na pagina `src/pages/AdminPage.tsx` entre as linhas **50-56** há um metodo if, pode remover esse metodo para facilitar o desenvolvimento, para colocar
    seu usuario como **Admin**.

### Após alterações para se tornar administrador (Admin), pode adicionar novamente as linhas de codigo para funcionamento normal do site.
        

### 🗄️ Persistência do Banco de Dados

O projeto utiliza o Sequelize para sincronizar os modelos.

- O arquivo `api/database.js` está configurado com `sequelize.sync({force: false})`.
    
- Isso garante que os dados **não sejam apagados** ao reiniciar o servidor.
    
- Para resetar o banco completamente, apague o arquivo `database.db` e deixe o `sequelize.sync({force: false})` como `sequelize.sync({force: true})`,
após isso basta rodar um `npm run dev`, que as migrações irão ser geradas automaticamente, após geradas pode remover o `true` para `false`!


## 📡 Endpoints da API

A API RESTful expõe os seguintes recursos principais:

### **Autenticação**

|Método|Rota|Descrição|
|---|---|---|
|`POST`|`/api/user/auth`|Cadastrar novo usuário|
|`POST`|`/api/user/auth/login`|Autenticar usuário (recebe Token)|

### **Livros**

|Método|Rota|Descrição|Autenticação|
|---|---|---|---|
|`GET`|`/api/livros`|Listar todos os livros|Não|
|`GET`|`/api/livros/:id`|Detalhes de um livro|Não|
|`POST`|`/api/livros`|Criar novo livro|**Sim**|
|`PUT`|`/api/livros/:id`|Atualizar livro|**Sim**|
|`DELETE`|`/api/livros/:id`|Remover livro|**Sim**|

## 👥 Equipe de Desenvolvimento

- **Lucas Sabino** - _Tech Lead & Frontend Developer_
    
- **Eric Ferraz** - _Backend Developer (API & Database)_
    
- **Wayron Jhonny** - _Backend Developer (Auth & Validações)_
    
- **Gabriel Antunes** - _Documentation_

- **Francisco Maganhoto** - _Quality Assurance_

<p align="center">Desenvolvido com 💜 pela equipe</p>
