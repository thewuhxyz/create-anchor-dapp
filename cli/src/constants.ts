import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const binPath = path.dirname(__filename)

export const PKG_ROOT = path.join(binPath, "../../")

export const DEFAULT_SOLANA_VERSION = "1.18.14"
export const DEFAULT_ANCHOR_VERSION = "0.29.0"