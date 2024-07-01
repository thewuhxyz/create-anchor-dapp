import path from "path"
import {
	addPnpmWorkspace,
	configureLibrs,
	configureProtocolCargoToml,
	configureProtocolPackageJson,
	configureRootAnchorToml,
	configureRootPackageJson,
	copyBaseTemplate,
	copyProgramKeypairJsonToFile,
} from "./helpers"
import { ADDONS_TEMP_PATH, BASE_TEMP_PATH } from "../constants"
import { ProjectConfig } from "../types"
import { installDependencies } from "./install-dependencies"
import { Keypair, PublicKey } from "@solana/web3.js"

export async function scaffold(config: ProjectConfig) {
	const { anchorVersion, name, pkg, solanaVersion, ui, install } = config
	const projectDir = path.resolve(process.cwd(), name)

	const program = Keypair.generate()
	const programId = program.publicKey.toBase58()
	const keypairJson = JSON.stringify(Array.from(program.secretKey))
	console.log("keypair json:", keypairJson)

	copyBaseTemplate({ projectDir, baseDir: BASE_TEMP_PATH })
	configureRootPackageJson({ projectDir, pkg, name })
	addPnpmWorkspace({ projectDir, pkg, addonsDir: ADDONS_TEMP_PATH })
	configureRootAnchorToml({
		projectDir,
		solanaVersion,
		anchorVersion,
		programId,
	})
	configureProtocolCargoToml({ projectDir, anchorVersion })
	configureProtocolPackageJson({ projectDir, name })
	configureLibrs({ projectDir, programId })
	copyProgramKeypairJsonToFile({ projectDir, keypairJson })
	install && (await installDependencies({ projectDir, pkg }))
}
