#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import { getUserPkgManager } from "./helpers"

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

program.action(() => {
	console.log("creating anchor app.....")
	console.log("created anchor app")
})

program
	.argument("<name>")
	.action((name) => { 
		console.log("creating anchor app.....")
		console.log("creating app at ", name, "...")
		const projectDir = path.resolve(process.cwd(), name)
		const srcDir = path.join(distPath, "template/base")

		const pkg = getUserPkgManager()
		console.log("package manager:", pkg)

		console.log("project dir:", projectDir)
		console.log("src dir:", srcDir)
		fs.copySync(srcDir, projectDir)
		console.log("created anchor app")
	})

program.parse()
