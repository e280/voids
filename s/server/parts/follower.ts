
import {MapG} from "@e280/stz"

import {Space} from "./space.js"
import {Clientside} from "../api/schema.js"

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
				const stopVoids = this.space.onVoid(async(vid, v) => {
					if (vid === voidId)
						await this.clientside.pulseVoid(vid, v)
				})

				const stopDrops = this.space.onDrop(async(id, drop) => {
					if (id === voidId)
						await this.clientside.pulseDrop(voidId, drop)
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

