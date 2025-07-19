
import {ssg, html} from "@e280/scute"

const title = "voids"
const domain = "voids.e280.org"
const favicon = "/assets/favicon.png"

export default ssg.page(import.meta.url, async orb => ({
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

	head: html`
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Bitcount:wght@100..900&family=Share+Tech&display=swap" rel="stylesheet">
	`,

	body: html`
		<voids-app>
			<section>
				<h1>VOIDS</h1>
				<p class=version>${orb.packageVersion()}</p>
				<p>better encrypted group chats</p>
				<p>lol it's work in progress</p>
				<p><a target=_blank href="https://github.com/e280/voids">github</a></p>
			</section>
		</voids-app>
	`,
}))

