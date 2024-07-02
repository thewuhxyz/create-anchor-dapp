import semverGte from "semver/functions/gte.js"

export function idlIndexTxTemplate({
	anchorVersion,
}: {
	anchorVersion: string
}) {
	const isPoint30andGt = semverGte(anchorVersion, "0.30.0")
	return `
import { type DemoProgram ${isPoint30andGt ? "" : ", IDL as DemoProgramIDL"} } from "./demo_program"
import DemoProgramIDLJson from "./demo_program.json"

export { type DemoProgram ${isPoint30andGt ? "" : ", DemoProgramIDL"}, DemoProgramIDLJson }
`
}
