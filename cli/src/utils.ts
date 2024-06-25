import { execaSync } from "execa"

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

export function getUserPkgManager(): PackageManager {
	const userAgent = process.env.npm_config_user_agent
  console.log("user agent:", userAgent)
	if (userAgent) {
		if (userAgent.startsWith("yarn")) {
			return "yarn"
		} else if (userAgent.startsWith("pnpm")) {
			return "pnpm"
		} else {
			return "npm"
		}
	} else {
		return "npm"
	}
}

export function getPkgManagerVersion(pkg: PackageManager) {
	const { stdout: version } = execaSync`${pkg} --version`
	console.log("pkg version:", version)
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

export type PackageManager = "npm" | "pnpm" | "yarn"

export type ProjectConfig = {
	pkg: PackageManager
	solanaVersion: string
	anchorVersion: string
	ui: string
	name: string
}

export const programCommand = [
	"build",
	"close",
	"deploy",
	"recover",
	"redeploy",
	"test",
	"test-all",
]

export function versionGreaterThan(first: string, second: string) {
  
}