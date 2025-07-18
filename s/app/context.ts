
import {getVoidsApp} from "./dom/voids-app/element.js"

export class Context {
	elements = {
		VoidsApp: getVoidsApp(this),
	}
}

