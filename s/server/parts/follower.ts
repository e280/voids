
import {MapG} from "@e280/stz"

import {Nest} from "./nest.js"
import {Clientside} from "../api/schema.js"

export class Follower {
	#watchers = new MapG<string, () => void>()

	constructor(private nest: Nest, private clientside: Clientside) {}

	followCarton(cartonId: string) {
		this.#watchers.guarantee(cartonId, () => {
			return this.nest.onEgg(async(cid, egg) => {
				if (cid === cartonId)
					await this.clientside.freshEgg(cartonId, egg)
			})
		})
	}

	unfollowCarton(cartonId: string) {
		const stop = this.#watchers.require(cartonId)
		stop()
		this.#watchers.delete(cartonId)
	}

	dispose() {
		for (const stop of this.#watchers.values())
			stop()
		this.#watchers.clear()
	}
}

