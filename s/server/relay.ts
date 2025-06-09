
import {Kv} from "@e280/kv"
import {Nest} from "./parts/nest.js"
import {Clientside} from "./api/schema.js"
import {Follower} from "./parts/follower.js"
import {makeDatabase} from "./parts/database.js"
import {setupServerside} from "./api/serverside.js"

export function makeRelay(kv: Kv) {
	const database = makeDatabase(kv)
	const nest = new Nest(database)

	async function accept(clientside: Clientside) {
		const follower = new Follower(nest, clientside)
		const serverside = setupServerside(
			nest,
			follower,
			clientside,
		)
		return {
			serverside,
			closed: () => follower.dispose(),
		}
	}

	return {accept}
}

