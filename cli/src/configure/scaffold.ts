import path from "path"
import {
	addPnpmWorkspace,
	configureProtocolCargoToml,
	configureProtocolPackageJson,
	configureRootAnchorToml,
	configureRootPackageJson,
	copyBaseTemplate,
} from "./helpers"
import { ADDONS_TEMP_PATH, BASE_TEMP_PATH } from "../constants"
import { ProjectConfig } from "../types"
import { installDependencies } from "./install-dependencies"

export async function scaffold(config: ProjectConfig) {
	const { anchorVersion, name, pkg, solanaVersion, ui, install } = config
	const projectDir = path.resolve(process.cwd(), name)

	copyBaseTemplate({ projectDir, baseDir: BASE_TEMP_PATH })
	configureRootPackageJson({ projectDir, pkg, name })
	addPnpmWorkspace({ projectDir, pkg, addonsDir: ADDONS_TEMP_PATH })
	configureRootAnchorToml({ projectDir, solanaVersion, anchorVersion })
	configureProtocolCargoToml({ projectDir, anchorVersion })
	configureProtocolPackageJson({ projectDir, name })
	install && await installDependencies({ projectDir, pkg })
}
