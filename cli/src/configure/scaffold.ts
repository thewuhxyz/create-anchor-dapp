import path from "path"
import { ProjectConfig } from "../types"
import { installDependencies } from "./install-dependencies"
import { copyBaseTemplate } from "./project/base/configure"
import { configureRoot } from "./project/root/configure"
import { configureProtocol } from "./project/protocol/configure"
import { configureApp } from "./project/app/configure"

export async function scaffold(config: ProjectConfig) {
	const { anchorVersion, name, pkg, solanaVersion, ui, install } = config
	const projectDir = path.resolve(process.cwd(), name)

	copyBaseTemplate({ projectDir })
	configureRoot({ pkg, name, projectDir })
	configureProtocol({ anchorVersion, name, projectDir, solanaVersion })
	configureApp({ name, projectDir, ui, pkg, anchorVersion })

	install && (await installDependencies({ projectDir, pkg }))
}
