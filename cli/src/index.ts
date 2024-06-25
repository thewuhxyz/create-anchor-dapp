#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"
import {
	getUserPkgManager,
	getInstalledSolanaVersion,
	getInstalledAnchorVersion,
} from "./utils"
import {
	DEFAULT_ANCHOR_VERSION,
	DEFAULT_APP_NAME,
	DEFAULT_SOLANA_VERSION,
} from "./constants"
import * as p from "@clack/prompts"
import { scaffold } from "./configure"
import ora from "ora"

async function main() {
	program
		.name("create-anchor-app")
		.description("Scaffold an Solana project with Anchor")
		.version("0.0.1")

	program.argument("[dir]", "project name")

	program.parse()

	const name = program.args[0]

	const pkgManager = getUserPkgManager()
	const solanaVersion = getInstalledSolanaVersion()
	const anchorVersion = getInstalledAnchorVersion()

	const userPreferences = await p.group(
		{
			...(!name && {
				name: () =>
					p.text({
						message: `💼 Project name? (default: ${DEFAULT_APP_NAME})`,
						defaultValue: DEFAULT_APP_NAME,
					}),
			}),
			pkg: () =>
				p.select({
					message: `👔 Package manager? (${pkgManager ? `current: ${pkgManager}` : "npm"})`,
					options: [
						{ value: "npm", label: "npm" },
						{ value: "yarn", label: "yarn" },
						{ value: "pnpm", label: "pnpm" },
					],
					initialValue: pkgManager,
				}),
			solanaVersion: () =>
				p.text({
					message: `☀️ Solana version? (${solanaVersion ? `current: ${solanaVersion}` : `default: ${DEFAULT_SOLANA_VERSION}`})`,
					defaultValue: solanaVersion ?? DEFAULT_SOLANA_VERSION,
				}),
			anchorVersion: () =>
				p.text({
					message: `⚓️ Anchor version? (${anchorVersion ? `current: ${anchorVersion}` : `default: ${DEFAULT_ANCHOR_VERSION}`})`,
					defaultValue: anchorVersion ?? DEFAULT_ANCHOR_VERSION,
				}),
			ui: () =>
				p.select({
					message: `🖥️ UI?`,
					options: [
						{ value: "none", label: "None (for now 😭)" },
						// { value: "react", label: "React" },
						// { value: "nextjs", label: "Next.JS" },
					],
					initialValue: "none",
				}),
		},
		{
			onCancel() {
				process.exit(1)
			},
		}
	)

	const config = {
		...userPreferences,
		name: name ?? userPreferences.name,
	}

	scaffold(config)
	ora(`Anchor app created! Kipp Buidling 🫡`).succeed()
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
