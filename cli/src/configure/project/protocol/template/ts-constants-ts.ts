export function constantsTsTemplate({programId}: {programId: string}) {
  return `
export const DEMO_PROGRAM_ID = "${programId}"
export const COUNTER_SEEDS = "counter"
`
}