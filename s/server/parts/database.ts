
import {Kv} from "@e280/kv"
import {Carton, Database, Egg} from "./types.js"

export function makeDatabase(kv: Kv): Database {
	return {
		cartons: kv.namespace<Carton>("room"),
		eggs: roomId => kv.namespace<Egg>(`message.${roomId}`),
	}
}

