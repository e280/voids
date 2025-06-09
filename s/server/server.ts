
import {Kv} from "@e280/kv"
import {LevelDriver} from "@e280/kv/level"
import {endpoint, remote, WebSocketServer} from "@e280/renraku/node"

import {Core} from "./core.js"
import {Clientside} from "./api/schema.js"
import {setupServerside} from "./api/serverside.js"

const level = new LevelDriver("./db")
const kv = new Kv(level)
const core = new Core(kv)

const wss = new WebSocketServer({
	async acceptConnection(connection) {
		const clientside = remote<Clientside>({
			endpoint: connection.remoteEndpoint,
		})
		return {
			localEndpoint: endpoint({fns: setupServerside(core.nest, clientside)}),
			closed: () => {},
		}
	},
})

wss.listen(8000)

