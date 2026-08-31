import Database from "better-sqlite3"

export type SqliteDatabase = Database.Database

export function openDatabase(filename: string): SqliteDatabase {
  const database = new Database(filename)
  database.pragma("foreign_keys = ON")
  database.pragma("journal_mode = WAL")
  return database
}

export function closeDatabase(database: SqliteDatabase): void {
  if (database.open) database.close()
}