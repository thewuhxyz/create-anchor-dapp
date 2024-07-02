export type PackageManager = "npm" | "pnpm" | "yarn"

export type App = "react" | "nextjs" | "none"

export type ProjectConfig = {
	pkg: PackageManager
	solanaVersion: string
	anchorVersion: string
	ui: App
	name: string
  install: boolean
}
