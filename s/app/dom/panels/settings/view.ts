
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Context} from "../../../context.js"

export const SettingsView = (_context: Context) => shadowView(use => () => {
	use.name("settings")
	use.styles(themeCss, stylesCss)

	return html`
		<h2>settings</h2>
	`
})

