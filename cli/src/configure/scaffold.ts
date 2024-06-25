import path from "path"
import {
	addPnpmWorksapce,
	configureProtocolCargoToml,
	configureProtocolPackageJson,
	configureRootAnchorToml,
	configureRootPackageJson,
	copyBaseTemplate,
} from "./helpers"
import { ADDONS_TEMP_PATH, BASE_TEMP_PATH } from "../constants"
import { ProjectConfig } from "../utils"

export function scaffold(config: ProjectConfig) {
	const { anchorVersion, name, pkg, solanaVersion, ui } = config
	const projectDir = path.resolve(process.cwd(), name)

	copyBaseTemplate({ projectDir, baseDir: BASE_TEMP_PATH })
	configureRootPackageJson({ projectDir, pkg, name })
	addPnpmWorksapce({ projectDir, pkg, addonsDir: ADDONS_TEMP_PATH })
	configureRootAnchorToml({ projectDir, solanaVersion, anchorVersion })
	configureProtocolCargoToml({ projectDir, anchorVersion })
	configureProtocolPackageJson({ projectDir, name })
}
