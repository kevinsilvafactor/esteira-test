import { mkdirSync } from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"

export type SqliteDatabase = Database.Database

export function openDatabase(filename: string): SqliteDatabase {
  const directory = path.dirname(filename)
  if (directory !== ".") mkdirSync(directory, { recursive: true })
  const database = new Database(filename)
  database.pragma("foreign_keys = ON")
  database.pragma("journal_mode = WAL")
  return database
}

export function closeDatabase(database: SqliteDatabase): void {
  if (database.open) database.close()
}