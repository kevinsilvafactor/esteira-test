# esteira-test

Encurtador de URL construído de ponta a ponta pela esteira do Factor OS.
Este repositório é o alvo do projeto de validação — o código é escrito pelos agentes.

## Stack

- **Runtime:** Node.js 22, TypeScript (ESM)
- **HTTP:** Fastify
- **Persistência:** SQLite via `better-sqlite3`, arquivo único no diretório do projeto
- **Testes:** Vitest
- **Qualidade:** ESLint + `tsc --noEmit`

## Layout

```
src/          código da aplicação
src/db/       schema e migrações
test/         testes
```

## Gates

Os três precisam passar antes de qualquer PR:

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest
```

## Convenções

- Todo comportamento novo entra com teste.
- Uma branch por spec; PR contra a feature-branch do plano, nunca direto na `main`.
- Migração de schema é versionada em `src/db/` e aplicada na subida do serviço.
- Sem dependência que exija serviço externo em execução.
