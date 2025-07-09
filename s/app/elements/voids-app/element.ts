
import {html, shadowComponent} from "@benev/slate"
import stylesCss from "./styles.css.js"
import {Context} from "../../context.js"

export const getVoidsApp = (context: Context) => shadowComponent(use => {
	use.styles(stylesCss)

	return html`voids`
})

