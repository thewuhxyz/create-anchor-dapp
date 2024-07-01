import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { parse, stringify } from "smol-toml"
import {
	execCommand,
	getPkgManagerVersion,
	packageName,
	programCommand,
} from "../utils"
import semverGte from "semver/functions/gte.js"
import { PackageManager } from "../types"

export function configureRootPackageJson(opt: {
	projectDir: string
	name: string
	pkg: PackageManager
}) {
	const { name, projectDir, pkg } = opt

	const pkgJsonPath = path.join(projectDir, "package.json")

	const pkgJson = fs.readJSONSync(pkgJsonPath) as PackageJson

	pkgJson.name = name

	if (pkgJson.scripts) {
		programCommand.map((command) => {
			pkgJson.scripts![`program:${command}`] =
				`${execCommand[pkg]} just ${command}`
		})
	}

	if (pkg !== "pnpm") {
		pkgJson.workspaces = ["app", "protocol"]
	}

	pkgJson.packageManager = getPkgManagerVersion(pkg)

	const sortedPkgJson = sortPackageJson(pkgJson)

	fs.writeJSONSync(pkgJsonPath, sortedPkgJson, {
		spaces: 2,
	})
}

export function configureProtocolPackageJson(opt: {
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

export function configureRootAnchorToml(opts: {
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

export function configureProtocolCargoToml(opts: {
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

export function addPnpmWorkspace(opts: {
	projectDir: string
	addonsDir: string
	pkg: PackageManager
}) {
	const { pkg, projectDir, addonsDir } = opts
	if (pkg === "pnpm") {
		const src = path.join(addonsDir, "package-manager/pnpm-workspace.yaml")
		const dest = path.join(projectDir, "pnpm-workspace.yaml")
		fs.copyFileSync(src, dest)
	}
}

export function copyBaseTemplate(opt: { baseDir: string; projectDir: string }) {
	const { projectDir, baseDir } = opt
	fs.copySync(baseDir, projectDir)
}

export function configureLibrs(opts: {
	projectDir: string
	programId: string
}) {
	const { projectDir, programId } = opts

	const rs = `
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("${programId}");

#[program]
pub mod demo_program {

    use super::*;

    pub fn create_counter(ctx: Context<CreateCounter>) -> Result<()> {
        instructions::create_counter(ctx)
    }

    pub fn increment_count(ctx: Context<IncrementCount>) -> Result<()> {
        instructions::increment_count(ctx)
    }
}

	`

	const librsPath = path.join(
		projectDir,
		"protocol/programs/demo-program/src",
		"lib.rs"
	)

	const dir = path.dirname(librsPath)
	fs.mkdirSync(dir, { recursive: true })
	fs.writeFileSync(librsPath, rs, "utf8")
}

export function copyProgramKeypairJsonToFile(opts: {
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
