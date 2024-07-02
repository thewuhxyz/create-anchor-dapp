import { BASE_TEMP_PATH } from "cli/src/constants"
import fs from "fs-extra"

export function copyBaseTemplate(opt: { projectDir: string }) {
	const { projectDir } = opt
	fs.copySync(BASE_TEMP_PATH, projectDir)
}
