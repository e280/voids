
import {Clientside} from "./surface.js"

export const setupClientside = (): Clientside => ({
	async pulseDrop(pulse) {
		console.log("drop pulse", pulse)
	},
	async pulseVoid(pulse) {
		console.log("void pulse", pulse)
	},
})

