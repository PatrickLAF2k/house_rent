# 🏠 Projeto Casas - Sistema de Gerenciamento de Aluguéis

Este é um sistema completo para controle de aluguéis de casas e apartamentos, focado na crescente demanda por quitinetes no Brasil. O sistema permite o gerenciamento de locadores, locatários, imóveis e contratos de aluguel, incluindo a geração de contratos em PDF e, futuramente, um sistema de notificações automáticas para locatários.

##  🔍 Principais Funcionalidades

- Registro de Usuário: O usuário registrado é o locador do sistema.

- Autenticação: Login seguro para acesso ao sistema.

- Cadastro de Locatários: Registro de inquilinos para gestão dos contratos.

- Gerenciamento de Imóveis: Inclusão e edição de informações dos imóveis disponíveis.

- Geração de Contratos: Cria contratos contendo informações do locador, locatário e imóvel.

- Exportação de PDF: Possibilidade de gerar um contrato em PDF para assinatura das partes.

- (Futuro) Notificações: Sistema de envio de mensagens para locatários sobre vencimentos e informações importantes.🔮

## 🏗️ Estrutura do Projeto

### **Backend**: Contém a API construída com.
  - Node.js
  - Express
  - PostgreSQL
  - JWT para autenticação
  - Joi para validação de dados
  - Bcrypt para criptografia de senhas

### **Frontend**: Contém a interface do usuário construída com.
- React
- Vite

## 🗂️ Estrutura de Diretórios

```plaintext
projetoCasas/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── app.js
│   ├── tests/
│   ├── .env.example
│   ├── .gitignore
│   ├── dumb.sql
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
└── README.md
