
import {Peeker} from "./types.js"
import {constants} from "../../constants.js"

export function normalizePeekers(peekers: Peeker[]): Peeker[] {
	const map = new Map<string, number>()

	// dedupe entries
	for (const [userId, time] of peekers) {
		const already = map.get(userId) ?? time
		map.set(userId, Math.max(already, time))
	}

	const cutoffTime = Date.now() - constants.peekerLifespan

	return [...map]

		// remove expired
		.filter(([,time]) => time > cutoffTime)

		// sort newest last
		.sort(([,a], [,b]) => a - b)

		// oldest are first to get dropped
		.slice(-constants.peekerLimit)
}

