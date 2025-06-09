
import {Clientside} from "./schema.js"

export const setupClientside = (): Clientside => ({
	async freshEgg(cartonId, egg) {
		console.log("fresh egg!", cartonId, egg)
	},
})

