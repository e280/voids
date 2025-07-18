
import {html, shadowComponent} from "@benev/slate"
import themeCss from "../theme.css.js"
import stylesCss from "./styles.css.js"
import {Context} from "../../context.js"

export const getVoidsApp = (_context: Context) => shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	return html`
		<div class=bg>
			<img alt="" src="/assets/space-01.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
		</div>
	`
})

