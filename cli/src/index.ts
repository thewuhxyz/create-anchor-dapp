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
import { App } from "./types"

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
					message: `🖥️ UI? (default: none)`,
					options: [
						{ value: "none", label: "None" },
						{ value: "react", label: "React" },
						{ value: "nextjs", label: "NextJS" },
					],
					initialValue: "none" as App,
				}),
			pkg: () =>
				p.select({
					message: `👔 Package manager? (current: ${pkgManager})`,
					options: [
						{ value: "npm", label: "npm" },
						{ value: "yarn", label: "yarn" },
						{ value: "pnpm", label: "pnpm" },
					],
					initialValue: pkgManager,
				}),
			install: () =>
				p.confirm({
					message: `🪡 Install Dependencies? (default: Yes)`,
					initialValue: true,
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

	await scaffold(config)

	ora(`Anchor dApp created! Kipp Buidling 🫡`).succeed()
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
