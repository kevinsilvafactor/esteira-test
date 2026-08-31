import { buildApp } from "./app.js"
import { loadConfig } from "./config.js"

const config = loadConfig()
const app = await buildApp(config)
try {
  await app.listen({ host: "0.0.0.0", port: Number(process.env.PORT ?? 3000) })
} catch (error: unknown) {
  app.log.error(error)
  process.exit(1)
}