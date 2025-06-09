
export function repeatly(milliseconds: number, fn: () => Promise<void>) {
	let timeout: any
	let stop = false

	async function tick() {
		if (stop) return undefined
		await fn()
		timeout = setTimeout(tick, milliseconds)
	}

	timeout = setTimeout(tick, milliseconds)

	return () => {
		stop = true
		clearTimeout(timeout)
	}
}

