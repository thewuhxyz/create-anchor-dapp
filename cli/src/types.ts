export type PackageManager = "npm" | "pnpm" | "yarn"

export type App = "react" | "nextjs" | "none"

export type PackageExec = "npx" | "yarn" | "pnpm exec" | "pnpx"

export type ProjectConfig = {
	pkg: PackageManager
	solanaVersion: string
	anchorVersion: string
	ui: App
	name: string
  install: boolean
}
