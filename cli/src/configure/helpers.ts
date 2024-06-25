import path from "path"
import fs from "fs-extra"
import sortPackageJson from "sort-package-json"
import { type PackageJson } from "type-fest"
import { parse, stringify } from "smol-toml"
import {
	PackageManager,
	execCommand,
	packageName,
	programCommand,
} from "../utils"
import semverGte from "semver/functions/gte.js"

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
}) {
	const { projectDir, solanaVersion, anchorVersion } = opts

	const anchorTomlPath = path.join(projectDir, "Anchor.toml")

	const anchorTomlString = fs.readFileSync(anchorTomlPath).toString()

	const anchorToml = parse(anchorTomlString)

	anchorToml.toolchain["anchor_version"] = anchorVersion
	anchorToml.toolchain["solana_version"] = solanaVersion

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

export function addPnpmWorksapce(opts: {
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
