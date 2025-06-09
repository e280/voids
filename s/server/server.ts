
import {Kv} from "@e280/kv"
import {LevelDriver} from "@e280/kv/level"
import {endpoint, remote, WebSocketServer} from "@e280/renraku/node"

import {makeRelay} from "./relay.js"
import {Clientside} from "./api/schema.js"

const level = new LevelDriver("./db")
const kv = new Kv(level)
const relay = makeRelay(kv)

const wss = new WebSocketServer({
	async acceptConnection(connection) {
		const clientside = remote<Clientside>({
			endpoint: connection.remoteEndpoint,
		})
		const {serverside, closed} = await relay.accept(clientside)
		return {
			localEndpoint: endpoint({fns: serverside}),
			closed,
		}
	},
})

wss.listen(8000)

