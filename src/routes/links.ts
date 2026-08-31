import type { FastifyInstance } from "fastify"
import type { LinkService } from "../modules/links/service.js"

export async function registerLinkRoutes(app: FastifyInstance, service: LinkService): Promise<void> {
  app.post<{ Body: { url: string }; Reply: { code: string; short_url: string } }>("/links", {
    schema: { body: { type: "object", required: ["url"], additionalProperties: false, properties: { url: { type: "string" } } } },
  }, async (request, reply) => {
    const created = service.create(request.body.url)
    return reply.code(201).send({ code: created.code, short_url: created.shortUrl })
  })
}