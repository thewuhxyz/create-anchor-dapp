import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { App, PackageManager } from "cli/src/types"
import { configureReact } from "./react/configure"
import { configureNextJs } from "./nextjs/configure"
import { ADDONS_TEMP_PATH } from "cli/src/constants"
import semverGte from "semver/functions/gte.js"

export function configureApp(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
	ui: App
	anchorVersion: string
}) {
	const { name, projectDir, ui, pkg, anchorVersion } = opt
	const addonsDir = ADDONS_TEMP_PATH

	if (ui === "none") return

	const isAnchorVersionGtePoint30 = semverGte(anchorVersion, "0.30.0")

	copyAppAddonTemplate({ ui, addonsDir, projectDir })
	configureAppPackageJson({ projectDir, name, pkg, isAnchorVersionGtePoint30 })

	if (ui === "react") {
		configureReact({ projectDir, name, isAnchorVersionGtePoint30 })
	}

	if (ui === "nextjs") {
		configureNextJs({ projectDir, name, isAnchorVersionGtePoint30 })
	}
}

function copyAppAddonTemplate(opt: {
	ui: App
	addonsDir: string
	projectDir: string
}) {
	const { ui, addonsDir, projectDir } = opt

	if (ui === "none") return

	const appAddon = path.join(addonsDir, "app", ui)
	const appDir = path.join(projectDir, "app")

	fs.copySync(appAddon, appDir)
}

function configureAppPackageJson(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
	isAnchorVersionGtePoint30: boolean
}) {
	const { name, projectDir, pkg, isAnchorVersionGtePoint30 } = opt

	const pkgJsonPath = path.join(projectDir, "app", "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = `@${name}/app`

	pkgJson.scripts!["shadcn:add"] =
		`${pkg === "pnpm" ? "pnpx" : "npx"} shadcn-ui@latest add`

	pkgJson.dependencies![`@${name}/protocol`] =
		pkg === "pnpm" ? "workspace:*" : "*"

	pkgJson.dependencies![`@coral-xyz/anchor`] = isAnchorVersionGtePoint30
		? "^0.30.1"
		: "^0.29.0"

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(pkgJsonPath, sortedPkgJson, {
		spaces: 2,
	})
}
