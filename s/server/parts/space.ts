
import {collect} from "@e280/kv"
import {Hex, sub} from "@e280/stz"

import {constants} from "../../constants.js"
import {normalizePeekers} from "./peekers.js"
import {Capabilities} from "./capabilities.js"
import {Database, Drop, Peeker, Void} from "./types.js"

export class Space {
	voidCount = 0
	onVoid = sub<[voidId: string, Void | null]>()
	onDrop = sub<[voidId: string, drop: Drop]>()
	capabilities = new Capabilities()

	constructor(private database: Database) {}

	async setVoid(v: Void) {
		await this.database.voids.set(v.id, v)
		this.onVoid.pub(v.id, v)
		this.#updateVoidCount()
		return v
	}

	async getVoid(id: string) {
		return this.database.voids.get(id)
	}

	async deleteVoids(...ids: string[]) {
		await Promise.all(ids.map(async id => this.wipeVoidDrops(id)))
		await this.database.voids.del(...ids)
		this.#updateVoidCount()
		for (const id of ids)
			this.onVoid.pub(id, null)
	}

	async requireVoid(id: string) {
		return this.database.voids.require(id)
	}

	async peekIntoVoid(voidId: string, userId: string) {
		const v = await this.database.voids.require(voidId)
		const newPeeker: Peeker = [userId, Date.now()]
		v.peekers = normalizePeekers([...v.peekers, newPeeker])
		await this.database.voids.set(voidId, v)
		return v
	}

	async listDropsInVoid(voidId: string) {
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

	async postDrop(v: Void, payload: string) {
		const now = Date.now()

		v.latestActivityTime = now
		await this.database.voids.set(v.id, v)

		const drop: Drop = {
			id: Hex.random(32),
			time: now,
			payload,
		}

		await this.database.drops(v.id).set(drop.id, drop)
		this.onDrop.pub(v.id, drop)
		return drop
	}

	async deleteDrops(voidId: string, dropIds: string[]) {
		await this.database.drops(voidId).del(...dropIds)
	}

	async wipeVoidDrops(voidId: string) {
		await this.database.drops(voidId).clear()
	}

	async deleteExpiredVoids() {
		const now = Date.now()
		const expiredIds = new Set<string>()

		for await (const v of this.database.voids.values()) {
			if (v.latestActivityTime < (now - constants.idleVoidLifespan))
				expiredIds.add(v.id)
		}

		await this.deleteVoids(...expiredIds)
	}

	async #updateVoidCount() {
		let count = 0
		for await (const _ of this.database.voids.keys())
			count += 1
		this.voidCount = count
	}
}

