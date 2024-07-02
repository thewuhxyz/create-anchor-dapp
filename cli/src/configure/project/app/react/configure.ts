import path from "path"
import fs from "fs-extra"
import { reactAppTsxTemplate } from "./template/app-tsx"

export function configureReact(opts: {
	projectDir: string
	name: string
}) {
	const { projectDir, name } = opts
	configureReactPageTsx({ projectDir, name })
}

export function configureReactPageTsx(opts: {
	projectDir: string
	name: string
}) {
	const { projectDir, name } = opts

	const librsPath = path.join(projectDir, "app/src", "App.tsx")

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(
		librsPath,
		reactAppTsxTemplate({ projectName: name }),
		"utf8"
	)
}
