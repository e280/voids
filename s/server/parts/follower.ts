
import {MapG} from "@e280/stz"

import {Space} from "./space.js"
import {Clientside} from "../api/schema.js"

export class Follower {
	#watchers = new MapG<string, () => void>()

	constructor(private space: Space, private clientside: Clientside) {}

	followVoid(voidId: string) {
		this.#watchers.guarantee(voidId, () => {
			const stopVoids = this.space.onVoid(async(v) => {
				if (v.id === voidId)
					await this.clientside.void(v)
			})

			const stopDrops = this.space.onDrop(async(id, drop) => {
				if (id === voidId)
					await this.clientside.drop(voidId, drop)
			})

			return () => {
				stopVoids()
				stopDrops()
			}
		})
	}

	unfollowVoid(voidId: string) {
		const stop = this.#watchers.require(voidId)
		stop()
		this.#watchers.delete(voidId)
	}

	dispose() {
		for (const stop of this.#watchers.values())
			stop()
		this.#watchers.clear()
	}
}

