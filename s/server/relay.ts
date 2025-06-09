
import {Kv} from "@e280/kv"
import {Space} from "./parts/space.js"
import {Clientside} from "./api/schema.js"
import {Follower} from "./parts/follower.js"
import {makeDatabase} from "./parts/database.js"
import {setupServerside} from "./api/serverside.js"

export function makeRelay(kv: Kv) {
	const database = makeDatabase(kv)
	const space = new Space(database)

	async function accept(clientside: Clientside) {
		const follower = new Follower(space, clientside)
		const serverside = setupServerside(
			space,
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

