
import {collect} from "@e280/kv"
import {dedupe, Hex, sub} from "@e280/stz"
import {ExposedError} from "@e280/renraku/node"

import {constants} from "../../constants.js"
import {Database, Drop, Void} from "./types.js"

export class Space {
	onVoid = sub<[Void]>()
	onDrop = sub<[voidId: string, drop: Drop]>()

	constructor(private database: Database) {}

	async setVoid(v: Void) {
		await this.database.voids.set(v.id, v)
		this.onVoid.pub(v)
		return v
	}

	async getVoid(id: string) {
		return this.database.voids.get(id)
	}

	async accessVoidAndMarkSeen(voidId: string, userId: string) {
		const v = await this.database.voids.require(voidId)
		const isAllowed = (
			!v.private ||
			v.ownerId === userId ||
			v.private.includes(userId)
		)
		if (!isAllowed)
			throw new ExposedError("you are forbidden from this private void")
		v.seen = dedupe([...v.seen, userId]).slice(-constants.seenLimit)
		await this.database.voids.set(voidId, v)
	}

	async getDrops(voidId: string) {
		await this.database.voids.require(voidId)
		const drops = this.database.drops(voidId)
		const all = await collect(drops.values())

		const recent = all
			.filter(d => d.time > (Date.now() - constants.dropLifespan))
			.sort((a, b) => a.time - b.time)
			.slice(-constants.maxDropsPerVoid)

		const recentSet = new Set(recent)

		const old = all
			.filter(d => !recentSet.has(d))

		// delete olds
		await drops.del(...old.map(d => d.id))

		// return recents
		return recent
	}

	async drop(voidId: string, payload: string) {
		const now = Date.now()

		const v = await this.database.voids.require(voidId)
		v.latestActivityTime = now
		await this.database.voids.set(voidId, v)

		const drop: Drop = {
			id: Hex.random(32),
			time: now,
			payload,
		}

		await this.database.drops(voidId).set(drop.id, drop)
		this.onDrop.pub(voidId, drop)
		return drop
	}

	async deleteExpiredVoids() {
		const now = Date.now()
		const expiredIds = new Set<string>()

		for await (const v of this.database.voids.values()) {
			if (v.latestActivityTime < (now - constants.idleVoidLifespan))
				expiredIds.add(v.id)
		}

		await this.database.voids.del(...expiredIds)
	}
}

