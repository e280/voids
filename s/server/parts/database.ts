
import {Kv} from "@e280/kv"
import {Database} from "../types.js"

export function makeDatabase(kv: Kv): Database {
	return {
		kv,
		vaults: kv.scope(`vault`),
		voids: kv.scope(`void`),
		void: voidId => ({
			self: kv.scope(`void`).store(voidId),
			tickets: kv.scope(`void.ticket:${voidId}`),
			drops: kv.scope(`void.drop:${voidId}`),
			bubble: bubbleId => ({
				drops: kv.scope(`void.drop:${voidId}:${bubbleId}`),
			}),
		}),
	}
}

