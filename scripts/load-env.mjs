import { existsSync, readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

/**
 * Prisma CLI reads `.env` only; Next.js uses `.env.local`.
 * Load `.env.local` first, then `.env` (without overriding existing vars).
 */
export function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(root, file)
    if (!existsSync(path)) continue

    const content = readFileSync(path, "utf8")
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue

      const eq = trimmed.indexOf("=")
      if (eq === -1) continue

      const key = trimmed.slice(0, eq).trim()
      if (!key || process.env[key] !== undefined) continue

      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
  }
}
