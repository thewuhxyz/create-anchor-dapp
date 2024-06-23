#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import { addName, addScripts, addWorkspace, getUserPkgManager } from "./utils"

const __filename = fileURLToPath(import.meta.url)
console.log("fileName:", __filename)

const binPath = path.dirname(__filename)
console.log("bin path:", binPath)

const distPath = path.join(binPath, "../../")
console.log("dist path:", distPath)

program
	.name("create-anchor-app")
	.description("Scaffold an Solana project with Anchor")
	.version("0.0.1")

program.argument("<name>").action((name) => {
	console.log("creating anchor app.....")

	const projectDir = path.resolve(process.cwd(), name)
	const baseDir = path.join(distPath, "template/base")
	const addonsDir = path.join(distPath, "template/add-ons")

	const pkg = getUserPkgManager()
	console.log("package manager:", pkg)

	console.log("project dir:", projectDir)
	console.log("src dir:", baseDir)

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

	console.log("created anchor app")
})

program.parse()
