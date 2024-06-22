#!/usr/bin/env node
import { program } from "@commander-js/extra-typings"

program
	.name("create-anchor-app")
	.description("Scaffold an Solana project with Anchor")
	.version("0.0.1")

program.action(() => console.log("creating anchor app....."))

program.parse()
