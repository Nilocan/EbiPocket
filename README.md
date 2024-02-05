# Ebi Pocket

Este trabalho apresenta um estudo de caso sobre o desenvolvimento de um sistema de pedidos online para uma loja de marmitas chinesas, com enfoque nas áreas de engenharia de software e metodologias ágeis, como Scrum e Kanban. O projeto, realizado como  prática extensionista universitária, tem como objetivo geral aprimorar a experiência do cliente, otimizar o processo de preparação na cozinha e aperfeiçoar o sistema de entregas. A pesquisa qualitativa e exploratória abrange etapas que vão desde a análise inicial e levantamento de requisitos até o design, desenvolvimento, testes e implementação do sistema, com foco nas necessidades e expectativas das partes interessadas, incluindo o restaurante, clientes e usuários. Este trabalho contribui para a integração prática de conhecimentos acadêmicos e para a aplicação de metodologias ágeis em um contexto real de negócios, com base em sólidos princípios de engenharia de software.

## Alunos integrantes da equipe

- Fernando Lúcio Mello do Couto
- Gabriel Augusto Souza Borges
- Rafael Pierre Martins
- Tito Li An Chen
- Vinicius Assis Lima

## Professores responsáveis

- Soraia Lúcia da Silva
- Joyce Christina de Paiva Carvalho

## Instruções de utilização

Para executar o sistema, é necessário ter instalado:
- Node.js (pelo menos na versão 18)
- Docker

Depois de clonar o projeto, entre nas pastas `Codigo/frontend` e `Codigo/backend` e execute o seguinte comando para instalar as dependências:

```
npm install
```

### Configuração do backend

Na pasta `Codigo/backend`, siga os seguintes passos:

O banco de dados de desenvolvimento executa em um container, é necessário configurá-lo com o comando:
```
docker compose up
```

Depois disso, consiga acesso ao arquivo `.env` com algum dos desenvolvedores do projeto. Nele, se encontram dados como as credenciais do banco de dados.

Para configurar o banco de dados, é necessário executar suas migrations com o seguinte comando:
```
npm run typeorm:run-migrations
```

Nesse momento, já possível executar o backend:
```
npm run start:dev
```

### Configuração do frontend

Na pasta `Codigo/frontend`, siga os seguintes passos:

Consiga acesso ao arquivo `.env` com algum dos desenvolvedores do projeto. Nele, se encontram dados como o endereço do backend

Execute o frontend com o seguinte comando:
```
npm run dev
```
