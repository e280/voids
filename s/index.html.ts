
import {template, html, easypage, headScripts, git_commit_hash, read_file, read_json, unsanitized, renderSocialCard} from "@benev/turtle"

const domain = "voids.e280.org"
const favicon = "/assets/favicon.png"
const version = (await read_json("package.json")).version

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()
	const faviconVersioned = await path.version.root(favicon)

	return easypage({
		path,
		dark: true,
		title: "voids",
		head: html`
			<meta data-commit-hash="${hash}"/>
			<meta data-version="${version}"/>

			<style>${unsanitized(await read_file("x/app/main.css"))}</style>
			<link rel="icon" href="${faviconVersioned}"/>

			${renderSocialCard({
				themeColor: "#d633fc",
				siteName: domain,
				title: "voids",
				description: "better encrypted group chats",
				image: `https://${domain}${favicon}`,
			})}

			${headScripts({
				devModulePath: await path.version.local("app/main.bundle.js"),
				prodModulePath: await path.version.local("app/main.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<h1>voids</h1>
		`,
	})
})

