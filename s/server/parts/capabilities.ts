
import {MapG} from "@e280/stz"
import {Role} from "./types.js"

export type Caps = {
	isMuted: boolean
	canMute: boolean
	canPostDrops: boolean
	canDeleteDrops: boolean
	canWritePinned: boolean
	canAssignRoles: boolean
	canDeleteVoid: boolean
}

export class Capabilities {
	#fallback: Caps = {
		isMuted: false,
		canPostDrops: true,
		canDeleteDrops: false,
		canMute: false,
		canAssignRoles: false,
		canWritePinned: false,
		canDeleteVoid: false,
	}

	#map = new MapG<Role, Caps>([
		["admin", {
			isMuted: false,
			canPostDrops: true,
			canDeleteDrops: true,
			canMute: true,
			canAssignRoles: true,
			canWritePinned: true,
			canDeleteVoid: true,
		}],
		["mod", {
			isMuted: false,
			canPostDrops: true,
			canDeleteDrops: true,
			canMute: true,
			canAssignRoles: false,
			canWritePinned: true,
			canDeleteVoid: false,
		}],
		["muted", {
			isMuted: true,
			canPostDrops: false,
			canDeleteDrops: false,
			canMute: false,
			canAssignRoles: false,
			canWritePinned: false,
			canDeleteVoid: false,
		}],
	])

	get(roles: Set<Role>): Caps {
		const caps = {...this.#fallback}
		for (const role of roles)
			Object.assign(caps, this.#map.require(role))
		return caps
	}
}

