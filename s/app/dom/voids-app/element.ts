
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

	const currentPosition = use.signal(0)
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

	const drag = use.signal<null | {startClientX: number}>(null)

	use.mount(() => {
		let run = true
		const lerp = 0.15
		const epsilon = 0.01
		function animate() {
			if (!run) return undefined
			if (!drag.value) {
				const diff = currentIndex.value - currentPosition.value
				if (Math.abs(diff) > epsilon)
					currentPosition.value += diff * lerp
			}
			requestAnimationFrame(animate)
		}
		animate()
		return () => { run = false }
	})

	const pointerdown = (event: PointerEvent) => {
		drag.value = {
			startClientX: event.clientX,
		}
		const target = event.currentTarget as HTMLElement
		target.setPointerCapture(event.pointerId)
	}

	const pointermove = (event: PointerEvent) => {
		const d = drag.value
		if (d) {
			const containerWidth = window.innerWidth
			const fraction = -(event.movementX / containerWidth)

			currentPosition.value = Math.max(0, Math.min(panels.length - 1, (
				currentPosition.value + (fraction * 1.5)
			)))

			currentIndex.value = Math.round(currentPosition.value)
		}
	}

	const pointerup = () => {
		drag.value = null
	}

	const alpha = (currentPosition.value / (panels.length - 1)) * 100
	const bravo = (currentPosition.value / panels.length) * 100

	return html`
		<div class=bg style="${`--alpha: ${alpha}%;`}">
			<img alt="" src="/assets/space-01.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
			<img alt="" src="/assets/space-02.avif"/>
		</div>

		<div class=harness>
			<div class=carousel
				style="${`width: ${panels.length * 100}%; --bravo: ${bravo}%;`}"
				@pointerdown="${pointerdown}"
				@pointermove="${pointermove}"
				@pointerup="${pointerup}"
				@blur="${pointerup}">
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

