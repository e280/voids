
import {verifyClaim} from "@e280/authlocal/core"
import {Authorize, ExposedError, secure} from "@e280/renraku/node"

import {Void} from "../parts/types.js"
import {Space} from "../parts/space.js"
import {constants} from "../../constants.js"
import {Follower} from "../parts/follower.js"
import {Caps} from "../parts/capabilities.js"
import {RoleKeeper} from "../parts/role-keeper.js"
import {AuthClaim, Clientside, Serverside} from "./schema.js"

export const setupServerside = (
		space: Space,
		follower: Follower,
		_clientside: Clientside,
	): Serverside => ({

	anon: {
		async getVoidCount() {
			return space.voidCount
		},
	},

	user: secure(async auth => {
		const {proof} = await verifyClaim<AuthClaim>({
			claimToken: auth.claimToken,
			appOrigins: [constants.appOrigin],
			allowedAudiences: [constants.serverOrigin],
		})

		const userId = proof.nametag.id

		function voidCapabilities(v: Void) {
			const roles = new RoleKeeper(v.roles).get(userId)
			return space.capabilities.get(roles)
		}

		async function getVoidAndCaps(voidId: string): Promise<[Void, Caps]> {
			const v = await space.requireVoid(voidId)
			return [v, voidCapabilities(v)]
		}

		return {
			async createVoid(voidId, options) {
				const already = await space.getVoid(voidId)
				if (already) throw new Error("this void already exists")
				const roles = new RoleKeeper()
				roles.get(userId).add("admin")
				return space.setVoid({
					id: voidId,
					pinned: options.pinned,
					roles: roles.toAssignments(),
					latestActivityTime: Date.now(),
					peekers: [userId],
				})
			},

			async readVoid(voidId) {
				const v = await space.getVoid(voidId)
				if (v) await space.peekIntoVoid(voidId, userId)
				return v
			},

			async updateVoid(voidId, options) {
				const v = await space.requireVoid(voidId)
				const caps = voidCapabilities(v)

				if (options.pinned) {
					if (!caps.canWritePinned) throw new ExposedError("unauthorized action")
					v.pinned = options.pinned
				}

				if (options.roles) {
					if (!caps.canAssignRoles) throw new ExposedError("unauthorized action")
					v.roles = options.roles
				}

				return space.setVoid(v)
			},

			async deleteVoid(voidId) {
				const [,caps] = await getVoidAndCaps(voidId)
				if (!caps.canDeleteVoid) throw new ExposedError("unauthorized action")
				await space.deleteVoids(voidId)
			},

			async postDrop(voidId, payload) {
				const [v, caps] = await getVoidAndCaps(voidId)
				if (!caps.canPostDrops) throw new ExposedError("unauthorized action")
				if (caps.isMuted) throw new ExposedError("you've been muted in this void")
				return space.postDrop(v, payload)
			},

			async listDrops(voidId) {
				await space.peekIntoVoid(voidId, userId)
				return space.listDropsInVoid(voidId)
			},

			async deleteDrops(voidId: string, dropIds: string[]) {
				const [,caps] = await getVoidAndCaps(voidId)
				if (!caps.canDeleteDrops) throw new ExposedError("unauthorized action")
				await space.deleteDrops(voidId, dropIds)
			},

			async wipeVoidDrops(voidId: string) {
				const [,caps] = await getVoidAndCaps(voidId)
				if (!caps.canDeleteDrops) throw new ExposedError("unauthorized action")
				await space.wipeVoidDrops(voidId)
			},

			async follow(voidIds) {
				await Promise.all(
					voidIds.map(async voidId => space.peekIntoVoid(voidId, userId))
				)
				follower.follow(voidIds)
			},
		} satisfies Authorize<Serverside["user"]>
	})
})

