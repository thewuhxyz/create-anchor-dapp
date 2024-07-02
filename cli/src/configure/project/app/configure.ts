import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { App } from "cli/src/types"
import { configureReact } from "./react/configure"
import { configureNextJs } from "./nextjs/configure"
import { ADDONS_TEMP_PATH } from "cli/src/constants"

export function configureApp(opt: {
	projectDir: string
	name: string
	ui: App
}) {
	const { name, projectDir, ui } = opt
	const addonsDir = ADDONS_TEMP_PATH

	if (ui === "none") return

	copyAppAddonTemplate({ ui, addonsDir, projectDir })
	configureAppPackageJson({ projectDir, name })

	if (ui === "react") {
		configureReact({ projectDir, name })
	}

	if (ui === "nextjs") {
		configureNextJs({ projectDir, name })
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

function configureAppPackageJson(opt: { projectDir: string; name: string }) {
	const { name, projectDir } = opt

	const pkgJsonPath = path.join(projectDir, "app", "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = `@${name}/app`

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(pkgJsonPath, sortedPkgJson, {
		spaces: 2,
	})
}
