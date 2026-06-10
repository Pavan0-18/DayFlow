import { spawnSync } from "child_process"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { loadEnvFiles } from "./load-env.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error("Usage: node scripts/run-with-env.mjs <command> [args...]")
  process.exit(1)
}

loadEnvFiles()

const result = spawnSync(command, args, {
  stdio: "inherit",
  env: process.env,
  cwd: root,
  shell: process.platform === "win32",
})

process.exit(result.status ?? 1)
