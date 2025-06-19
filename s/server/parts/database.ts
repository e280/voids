
import {Kv} from "@e280/kv"
import {Database} from "../types/types.js"

export function makeDatabase(kv: Kv): Database {
	return {
		vaults: kv.scope(`vault`),
		voids: kv.scope(`void`),
		void: voidId => ({
			store: kv.scope(`void`).store(voidId),
			tickets: kv.scope(`void.tickets:${voidId}`),
			drops: kv.scope(`void.drops:${voidId}`),
			bubble: bubbleId => ({
				drops: kv.scope(`void.drops:${voidId}:${bubbleId}`)
			}),
		}),
	}
}

