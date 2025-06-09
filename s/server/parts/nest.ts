
import {collect} from "@e280/kv"
import {Hex, sub} from "@e280/stz"
import {constants} from "../../constants.js"
import {Database, Egg, Carton} from "./types.js"

export class Nest {
	onCarton = sub<[Carton]>()
	onEgg = sub<[{cartonId: string, egg: Egg}]>()

	constructor(private database: Database) {}

	async createCarton(carton: Carton) {
		if (await this.database.cartons.has(carton.id))
			throw new Error("carton already exists")
		await this.database.cartons.set(carton.id, carton)
		this.onCarton.pub(carton)
		return carton
	}

	async getCarton(cartonId: string) {
		return this.database.cartons.get(cartonId)
	}

	async getEggs(cartonId: string) {
		await this.database.cartons.require(cartonId)
		const eggs = this.database.eggs(cartonId)
		const all = await collect(eggs.values())

		const recent = all
			.filter(e => e.time > (Date.now() - constants.eggLifespan))
			.sort((a, b) => a.time - b.time)
			.slice(-constants.maxEggsPerCarton)

		const recentSet = new Set(recent)

		const old = all
			.filter(e => !recentSet.has(e))

		// delete all old eggs
		await eggs.del(...old.map(e => e.id))

		// return all recent eggs
		return recent
	}

	async addEgg(cartonId: string, payload: string) {
		const now = Date.now()

		const carton = await this.database.cartons.require(cartonId)
		carton.latestActivityTime = now
		await this.database.cartons.set(cartonId, carton)

		const egg: Egg = {
			id: Hex.random(32),
			time: now,
			payload,
		}

		await this.database.eggs(cartonId).set(egg.id, egg)
		this.onEgg.pub({cartonId, egg})
		return egg
	}

	async deleteExpiredCartons() {
		const now = Date.now()
		const expiredIds = new Set<string>()

		for await (const carton of this.database.cartons.values()) {
			if (carton.latestActivityTime < (now - constants.idleCartonLifespan))
				expiredIds.add(carton.id)
		}

		await this.database.cartons.del(...expiredIds)
	}
}

