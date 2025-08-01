
import {Hex} from "@e280/stz"
import {Cryption} from "../types.js"
import {hashHex} from "../../server/tools/hash-hex.js"
import {HierBranch, HierBubble, Role, Seat, Void} from "../../server/types.js"

export async function makeVoid(cryption: Cryption) {
	const voidId = cryption.symkey.id

	const adminSeatKey = Hex.random()
	const adminSeatId = await hashHex(adminSeatKey)

	const adminRole: Role = {
		id: Hex.random(),
		label: await cryption.encrypt("admin"),
		privileges: {
			canAdminRoles: true,
			canAssignRoles: true,
			canDeleteDrops: true,
			canDeleteVoid: true,
			canPostDrops: true,
			canReadDrops: true,
			canSeeBubbles: true,
			canUpdateVoid: true,
			canWipeVoid: true,
			canWriteBulletin: true,
			canWriteHeader: true,
		},
	}

	const bubble: HierBubble = {
		id: Hex.random(),
		label: await cryption.encrypt("label"),
		bubbleId: Hex.random(),
		header: await cryption.encrypt("header"),
	}

	const branch: HierBranch = {
		id: Hex.random(),
		label: await cryption.encrypt("label"),
		assignments: [[adminRole.id, [adminSeatId]]],
		children: [bubble.id]
	}

	const seat: Seat = {
		id: adminSeatId,
		joinedTime: Date.now()
	}

	const v: Void = {
		id: voidId,
		bulletin: await cryption.encrypt("bulletin"),
		hierarchy: {
			root: branch.id,
			nodes: [branch],
			roles: [adminRole],
		},
		seats: [seat],
	}

	return {void: v, adminSeatKey}
}

