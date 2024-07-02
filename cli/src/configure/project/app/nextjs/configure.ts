import path from "path"
import fs from "fs-extra"
import { nextJsPageTsxTemplate } from "./template/page-tsx"

export function configureNextJs(opts: {
	projectDir: string
	name: string
}) {
	const { projectDir, name } = opts
	configureNextJsPageTsx({ projectDir, name })
}

function configureNextJsPageTsx(opts: { projectDir: string; name: string }) {
	const { projectDir, name } = opts

	const librsPath = path.join(projectDir, "app/src/app", "page.tsx")

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(
		librsPath,
		nextJsPageTsxTemplate({ projectName: name }),
		"utf8"
	)
}
