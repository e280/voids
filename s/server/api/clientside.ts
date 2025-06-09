
import {Clientside} from "./schema.js"

export const setupClientside = (): Clientside => ({
	async drop(voidId, drop) {
		console.log("fresh drop", voidId, drop)
	},
})

