export type PackageManager = "npm" | "pnpm" | "yarn"

export type ProjectConfig = {
	pkg: PackageManager
	solanaVersion: string
	anchorVersion: string
	ui: string
	name: string
  install: boolean
}
