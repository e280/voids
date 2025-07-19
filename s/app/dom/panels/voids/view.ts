
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Context} from "../../../context.js"

export const VoidsView = (_context: Context) => shadowView(use => () => {
	use.name("voids")
	use.styles(themeCss, stylesCss)

	return html`
		<h2>voids</h2>
	`
})

