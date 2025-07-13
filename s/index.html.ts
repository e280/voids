
import {temple, html} from "@e280/scute"

const domain = "voids.e280.org"
const favicon = "/assets/favicon.png"

export default temple.page(import.meta.url, async orb => ({
	title: "voids",
	css: "app/main.css",
	dark: true,
	favicon,
	head: html`
		<script type=module src="${orb.hashurl("app/main.bundle.js")}"></script>
	`,

	socialCard: {
		themeColor: "#d633fc",
		siteName: domain,
		title: "voids",
		description: "better encrypted group chats",
		image: `https://${domain}${favicon}`,
	},

	body: html`
		<voids-app></voids-app>
	`,
}))

