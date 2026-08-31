import type { SqliteDatabase } from "../../db/client.js"
import type { CreateLinkInput, Link } from "./types.js"

interface LinkRow { id: number; code: string; original_url: string; created_at: string; deleted_at: string | null }

function toLink(row: LinkRow): Link { return { id: row.id, code: row.code, originalUrl: row.original_url, createdAt: row.created_at, deletedAt: row.deleted_at } }

export class LinkRepository {
  public constructor(private readonly database: SqliteDatabase) {}
  public create(input: CreateLinkInput): Link {
    const result = this.database.prepare("INSERT INTO links (code, original_url, created_at) VALUES (?, ?, ?)").run(input.code, input.originalUrl, input.createdAt)
    return this.findById(Number(result.lastInsertRowid)) as Link
  }
  public findById(id: number): Link | undefined {
    const row = this.database.prepare("SELECT id, code, original_url, created_at, deleted_at FROM links WHERE id = ?").get(id) as LinkRow | undefined
    return row ? toLink(row) : undefined
  }
  public findByCode(code: string): Link | undefined {
    const row = this.database.prepare("SELECT id, code, original_url, created_at, deleted_at FROM links WHERE code = ?").get(code) as LinkRow | undefined
    return row ? toLink(row) : undefined
  }
}