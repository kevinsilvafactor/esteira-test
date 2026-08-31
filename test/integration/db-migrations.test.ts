import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { closeDatabase, openDatabase } from "../../src/db/client.js"
import { migrate } from "../../src/db/migrate.js"
import { LinkRepository } from "../../src/modules/links/repository.js"

const resources: Array<{ directory: string; close: () => void }> = []
afterEach(() => { for (const resource of resources.splice(0)) { resource.close(); rmSync(resource.directory, { recursive: true, force: true }) } })

function setup() {
  const directory = mkdtempSync(path.join(tmpdir(), "shortener-"))
  const database = openDatabase(path.join(directory, "links.db"))
  resources.push({ directory, close: () => closeDatabase(database) })
  return { directory, database }
}

describe("SQLite migrations", () => {
  it("creates the schema and is idempotent", () => {
    const { database } = setup()
    migrate(database)
    migrate(database)
    expect(database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'links'").get()).toBeTruthy()
    expect(database.prepare("SELECT COUNT(*) AS count FROM schema_migrations").get()).toMatchObject({ count: 1 })
    expect(database.prepare("PRAGMA table_info(links)").all()).toHaveLength(5)
  })

  it("preserves a link after closing and reopening the same file", () => {
    const { directory, database } = setup()
    migrate(database)
    new LinkRepository(database).create({ code: "abc1234", originalUrl: "https://example.com", createdAt: "2026-08-31T17:33:00.000Z" })
    closeDatabase(database)
    const reopened = openDatabase(path.join(directory, "links.db"))
    migrate(reopened)
    expect(new LinkRepository(reopened).findByCode("abc1234")).toMatchObject({ originalUrl: "https://example.com" })
    closeDatabase(reopened)
  })
})