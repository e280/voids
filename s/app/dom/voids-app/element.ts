
import {Content, html, shadowComponent} from "@benev/slate"
import themeCss from "../theme.css.js"
import stylesCss from "./styles.css.js"
import {Context} from "../../context.js"

export const getVoidsApp = (_context: Context) => shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	const currentIndex = use.signal(0)

	const panels: [string, () => Content][] = [
		["a", () => html`
			<div>a</div>
		`],
		["b", () => html`
			<div>b</div>
		`],
		["c", () => html`
			<div>c</div>
		`],
		["d", () => html`
			<div>d</div>
		`],
	]

	const click = (index: number) => () => {
		currentIndex.value = index
	}

	const x = (currentIndex.value / (panels.length - 1)) * 100
	const y = (currentIndex.value / panels.length) * 100

	return html`
		<div class=bg style="${`--x: ${x}%;`}">
			<img alt="" src="/assets/space-01.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
		</div>

		<div class=harness>
			<div class=carousel style="${`width: ${panels.length * 100}%; --y: ${y}%;`}">
				${panels.map(([,render]) => html`
					<section>
						${render()}
					</section>
				`)}
			</div>
			<nav>
				${panels.map(([label], index) => html`
					<button @click="${click(index)}">${label}</button>
				`)}
			</nav>
		</div>
	`
})

