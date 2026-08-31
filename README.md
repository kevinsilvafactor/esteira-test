# Encurtador de URL

Fundação de persistência SQLite para o serviço de links curtos.

## Configuração

- `DATABASE_PATH`: caminho do arquivo SQLite (padrão: `data/links.db`).
- `SHORT_BASE_URL`: base para URLs curtas (padrão: `http://localhost:3000`); barras finais são removidas.

As migrações são versionadas, idempotentes e aplicadas antes do tráfego. Datas são armazenadas em ISO 8601 UTC. A tabela `links` mantém `code` único, URL original, criação e o campo `deleted_at` reservado para a evolução de desativação.

## Desenvolvimento

```sh
npm install
npm run lint
npm run typecheck
npm test
```

A API HTTP será adicionada na próxima fatia; esta implementação fornece a configuração, ciclo de vida SQLite, migração e repositório de persistência.
