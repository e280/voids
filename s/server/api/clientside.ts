
import {Clientside} from "./schema.js"

export const setupClientside = (): Clientside => ({
	async pulseDrop(voidId, drop) {
		console.log("fresh drop", voidId, drop)
	},
	async pulseVoid(voidId, v) {
		console.log("void updated", voidId, v)
	},
})

