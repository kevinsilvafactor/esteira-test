import path from "node:path"

export interface AppConfig {
  databasePath: string
  shortBaseUrl: string
}

const DEFAULT_DATABASE_PATH = path.resolve("data/links.db")
const DEFAULT_SHORT_BASE_URL = "http://localhost:3000"

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const shortBaseUrl = (env.SHORT_BASE_URL ?? DEFAULT_SHORT_BASE_URL).replace(/\/+$/, "")
  if (!shortBaseUrl) throw new Error("SHORT_BASE_URL must not be empty")
  return {
    databasePath: env.DATABASE_PATH ?? DEFAULT_DATABASE_PATH,
    shortBaseUrl,
  }
}