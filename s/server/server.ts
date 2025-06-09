
import {Kv} from "@e280/kv"
import {LevelDriver} from "@e280/kv/level"
import {endpoint, remote, WebSocketServer} from "@e280/renraku/node"

import {Core} from "./core.js"
import {Clientside} from "./api/schema.js"
import {setupServerside} from "./api/serverside.js"
import { Follower } from "./parts/follower.js"

const level = new LevelDriver("./db")
const kv = new Kv(level)
const core = new Core(kv)

const wss = new WebSocketServer({
	async acceptConnection(connection) {
		const clientside = remote<Clientside>({
			endpoint: connection.remoteEndpoint,
		})
		const follower = new Follower(core.nest, clientside)
		const serverside = setupServerside(
			core.nest,
			follower,
			clientside,
		)
		return {
			localEndpoint: endpoint({fns: serverside}),
			closed: () => {
				follower.dispose()
			},
		}
	},
})

wss.listen(8000)

