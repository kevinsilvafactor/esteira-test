import type { FastifyInstance } from "fastify"
import type { LinkService } from "../modules/links/service.js"

export async function registerRedirectRoutes(app: FastifyInstance, service: LinkService): Promise<void> {
  app.get<{ Params: { code: string } }>("/:code", { schema: { params: { type: "object", required: ["code"], properties: { code: { type: "string", minLength: 1 } } } } }, async (request, reply) => {
    const link = service.resolve(request.params.code)
    return reply.code(302).header("location", link.originalUrl).send()
  })
}