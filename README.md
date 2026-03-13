👨‍💻 Vaga para apaixonados por criação de software
===========================================

## Solucao implementada (Angular + Node GraphQL)

Este repositorio contem uma implementacao fullstack do desafio:

- `frontend/`: Angular 18+ SPA com Angular Material e RxJS
- `backend/`: Node.js + GraphQL Yoga como BFF para GitHub Search API
- `docker-compose.yml`: sobe frontend e backend juntos

### Requisitos

- Node.js 22+
- npm 10+
- Docker + Docker Compose (opcional, para ambiente containerizado)

### Variaveis de ambiente

Use `.env.example` na raiz como referencia:

- `BACKEND_PORT` (padrao: `4000`)
- `GITHUB_TOKEN` (opcional, recomendado para maior limite da API GitHub)
- `FRONTEND_GRAPHQL_URL` (padrao local: `http://localhost:4000/graphql`)
- `NODE_ENV` (`development` local, `production` para desabilitar GraphiQL)
- `CORS_ORIGIN` (origem permitida para CORS no backend)

### Rodar localmente (sem Docker)

1) Backend

```bash
cd backend
npm install
npm run dev
```

2) Frontend (novo terminal)

```bash
cd frontend
npm install
npm run start
```

3) Acesso

- Frontend: `http://localhost:4200`
- Backend GraphQL: `http://localhost:4000/graphql`

### Testes

Backend:

```bash
cd backend
npm run test
npm run smoke
```

Frontend:

```bash
cd frontend
npm run test:unit
npm run smoke
```

### Rodar com Docker Compose

Na raiz do projeto:

```bash
docker compose up -d --build
```

Acesso:

- Frontend: `http://localhost:4200`
- Backend GraphQL: `http://localhost:4000/graphql`

### Recursos da busca

O frontend suporta busca por tipo via filtros na tela de resultados:

- `Repositories`
- `Code`
- `Commits`
- `Issues and Pull Requests`
- `Labels` (use `repoId:123456` na query)
- `Topics`
- `Users`

Para os modos `Code` e `Commits`, recomenda-se configurar `GITHUB_TOKEN` no backend para reduzir limites da API.

### Validacao final (quickstart)

Validado neste repositorio com os seguintes comandos:

```bash
# backend
cd backend && npm run smoke

# frontend
cd frontend && npm run smoke

# docker compose
cd .. && docker compose config
```

Todos os comandos acima executaram com sucesso.

### Deploy (diferencial)

O projeto esta pronto para containerizacao e deploy em qualquer plataforma com suporte a Docker.

- Backend: expose porta `BACKEND_PORT` e configure `NODE_ENV=production` + `CORS_ORIGIN`.
- Frontend: servir imagem Nginx gerada pelo `frontend/Dockerfile`.
- Opcionalmente, publicar com `docker compose` em um host (Render/Fly.io/EC2/VM).

---

A empresa
----------

Somos um [SaaS (Software as a service)](https://pt.wikipedia.org/wiki/Software_como_servi%C3%A7o) para empresas que atuam no ramo de assistências 24h.

Entregamos **controle**, **organização** e **melhor relacionamento com o cliente** para empresas de Viagens, Auto, Saúde, Funeral e também Residencial.

<p>
  <img src="assets/notro.jpg" width="955"/>
</p>

Origem
----------

Um ponto importante é que a Notro foi fundada por desenvolvedores, só por esse motivo você pode **TER CERTEZA** que aqui as coisas são muito diferentes das empresas tradicionais.

Aqui utilizamos [princípios ágeis](http://www.manifestoagil.com.br/) **DE VERDADE** para criação de software. Veja bem, não estou falando de post its ou reuniões em pé.. E sim de: Pair programming, Continuous Integration, Continuous Deployment e claro, testes automatizados.

Condições
----------
- Período: Integral
- Onde: Qualquer lugar :)
----------

A empresa não possui hierarquias e você é convidado e desafiado a colaborar com todas as frentes de trabalho. Ou seja, aqui todas sugestões são bem vindas!
Oportunidade

Estamos em busca de desenvolvedores **Frontend** FODAS e APAIXONADOS para fazer parte do nosso time de produto.

Na Notro, o seu dia-a-dia será repleto de:

```javascript
[
  'GitHub & Git <3',
  'Muito, muito e muito JavaScript',
  'Object-oriented programming, SOLID Principles & Design Patterns',
  'Práticas e princípios ágeis (Pair programming, Continuous Integration, Continuous Deployment)',
  'Testes de software (unitários, integração, e2e..)',
  'Desafios de escalabilidade',
  'Desafios de alta disponibilidade',
  'Micro services e aplicações distribuídas',
  'Amazon Web Services',
  'PAAS & Cloud Services',
  'Serverless apps',
  'Angular',
  'REST APIs',
  'GraphQL APIs',
  'Material Design',
  'Open source software'
]
```

Nossa stack é praticamente toda em JavaScript: Node.js, SPA's e Hybrid Mobile Apps.

Acreditamos que bons desenvolvedores usam a melhor ferramenta para cada problema, então, para resolver alguns problemas bem específicos usamos a melhor alternativa disponível, por isso, temos uma pitada de C#, Java e PHP também.

Nossos servidores estão na AWS e usamos a núvem como plataforma. Temos apps rodando no Elastic BeanStalk, S3 e Serverless na AWS Lambda :)

