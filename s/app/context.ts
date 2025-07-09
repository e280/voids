
import {getVoidsApp} from "./elements/voids-app/element.js"

export class Context {
	elements = {
		VoidsApp: getVoidsApp(this),
	}
}

