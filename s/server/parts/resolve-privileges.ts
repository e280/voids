
import {deep, MapG} from "@e280/stz"
import {Bubble, BubbleId, Privileges, Void, VoidPrivs} from "../types/types.js"

export const defaultPrivileges: Privileges = {
	canPostDrops: true,
	canReadDrops: true,
	canSeeBubbles: true,

	canAdminRoles: false,
	canAssignRoles: false,
	canDeleteDrops: false,
	canDeleteVoid: false,
	canUpdateVoid: false,
	canWipeVoid: false,
	canWriteBulletin: false,
	canWriteHeader: false,
}

export function resolvePrivileges(v: Void, member: string, bubbleId?: string): Privileges {
	if (!v.members.includes(member)) throw new Error("not even a member")

	// starting with the default privileges
	const privileges = deep.clone(defaultPrivileges)

	// applying void-level privs
	for (const role of v.roles) {
		if (role.members.includes(member))
			applyPrivs(privileges, role.privs)
	}

	// apply bubble-level privs
	if (bubbleId) {
		const chain = bubbleChain(v, bubbleId)
		for (const bubble of chain) {
			for (const role of bubble.roles) {
				if (role.members.includes(member))
					applyPrivs(privileges, role.privs)
			}
		}
	}
	
	return privileges
}

function applyPrivs(privileges: Privileges, privs: Partial<VoidPrivs>) {
	for (const [key, priv] of Object.entries(privs)) {
		const k = key as keyof Privileges
		if (priv === 1) privileges[k] = true
		if (priv === -1) privileges[k] = false
	}
}

function bubbleChain(v: Void, leaf: BubbleId): Bubble[] {
	const map = new MapG(v.bubbles.map(b => [b.id, b]))
	const parent = new Map<BubbleId, BubbleId>()
	for (const b of v.bubbles) for (const c of b.children) parent.set(c, b.id)

	const chain: Bubble[] = []
	let current = map.get(leaf)

	while (current) {
		chain.unshift(current)
		const pid = parent.get(current.id)
		current = pid ? map.get(pid) : undefined
	}

	return chain
}

