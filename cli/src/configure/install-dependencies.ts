import { execa, type StdoutStderrOption } from "execa"
import ora, { type Ora } from "ora"
import { PackageManager } from "../types"

const execWithSpinner = async (
	projectDir: string,
	pkgManager: PackageManager,
	options: {
		args?: string[]
		stdout?: StdoutStderrOption
		onDataHandle?: (spinner: Ora) => (data: Buffer) => void
	}
) => {
	const { onDataHandle, args = ["install"], stdout = "pipe" } = options

	const spinner = ora(`Running ${pkgManager} install...`).start()
	const subprocess = execa(pkgManager, args, { cwd: projectDir, stdout })

	await new Promise<void>((res, rej) => {
		if (onDataHandle) {
			subprocess.stdout?.on("data", onDataHandle(spinner))
		}

		void subprocess.on("error", (e) => rej(e))
		void subprocess.on("close", () => res())
	})

	return spinner
}

const runInstallCommand = async (
	pkgManager: PackageManager,
	projectDir: string
): Promise<Ora | null> => {
	switch (pkgManager) {
		// When using npm, inherit the stderr stream so that the progress bar is shown
		case "npm":
			await execa(pkgManager, ["install"], {
				cwd: projectDir,
				stderr: "inherit",
			})

			return null
		// When using yarn or pnpm, use the stdout stream and ora spinner to show the progress
		case "pnpm":
			return execWithSpinner(projectDir, pkgManager, {
				onDataHandle: (spinner) => (data) => {
					const text = data.toString()

					if (text.includes("Progress")) {
						spinner.text = text.includes("|")
							? text.split(" | ")[1] ?? ""
							: text
					}
				},
			})
		case "yarn":
			return execWithSpinner(projectDir, pkgManager, {
				onDataHandle: (spinner) => (data) => {
					spinner.text = data.toString()
				},
			})
	}
}

export const installDependencies = async ({
	projectDir,
	pkg,
}: {
	projectDir: string
	pkg: PackageManager
}) => {
	console.info("Installing dependencies...")

	const installSpinner = await runInstallCommand(pkg, projectDir)

	;(installSpinner ?? ora()).succeed("Successfully installed dependencies!\n")
}
