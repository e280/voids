
import {Content, html, shadowComponent} from "@benev/slate"

import themeCss from "../theme.css.js"
import stylesCss from "./styles.css.js"
import homeSvg from "../../icons/tabler/home.svg.js"
import usersSvg from "../../icons/tabler/users.svg.js"
import stack2Svg from "../../icons/tabler/stack-2.svg.js"
import settingsSvg from "../../icons/tabler/settings.svg.js"
import messageCircleSvg from "../../icons/tabler/message-circle.svg.js"

import {Context} from "../../context.js"
import {ChatView} from "../panels/chat/view.js"
import {VoidsView} from "../panels/voids/view.js"
import {MembersView} from "../panels/members/view.js"
import {SettingsView} from "../panels/settings/view.js"

export const getVoidsApp = (context: Context) => shadowComponent(use => {
	use.styles(themeCss, stylesCss)

	const currentIndex = use.signal(0)

	type Panel = {
		icon: Content
		label: string
		render: () => Content
	}

	const panels = use.once<Panel[]>(() => [
		{
			icon: homeSvg,
			label: "home",
			render: () => html`<slot></slot>`,
		},
		{
			icon: stack2Svg,
			label: "voids",
			render: () => VoidsView(context)([]),
		},
		{
			icon: messageCircleSvg,
			label: "chat",
			render: () => ChatView(context)([]),
		},
		{
			icon: usersSvg,
			label: "members",
			render: () => MembersView(context)([]),
		},
		{
			icon: settingsSvg,
			label: "settings",
			render: () => SettingsView(context)([]),
		},
	])

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
				${panels.map(({render}, index) => html`
					<section ?inert="${index !== currentIndex.value}">
						${render()}
					</section>
				`)}
			</div>

			<nav>
				${panels.map(({icon, label}, index) => html`
					<button
						title="${label}"
						?disabled="${index === currentIndex.value}"
						?x-active="${index === currentIndex.value}"
						@click="${click(index)}">
							${icon}
							<span>${label}</span>
					</button>
				`)}
			</nav>
		</div>
	`
})

