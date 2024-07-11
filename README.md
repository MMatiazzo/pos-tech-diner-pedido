# Microsserviço Pedido🧾

Projeto desenvolvido para entrega do *Tech Challenge* da **Pós Tech - Software Architecture** (Fase 5).

# To-do Readme
- [ ] Ajustar link do projeto de infraestrutura
- [ ] Ajustar link/imagem do vídeo de apresentação
- [ ] Criar diagramas do funcionamento do projeto (SAGA + Arquitetura)
- [ ] Adicionar anexos do relatório de segurança (OWASP Zap)


## Grupo 11 - SOAT 4
- Alexandre Mikio Kimura Fukano - **RM 351127** (alexandremkimura@hotmail.com)
- Lucas Proença Renó - **RM 351351** (lucasreno9@gmail.com)
- Matheus Agusuto Leme Matiazzo - **RM 351128** (mathmatiazzo@gmail.com)
- Vinicius Carloto Carnelocce - **RM 351126** (viniciuscarloto@gmail.com)

## Visão Geral
O projeto foi desenvolvido para ajudar uma lanchonete de bairro em expansão que ainda não possui um sistema de controle de pedidos. A aplicação consiste em quatro microserviços:
- [Pedido](https://github.com/MMatiazzo/pos-tech-diner-pedido): Responsável por gerenciar os pedidos dos usuários e os produtos;
- [Produção](https://github.com/MMatiazzo/pos-tech-diner-producao): Responsável por gerenciar a produção dos pedidos;
- [Cliente](https://github.com/MMatiazzo/pos-tech-diner-cliente): Responsável por autenticar os usuários;
- [Pagamento](https://github.com/MMatiazzo/pos-tech-diner-pagamento): Responsável por gerenciar os pagamentos dos pedidos;

## Infraestrutura
Além dos microsserviços, existe um [projeto de infraestrutura](https://github.com/MMatiazzo/) que visa criar uma infraestrutura para os microsserviços da aplicação utilizando Amazon Web Services. O projeto foi desenvolvido utilizando Terraform e Github Actions.

## Vídeo de Apresentação - Fase 5
[![Vídeo de Apresentação](https://img.youtube.com/vi/1Q6Q1Q1Q1Q1Q/0.jpg)](https://www.youtube.com/watch?v=1Q6Q1Q1Q1Q1Q)


## Objetivo

Este projeto visa criar um microsserviço para gerenciar os pedidos de uma lanchonete. O microsserviço é responsável por cadastrar, listar, editar e deletar produtos e pedidos.

## Funcionamento

### Padrão SAGA

O padrão SAGA é um padrão de design de software que permite manter a consistência dos dados em um sistema distribuído. 

#### Padrão SAGA Coreografado

Escolhemos utilizar o padrão **SAGA Coreografado** para garantir a consistência dos dados entre os microsserviços. A sua escolha se deu por ser um padrão mais simples, além de ser mais adequado para sistemas com poucos microsserviços e poucas etapas. Uma vez que cada microsserviço é responsável apenas por publicar e consumir eventos, não havendo necessidade de um microsserviço orquestrador para controlar o fluxo.

### Diagramas
![infra](https://github.com/lucasreno/FoodieFlowInfra/assets/62509668/7c38cada-664a-4c45-a5c0-d3b0f7cdce47)


## Segurança

Validamos os microsserviços com auxílio da ferramente OWASP Zap, que identificou algumas vulnerabilidades como:
#### Nível de Risco Alto
- SQL Injection (1 instância)
#### Nível de Risco Baixo
- Application Error Disclosure (1 instância)
- Divulgação de Informações - Mensagens de Erro de Depuração (1 instância)
- Vazamento de Informações - Cabeçalhos de Resposta HTTP (4 instâncias)
- X-Content-Type-Options Header Missing (3 instância)

#### Ações Tomadas
Todas as vulnerabilidades foram corrigidas, sendo a maioria delas corrigidas com a utilização de bibliotecas de validação e tratamento de exceções.

### Stack utilizada:

#### Core
- TypeScript: Superset da linguagem JavaScript que adiciona tipagem estática opcional.
- NestJS: Framework para construção de aplicações server-side eficientes e escaláveis.
- Mongoose: ODM para modelar os dados da aplicação.
- MongoDB: Banco de dados NoSQL orientado a documentos.
- Prisma: ORM para Node.js e TypeScript.
- AWS SDK: SDK para interagir com os serviços da AWS.
- SQS Client: Cliente para interagir com o Amazon Simple Queue Service.

#### Testes
- Jest: Framework de testes em JavaScript.
- Cucumber: Ferramenta para executar testes de aceitação.
- NestJS Testing: Biblioteca para testar aplicações NestJS.

#### Code Quality
- ESLint: Ferramenta para identificar e reportar padrões encontrados no código ECMAScript/JavaScript.
- Prettier: Ferramenta para formatar o código.
- SonarQube: Ferramenta para análise contínua da qualidade do código.

#### Infraestrutura
- Terraform: Ferramenta para construir, alterar e versionar infraestrutura de forma segura e eficiente.
- AWS: Serviços de computação em nuvem da Amazon.
- Github Actions: Ferramenta de integração contínua.
- Docker: Plataforma para desenvolvimento, envio e execução de aplicações em containers.
- Kubernetes: Sistema de orquestração de containers.

#### Outros
- Git: Sistema de controle de versão distribuído.
- Github: Plataforma de hospedagem de código-fonte e arquivos com controle de versão usando o Git.
- Postman: Ferramenta para testar APIs.
- Class Transformer: Biblioteca para transformar objetos em classes e vice-versa.
- Class Validator: Biblioteca para validação de classes.
- Reflect Metadata: API para metadados de objetos.
- RxJS: Biblioteca para programação reativa.


## Rodando o projeto localmente

### 1. Clone o projeto e utilize a branch principal `master`
```bash
git clone https://github.com/MMatiazzo/pos-tech-diner-pedido
cd pos-tech-diner-pedido
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Substitua a variável DATABASE_URL
```bash
Substitua a váriavel DATABASE_URL com a connection string mongodb
```

### 4. Execute o projeto
```bash
npm run start:dev
```
<br>

# Postman

Deixamos uma collection com os requests no arquivo `micro-services.postman_collection.json` na raiz do projeto.
