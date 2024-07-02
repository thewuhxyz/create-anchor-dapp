import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { parse, stringify } from "smol-toml"
import { packageName } from "../../../utils"
import semverGte from "semver/functions/gte.js"
import { librsTemplate } from "./template/lib-rs"
import { Keypair } from "@solana/web3.js"

export function configureProtocol(opt: {
	projectDir: string
	name: string
	solanaVersion: string
	anchorVersion: string
}) {
	const { name, projectDir, solanaVersion, anchorVersion } = opt
	const program = Keypair.generate()
	const programId = program.publicKey.toBase58()
	const keypairJson = JSON.stringify(Array.from(program.secretKey))

	configureProtocolPackageJson({ name, projectDir })
	configureProtocolAnchorTomlAtRoot({
		projectDir,
		anchorVersion,
		programId,
		solanaVersion,
	})
	configureProtocolCargoToml({
		projectDir,
		anchorVersion,
	})
	configureLibrs({ programId, projectDir })
	copyProgramKeypairJsonToFile({ projectDir, keypairJson })
}

function configureProtocolPackageJson(opt: {
	projectDir: string
	name: string
}) {
	const { name, projectDir } = opt

	const workspace = "protocol"

	const pkgJsonPath = path.join(projectDir, workspace, "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = packageName(name, workspace)

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(pkgJsonPath, sortedPkgJson, {
		spaces: 2,
	})
}

function configureProtocolAnchorTomlAtRoot(opts: {
	projectDir: string
	solanaVersion: string
	anchorVersion: string
	programId: string
}) {
	const { projectDir, solanaVersion, anchorVersion, programId } = opts

	const anchorTomlPath = path.join(projectDir, "Anchor.toml")

	const anchorTomlString = fs.readFileSync(anchorTomlPath).toString()

	const anchorToml = parse(anchorTomlString)

	anchorToml.toolchain["anchor_version"] = anchorVersion
	anchorToml.toolchain["solana_version"] = solanaVersion

	anchorToml.programs["localnet"]["demo_program"] = programId

	fs.writeFileSync(anchorTomlPath, stringify(anchorToml))
}

function configureProtocolCargoToml(opts: {
	projectDir: string
	anchorVersion: string
}) {
	const { projectDir, anchorVersion } = opts

	const cargoTomlPath = path.join(
		projectDir,
		"protocol/programs/demo-program",
		"Cargo.toml"
	)

	const programCargoTomlString = fs.readFileSync(cargoTomlPath).toString()

	const programCargoToml = parse(programCargoTomlString)

	programCargoToml.dependencies["anchor-lang"] = anchorVersion

	if (semverGte(anchorVersion, "0.30.0")) {
		programCargoToml.features["idl-build"] = ["anchor-lang/idl-build"]
	}

	fs.writeFileSync(cargoTomlPath, stringify(programCargoToml))
}

function configureLibrs(opts: { projectDir: string; programId: string }) {
	const { projectDir, programId } = opts

	const librsPath = path.join(
		projectDir,
		"protocol/programs/demo-program/src",
		"lib.rs"
	)

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(librsPath, librsTemplate({ programId }), "utf8")
}

function copyProgramKeypairJsonToFile(opts: {
	projectDir: string
	keypairJson: string
}) {
	const { projectDir, keypairJson } = opts

	const keypairFilePath = path.join(
		projectDir,
		"target/deploy/demo_program-keypair.json"
	)

	const dir = path.dirname(keypairFilePath)
	fs.mkdirSync(dir, { recursive: true })

	fs.writeFileSync(keypairFilePath, keypairJson, "utf8")
}
