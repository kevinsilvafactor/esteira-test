# Encurtador de URLs

API Fastify para criar links curtos persistidos em SQLite e redirecioná-los.

## Configuração

- `DATABASE_PATH`: arquivo SQLite (padrão `data/links.db`).
- `SHORT_BASE_URL`: base usada na resposta `short_url` (padrão `http://localhost:3000`). Barras finais são removidas.

As migrações versionadas são aplicadas antes do tráfego. Códigos automáticos têm 7 caracteres alfanuméricos e excluem `0`, `O`, `l` e `1`.

## Execução

```sh
npm install
npm run dev
# ou: npm run build && node dist/index.js
```

## API

`POST /links` com `{ "url": "https://example.com/page" }` retorna `201` e `{ "code": "...", "short_url": "..." }`. URLs HTTP e HTTPS são aceitas e preservadas exatamente como recebidas.

`GET /:code` retorna `302` e o header `Location` original. Código inexistente retorna `404` com `{ "error": { "code": "LINK_NOT_FOUND", "message": "Link not found" } }`. Erros de entrada também são JSON e não expõem stack trace.

## Qualidade

```sh
npm run lint
npm run typecheck
npm test
```