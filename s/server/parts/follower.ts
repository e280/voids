
import {MapG} from "@e280/stz"

import {Space} from "./space.js"
import {Clientside} from "../api/surface.js"

export class Follower {
	#watchers = new MapG<string, () => void>()
	constructor(private space: Space, private clientside: Clientside) {}

	#unfollowAll() {
		for (const stop of this.#watchers.values())
			stop()
		this.#watchers.clear()
	}

	follow(voidIds: string[]) {
		this.#unfollowAll()
		for (const voidId of voidIds) {
			this.#watchers.guarantee(voidId, () => {
				const stopVoids = this.space.onVoid(async pulse => {
					if (pulse.voidId === voidId)
						await this.clientside.pulseVoid(pulse)
				})

				const stopDrops = this.space.onDrop(async pulse => {
					if (pulse.voidId === voidId)
						await this.clientside.pulseDrop(pulse)
				})

				return () => {
					stopVoids()
					stopDrops()
				}
			})
		}
	}

	dispose() {
		this.#unfollowAll()
	}
}

