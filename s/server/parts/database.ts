
import {Kv} from "@e280/kv"
import {Void, Database, Drop} from "./types.js"

export function makeDatabase(kv: Kv): Database {
	return {
		voids: kv.namespace<Void>("void"),
		drops: voidId => kv.namespace("drop").namespace<Drop>(voidId),
	}
}

