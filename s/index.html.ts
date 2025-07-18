
import {ssg, html} from "@e280/scute"

const title = "voids"
const domain = "voids.e280.org"
const favicon = "/assets/favicon.png"

export default ssg.page(import.meta.url, async _orb => ({
	title,
	favicon,
	dark: true,
	css: "app/main.css",
	js: "app/main.bundle.min.js",

	socialCard: {
		title,
		description: "better encrypted group chats",
		themeColor: "#d633fc",
		siteName: domain,
		image: `https://${domain}${favicon}`,
	},

	body: html`
		<voids-app></voids-app>
	`,
}))