Antes do conhecimento técnico, temos preferência pelo perfil pessoal. Ou seja, se você for esforçado, interessado e curioso.. é isso que importa pra a gente! :)

Requisitos principais
----------
 - P R O A T I V I D A D E
 - Sentimento de D O N O
 - Boa comunicação e trabalho em equipe :)
 - Proficiência em JavaScript e Typescript
 - Experiência com CSS e HTML Semântico
 - Experiência sólida com Angular, Ionic, GraphQL
 - Familiaridade com princípios de UX
 - Familiaridade com APIs REST, GraphQL e WebSockets
 - Ter prática em testar software!

Os desafios de programação
----------

Se você **realmente ama** trabalhar com desenvolvimento de software e quer desafios pra sua carreira.. escolha um (ou todos) dos desafios abaixo, faça um fork desse repositório e [let the hacking begin](https://www.youtube.com/watch?v=Dvrdxn0kHL8)

<!-- &lt;challenge&gt; Frontend Developer Iniciante &lt;/challenge&gt;
----------

:exclamation: | Faça esse teste apenas se você é realmente iniciante, beleza? :)
---: | :---

<br/>

Esse desafio consiste em recortar o psd anexo nesse repositório ([Clique aqui para fazer o download](https://github.com/FieldControl/valinor/raw/master/front-end-challenge-1.zip)) para uma landing page.

Você pode usar criar os estilos na mão ou usar um framework já pronto como o Twitter Bootstrap.

A idéia é que a landing seja responsiva e deve conter todas as seções do PSD:

- Header
- Section para funcionalidades
- Section de imagens
- Section do time
- Slider com depoimentos
- Section para call to action
- Footer

A dica aqui é que seu HTML e CSS seja bem escrito e com uma boa semântica :) -->

# 🚀 Desafio Técnico – Fullstack Developer

----------

O objetivo deste desafio é avaliar suas habilidades de **frontend e backend** em um cenário prático.  
Você deverá construir uma aplicação **SPA (Single Page Application)** utilizando **Angular 18+** e também desenvolver um **backend em Node.js** (pode ser com **Express, Nest.js, GraphQL ou até Node.js puro**).

A aplicação deverá permitir que o usuário **pesquise repositórios no GitHub** (ou outra API pública de sua escolha) e exiba informações relevantes de cada repositório de forma paginada.

---

## 🎯 Objetivos

### Frontend (Angular 18+)
- Permitir pesquisar repositórios por nome.
- Listar informações relevantes: **nome, URL, descrição, contagem de watchers, estrelas, issues**, etc.
- Implementar **paginação** via API.
- Seguir boas práticas de **UX/UI**, com layout simples e organizado.

### Backend (Node.js)
- Servir como camada intermediária entre o frontend e a API externa (ex: GitHub).
- Disponibilizar **endpoints REST ou GraphQL** para o frontend consumir.
- Implementar **tratamento de erros** e boas práticas de arquitetura.
- Utilizar **estrutura clara de pastas (MVC ou modular)**.
- **Opcional:** implementar **caching** para melhorar a performance.

---

## 🧪 Diferenciais

- **Testes unitários e integrados** no frontend e backend.  
- Uso de **RxJS** no Angular para lidar com chamadas assíncronas.  
- Uso de **Angular Material** ou outra biblioteca de UI.  
- Configuração de **Docker** para subir o ambiente completo.  
- Deploy em algum serviço (Heroku, Vercel, AWS, etc).  

---

## 🔗 URLs úteis

| Descrição | URL |
|-----------|-----|
| API para pesquisar repositórios no GitHub | https://api.github.com/search/repositories?q=bootstrap |
| API para listar issues de um repositório | https://api.github.com/search/issues?q=repo:username/reponame |
| Documentação da API GitHub | https://developer.github.com/v3/search |

Se achar a API do GitHub muito "boring", pode escolher outra API pública divertida, como:
- [Star Wars (SWAPI)](https://swapi.dev)
- [Marvel](https://developer.marvel.com)
- [The Cat API](https://thecatapi.com)

---

## ✅ Requisitos mínimos

- Frontend em **Angular 18+** (obrigatório).
- Backend em **Node.js** (pode ser Express, Nest.js, GraphQL ou puro).
- Listar itens de uma API pública.
- Implementar **paginação** via API.
- Seguir **boas práticas de código, organização e clareza**.

---

## 📦 Entrega

- O código deve estar em um repositório público no GitHub/GitLab.  
- O README deve conter:
  - Instruções para rodar o frontend e backend.  
  - Dependências necessárias.  
  - Como rodar os testes.  

---

👉 Esse desafio é uma oportunidade de mostrar suas **skills técnicas** e também sua **organização de projeto**.  

Boa sorte e divirta-se! 🚀

<!-- { "challenge": "Backend Developer 1" } -->
<!-- ---------- -->

<!-- Desenvolver uma API JSON RESTful expondo operações de um CRUD. -->

<!-- Pense em algum recurso (use sua criatividade), pode ser gatos, personagens dos senhores do anéis, personagens da marvel, pokemon, enfim, o que você quiser.. -->

<!-- Utilize todos os métodos (GET, POST, PUT, PATCH, DELETE) -->

<!-- Você terá que expor os seguintes endpoints para o recurso escolhido: -->

<!-- | Método | URL  | Comportamento esperado                               |  -->
<!-- |--------| ---  |                                                  --- | -->
<!-- | GET    | /resources     | Recupera a lista dos recursos, essa ação deve ser paginada e deve possibilitar busca pelas propriedades do recurso |  -->
<!-- | GET    | /resources/:id | Recupera um recursos em especifico pelo id |  -->
<!-- | POST   | /resources     | Insere um novo recurso                     |  -->
<!-- | PUT    | /resources/:id | Altera um recurso existente                |  -->
<!-- | PATCH  | /resources/:id | Altera parcialmente um recurso existente   |  -->
<!-- | DELETE | /resources/:id | Exclui um recurso existente                | -->

<!-- - **Qual Web Framework?** pode ser Express.js, Hapi, Restify, Koa, fastify, o que você preferir :P -->
<!-- - **Qual Banco de dados?** Mesmo pensamento, pode ser MongoDb, DynamoDb, Postgres, MySql.. enfim, não importa :) -->

 <!-- **Atenção:** -->
 <!-- Você deve se preocupar com sanitização, validação e semântica.   -->
 
<!-- { "challenge": "Backend Developer" }
----------

Desenvolver uma API GraphQL em JavaScript expondo operações de um CRUD.

Pense em algum tema (use sua criatividade), pode ser gatos, personagens dos senhores do anéis, personagens da marvel, pokemon, enfim, o que você quiser..

Você terá que expor as seguintes queries e mutations para o tema escolhido:

| Tipo      | O quê?  | Comportamento esperado                               | 
|--------   | ---     |                                                  --- |
| Query     | Recuperar lista dos items     | Recupera a lista dos items, essa ação deve ser paginada e deve possibilitar busca por propriedades | 
| Query     | Recuperar um item | Recupera um item pelo id | 
| Mutation  | Adicionar um item | Insere um novo item                     | 
| Mutation  | Atualizar um item | Altera um item existente                | 
| Mutation  | Excluir um item   | Remove um item existente                | 

- **Qual Web Framework?** pode ser graphql-js, graphql-yoga, apollographql ou o que você preferir :P

- **Qual Banco de dados?** Mesmo pensamento, pode ser MongoDb, DynamoDb, Postgres, MySql.. enfim, não importa :)

 **Atenção:**
 Você deve se preocupar com validação e semântica.  -->

Dúvidas?
----------
Abra um issue ou mande um e-mail para **igor@notro.io** ou **luiz@fieldcontrol.com.br**, fechou? :)

Avaliação
----------

Entre os critérios de avaliação estão:

- Código limpo e organização
- Testes de software (unitários e integrados)
- Semântica
- Documentação do projeto (README)
- Segurança

Entrega
----------

Você deve enviar a resolução do desafio via pull request nesse mesmo repositório :)

Gostariamos de entender como você pensa e as decisões que você tomou durante o desenvolvimento. Então, quando for enviar seu pull request, por favor responda:

- Qual ferramentas e bibliotecas (libraries, framework, tools etc) você usou
- Porque você optou pela tecnologia X e não a Y
- Quais princípios da engenharia de software que você usou?
- Desafios e problemas que você enfrentou e como você resolveu
- O que você entende que pode ser melhorado e como fazer isso
