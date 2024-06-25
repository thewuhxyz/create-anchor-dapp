import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"

export type PackageManager = "npm" | "pnpm" | "yarn"

export const getUserPkgManager: () => PackageManager = () => {
	// This environment variable is set by npm and yarn but pnpm seems less consistent
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
		// If no user agent is set, assume npm
		return "npm"
	}
}

export const addWorkspace = (opts: { projectDir: string }) => {
	const { projectDir } = opts

	const pkgJson = fs.readJSONSync(
		path.join(projectDir, "package.json")
	) as PackageJson

	pkgJson.workspaces = ["app", "protocol"]

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 2,
	})
}

export const addScripts = (opts: {
	projectDir: string
	pkg: PackageManager
}) => {
	const { projectDir, pkg } = opts

	const pkgJson = fs.readJSONSync(
		path.join(projectDir, "package.json")
	) as PackageJson

	// programScripts.forEach((script) => {
	// 	if (pkgJson.scripts) {
	// 		pkgJson.scripts[`program:${script}`] = `${exec[pkg]} just ${script}`
	// 	}
	// })

	if (pkgJson.scripts) {
		pkgJson.scripts["program"] = `${exec[pkg]} just`
	}
	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 2,
	})
}

export const addName = (opts: { projectDir: string; name: string }) => {
	const { projectDir, name } = opts

	const pkgJson = fs.readJSONSync(
		path.join(projectDir, "package.json")
	) as PackageJson

	pkgJson.name = name

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 2,
	})

	const protocolDir = path.join(projectDir, "protocol")

	const protocolPkgJson = fs.readJSONSync(
		path.join(protocolDir, "package.json")
	) as PackageJson

	protocolPkgJson.name = `@${name}/protocol`

	const protocolSortedPkgJson = sortPackageJson(protocolPkgJson)

	fs.writeJSONSync(
		path.join(protocolDir, "package.json"),
		protocolSortedPkgJson,
		{
			spaces: 2,
		}
	)
}

// const programScripts = [
// 	"build",
// 	"close",
// 	"deploy",
// 	"recover",
// 	"redeploy",
// 	"test",
// 	"test-all",
// ]

const exec: Record<PackageManager, string> = {
	npm: "npx",
	yarn: "yarn exec",
	pnpm: "pnpm exec",
}
