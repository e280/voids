
import {sub} from "@e280/stz"
import {collect} from "@e280/kv"
import {constants} from "../../constants.js"
import {Database, DropPulse, SeatId, Stats, VoidId, VoidPulse} from "../types/types.js"

export class Space {
	stats: Stats = {
		voidCount: 0,
		pruneTime: 0,
	}

	onVoid = sub<[pulse: VoidPulse]>()
	onDrop = sub<[pulse: DropPulse]>()

	constructor(public database: Database) {}

	async updateVoidCount() {
		let count = 0
		for await (const _ of this.database.voids.keys())
			count += 1
		this.stats.voidCount = count
	}

	async deleteVoid(voidId: VoidId) {
		const v = this.database.void(voidId)
		await v.drops.clear()
		await v.tickets.clear()
		await v.self.set(undefined)
		this.stats.voidCount--
		this.onVoid.pub({voidId, v: null})
	}

	async wipeDropsBySeat(voidId: VoidId, seatId: SeatId) {
		const drops = await collect(this.database.void(voidId).drops.entries())
		const myDropKeys = drops
			.filter(([,drop]) => drop.seatId === seatId)
			.map(([key]) => key)
		await this.database.void(voidId).drops.del(...myDropKeys)
	}

	async pruneVoidsAndDrops() {
		const start = Date.now()

		// delete expired voids
		{
			const now = Date.now()
			const expiredVoidIds: string[] = []

			for await (const [voidId, v] of this.database.voids.entries()) {
				if (v.latestActivityTime < (now - constants.idleVoidLifespan))
					expiredVoidIds.push(voidId)
			}

			for (const voidId of expiredVoidIds)
				await this.deleteVoid(voidId)
		}

		// delete all expired drops
		{
			const now = Date.now()

			for await (const voidId of this.database.voids.keys()) {
				const expiredDropKeys: string[] = []

				for await (const [key, drop] of this.database.void(voidId).drops.entries()) {
					const expiresAt = drop.time + (drop.lifespan ?? constants.dropLifespan)
					const isExpired = now > expiresAt
					if (isExpired)
						expiredDropKeys.push(key)
				}

				await this.database.void(voidId).drops.del(...expiredDropKeys)
			}
		}

		await this.updateVoidCount()

		this.stats.pruneTime = Date.now() - start
	}
}

