import path from "path"
import fs from "fs-extra"
import { reactAppTsxTemplate } from "./template/app-tsx"

export function configureReact(opts: {
	projectDir: string
	name: string
	isAnchorVersionGtePoint30: boolean
}) {
	const { projectDir, name, isAnchorVersionGtePoint30 } = opts
	configureReactPageTsx({ projectDir, name, isAnchorVersionGtePoint30 })
}

export function configureReactPageTsx(opts: {
	projectDir: string
	name: string
	isAnchorVersionGtePoint30: boolean
}) {
	const { projectDir, name, isAnchorVersionGtePoint30 } = opts

	const librsPath = path.join(projectDir, "app/src", "App.tsx")

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(
		librsPath,
		reactAppTsxTemplate({ projectName: name, isAnchorVersionGtePoint30 }),
		"utf8"
	)
}
