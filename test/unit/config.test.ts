import { describe, expect, it } from "vitest"
import { loadConfig } from "../../src/config.js"

describe("loadConfig", () => {
  it("uses deterministic local defaults", () => {
    const config = loadConfig({})
    expect(config.shortBaseUrl).toBe("http://localhost:3000")
    expect(config.databasePath).toMatch(/data[/\\]links\.db$/)
  })

  it("supports database and base URL overrides", () => {
    expect(loadConfig({ DATABASE_PATH: "/tmp/test.db", SHORT_BASE_URL: "https://sho.rt/" })).toEqual({
      databasePath: "/tmp/test.db",
      shortBaseUrl: "https://sho.rt",
    })
  })
})