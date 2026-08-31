import Fastify, { type FastifyError, type FastifyInstance } from "fastify"
import type { SqliteDatabase } from "./db/client.js"
import { closeDatabase, openDatabase } from "./db/client.js"
import { migrate } from "./db/migrate.js"
import type { AppConfig } from "./config.js"
import { generateCode } from "./modules/links/code-generator.js"
import { LinkRepository } from "./modules/links/repository.js"
import { LinkService } from "./modules/links/service.js"
import { registerLinkRoutes } from "./routes/links.js"
import { registerRedirectRoutes } from "./routes/redirect.js"
import { CollisionError, InvalidUrlError, LinkNotFoundError } from "./shared/errors.js"

export interface AppDependencies { database?: SqliteDatabase; service?: LinkService }

export async function buildApp(config: AppConfig, dependencies: AppDependencies = {}): Promise<FastifyInstance> {
  const database = dependencies.database ?? openDatabase(config.databasePath)
  migrate(database)
  const service = dependencies.service ?? new LinkService({ repository: new LinkRepository(database), generateCode }, config.shortBaseUrl)
  const app = Fastify({ logger: false })
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) return reply.code(400).send({ error: { code: "INVALID_REQUEST", message: "Invalid request body or parameters" } })
    if (error instanceof LinkNotFoundError) return reply.code(404).send({ error: { code: "LINK_NOT_FOUND", message: error.message } })
    if (error instanceof InvalidUrlError) return reply.code(400).send({ error: { code: "INVALID_URL", message: error.message } })
    if (error instanceof CollisionError) return reply.code(500).send({ error: { code: "CODE_GENERATION_FAILED", message: "Unable to create short link" } })
    request.log.error(error)
    return reply.code(500).send({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } })
  })
  await registerLinkRoutes(app, service)
  await registerRedirectRoutes(app, service)
  if (!dependencies.database) app.addHook("onClose", async () => closeDatabase(database))
  return app
}