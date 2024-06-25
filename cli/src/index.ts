#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"
import fs from "fs-extra"
import path from "path"
import {
	addName,
	addScripts,
	addWorkspace,
	getUserPkgManager,
	getInstalledSolanaVersion,
	getInstalledAnchorVersion,
	setVersion,
} from "./utils"
import {
	DEFAULT_ANCHOR_VERSION,
	DEFAULT_SOLANA_VERSION,
	PKG_ROOT,
} from "./constants"

program
	.name("create-anchor-app")
	.description("Scaffold an Solana project with Anchor")
	.version("0.0.1")

program.argument("<name>").action(async (name) => {
	console.log("creating anchor app.....")

	const projectDir = path.resolve(process.cwd(), name)

	const baseDir = path.join(PKG_ROOT, "template/base")
	const addonsDir = path.join(PKG_ROOT, "template/add-ons")

	const pkg = getUserPkgManager()
	console.log("package manager:", pkg)

	fs.copySync(baseDir, projectDir)

	if (pkg === "pnpm") {
		const srcPath = path.join(addonsDir, "package-manager/pnpm-workspace.yaml")
		const destPath = path.join(projectDir, "pnpm-workspace.yaml")
		fs.copyFileSync(srcPath, destPath)
	} else {
		addWorkspace({ projectDir })
	}

	addScripts({ projectDir, pkg })

	addName({ projectDir, name })

	const solanaVersion = getInstalledSolanaVersion() ?? DEFAULT_SOLANA_VERSION
	const anchorVersion = getInstalledAnchorVersion() ?? DEFAULT_ANCHOR_VERSION

	setVersion({ projectDir, anchorVersion, solanaVersion })

	console.log("created anchor app.")
})

program.parse()
