
import {validLabel, verifyClaim} from "@e280/authlocal/core"
import {Authorize, ExposedError, secure} from "@e280/renraku"

import {Space} from "../parts/space.js"
import {Follower} from "../parts/follower.js"
import {constants} from "../../constants.js"
import {AuthClaim, Clientside, Serverside} from "./schema.js"

export const setupServerside = (
		space: Space,
		follower: Follower,
		_clientside: Clientside,
	): Serverside => ({

	anon: {
		async getVoid(id) {
			return space.getVoid(id)
		},
		async followVoid(id) {
			follower.followVoid(id)
		},
		async unfollowVoid(id) {
			follower.unfollowVoid(id)
		},
		async getDrops(voidId) {
			return space.getDrops(voidId)
		},
	},

	user: secure(async auth => {
		const {proof} = await verifyClaim<AuthClaim>({
			claimToken: auth.claimToken,
			appOrigins: [constants.appOrigin],
			allowedAudiences: [constants.serverOrigin],
		})
		return <Authorize<Serverside["user"]>>{

			async makeVoid(id: string, label: string) {
				if (!validLabel(label))
					throw new ExposedError("invalid label")
				return space.makeVoid({
					id,
					label,
					ownerId: proof.nametag.id,
					latestActivityTime: Date.now(),
				})
			},

			async drop(voidId: string, payload: string) {
				return space.drop(voidId, payload)
			},
		}
	})
})

