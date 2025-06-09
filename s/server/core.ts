
import {Kv} from "@e280/kv"
import {Nest} from "./parts/nest.js"
import {Database, Egg, Carton} from "./parts/types.js"

export class Core {
	database: Database
	nest: Nest

	constructor(kv: Kv) {
		this.database = {
			cartons: kv.namespace<Carton>("room"),
			eggs: roomId => kv.namespace<Egg>(`message.${roomId}`),
		}

		this.nest = new Nest(this.database)
	}
}

