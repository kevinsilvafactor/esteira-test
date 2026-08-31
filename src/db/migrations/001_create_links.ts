import type { SqliteDatabase } from "../client.js"

export const version = 1
export const name = "create_links"

export function up(database: SqliteDatabase): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      original_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      deleted_at TEXT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at DESC);
  `)
}