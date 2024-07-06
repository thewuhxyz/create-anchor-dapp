import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { getPkgManagerVersion, programCommand } from "../../../utils"
import { App, PackageManager } from "../../../types"
import { ADDONS_TEMP_PATH } from "cli/src/constants"

export function configureRoot(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
	ui: App
}) {
	const { pkg, name, projectDir, ui } = opt
	const addonsDir = ADDONS_TEMP_PATH

	configureRootPackageJson({ projectDir, name, pkg, ui })
	configureRootPnpmWorkspace({ addonsDir, pkg, projectDir })
}

function configureRootPackageJson(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
	ui: App
}) {
	const { name, projectDir, pkg, ui } = opt

	const pkgJsonPath = path.join(projectDir, "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = name

	if (pkgJson.scripts) {
		const execScript = pkg === "npm" ? `${pkg} run` : pkg

		pkgJson.scripts["build:protocol"] = 'turbo build --filter=protocol'

		if (ui !== "none") {
			pkgJson.scripts["build:app"] = 'turbo build --filter=app'
			pkgJson.scripts["dev:app"] = 'turbo dev --filter=app'
			pkgJson.scripts["shadcn:add"] = `cd app && ${execScript} shadcn:add`
		}

		programCommand.map((command) => {
			pkgJson.scripts![command === "anchor" ? command : `program:${command}`] =
				`just ${command}`
		})
	}

	if (pkg !== "pnpm") {
		pkgJson.workspaces = ["app", "protocol/ts"]
	}

	pkgJson.packageManager = getPkgManagerVersion(pkg)

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(pkgJsonPath, sortedPkgJson, {
		spaces: 2,
	})
}

function configureRootPnpmWorkspace(opts: {
	projectDir: string
	addonsDir: string
	pkg: PackageManager
}) {
	const { pkg, projectDir, addonsDir } = opts
	if (pkg === "pnpm") {
		const src = path.join(addonsDir, "package-manager/pnpm-workspace.yaml")
		const dest = path.join(projectDir, "pnpm-workspace.yaml")
		fs.copyFileSync(src, dest)
	}
}
