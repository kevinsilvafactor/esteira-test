import type { SqliteDatabase } from "./client.js"
import { name as createLinksName, up as createLinks, version as createLinksVersion } from "./migrations/001_create_links.js"

type Migration = { version: number; name: string; up: (database: SqliteDatabase) => void }

const migrations: Migration[] = [{ version: createLinksVersion, name: createLinksName, up: createLinks }]

export function migrate(database: SqliteDatabase): void {
  database.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL
  )`)
  const applied = database.prepare("SELECT version FROM schema_migrations ORDER BY version").all() as Array<{ version: number }>
  const appliedVersions = new Set(applied.map((row) => row.version))
  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue
    const apply = database.transaction(() => {
      migration.up(database)
      database.prepare("INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)")
        .run(migration.version, migration.name, new Date().toISOString())
    })
    apply()
  }
}