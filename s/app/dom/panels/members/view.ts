
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Context} from "../../../context.js"

export const MembersView = (_context: Context) => shadowView(use => () => {
	use.name("members")
	use.styles(themeCss, stylesCss)

	return html`
		<h2>members</h2>
	`
})

