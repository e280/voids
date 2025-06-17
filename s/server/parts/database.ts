
import {Kv} from "@e280/kv"
import {Database} from "../types/types.js"

export function makeDatabase(kv: Kv): Database {
	return {
		vaults: kv.namespace("vault"),
		voids: kv.namespace("void"),
		voidDrops: voidId => kv.namespace(`drop:${voidId}`),
		drops: (voidId, bubbleId) => kv.namespace(`drop:${voidId}:${bubbleId}`),
	}
}

