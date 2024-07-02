import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import {
	execCommand,
	getPkgManagerVersion,
	programCommand,
} from "../../../utils"
import { PackageManager } from "../../../types"
import { ADDONS_TEMP_PATH } from "cli/src/constants"

export function configureRoot(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
}) {
	const { pkg, name, projectDir } = opt
	const addonsDir = ADDONS_TEMP_PATH

	configureRootPackageJson({ projectDir, name, pkg })
	configureRootPnpmWorkspace({ addonsDir, pkg, projectDir })
}

function configureRootPackageJson(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
}) {
	const { name, projectDir, pkg } = opt

	const pkgJsonPath = path.join(projectDir, "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = name

	if (pkgJson.scripts) {
		programCommand.map((command) => {
			pkgJson.scripts![`program:${command}`] =
				`${execCommand[pkg]} just ${command}`
		})
	}

	if (pkg !== "pnpm") {
		pkgJson.workspaces = ["app", "protocol"]
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
