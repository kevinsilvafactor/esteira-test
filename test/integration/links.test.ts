import { randomUUID } from "node:crypto"
import { describe, expect, it, afterEach } from "vitest"
import { buildApp } from "../../src/app.js"
import { loadConfig } from "../../src/config.js"
import type { FastifyInstance } from "fastify"

const apps: FastifyInstance[] = []
afterEach(async () => { for (const app of apps.splice(0)) await app.close() })

async function makeApp(): Promise<FastifyInstance> {
  const app = await buildApp(loadConfig({ DATABASE_PATH: `/tmp/links-${randomUUID()}.db`, SHORT_BASE_URL: "https://short.test/" }))
  apps.push(app)
  return app
}

describe("links HTTP API", () => {
  it("creates, persists and redirects a link", async () => {
    const app = await makeApp()
    const created = await app.inject({ method: "POST", url: "/links", payload: { url: "https://example.com/path?a=1" } })
    expect(created.statusCode).toBe(201)
    const body = created.json<{ code: string; short_url: string }>()
    expect(body.code).toMatch(/^[A-Za-z0-9]{7}$/)
    expect(body.code).not.toMatch(/[0Ol1]/)
    expect(body.short_url).toBe(`https://short.test/${body.code}`)
    const redirect = await app.inject({ method: "GET", url: `/${body.code}` })
    expect(redirect.statusCode).toBe(302)
    expect(redirect.headers.location).toBe("https://example.com/path?a=1")
  })

  it("rejects invalid input and returns a stable JSON 404", async () => {
    const app = await makeApp()
    const invalid = await app.inject({ method: "POST", url: "/links", payload: { url: "ftp://example.com" } })
    expect(invalid.statusCode).toBe(400)
    expect(invalid.json<{ error: { code: string } }>().error.code).toBe("INVALID_URL")
    const missing = await app.inject({ method: "GET", url: "/unknown" })
    expect(missing.statusCode).toBe(404)
    expect(missing.json<{ error: { code: string } }>().error.code).toBe("LINK_NOT_FOUND")
  })

  it("persists the record in SQLite", async () => {
    const path = `/tmp/links-${randomUUID()}.db`
    const config = loadConfig({ DATABASE_PATH: path, SHORT_BASE_URL: "http://localhost:4000" })
    const first = await buildApp(config)
    const created = await first.inject({ method: "POST", url: "/links", payload: { url: "https://example.com" } })
    const code = created.json<{ code: string }>().code
    await first.close()
    const second = await buildApp(config)
    apps.push(second)
    expect((await second.inject({ method: "GET", url: `/${code}` })).statusCode).toBe(302)
  })
})