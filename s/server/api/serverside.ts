
import {validLabel, verifyClaim} from "@e280/authlocal/core"
import {Authorize, ExposedError, secure} from "@e280/renraku/node"

import {Space} from "../parts/space.js"
import {constants} from "../../constants.js"
import {Follower} from "../parts/follower.js"
import {AuthClaim, Clientside, Serverside} from "./schema.js"

export const setupServerside = (
		space: Space,
		follower: Follower,
		_clientside: Clientside,
	): Serverside => ({

	user: secure(async auth => {
		const {proof} = await verifyClaim<AuthClaim>({
			claimToken: auth.claimToken,
			appOrigins: [constants.appOrigin],
			allowedAudiences: [constants.serverOrigin],
		})

		const userId = proof.nametag.id

		return <Authorize<Serverside["user"]>>{

			async setVoid(options) {
				if (!validLabel(options.label))
					throw new ExposedError("invalid label")

				const already = await space.getVoid(options.id)

				if (already) {
					if (already.ownerId !== userId)
						throw new ExposedError("you don't own this void")
					return space.setVoid({
						id: options.id,
						label: options.label,
						private: options.private,
						seen: already.seen,
						ownerId: userId,
						latestActivityTime: Date.now(),
					})
				}
				else {
					return space.setVoid({
						id: options.id,
						label: options.label,
						private: options.private,
						seen: [userId],
						ownerId: userId,
						latestActivityTime: Date.now(),
					})
				}
			},

			async getVoid(id) {
				const v = await space.getVoid(id)
				if (v) await space.accessVoidAndMarkSeen(id, userId)
				return v
			},

			async drop(voidId: string, payload: string) {
				await space.accessVoidAndMarkSeen(voidId, userId)
				return space.drop(voidId, payload)
			},

			async getDrops(voidId) {
				await space.accessVoidAndMarkSeen(voidId, userId)
				return space.getDrops(voidId)
			},

			async followVoid(id) {
				await space.accessVoidAndMarkSeen(id, userId)
				follower.followVoid(id)
			},

			async unfollowVoid(id) {
				follower.unfollowVoid(id)
			},
		}
	})
})

