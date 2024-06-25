import { execaSync } from "execa"
import fs from "fs-extra"
import path from "path"
import { parse, stringify } from "smol-toml"

export function getInstalledSolanaVersion() {
	const { stdout } = execaSync`solana --version`
	if (!stdout) return null
	return stdout.split(" ")[1] ?? null
}

export function getInstalledAnchorVersion() {
	const { stdout } = execaSync`anchor --version`
	if (!stdout) return null
	return stdout.split(" ")[1] ?? null
}

export function setVersion(opts: {
	projectDir: string
	solanaVersion: string
	anchorVersion: string
}) {
	const { projectDir, solanaVersion, anchorVersion } = opts

	const anchorTomlString = fs
		.readFileSync(path.join(projectDir, "Anchor.toml"))
		.toString()

	const programCargoTomlString = fs
		.readFileSync(
			path.join(projectDir, "protocol/programs/demo-program", "Cargo.toml")
		)
		.toString()

	const anchorToml = parse(anchorTomlString)
	const programCargoToml = parse(programCargoTomlString)

	anchorToml.toolchain["anchor_version"] = anchorVersion
	anchorToml.toolchain["solana_version"] = solanaVersion

	programCargoToml.dependencies["anchor-lang"] = anchorVersion

	fs.writeFileSync(path.join(projectDir, "Anchor.toml"), stringify(anchorToml))

	fs.writeFileSync(
		path.join(projectDir, "protocol/programs/demo-program", "Cargo.toml"),
		stringify(programCargoToml)
	)
}
