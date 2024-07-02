import path from "path"
import fs from "fs-extra"
import { nextJsPageTsxTemplate } from "./template/page-tsx"
import { nextJsNextEnvDTsTemplate } from "./template/next-env-d-ts"

export function configureNextJs(opts: {
	projectDir: string
	name: string
	isAnchorVersionGtePoint30: boolean
}) {
	const { projectDir, name, isAnchorVersionGtePoint30 } = opts
	configureNextJsPageTsx({ projectDir, name, isAnchorVersionGtePoint30 })
	configureNextJsNextEnvDTs({ projectDir })
}

function configureNextJsPageTsx(opts: {
	projectDir: string
	name: string
	isAnchorVersionGtePoint30: boolean
}) {
	const { projectDir, name, isAnchorVersionGtePoint30 } = opts

	const librsPath = path.join(projectDir, "app/src/app", "page.tsx")

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(
		librsPath,
		nextJsPageTsxTemplate({ projectName: name, isAnchorVersionGtePoint30 }),
		"utf8"
	)
}

function configureNextJsNextEnvDTs(opts: { projectDir: string }) {
	const { projectDir } = opts

	const librsPath = path.join(projectDir, "app", "next-env.d.ts")

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(librsPath, nextJsNextEnvDTsTemplate(), "utf8")
}
