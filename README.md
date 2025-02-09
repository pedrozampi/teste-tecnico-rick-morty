
# Teste Técnico

## Tecnologias
- [NestJs](https://nestjs.com/)
- [Docker](https://www.docker.com/)
- [Postgree](https://www.docker.com/)
- [Prisma](https://www.prisma.io/)
- [Pactum](https://pactumjs.github.io/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Passport](https://docs.nestjs.com/recipes/passport)
- [Axios](https://docs.nestjs.com/techniques/http-module)
- [Argor2](https://www.npmjs.com/package/argon2)

## Documentação da API

### autenticação

#### Registra Usuário e retorna JWT
Retorna o JWT
```http
  POST /auth/signup
```

| Chave   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| email | `string` | E-mail do usuário |
| password | `string` | E-mail do usuário |

#### Sigin no usuário
Retorna o JWT

```http
  POST /auth/signin
```

| Chave   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| email | `string` | E-mail do usuário |
| password | `string` | E-mail do usuário |

### Consulta de Informações

#### Realiza uma consulta sem estar autenticado
Usa cookies e caching para limitar o número de consultas, com validade de 24 horas.
```http
  GET /search/character/?page=<page>
```

#### Realiza uma consulta autenticado
Usa o email do usuário e caching para limitar o número de consultas, com validade de 24 horas.
Optei por separar do endpoint não autenticado para caso seja necessário impor demais limitações além de manter a função mais limpa e com menos lógica.
```http
  GET /search/character/?page=<page>
```

### Usuário

#### Retorna o perfil do usuário

```http
  GET /users/profile
```

#### Retorna todos os personagens favoritados

```http
  GET /users/favorite
```

#### Retorna um personagem favoritado

```http
  GET /users/favorites/:id
```

#### Adiciona um personagem ao favoritos
`Limitado a 3`

```http
  POST /users/favorite/:id
```

#### Atualiza personagem favorito

```http
  PATCH /users/favorite/:id
```
| Chave   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| id | `string` | E-mail do usuário |

#### Deleta Favorito

```http
  DELETE /users/favorite/:id
```

#### Retorna quantos episódios cada favorito apareceu

```http
  GET /users/favorite/episodes
```

#### Retorna quantos episódios os favoritos aparecem

```http
  GET /users/favorite/episodes/all
```



## Instalação

Instalar a dependências com o gerenciador de pacotes npm.

#### Necessario ter
- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/)
- [NestJs](https://nestjs.com/)

```bash
  npm install
```
    
## Teste

Utilizei [Pactum](https://pactumjs.github.io/) para aplicar a metodologia TDD(Test Driven Development) no projeto.
Todos os testes estão descritos em /test/app.e2e-spec.ts

```bash
  npm run test:e2e
```


## Iniciando ambiente de desenvolvimento

```bash
  npm run start:dev
```

## Iniciando em produção

```bash
  npm run start:prod
```