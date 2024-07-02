import { execaSync } from "execa"
import { PackageManager } from "./types"

export function getInstalledSolanaVersion() {
	const { stdout } = execaSync`solana --version`
	if (!stdout) return null
	return stdout.split(" ")[1] ?? null
}

export function getInstalledAnchorVersion() {
	const { stdout } = execaSync`anchor --version`
	if (!stdout) return null
	return stdout.split(" ")[1] ?? null
}

export function getUserPkgManager(fallback?: PackageManager): PackageManager {
	const userAgent = process.env.npm_config_user_agent
	if (userAgent) {
		if (userAgent.startsWith("yarn")) {
			return "yarn"
		} else if (userAgent.startsWith("pnpm")) {
			return "pnpm"
		} else {
			return "npm"
		}
	} else {
		return fallback ?? "npm"
	}
}

export function getPkgManagerVersion(pkg: PackageManager) {
	const { stdout: version } = execaSync`${pkg} --version`
	return `${pkg}@${version}`
}

export const execCommand: Record<PackageManager, string> = {
	npm: "npx",
	yarn: "yarn exec",
	pnpm: "pnpm exec",
}

export function packageName(root: string, workspace: string) {
	return `@${root}/${workspace}`
}

export const programCommand = [
	"build",
	"close",
	"deploy",
	"extend",
	"recover",
	"redeploy",
	"test",
	"test-all",
]

