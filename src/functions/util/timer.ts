export default async function(ms: number): Promise<void> {
	new Promise(res => setTimeout(res, ms))
}
